import { AdminStatisticsAPI } from "../api/API";

export interface AdminDashboardStats {
  totalDocuments: number;
  activeUsers: number;
  pendingApprovals: number;
  violationReports: number;
  dailyViews: number;
  dailyDownloads: number;
  weeklyNewDocuments: number;
  approvalRate: number;
}

class AdminStatisticsService {
  // Get dashboard statistics for a specific time period
  async getDashboardStats(params?: {
    period?: "day" | "week" | "month" | "year";
    year?: number;
    month?: number;
  }): Promise<AdminDashboardStats> {
    try {
      const response = await AdminStatisticsAPI.getDashboardStats(params);
      return response.data || response;
    } catch (error) {
      console.error(
        "Error in AdminStatisticsService.getDashboardStats:",
        error
      );
      throw error;
    }
  }

  // Sync dashboard statistics
  async syncDashboardStats(params?: {
    period?: "day" | "week" | "month" | "year";
    year?: number;
    month?: number;
  }): Promise<void> {
    try {
      await AdminStatisticsAPI.syncDashboardStats(params);
    } catch (error) {
      console.error(
        "Error in AdminStatisticsService.syncDashboardStats:",
        error
      );
      throw error;
    }
  }
}

export const adminStatisticsService = new AdminStatisticsService();
