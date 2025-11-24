import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Users,
  Download,
  Eye,
  AlertCircle,
  BookOpen,
  Building,
  Flag,
  BarChart3,
} from "lucide-react";
import AdminStatisticsService from "../../../utils/AdminStatisticsService";
import type {
  TaskItem,
  AdminDashboardData,
  RecentActivity,
} from "../../../models/AdminStatisticsModel";
import AdminTasksToDo from "../../../components/admin/dashboard/tasks/AdminTasksToDo";
import AdminStatsGrid from "../../../components/admin/dashboard/stats/AdminStatsGrid";
import AdminQuickActions from "../../../components/admin/dashboard/actions/AdminQuickActions";
import AdminRecentActivities from "../../../components/admin/dashboard/activities/AdminRecentActivities";
import { AdminBreadcrumb } from "../../../components/admin/common/AdminBreadcrumb";

const AdminHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [apiData, setApiData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQuickActions, setShowQuickActions] = useState(true);

  // Load dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const statsResponse = await AdminStatisticsService.getDashboardStats();
        const tasksResponse = await AdminStatisticsService.getAdminTasks();
        if (statsResponse.success && statsResponse.data) {
          setApiData({
            statistics: statsResponse.data.statistics,
            recent_activities: statsResponse.data.recent_activities,
            tasks: tasksResponse,
          });
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Extract data from API response
  const statsData = apiData?.statistics || {
    total_documents: 0,
    pending_documents: 0,
    total_users: 0,
    total_downloads: 0,
    total_views: 0,
    total_organizations: 0,
    total_reports: 0,
    banned_users: 0,
    approved_documents: 0,
    active_users: 0,
    pending_reports: 0,
    total_subjects: 0,
  };

  const tasks = (apiData?.tasks as TaskItem[]) || [];

  // Handle task click - navigate to document review page
  const handleTaskClick = (task: TaskItem) => {
    if (task.type === "approval_request") {
      navigate(`/admin/documents/review/${task.data.documentId}`);
    }
  };

  // Handle activity click - navigate based on targetType
  const handleActivityClick = (activity: RecentActivity) => {
    switch (activity.targetType) {
      case "Document":
        navigate(`/admin/documents/review/${activity.targetId}`);
        break;
      case "User":
        navigate(`/admin/users`);
        break;
      case "Organization":
        navigate(`/admin/organizations`);
        break;
      case "Subject":
        navigate(`/admin/subjects`);
        break;
      case "Report":
        navigate(`/admin/reports`);
        break;
      default:
        // Default navigation or do nothing
        break;
    }
  };

  const statsCards = [
    {
      title: "Tổng tài liệu",
      value: statsData.total_documents,
      icon: (
        <FileText
          className="w-6 h-6"
          style={{ color: "var(--primary-color)" }}
        />
      ),
      color: "var(--primary-color)",
    },
    {
      title: "Tài liệu chờ duyệt",
      value: statsData.pending_documents,
      icon: (
        <AlertCircle
          className="w-6 h-6"
          style={{ color: "var(--red-button-color)" }}
        />
      ),
      color: "var(--red-button-color)",
    },
    {
      title: "Người dùng",
      value: statsData.total_users,
      icon: (
        <Users
          className="w-6 h-6"
          style={{ color: "var(--green-button-color)" }}
        />
      ),
      color: "var(--green-button-color)",
    },
    {
      title: "Lượt tải xuống",
      value: statsData.total_downloads,
      icon: <Download className="w-6 h-6" style={{ color: "#ffa500" }} />,
      color: "#ffa500",
    },
    {
      title: "Lượt xem",
      value: statsData.total_views,
      icon: (
        <Eye className="w-6 h-6" style={{ color: "var(--secondary-color)" }} />
      ),
      color: "var(--secondary-color)",
    },
    {
      title: "Số lượng tổ chức",
      value: statsData.total_organizations,
      icon: (
        <Building
          className="w-6 h-6"
          style={{ color: "var(--favorite-color)" }}
        />
      ),
      color: "var(--favorite-color)",
    },
    {
      title: "Lượt báo cáo",
      value: statsData.total_reports,
      icon: (
        <Flag className="w-6 h-6" style={{ color: "var(--favorite-color)" }} />
      ),
      color: "var(--favorite-color)",
    },
    {
      title: "Môn học",
      value: statsData.total_subjects,
      icon: (
        <BookOpen
          className="w-6 h-6"
          style={{ color: "var(--primary-color)" }}
        />
      ),
      color: "var(--primary-color)",
    },
  ];

  const quickActions = [
    {
      title: "Quản lý tài liệu",
      path: "/admin/documents/all",
      icon: (
        <FileText
          className="w-6 h-6"
          style={{ color: "var(--primary-color)" }}
        />
      ),
      description: "Xem và quản lý tất cả tài liệu",
    },
    {
      title: "Quản lý người dùng",
      path: "/admin/users",
      icon: (
        <Users
          className="w-6 h-6"
          style={{ color: "var(--green-button-color)" }}
        />
      ),
      description: "Quản lý tài khoản và quyền",
    },
    {
      title: "Quản lý môn học",
      path: "/admin/subjects",
      icon: (
        <BookOpen
          className="w-6 h-6"
          style={{ color: "var(--secondary-color)" }}
        />
      ),
      description: "Thêm, sửa, xóa môn học",
    },
    {
      title: "Quản lý tổ chức",
      path: "/admin/organizations",
      icon: (
        <Building className="w-6 h-6" style={{ color: "var(--third-color)" }} />
      ),
      description: "Quản lý trường học và tổ chức",
    },
    {
      title: "Thống kê",
      path: "/admin/statistics/documents",
      icon: (
        <BarChart3
          className="w-6 h-6"
          style={{ color: "var(--favorite-color)" }}
        />
      ),
      description: "Xem báo cáo và thống kê",
    },
    {
      title: "Báo cáo",
      path: "/admin/reports",
      icon: (
        <Flag
          className="w-6 h-6"
          style={{ color: "var(--red-button-color)" }}
        />
      ),
      description: "Xem và xử lý báo cáo vi phạm",
    },
  ];

  return (
    <div className="bg-[var(--secondary-background-color)] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <AdminBreadcrumb items={[{ label: "Admin" }]} />

          <div className="mt-4">
            <h1
              className="text-lg xs:text-lg sm:text-lg md:text-lg font-bold mb-2 w-fit text-left"
              style={{ color: "var(--primary-text-color)" }}
            >
              Trang chủ Admin
            </h1>
            <p
              className="text-xs xs:text-xs sm:text-xs md:text-xs w-fit text-left"
              style={{ color: "var(--secondary-text-color)" }}
            >
              Tổng quan hệ thống quản lý chia sẻ tài liệu
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <AdminStatsGrid statsCards={statsCards} loading={loading} />

        {/* Quick Actions */}
        <AdminQuickActions
          quickActions={quickActions}
          showQuickActions={showQuickActions}
          setShowQuickActions={setShowQuickActions}
        />

        {/* Tasks To Do and Recent Activity in 2 columns */}
        <Row gutter={[24, 24]} className="mt-8 md:mt-12">
          {/* Tasks To Do Section */}
          <Col xs={24} lg={12}>
            <AdminTasksToDo
              tasks={tasks}
              loading={loading}
              onTaskClick={handleTaskClick}
            />
          </Col>

          {/* Recent Activity Section */}
          <Col xs={24} lg={12}>
            <AdminRecentActivities
              activities={apiData?.recent_activities}
              loading={loading}
              onActivityClick={handleActivityClick}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminHomePage;
