import { AuthAPI } from "../api/API";
import { deleteCookie } from "./CookieUtils";
import type { RegisterWithOTPRequest } from "../models/otp";

/**
 * Utility functions to interact with auth APIs
 */

// Login function
export const login = async (email: string, password: string) => {
  return AuthAPI.login(email, password);
};

// Register function
export const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
) => {
  return AuthAPI.register(firstName, lastName, email, password);
};

// Logout function
export const logout = async () => {
  try {
    const result = await AuthAPI.logout();

    // Delete the isAdminMode cookie when logging out
    deleteCookie("isAdminMode");

    return result;
  } catch (error) {
    // Even if the API call fails, we should still clean up local cookies
    deleteCookie("isAdminMode");
    throw error;
  }
};

// Refresh token function
export const refreshToken = async () => {
  return AuthAPI.refreshToken();
};

// Check if user has valid token
export const hasValidToken = async (): Promise<boolean> => {
  try {
    await AuthAPI.getCurrentUser();
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false;
  }
};

// Get current user info
export const getCurrentUser = async () => {
  return AuthAPI.getCurrentUser();
};

// Create OTP function
export const createOTP = async (
  email: string,
  type: "REGISTER" | "RESET_PASSWORD" | "VERIFY_EMAIL" = "REGISTER"
) => {
  return AuthAPI.createOTP(email, type);
};

// Verify OTP function
export const verifyOTP = async (
  email: string,
  otp: string,
  type: "REGISTER" | "RESET_PASSWORD" | "VERIFY_EMAIL" = "REGISTER"
) => {
  return AuthAPI.verifyOTP(email, otp, type);
};

// Register with OTP function
export const registerWithOTP = async (data: RegisterWithOTPRequest) => {
  return AuthAPI.registerWithOTP(data);
};

export const forgotPassword = async (email: string) => {
  return AuthAPI.forgotPassword(email);
};
