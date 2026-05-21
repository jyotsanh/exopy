/**
 * Unit tests for utility modules in src/utils/.
 *
 * Covers HttpException factories, JWT round-trips, and the catchAsync wrapper.
 * No mocks — these all operate on pure inputs.
 */

import { describe, expect, it, jest } from "@jest/globals";
import HttpException from "../src/utils/httpException.utils.js";
import {
  daysToMs,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../src/utils/jwt.js";
import { catchAsync } from "../src/utils/catchAsync.utils.js";
import { StatusCodes } from "../src/constants/statusCode.js";

describe("HttpException", () => {
  it("sets status code, message, and isCustom flag", () => {
    const err = new HttpException("boom", 418);
    expect(err.message).toBe("boom");
    expect(err.statusCode).toBe(418);
    expect(err.isCustom).toBe(true);
    expect(err).toBeInstanceOf(Error);
  });

  it.each<[keyof typeof HttpException, number]>([
    ["badRequest", StatusCodes.BAD_REQUEST],
    ["unauthorized", StatusCodes.UNAUTHORIZED],
    ["notFound", StatusCodes.NOT_FOUND],
    ["conflict", StatusCodes.CONFLICT],
    ["forbidden", StatusCodes.FORBIDDEN],
    ["internalServerError", StatusCodes.INTERNAL_SERVER_ERROR],
  ])("factory %s produces correct status code", (method, expectedCode) => {
    const factory = HttpException[method] as (m: string) => HttpException;
    const err = factory("nope");
    expect(err.statusCode).toBe(expectedCode);
    expect(err).toBeInstanceOf(HttpException);
  });
});

describe("JWT helpers", () => {
  it("generated access token round-trips through verifyAccessToken", () => {
    const token = generateAccessToken({ id: "user-123", role: "admin" });
    const decoded = verifyAccessToken(token);
    expect(decoded.id).toBe("user-123");
    expect(decoded.role).toBe("admin");
  });

  it("generated refresh token round-trips through verifyRefreshToken", () => {
    const token = generateRefreshToken({ id: "user-123" });
    const decoded = verifyRefreshToken(token);
    expect(decoded.id).toBe("user-123");
  });

  it("verifyAccessToken throws on a tampered/garbage token", () => {
    expect(() => verifyAccessToken("not.a.real.jwt")).toThrow();
  });

  it("verifyAccessToken rejects a token signed with the wrong secret", () => {
    // A token signed with the refresh secret should not validate against the access secret.
    const refreshToken = generateRefreshToken({ id: "user-1" });
    expect(() => verifyAccessToken(refreshToken)).toThrow();
  });

  it("daysToMs converts days to milliseconds", () => {
    expect(daysToMs(1)).toBe(86_400_000);
    expect(daysToMs(7)).toBe(604_800_000);
    expect(daysToMs(0)).toBe(0);
  });
});

describe("catchAsync", () => {
  it("forwards async handler errors to next()", async () => {
    const boom = new Error("kaboom");
    const wrapped = catchAsync(async () => {
      throw boom;
    });

    const next = jest.fn();
    await wrapped({} as any, {} as any, next as any);

    expect(next).toHaveBeenCalledWith(boom);
  });

  it("does not call next() with an error when the handler resolves", async () => {
    const handler = jest.fn<() => Promise<void>>().mockResolvedValue();
    const wrapped = catchAsync(handler as any);

    const next = jest.fn();
    await wrapped({} as any, {} as any, next as any);

    expect(handler).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
