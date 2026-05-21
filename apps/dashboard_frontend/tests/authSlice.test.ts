/**
 * Reducer-only tests for the auth slice.
 *
 * We invoke the reducer directly with synthetic actions — no axios, no thunks,
 * no Redux store wiring needed. This exercises real reducer code without mocks.
 */

import { describe, expect, it } from "vitest";
// The slice transitively imports axiosInstance, which imports the store, which
// imports the slice — a real cycle in the app. At runtime in the browser it's
// resolved because main.tsx loads `store` first. We replicate that here by
// pre-importing the store so the slice's default export is defined by the time
// `combineReducers` runs.
import "@/store/store";
import authReducer, {
  clearCredentials,
  setUser,
  loginUser,
  logout,
  type IAuthState,
} from "@/store/slice/authSlice/authSlice";

const initial: IAuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,
};

const sampleUser = {
  id: "u1",
  username: "alice",
  email: "alice@example.com",
  role: "admin",
};

describe("authSlice reducer", () => {
  it("returns the initial state for an unknown action", () => {
    expect(authReducer(undefined, { type: "@@INIT" })).toEqual(initial);
  });

  it("setUser sets credentials and marks the session authenticated", () => {
    const next = authReducer(
      initial,
      setUser({ accessToken: "tok-1", user: sampleUser }),
    );
    expect(next.isAuthenticated).toBe(true);
    expect(next.user).toEqual(sampleUser);
    expect(next.accessToken).toBe("tok-1");
    expect(next.isLoading).toBe(false);
    expect(next.error).toBe(null);
  });

  it("clearCredentials wipes the session", () => {
    const authed: IAuthState = {
      ...initial,
      isAuthenticated: true,
      user: sampleUser,
      accessToken: "tok-1",
    };
    const next = authReducer(authed, clearCredentials());
    expect(next.isAuthenticated).toBe(false);
    expect(next.user).toBe(null);
    expect(next.accessToken).toBe(null);
  });

  it("loginUser.pending flips isLoading on and clears error", () => {
    const stateWithError: IAuthState = { ...initial, error: "previous" };
    const next = authReducer(stateWithError, { type: loginUser.pending.type });
    expect(next.isLoading).toBe(true);
    expect(next.error).toBe(null);
  });

  it("loginUser.fulfilled stores token + user and clears loading", () => {
    const action = {
      type: loginUser.fulfilled.type,
      payload: {
        success: true,
        message: "ok",
        data: { accessToken: "abc", user: sampleUser },
      },
    };
    const next = authReducer({ ...initial, isLoading: true }, action);
    expect(next.isLoading).toBe(false);
    expect(next.isAuthenticated).toBe(true);
    expect(next.user).toEqual(sampleUser);
    expect(next.accessToken).toBe("abc");
  });

  it("loginUser.rejected records the error payload and clears loading", () => {
    const action = {
      type: loginUser.rejected.type,
      payload: "bad credentials",
    };
    const next = authReducer({ ...initial, isLoading: true }, action);
    expect(next.isLoading).toBe(false);
    expect(next.error).toBe("bad credentials");
    expect(next.isAuthenticated).toBe(false);
  });

  it("logout.fulfilled clears the session", () => {
    const authed: IAuthState = {
      ...initial,
      isAuthenticated: true,
      user: sampleUser,
      accessToken: "tok-1",
    };
    const next = authReducer(authed, { type: logout.fulfilled.type });
    expect(next.isAuthenticated).toBe(false);
    expect(next.user).toBe(null);
    expect(next.accessToken).toBe(null);
  });
});
