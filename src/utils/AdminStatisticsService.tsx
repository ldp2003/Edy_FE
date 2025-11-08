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
  approved_documents: number;
  active_users: number;
  pending_reports: number;
  total_subjects: number;
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

export interface PendingDocument {
  _id: string;
  user: {
    _id: string;
    first_name: string;
    last_name: string;
    avatar?: string;
    organization: {
      _id: string;
      name: string;
    };
    doc_count: number;
  };
  author: string[];
  url: string;
  published_year: number | null;
  publisher: string | null;
  intensive: boolean;
  organization: {
    _id: string;
    name: string;
  };
  level: string;
  subject: {
    _id: string;
    name: string;
  };
  status: string;
  page: number;
  file_type: string;
  title: string;
  doc_type: string;
  view: number;
  comment_count: number;
  download_count: number;
  createdAt: string;
}

export interface PendingTasksResponse {
  documents: PendingDocument[];
  total: number;
  page: number;
  totalPages: number;
  have_next: boolean;
}

export interface TaskItem {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "completed";
  createdAt: string;
  data: {
    requestId: string;
    documentId: string;
    documentTitle: string;
    requester: {
      _id: string;
      first_name: string;
      last_name: string;
      avatar?: string;
    };
    aiChecked: boolean;
    aiViolationLevel: string;
  };
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
