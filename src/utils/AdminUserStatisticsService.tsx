import { AdminUserStatisticsAPI } from "../api/API";

export const AdminUserStatisticsService = {
  // Get admin user statistics
  getAdminUserStatistics: async (params?: {
    year?: number;
    month?: number;
  }) => {
    const result = await AdminUserStatisticsAPI.getAdminUserStatistics(params);
    // console.log("Admin user statistics fetched successfully:", result);
    return result;
  },

  // Get users list for admin
  getUsersList: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    try {
      const result = await AdminUserStatisticsAPI.getUsersList(params);
      // console.log("Users list fetched successfully:", result);
      return result;
    } catch (error) {
      console.error("Failed to fetch users list:", error);
      throw error;
    }
  },

  // Sync admin user statistics
  syncAdminUserStatistics: async (params?: {
    year?: number;
    month?: number;
  }) => {
    try {
      const result = await AdminUserStatisticsAPI.syncAdminUserStatistics(
        params
      );
      // console.log("Admin user statistics synced successfully:", result);
      return result;
    } catch (error) {
      console.error("Failed to sync admin user statistics:", error);
      throw error;
    }
  },
};
