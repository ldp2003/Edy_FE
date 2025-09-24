import { UserAPI } from "../api/API";

export const UserService = {
  async verifyUser(organization: string, field_of_study: string) {
    try {
      const result = await UserAPI.verifyUser({ organization, field_of_study });
      console.log("User verified successfully:", result);
      return result;
    } catch (error) {
      console.error("Failed to verify user:", error);
      throw error;
    }
  },

  async getAllUsers() {
    try {
      const users = await UserAPI.getAllUsers();
      console.log("Fetched users:", users);
      return users;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw error;
    }
  },

  async getUserById(userId: string) {
    try {
      const user = await UserAPI.getUserById(userId);
      console.log("Fetched user:", user);
      return user;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      throw error;
    }
  },

  async updateUserStatus(userId: string, status: string) {
    try {
      const result = await UserAPI.updateUserStatus(userId, status);
      console.log("User status updated:", result);
      return result;
    } catch (error) {
      console.error("Failed to update user status:", error);
      throw error;
    }
  },

  async updateUser(
    userId: string,
    userData: {
      first_name?: string;
      last_name?: string;
      contact_email?: string;
      organization?: string;
      field_of_study?: string[];
      status?: string;
      avatar?: string;
    }
  ) {
    try {
      const result = await UserAPI.updateUser(userId, userData);
      console.log("User updated:", result);
      return result;
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  },

  async updateProfile(profileData: {
    first_name?: string;
    last_name?: string;
    organization?: string;
    avatar?: string;
  }) {
    try {
      const result = await UserAPI.updateProfile(profileData);
      console.log("Profile updated successfully:", result);
      return result;
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  },

  async changePassword(passwordData: {
    current_password: string;
    new_password: string;
  }) {
    try {
      const result = await UserAPI.changePassword(passwordData);
      console.log("Password changed successfully:", result);
      return result;
    } catch (error) {
      console.error("Failed to change password:", error);
      throw error;
    }
  },
};

// Legacy exports for backward compatibility
export const verifyUser = UserService.verifyUser;
export const getUsers = UserService.getAllUsers;
export const updateProfile = UserService.updateProfile;
export const changePassword = UserService.changePassword;
export const getUserById = UserService.getUserById;
