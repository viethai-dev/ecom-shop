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
  try {
    const response = await request("post", "/auth/login", data);
    return response;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

export const signUp = async (data: SignUpPayload) => {
  try {
    const response = await request("post", "/auth/register", data);
    return response;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const response = await request("post", "/auth/logout");
    return response;
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export const verifyEmail = async (token: string) => {
  try {
    const response = await request(
      "get",
      `/auth/verify-email?token=${encodeURIComponent(token)}`
    );
    return response;
  } catch (error) {
    console.error("Error verifying email:", error);
    throw error;
  }
};

export const userProfile = async (token: string) => {
  try {
    const response = await request("get", "/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
