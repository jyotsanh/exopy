/**
 * Unit tests for Zod validators under src/validators/.
 *
 * These run as pure schema checks — no Express, no DB.
 */

import { describe, expect, it } from "@jest/globals";
import {
  loginODT,
  registerODT,
} from "../src/validators/auth.validator.js";
import {
  createOrganizationODT,
  updateOrganizationODT,
  organizationIdParamODT,
  paginationQueryODT,
} from "../src/validators/organization.validator.js";

describe("loginODT", () => {
  it("accepts a valid email + password", () => {
    const result = loginODT.safeParse({
      email: "alice@example.com",
      password: "longenoughpwd",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = loginODT.safeParse({
      email: "not-an-email",
      password: "longenoughpwd",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Invalid email");
    }
  });

  it("rejects a password shorter than 8 chars", () => {
    const result = loginODT.safeParse({
      email: "alice@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });
});

describe("registerODT", () => {
  it("defaults role to 'user' when not supplied", () => {
    const result = registerODT.safeParse({
      email: "alice@example.com",
      password: "longenoughpwd",
      username: "alice",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.role).toBe("user");
  });

  it("accepts the allowed roles", () => {
    for (const role of ["user", "admin", "superadmin"]) {
      const result = registerODT.safeParse({
        email: "x@example.com",
        password: "longenoughpwd",
        username: "ab",
        role,
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects an unknown role", () => {
    const result = registerODT.safeParse({
      email: "alice@example.com",
      password: "longenoughpwd",
      username: "alice",
      role: "owner",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a username shorter than 2 chars", () => {
    const result = registerODT.safeParse({
      email: "alice@example.com",
      password: "longenoughpwd",
      username: "a",
    });
    expect(result.success).toBe(false);
  });
});

describe("createOrganizationODT", () => {
  it("requires name and a valid email", () => {
    const result = createOrganizationODT.safeParse({
      name: "Acme",
      email: "ops@acme.io",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty name", () => {
    const result = createOrganizationODT.safeParse({
      name: "",
      email: "ops@acme.io",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a name longer than 100 chars", () => {
    const result = createOrganizationODT.safeParse({
      name: "x".repeat(101),
      email: "ops@acme.io",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateOrganizationODT", () => {
  it("accepts an empty object (all fields optional)", () => {
    const result = updateOrganizationODT.safeParse({});
    expect(result.success).toBe(true);
  });

  it("rejects an invalid partial email update", () => {
    const result = updateOrganizationODT.safeParse({ email: "nope" });
    expect(result.success).toBe(false);
  });
});

describe("organizationIdParamODT", () => {
  it("accepts a 24-character ObjectId-shaped string", () => {
    const result = organizationIdParamODT.safeParse({
      id: "a".repeat(24),
    });
    expect(result.success).toBe(true);
  });

  it("rejects an id of the wrong length", () => {
    const result = organizationIdParamODT.safeParse({ id: "tooshort" });
    expect(result.success).toBe(false);
  });
});

describe("paginationQueryODT", () => {
  it("defaults page=1 and limit=10 when omitted", () => {
    const result = paginationQueryODT.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(10);
    }
  });

  it("parses numeric strings to numbers", () => {
    const result = paginationQueryODT.safeParse({ page: "3", limit: "25" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(3);
      expect(result.data.limit).toBe(25);
    }
  });

  it("rejects limit > 100", () => {
    const result = paginationQueryODT.safeParse({ limit: "999" });
    expect(result.success).toBe(false);
  });
});
