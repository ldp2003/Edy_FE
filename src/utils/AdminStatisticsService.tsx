import { AdminStatisticsAPI } from "../api/API";

export interface AdminStatsData {
  total_documents: number;
  pending_documents: number;
  total_users: number;
  total_downloads: number;
  total_views: number;
  total_organizations: number;
  total_reports: number;
  banned_users: number;
}

export interface AdminStatsResponse {
  success: boolean;
  data: AdminStatsData;
  cached: boolean;
  last_updated: string;
}

export interface RecentActivityData {
  id: string;
  type: string;
  description: string;
  actor: {
    name: string;
    role: string;
    avatar?: string;
  };
  target?: Record<string, unknown>;
  color: "success" | "warning" | "danger" | "info";
  icon: string;
  createdAt: string;
}

export interface RecentActivitiesResponse {
  success: boolean;
  data: RecentActivityData[];
}

const AdminStatisticsService = {
  /**
   * Get admin dashboard statistics
   * @param forceRefresh - Force refresh statistics instead of using cache
   * @returns Promise<AdminStatsResponse>
   */
  async getDashboardStats(forceRefresh = false): Promise<AdminStatsResponse> {
    try {
      const response = await AdminStatisticsAPI.getDashboardStats({
        force_refresh: forceRefresh,
      });
      return response;
    } catch (error) {
      console.error(
        "Error in AdminStatisticsService.getDashboardStats:",
        error
      );
      throw error;
    }
  },

  /**
   * Sync/refresh admin statistics
   * @returns Promise<Record<string, unknown>>
   */
  async syncDashboardStats(): Promise<Record<string, unknown>> {
    try {
      const response = await AdminStatisticsAPI.syncDashboardStats();
      return response;
    } catch (error) {
      console.error(
        "Error in AdminStatisticsService.syncDashboardStats:",
        error
      );
      throw error;
    }
  },

  /**
   * Get recent activities
   * @param limit - Number of activities to fetch (default: 10)
   * @returns Promise<RecentActivitiesResponse>
   */
  async getRecentActivities(limit = 10): Promise<RecentActivitiesResponse> {
    try {
      const response = await AdminStatisticsAPI.getRecentActivities({
        limit,
      });
      return response;
    } catch (error) {
      console.error(
        "Error in AdminStatisticsService.getRecentActivities:",
        error
      );
      throw error;
    }
  },
};

export default AdminStatisticsService;
