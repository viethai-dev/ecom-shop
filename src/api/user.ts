import { request } from "./request";

export type SignInPayload = { email: string; password: string };
export type SignUpPayload = {
  email: string;
  password: string;
  name: string;
  phone: string;
  avatar_url: string;
};

export const signIn = async (data: SignInPayload) => {
  const response = await request("post", "/auth/login", data);
  return response;
};

export const signUp = async (data: SignUpPayload) => {
  const response = await request("post", "/auth/register", data);
  return response;
};

export const signOut = async () => {
  const response = await request("post", "/auth/logout");
  return response;
};

export const verifyEmail = async (token: string) => {
  const response = await request("get", `/auth/verify-email?token=${encodeURIComponent(token)}`);
  return response;
};

export const userProfile = async (token: string) => {
  const response = await request("get", "/auth/me", { headers: { Authorization: `Bearer ${token}` } });
  return response;
};
