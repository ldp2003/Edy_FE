import React from "react";
import { Card, Row, Col } from "antd";
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
  Ban,
} from "lucide-react";

const AdminHomePage: React.FC = () => {
  const navigate = useNavigate();

  // Mock data - in real app, fetch from API
  const stats = [
    {
      title: "Tổng tài liệu",
      value: 1250,
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
      value: 23,
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
      value: 856,
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
      value: 5432,
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
      value: 12890,
      icon: <Eye className="w-6 h-6" style={{ color: "var(--third-color)" }} />,
      color: "var(--third-color)",
    },
    {
      title: "Số lượng tổ chức",
      value: 45,
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
      value: 127,
      icon: (
        <Flag
          className="w-6 h-6"
          style={{ color: "var(--red-button-color)" }}
        />
      ),
      color: "var(--red-button-color)",
    },
    {
      title: "Bị cấm",
      value: 23,
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
        <div className="mb-6 md:mb-8">
          <h1
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-2"
            style={{ color: "var(--primary-text-color)" }}
          >
            Trang chủ Admin
          </h1>
          <p
            className="text-sm sm:text-base md:text-lg"
            style={{ color: "var(--secondary-text-color)" }}
          >
            Tổng quan hệ thống quản lý chia sẻ tài liệu
          </p>
        </div>

        {/* Stats Grid */}
        <Row gutter={[16, 16]}>
          {stats.map((stat, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card
                className="shadow-sm hover:shadow-md transition-shadow duration-200"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--primary-background-color)",
                }}
                bodyStyle={{ padding: "20px" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div
                      className="text-xs sm:text-sm font-medium mb-1"
                      style={{ color: "var(--secondary-text-color)" }}
                    >
                      {stat.title}
                    </div>
                    <div
                      className="text-lg sm:text-xl md:text-2xl font-bold"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </div>
                  </div>
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: "var(--field-background-color)" }}
                  >
                    {stat.icon}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Recent Activity and Quick Actions in 2 columns */}
        <Row gutter={[24, 24]} className="mt-8 md:mt-12">
          {/* Recent Activity Section */}
          <Col xs={24} lg={12}>
            <h2
              className="text-lg sm:text-xl md:text-2xl font-bold mb-4"
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
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "var(--green-button-color)" }}
                    ></div>
                    <span
                      className="text-sm sm:text-base"
                      style={{ color: "var(--primary-text-color)" }}
                    >
                      Tài liệu "Toán cao cấp" đã được duyệt
                    </span>
                  </div>
                  <span
                    className="text-xs sm:text-sm"
                    style={{ color: "var(--secondary-text-color)" }}
                  >
                    2 giờ trước
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "var(--primary-color)" }}
                    ></div>
                    <span
                      className="text-sm sm:text-base"
                      style={{ color: "var(--primary-text-color)" }}
                    >
                      Người dùng mới: Nguyễn Văn A
                    </span>
                  </div>
                  <span
                    className="text-xs sm:text-sm"
                    style={{ color: "var(--secondary-text-color)" }}
                  >
                    4 giờ trước
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ color: "var(--red-button-color)" }}
                    ></div>
                    <span
                      className="text-sm sm:text-base"
                      style={{ color: "var(--primary-text-color)" }}
                    >
                      Báo cáo vi phạm từ tài liệu ID: 1234
                    </span>
                  </div>
                  <span
                    className="text-xs sm:text-sm"
                    style={{ color: "var(--secondary-text-color)" }}
                  >
                    6 giờ trước
                  </span>
                </div>
              </div>
            </Card>
          </Col>

          {/* Quick Actions Section */}
          <Col xs={24} lg={12}>
            <h2
              className="text-lg sm:text-xl md:text-2xl font-bold mb-4"
              style={{ color: "var(--primary-text-color)" }}
            >
              Chuyển hướng nhanh
            </h2>
            <Row gutter={[16, 16]}>
              {quickActions.map((action, index) => (
                <Col xs={24} sm={12} key={index}>
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
                        className="text-xs sm:text-sm font-semibold mb-1"
                        style={{ color: "var(--primary-text-color)" }}
                      >
                        {action.title}
                      </h3>
                      <p
                        className="text-xs"
                        style={{ color: "var(--secondary-text-color)" }}
                      >
                        {action.description}
                      </p>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AdminHomePage;
