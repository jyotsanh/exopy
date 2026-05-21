/**
 * Integration tests for dashboard_backend HTTP endpoints.
 *
 * The Server class in src/index.ts connects to MongoDB before listening. We
 * skip that here by instantiating `App` directly — its constructor doesn't
 * touch any external service. Tests focus on routes that resolve before
 * hitting the DB (validators, auth/authorization middleware, 404s, metrics).
 *
 * For one test we generate a real JWT to exercise the authentication middleware
 * past the "no token" path. That still doesn't reach the DB because the
 * authorization middleware (role check) rejects first.
 */

import { describe, expect, it } from "@jest/globals";
import request from "supertest";

import { App } from "../src/app.js";
import { generateAccessToken } from "../src/utils/jwt.js";

const httpApp = new App().getApp();

describe("GET /health", () => {
  it("responds with status ok", async () => {
    const res = await request(httpApp).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});

describe("GET /metrics", () => {
  it("returns Prometheus text-format metrics", async () => {
    const res = await request(httpApp).get("/metrics");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/text\/plain/);
    expect(res.text).toContain("http_request_duration_seconds");
  });
});

describe("Unknown routes", () => {
  it("returns 404 for an unmapped path", async () => {
    const res = await request(httpApp).get("/no/such/route");
    expect(res.status).toBe(404);
  });
});

describe("POST /api/auth/login — validator", () => {
  it("400 when body is empty", async () => {
    const res = await request(httpApp).post("/api/auth/login").send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("400 when email is malformed", async () => {
    const res = await request(httpApp)
      .post("/api/auth/login")
      .send({ email: "bad", password: "longenoughpwd" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/email/i);
  });

  it("400 when password too short", async () => {
    const res = await request(httpApp)
      .post("/api/auth/login")
      .send({ email: "alice@example.com", password: "1" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/password/i);
  });
});

describe("POST /api/auth/register — validator", () => {
  it("400 when role is not in enum", async () => {
    const res = await request(httpApp).post("/api/auth/register").send({
      email: "alice@example.com",
      password: "longenoughpwd",
      username: "alice",
      role: "owner",
    });
    expect(res.status).toBe(400);
  });

  it("400 when username is missing", async () => {
    const res = await request(httpApp).post("/api/auth/register").send({
      email: "alice@example.com",
      password: "longenoughpwd",
    });
    expect(res.status).toBe(400);
  });
});

describe("/api/auth/me — authMiddleware gate", () => {
  it("401 with NO_TOKEN when Authorization header is absent", async () => {
    const res = await request(httpApp).get("/api/auth/me");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("NO_TOKEN");
  });

  it("403 with INVALID_TOKEN when token can't be verified", async () => {
    const res = await request(httpApp)
      .get("/api/auth/me")
      .set("Authorization", "Bearer not.a.valid.jwt");
    // The auth middleware translates any verify error other than expiry to forbidden.
    expect(res.status).toBe(403);
    expect(res.body.message).toBe("INVALID_TOKEN");
  });
});

describe("/api/organizations — auth + authorization gates", () => {
  it("401 NO_TOKEN when listing without auth", async () => {
    const res = await request(httpApp).get("/api/organizations");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("NO_TOKEN");
  });

  it("401 NO_TOKEN when creating without auth", async () => {
    const res = await request(httpApp)
      .post("/api/organizations")
      .send({ name: "Acme", email: "ops@acme.io" });
    expect(res.status).toBe(401);
  });

  it("403 when an authenticated USER tries to create an organization", async () => {
    // Create-org requires Role.ADMIN or Role.SUPERADMIN. A USER-role token
    // passes authentication but the authorization middleware blocks it
    // before any DB call.
    const token = generateAccessToken({ id: "507f1f77bcf86cd799439011", role: "user" });
    const res = await request(httpApp)
      .post("/api/organizations")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Acme", email: "ops@acme.io" });
    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/forbidden/i);
  });

  it("403 when an authenticated ADMIN tries to delete (SUPERADMIN-only)", async () => {
    const token = generateAccessToken({ id: "507f1f77bcf86cd799439011", role: "admin" });
    const res = await request(httpApp)
      .delete("/api/organizations/" + "a".repeat(24))
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(403);
  });
});

describe("Global error handler", () => {
  it("returns a structured JSON body for HttpException-derived errors", async () => {
    const res = await request(httpApp).get("/api/auth/me");
    expect(res.status).toBe(401);
    // Shape comes from globalErrorHandler — { success, message }
    expect(res.body).toEqual({ success: false, message: "NO_TOKEN" });
  });
});
