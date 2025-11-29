import { AdminStatisticsAPI } from "../api/API";
import type {
  AdminStatsResponse,
  PendingTasksResponse,
  PendingDocument,
} from "../models/AdminStatisticsModel";

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
      return response.data; // Trả về data từ response
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
   * Get pending tasks for admin
   * @returns Promise<PendingTasksResponse>
   */
  async getPendingTasks(): Promise<PendingTasksResponse> {
    try {
      const response = await AdminStatisticsAPI.getPendingTasks();
      return response;
    } catch (error) {
      console.error("Error in AdminStatisticsService.getPendingTasks:", error);
      throw error;
    }
  },

  /**
   * Get admin tasks (pending documents)
   * @returns Promise<PendingDocument[]>
   */
  async getAdminTasks(): Promise<PendingDocument[]> {
    try {
      const response = await this.getPendingTasks();
      return response.documents;
    } catch (error) {
      console.error("Error in AdminStatisticsService.getAdminTasks:", error);
      throw error;
    }
  },
};

export default AdminStatisticsService;
