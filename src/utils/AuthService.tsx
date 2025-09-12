import { AuthAPI } from "../api/API";

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
  return AuthAPI.logout();
};

// Refresh token function
export const refreshToken = async () => {
  return AuthAPI.refreshToken();
};

// Get current user info
export const getCurrentUser = async () => {
  return AuthAPI.getCurrentUser();
};
