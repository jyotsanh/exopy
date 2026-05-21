/**
 * Unit tests for Zod schemas used by frontend forms.
 */

import { describe, expect, it } from "vitest";
import { loginSchema } from "@/features/auth/schemas/auth.schema";
import { organizationSchema } from "@/features/organization/schemas/organization.schema";

describe("loginSchema", () => {
  it("accepts a valid email + password", () => {
    const result = loginSchema.safeParse({
      email: "alice@example.com",
      password: "abcdef",
      rememberMe: true,
    });
    expect(result.success).toBe(true);
  });

  it("treats rememberMe as optional", () => {
    const result = loginSchema.safeParse({
      email: "alice@example.com",
      password: "abcdef",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email format", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "abcdef",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.message.includes("email"))).toBe(true);
    }
  });

  it("rejects a password shorter than 6 chars", () => {
    const result = loginSchema.safeParse({
      email: "alice@example.com",
      password: "abc",
    });
    expect(result.success).toBe(false);
  });
});

describe("organizationSchema", () => {
  it("accepts minimal valid input", () => {
    const result = organizationSchema.safeParse({
      name: "Acme",
      email: "ops@acme.io",
    });
    expect(result.success).toBe(true);
  });

  it("lowercases the email after validation", () => {
    // Note: Zod's .email() runs before .toLowerCase()/.trim(), so the input
    // must already be a valid email shape. We just verify the casing transform
    // is applied to the parsed data.
    const result = organizationSchema.safeParse({
      name: "Acme",
      email: "OPS@ACME.IO",
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.email).toBe("ops@acme.io");
  });

  it("rejects single-char names (min 2 after trim)", () => {
    const result = organizationSchema.safeParse({ name: "A", email: "x@y.co" });
    expect(result.success).toBe(false);
  });

  it("rejects names over 100 chars", () => {
    const result = organizationSchema.safeParse({
      name: "x".repeat(101),
      email: "x@y.co",
    });
    expect(result.success).toBe(false);
  });

  it("accepts empty string for optional address", () => {
    const result = organizationSchema.safeParse({
      name: "Acme",
      email: "ops@acme.io",
      address: "",
    });
    expect(result.success).toBe(true);
  });

  it("accepts well-formed international phone numbers", () => {
    for (const phone of ["+1 (000) 000-0000", "9800000000", "+977-9800000000"]) {
      const result = organizationSchema.safeParse({
        name: "Acme",
        email: "ops@acme.io",
        contact_number: phone,
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects garbage in contact_number", () => {
    const result = organizationSchema.safeParse({
      name: "Acme",
      email: "ops@acme.io",
      contact_number: "abc",
    });
    expect(result.success).toBe(false);
  });

  it("accepts an empty contact_number (optional)", () => {
    const result = organizationSchema.safeParse({
      name: "Acme",
      email: "ops@acme.io",
      contact_number: "",
    });
    expect(result.success).toBe(true);
  });
});
