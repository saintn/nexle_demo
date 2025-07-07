import { configureStore } from "@reduxjs/toolkit";

import * as authServices from "../../../api/authServices";
import authReducer, { login, logout } from "../../../store/slices/authSlice";

jest.mock("../../../api/authServices");

describe("authSlice", () => {
  let store;

  const mockUser = {
    id: 1,
    email: "morris@example.com",
    name: "Morris Jane",
  };

  const mockLoginResponse = {
    accessToken: "mockAccessToken",
    refreshToken: "mockRefreshToken",
    user: mockUser,
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });

    localStorage.clear();
  });

  it("should handle login fulfilled", async () => {
    authServices.signinService.mockResolvedValue(mockLoginResponse);

    await store.dispatch(
      login({ email: "morris@example.com", password: "password123" })
    );

    const state = store.getState().auth;

    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(state.accessToken).toBe("mockAccessToken");
    expect(state.refreshToken).toBe("mockRefreshToken");
    expect(localStorage.getItem("accessToken")).toBe("mockAccessToken");
    expect(localStorage.getItem("refreshToken")).toBe("mockRefreshToken");
  });

  it("should handle login rejected", async () => {
    authServices.signinService.mockRejectedValue({
      response: { data: "Invalid credentials" },
    });

    await store.dispatch(
      login({ email: "wrong@example.com", password: "wrong" })
    );

    const state = store.getState().auth;
    expect(state.status).toBe("failed");
    expect(state.error).toBe("Invalid credentials");
  });

  it("should handle logout fulfilled", async () => {
    authServices.logoutService.mockResolvedValue({});

    localStorage.setItem("accessToken", "testToken");
    localStorage.setItem("refreshToken", "testRefresh");

    await store.dispatch(logout());

    const state = store.getState().auth;

    expect(state.isAuthenticated).toBe(false);
    expect(state.accessToken).toBe(null);
    expect(localStorage.getItem("accessToken")).toBe(null);
  });
});
