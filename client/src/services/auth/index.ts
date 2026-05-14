import axiosInstance from "../axiosInstance";
import {
  LoginRequestPayloadType,
  AuthResponseType,
  RegisterRequestPayloadType,
} from "./types";

const login = async (payload: LoginRequestPayloadType) => {
  return await axiosInstance.post<AuthResponseType>("/auth/login", payload);
};

const register = async (payload: RegisterRequestPayloadType) => {
  return await axiosInstance.post<AuthResponseType>("/auth/signup", payload);
};

const logout = async () => {
  return await axiosInstance.post("/auth/logout");
};

const getCurrentUser = async () => {
  return await axiosInstance.get("/auth/current-user");
};

const ForgotPassword = async (payload: { email: string }) => {
  return await axiosInstance.post("/auth/forgot-password", payload);
};

const ResetPassword = async (payload: { password: string; token: string }) => {
  return await axiosInstance.post("/auth/reset-password", payload);
};

const authService = {
  login,
  register,
  getCurrentUser,
  logout,
  ForgotPassword,
  ResetPassword,
};

export default authService;
