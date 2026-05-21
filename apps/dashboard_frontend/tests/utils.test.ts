/**
 * Unit tests for pure utility functions in src/lib and src/utils.
 */

import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";
import { paths } from "@/utils/path";

describe("cn() — class name merger", () => {
  it("joins string class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("filters out falsy values", () => {
    expect(cn("foo", false, null, undefined, "bar")).toBe("foo bar");
  });

  it("merges conflicting tailwind utility classes (last one wins)", () => {
    // twMerge keeps only the last padding-x utility
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("handles conditional object syntax (clsx)", () => {
    expect(cn({ "text-red-500": true, "hidden": false })).toBe("text-red-500");
  });

  it("returns empty string when given nothing", () => {
    expect(cn()).toBe("");
  });

  it("handles nested arrays", () => {
    expect(cn(["a", ["b", "c"]])).toBe("a b c");
  });
});

describe("paths", () => {
  it("home returns '/'", () => {
    expect(paths.home.getHref()).toBe("/");
    expect(paths.home.path).toBe("/");
  });

  it("auth.login.getHref returns plain /login with no arg", () => {
    expect(paths.auth.login.getHref()).toBe("/login");
  });

  it("auth.login.getHref encodes a redirectTo target", () => {
    expect(paths.auth.login.getHref("/dashboard")).toBe("/login?redirectTo=%2Fdashboard");
  });

  it("auth.login.getHref handles redirectTo with query params", () => {
    expect(paths.auth.login.getHref("/users?id=42")).toBe(
      "/login?redirectTo=%2Fusers%3Fid%3D42",
    );
  });

  it("auth.login.getHref omits the param when redirectTo is null/undefined", () => {
    expect(paths.auth.login.getHref(null)).toBe("/login");
    expect(paths.auth.login.getHref(undefined)).toBe("/login");
  });

  it("dashboard view path is /dashboard", () => {
    expect(paths.views.dashboard.getHref()).toBe("/dashboard");
  });

  it("controls.organization path is /organization", () => {
    expect(paths.controls.organization.path).toBe("/organization");
  });
});
