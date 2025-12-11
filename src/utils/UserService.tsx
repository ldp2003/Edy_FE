import { UserAPI } from "../api/API";

export const UserService = {
  async verifyUser(organization: string, field_of_study: string) {
    try {
      const result = await UserAPI.verifyUser({ organization, field_of_study });
      // console.log("User verified successfully:", result);
      return result;
    } catch (error) {
      console.error("Failed to verify user:", error);
      throw error;
    }
  },

  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string[];
    organization?: string[];
    field_of_study?: string[];
    rank_point_min?: number;
    rank_point_max?: number;
    strike_min?: number;
    strike_max?: number;
  }) {
    try {
      const users = await UserAPI.getAllUsers(params);
      // console.log("Fetched users:", users);
      return users;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw error;
    }
  },

  async getUserById(userId: string) {
    try {
      const user = await UserAPI.getUserById(userId);
      // console.log("Fetched user:", user);
      return user;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      throw error;
    }
  },

  async updateUserStatus(userId: string, status: string) {
    try {
      const result = await UserAPI.updateUserStatus(userId, status);
      // console.log("User status updated:", result);
      return result;
    } catch (error) {
      console.error("Failed to update user status:", error);
      throw error;
    }
  },

  async suspendUser(
    userId: string,
    data: { reason: string; duration_days: number }
  ) {
    try {
      const result = await UserAPI.suspendUser(userId, data);
      // console.log("User suspended:", result);
      return result;
    } catch (error) {
      console.error("Failed to suspend user:", error);
      throw error;
    }
  },

  async unsuspendUser(userId: string) {
    try {
      const result = await UserAPI.unsuspendUser(userId);
      // console.log("User unsuspended:", result);
      return result;
    } catch (error) {
      console.error("Failed to unsuspend user:", error);
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
      // console.log("User updated:", result);
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
      // console.log("Profile updated successfully:", result);
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
      // console.log("Password changed successfully:", result);
      return result;
    } catch (error) {
      console.error("Failed to change password:", error);
      throw error;
    }
  },
  async getListFavorites() {
    try {
      const favorites = await UserAPI.getListFavorites();
      // console.log("Fetched favorite documents:", favorites);
      return favorites;
    } catch (error) {
      console.error("Failed to fetch favorite documents:", error);
      throw error;
    }
  },

  async addToFavorites(documentId: string) {
    try {
      const result = await UserAPI.addToFavorites(documentId);
      // console.log("Document added to favorites:", result);
      return result;
    } catch (error) {
      console.error("Failed to add document to favorites:", error);
      throw error;
    }
  },

  async removeFromFavorites(documentId: string) {
    try {
      const result = await UserAPI.removeFromFavorites(documentId);
      // console.log("Document removed from favorites:", result);
      return result;
    } catch (error) {
      console.error("Failed to remove document from favorites:", error);
      throw error;
    }
  },
  //   followUser: async (userId: string) => {
  //   return await apiClient.post(`/users/${userId}/follow`);
  // },
  // unfollowUser: async (userId: string) => {
  //   return await apiClient.post(`/users/${userId}/unfollow`);
  // },
  async followUser(userId: string) {
    try {
      const result = await UserAPI.followUser(userId);
      // console.log("Followed user successfully:", result);
      return result;
    } catch (error) {
      console.error("Failed to follow user:", error);
      throw error;
    }
  },
  async unfollowUser(userId: string) {
    try {
      const result = await UserAPI.unfollowUser(userId);
      // console.log("Unfollowed user successfully:", result);
      return result;
    } catch (error) {
      console.error("Failed to unfollow user:", error);
      throw error;
    }
  },
  async updateFieldOfStudy(field_of_study: string[]) {
    try {
      const result = await UserAPI.updateFieldStudy(field_of_study);
      // console.log("Field of study updated successfully:", result);
      return result;
    } catch (error) {
      console.error("Failed to update field of study:", error);
      throw error;
    }
  },
  async getContributions(year?: number) {
    try {
      const contributions = await UserAPI.getContributions(year);
      // console.log("Fetched user contributions:", contributions);
      return contributions;
    } catch (error) {
      console.error("Failed to fetch user contributions:", error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const user = await UserAPI.getCurrentUser();
      // console.log("Fetched current user:", user);
      return user;
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      throw error;
    }
  },

  async getUserRestrictions(userId: string) {
    try {
      const restrictions = await UserAPI.getUserRestrictions(userId);
      // console.log("Fetched user restrictions:", restrictions);
      return restrictions;
    } catch (error) {
      console.error("Failed to fetch user restrictions:", error);
      throw error;
    }
  },

  async getUserViolations(userId: string) {
    try {
      const violations = await UserAPI.getUserViolations(userId);
      // console.log("Fetched user violations:", violations);
      return violations;
    } catch (error) {
      console.error("Failed to fetch user violations:", error);
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
export const updateUserStatus = UserService.updateUserStatus;
export const updateUser = UserService.updateUser;
export const getListFavorites = UserService.getListFavorites;
export const addToFavorites = UserService.addToFavorites;
export const removeFromFavorites = UserService.removeFromFavorites;
export const followUser = UserService.followUser;
export const unfollowUser = UserService.unfollowUser;
export const updateFieldOfStudy = UserService.updateFieldOfStudy;
export const getContributions = UserService.getContributions;
export const getCurrentUser = UserService.getCurrentUser;
export const getUserRestrictions = UserService.getUserRestrictions;
export const getUserViolations = UserService.getUserViolations;
