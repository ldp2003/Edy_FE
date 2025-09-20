import { AuthAPI } from "../api/API";
import { deleteCookie } from "./CookieUtils";

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

// Get current user info
export const getCurrentUser = async () => {
  return AuthAPI.getCurrentUser();
};
