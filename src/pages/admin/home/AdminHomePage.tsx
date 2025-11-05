/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Card, Row, Col, Spin, Typography } from "antd";

const { Text } = Typography;
import { useNavigate } from "react-router-dom";
import { CheckCircleOutlined } from "@ant-design/icons";
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
  Ban,
} from "lucide-react";
import AdminStatisticsService from "../../../utils/AdminStatisticsService";
import AdminTasksToDo from "../../../components/admin/dashboard/AdminTasksToDo";

// API Response interfaces
interface ApiResponse {
  success: boolean;
  data: {
    statistics: {
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
    };
    recent_activities: any[];
    tasks: TaskItem[];
  };
  cached: boolean;
  last_updated: string;
}

// Task interface matching API response
interface TaskItem {
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
    };
    aiChecked: boolean;
    aiViolationLevel: string;
  };
}

const AdminHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [apiData, setApiData] = useState<ApiResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);

  // Load dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const response = await AdminStatisticsService.getDashboardStats();
        if (response.success && response.data) {
          setApiData(response.data as unknown as ApiResponse["data"]);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        // Keep fallback data
        setApiData({
          statistics: {
            total_documents: 32,
            pending_documents: 9,
            total_users: 8,
            total_downloads: 35,
            total_views: 23,
            total_organizations: 4,
            total_reports: 0,
            banned_users: 0,
            approved_documents: 23,
            active_users: 8,
            pending_reports: 0,
            total_subjects: 19,
          },
          recent_activities: [],
          tasks: [
            {
              id: "690975ed1c07d5a1f5224d57",
              type: "approval_request",
              title: "Duyệt tài liệu: Câu chuyện xảy ra vào năm 1925",
              description: "Yêu cầu duyệt từ Lê Đại Phát",
              priority: "high",
              status: "pending",
              createdAt: "2025-11-04T03:41:33.229Z",
              data: {
                requestId: "690975ed1c07d5a1f5224d57",
                documentId: "690975ec1c07d5a1f5224d35",
                documentTitle: "Câu chuyện xảy ra vào năm 1925",
                requester: {
                  _id: "68c37e4014c04e538b78c890",
                  first_name: "Lê Đại",
                  last_name: "Phát",
                },
                aiChecked: true,
                aiViolationLevel: "MEDIUM",
              },
            },
            {
              id: "6908fd32565449aba21cc6bf",
              type: "approval_request",
              title: "Duyệt tài liệu: Câu chuyện xảy ra vào năm 1925",
              description: "Yêu cầu duyệt từ Lê Đại Phát",
              priority: "high",
              status: "pending",
              createdAt: "2025-11-03T19:06:26.611Z",
              data: {
                requestId: "6908fd32565449aba21cc6bf",
                documentId: "6908fd32565449aba21cc6ad",
                documentTitle: "Câu chuyện xảy ra vào năm 1925",
                requester: {
                  _id: "68f4897b0071159f6786f7f4",
                  first_name: "Lê",
                  last_name: "Đại Phát",
                },
                aiChecked: true,
                aiViolationLevel: "MEDIUM",
              },
            },
            {
              id: "6908fbde32bf2254a975b00b",
              type: "approval_request",
              title: "Duyệt tài liệu: Câu chuyện xảy ra vào năm 1925",
              description: "Yêu cầu duyệt từ Lê Đại Phát",
              priority: "high",
              status: "pending",
              createdAt: "2025-11-03T19:00:46.611Z",
              data: {
                requestId: "6908fbde32bf2254a975b00b",
                documentId: "6908fbde32bf2254a975aff9",
                documentTitle: "Câu chuyện xảy ra vào năm 1925",
                requester: {
                  _id: "68f4897b0071159f6786f7f4",
                  first_name: "Lê",
                  last_name: "Đại Phát",
                },
                aiChecked: true,
                aiViolationLevel: "MEDIUM",
              },
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Extract data from API response
  const statsData = apiData?.statistics || {
    total_documents: 32,
    pending_documents: 9,
    total_users: 8,
    total_downloads: 35,
    total_views: 23,
    total_organizations: 4,
    total_reports: 0,
    banned_users: 0,
    approved_documents: 23,
    active_users: 8,
    pending_reports: 0,
    total_subjects: 19,
  };

  const tasks = apiData?.tasks || [];

  // Handle task click - navigate to document review page
  const handleTaskClick = (task: TaskItem) => {
    if (task.type === "approval_request") {
      navigate(`/admin/documents/review/${task.data.documentId}`);
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
      title: "Tài liệu đã duyệt",
      value: statsData.approved_documents,
      icon: (
        <CheckCircleOutlined
          className="w-6 h-6"
          style={{ color: "var(--green-button-color)" }}
        />
      ),
      color: "var(--green-button-color)",
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
      title: "Người dùng hoạt động",
      value: statsData.active_users,
      icon: (
        <Users className="w-6 h-6" style={{ color: "var(--primary-color)" }} />
      ),
      color: "var(--primary-color)",
    },
    {
      title: "Lượt tải xuống",
      value: statsData.total_downloads,
      icon: (
        <Download
          className="w-6 h-6"
          style={{ color: "var(--secondary-color)" }}
        />
      ),
      color: "var(--secondary-color)",
    },
    {
      title: "Lượt xem",
      value: statsData.total_views,
      icon: <Eye className="w-6 h-6" style={{ color: "var(--third-color)" }} />,
      color: "var(--third-color)",
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
        <Flag
          className="w-6 h-6"
          style={{ color: "var(--red-button-color)" }}
        />
      ),
      color: "var(--red-button-color)",
    },
    {
      title: "Báo cáo chờ xử lý",
      value: statsData.pending_reports,
      icon: (
        <AlertCircle
          className="w-6 h-6"
          style={{ color: "var(--red-button-color)" }}
        />
      ),
      color: "var(--red-button-color)",
    },
    {
      title: "Môn học",
      value: statsData.total_subjects,
      icon: (
        <BookOpen
          className="w-6 h-6"
          style={{ color: "var(--secondary-color)" }}
        />
      ),
      color: "var(--secondary-color)",
    },
    {
      title: "Bị cấm",
      value: statsData.banned_users,
      icon: (
        <Ban className="w-6 h-6" style={{ color: "var(--secondary-color)" }} />
      ),
      color: "var(--secondary-color)",
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
    <div
      className="p-4 md:p-6 lg:p-8"
      style={{
        backgroundColor: "var(--secondary-background-color)",
        minHeight: "100vh",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1
            className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold mb-2 w-fit text-left"
            style={{ color: "var(--primary-text-color)" }}
          >
            Trang chủ Admin
          </h1>
          <p
            className="text-xs xs:text-sm sm:text-base md:text-lg w-fit text-left"
            style={{ color: "var(--secondary-text-color)" }}
          >
            Tổng quan hệ thống quản lý chia sẻ tài liệu
          </p>
        </div>

        {/* Stats Grid */}
        <Row gutter={[16, 16]}>
          {statsCards.map((stat, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card
                className="shadow-sm hover:shadow-md transition-shadow duration-200"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--primary-background-color)",
                }}
                bodyStyle={{ padding: "20px" }}
              >
                {loading ? (
                  <div className="flex items-center justify-center h-16">
                    <Spin size="small" />
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div
                        className="text-xs xs:text-xs sm:text-sm font-medium mb-1"
                        style={{ color: "var(--secondary-text-color)" }}
                      >
                        {stat.title}
                      </div>
                      <div
                        className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </div>
                    </div>
                    <div
                      className="p-2 rounded-lg"
                      style={{
                        backgroundColor: "var(--field-background-color)",
                      }}
                    >
                      {stat.icon}
                    </div>
                  </div>
                )}
              </Card>
            </Col>
          ))}
        </Row>

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
            <h2
              className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold mb-4 w-fit text-left"
              style={{ color: "var(--primary-text-color)" }}
            >
              Hoạt động gần đây
            </h2>
            <Card
              className="shadow-sm"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--primary-background-color)",
              }}
            >
              <div className="text-center py-8">
                <Text
                  style={{ color: "var(--secondary-text-color)" }}
                  className="text-xs xs:text-sm"
                >
                  Chưa có hoạt động gần đây
                </Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Quick Actions Section */}
        <div className="mt-6 sm:mt-8 md:mt-12">
          <h2
            className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold mb-4 w-fit text-left"
            style={{ color: "var(--primary-text-color)" }}
          >
            Chuyển hướng nhanh
          </h2>
          <Row gutter={[16, 16]}>
            {quickActions.map((action, index) => (
              <Col xs={24} sm={12} md={8} lg={6} key={index}>
                <Card
                  className="shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                  style={{
                    borderColor: "var(--border-color)",
                    backgroundColor: "var(--primary-background-color)",
                  }}
                  bodyStyle={{ padding: "16px" }}
                  onClick={() => navigate(action.path)}
                >
                  <div className="text-center">
                    <div className="mb-2 flex justify-center">
                      {action.icon}
                    </div>
                    <h3
                      className="text-xs xs:text-xs sm:text-sm font-semibold mb-1"
                      style={{ color: "var(--primary-text-color)" }}
                    >
                      {action.title}
                    </h3>
                    <p
                      className="text-xs xs:text-xs sm:text-xs"
                      style={{ color: "var(--secondary-text-color)" }}
                    >
                      {action.description}
                    </p>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
