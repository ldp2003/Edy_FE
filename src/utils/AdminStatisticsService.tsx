import { AdminStatisticsAPI } from "../api/API";
import type {
  AdminStatsResponse,
  PendingTasksResponse,
  TaskItem,
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
   * Get admin tasks (transformed from pending documents)
   * @returns Promise<TaskItem[]>
   */
  async getAdminTasks(): Promise<TaskItem[]> {
    try {
      const response = await this.getPendingTasks();
      return response.documents.map((doc) => ({
        id: doc._id,
        type: "approval_request",
        title: doc.title,
        description: `${doc.user.first_name} ${doc.user.last_name} • ${doc.subject.name} • ${doc.organization.name} • ${doc.level} • ${doc.file_type} • ${doc.page} trang`,
        priority: "high",
        status: "pending",
        createdAt: doc.createdAt,
        data: {
          requestId: doc._id,
          documentId: doc._id,
          documentTitle: doc.title,
          requester: {
            _id: doc.user._id,
            first_name: doc.user.first_name,
            last_name: doc.user.last_name,
            avatar: doc.user.avatar,
          },
          aiChecked: false,
          aiViolationLevel: "",
        },
      }));
    } catch (error) {
      console.error("Error in AdminStatisticsService.getAdminTasks:", error);
      throw error;
    }
  },
};

export default AdminStatisticsService;
