import api from "./axios";

export const signupService = async (formData) => {
  const response = await api.post("/auth/signup", formData);
  return response;
};

export const signinService = async (formData) => {
  const response = await api.post("/auth/signin", formData);
  return response;
};

export const logoutService = async ({ accessToken, refreshToken }) => {
  const response = await api.post(
    "/auth/signout",
    { refreshToken },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response;
};
