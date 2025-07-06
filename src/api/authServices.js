import api from "./axios";

export const signupService = async (formData) => {
  const response = await api.post("/auth/signup", formData);
  return response;
};

export const signinService = async (formData) => {
  const response = await api.post("/auth/signin", formData);
  return response;
};
