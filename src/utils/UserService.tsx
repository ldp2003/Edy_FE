import { UserAPI, AuthAPI } from "../api/API";

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
  async getListFavorites() {
    try {
      const favorites = await UserAPI.getListFavorites();
      console.log("Fetched favorite documents:", favorites);
      return favorites;
    } catch (error) {
      console.error("Failed to fetch favorite documents:", error);
      throw error;
    }
  },

  async addToFavorites(documentId: string) {
    try {
      const result = await UserAPI.addToFavorites(documentId);
      console.log("Document added to favorites:", result);
      return result;
    } catch (error) {
      console.error("Failed to add document to favorites:", error);
      throw error;
    }
  },

  async removeFromFavorites(documentId: string) {
    try {
      const result = await UserAPI.removeFromFavorites(documentId);
      console.log("Document removed from favorites:", result);
      return result;
    } catch (error) {
      console.error("Failed to remove document from favorites:", error);
      throw error;
    }
  },

  async getReadHistory() {
    try {
      const response = await AuthAPI.getCurrentUser();
      const readHistory = response.user.read_history || [];
      return readHistory.filter((item: any) => {
        const doc = item.document;
        // Kiểm tra document có được approved không
        if (doc.status !== "APPROVED") return false;

        // Kiểm tra quyền truy cập dựa trên public_mode
        if (doc.public_mode === "PUBLIC") return true;

        const currentUser = response.user;
        
        // Kiểm tra nếu là SHARE_ORGANIZATION
        if (doc.public_mode === "SHARE_ORGANIZATION") {
          return currentUser.organization?._id === doc.organization;
        }

        // Kiểm tra nếu là PRIVATE_SHARE
        if (doc.public_mode === "PRIVATE_SHARED") {
          return currentUser.shared_documents?.some(
            (shared: any) => shared.document._id === doc._id
          );
        }

        return false;
      });
    } catch (error) {
      console.error("Error in UserService.getReadHistory:", error);
      throw error;
    }
  }
};

// Legacy exports for backward compatibility
export const verifyUser = UserService.verifyUser;
export const getUsers = UserService.getAllUsers;
export const updateProfile = UserService.updateProfile;
export const changePassword = UserService.changePassword;
export const getUserById = UserService.getUserById;
export const updateUserStatus = UserService.updateUserStatus;
export const updateUser = UserService.updateUser;
export const getListFavorites = UserService.getListFavorites;
export const addToFavorites = UserService.addToFavorites;
export const removeFromFavorites = UserService.removeFromFavorites;
