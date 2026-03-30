import api from "./api";

export const register = async (email, password) => {
  const response = await api.post("/api/v1/auth/register", {
    email,
    password,
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post("/api/v1/auth/login", {
    email,
    password,
  });
  return response.data;
};
