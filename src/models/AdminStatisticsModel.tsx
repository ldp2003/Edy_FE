import type { ActivityActionType, TargetTypeValue } from "./activityLog";

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

export interface RecentActivity {
  id: string;
  user: {
    _id: string;
    first_name: string;
    last_name: string;
    avatar?: string;
    contact_email: string;
  };
  action: ActivityActionType;
  actionLabel: string;
  targetType: TargetTypeValue;
  targetId: string;
  targetTitle: string;
  description: string;
  metadata?: Record<string, unknown>;
  redirectTo?: string;
  redirectParams?: Record<string, unknown>;
  timestamp: string;
}

export interface AdminDashboardData {
  statistics: AdminStatsData;
  recent_activities: RecentActivity[];
  tasks: unknown[]; // Bỏ qua tasks từ API này
}

export interface AdminStatsResponse {
  success: boolean;
  data: AdminDashboardData;
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
