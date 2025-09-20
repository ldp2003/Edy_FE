import { UserAPI } from "../api/API";
import type { User } from "../models/user";

export const verifyUser = async (
  organization: string,
  field_of_study: string
) => {
  try {
    const result = await UserAPI.verifyUser({ organization, field_of_study });
    console.log("User verified successfully:", result);
    return result;
  } catch (error) {
    console.error("Failed to verify user:", error);
    throw error;
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const users = await UserAPI.getUsers();
    console.log("Fetched users:", users);
    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

export const updateProfile = async (profileData: {
  first_name?: string;
  last_name?: string;
  organization?: string;
  avatar?: string;
}) => {
  try {
    const result = await UserAPI.updateProfile(profileData);
    console.log("Profile updated successfully:", result);
    return result;
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw error;
  }
};

export const changePassword = async (passwordData: {
  current_password: string;
  new_password: string;
}) => {
  try {
    const result = await UserAPI.changePassword(passwordData);
    console.log("Password changed successfully:", result);
    return result;
  } catch (error) {
    console.error("Failed to change password:", error);
    throw error;
  }
};
