import React, { useState, useEffect } from "react";
import { Row, Col, Divider } from "antd";
import {
  FileText,
  Users,
  Clock,
  AlertTriangle,
  Eye,
  Download,
  BookOpen,
  UserCheck,
} from "lucide-react";
import AdminDashboardHeader from "../../../components/admin/dashboard/AdminDashboardHeader";
import AdminStatsGrid from "../../../components/admin/dashboard/AdminStatsGrid";
import AdminChartsSection from "../../../components/admin/dashboard/AdminChartsSection";
import AdminQuickActions from "../../../components/admin/dashboard/AdminQuickActions";
import AdminRecentActivities from "../../../components/admin/dashboard/AdminRecentActivities";
import { type StatCard } from "../../../components/admin/dashboard/AdminStatsCard";

interface ActivityData {
  key: string;
  user: string;
  action: string;
  target: string;
  time: string;
  status: "success" | "warning" | "error";
}

const AdminHomePage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Mock data - in real app, this would come from API
  const statsData: StatCard[] = [
    {
      title: "Tổng tài liệu",
      value: 1247,
      icon: <FileText size={24} />,
      color: "var(--primary-color)",
      bgColor: "rgba(13, 153, 255, 0.1)",
      trend: { value: 12.5, isPositive: true },
    },
    {
      title: "Người dùng hoạt động",
      value: 892,
      icon: <Users size={24} />,
      color: "var(--green-button-color)",
      bgColor: "rgba(39, 167, 67, 0.1)",
      trend: { value: 8.2, isPositive: true },
    },
    {
      title: "Chờ duyệt",
      value: 23,
      icon: <Clock size={24} />,
      color: "var(--intensive-color)",
      bgColor: "rgba(255, 213, 87, 0.1)",
      trend: { value: -5.1, isPositive: false },
    },
    {
      title: "Báo cáo vi phạm",
      value: 7,
      icon: <AlertTriangle size={24} />,
      color: "var(--red-button-color)",
      bgColor: "rgba(214, 56, 71, 0.1)",
      trend: { value: -15.3, isPositive: false },
    },
    {
      title: "Lượt xem hôm nay",
      value: "2.4K",
      icon: <Eye size={24} />,
      color: "var(--secondary-color)",
      bgColor: "rgba(53, 134, 219, 0.1)",
      trend: { value: 18.7, isPositive: true },
    },
    {
      title: "Download hôm nay",
      value: 156,
      icon: <Download size={24} />,
      color: "var(--favorite-color)",
      bgColor: "rgba(255, 184, 0, 0.1)",
      trend: { value: 22.1, isPositive: true },
    },
    {
      title: "Tài liệu mới tuần",
      value: 89,
      icon: <BookOpen size={24} />,
      color: "var(--primary-text-color)",
      bgColor: "rgba(23, 67, 113, 0.1)",
      trend: { value: 14.8, isPositive: true },
    },
    {
      title: "Tỷ lệ phê duyệt",
      value: "94.2%",
      icon: <UserCheck size={24} />,
      color: "var(--green-button-color)",
      bgColor: "rgba(39, 167, 67, 0.1)",
      trend: { value: 2.3, isPositive: true },
    },
  ];

  const recentActivities: ActivityData[] = [
    {
      key: "1",
      user: "Nguyễn Văn A",
      action: "Upload tài liệu",
      target: "Machine Learning Guide.pdf",
      time: "2 phút trước",
      status: "success",
    },
    {
      key: "2",
      user: "Trần Thị B",
      action: "Báo cáo vi phạm",
      target: "Document ID: 12345",
      time: "5 phút trước",
      status: "warning",
    },
    {
      key: "3",
      user: "Lê Văn C",
      action: "Đăng ký tài khoản",
      target: "Đại học Bách khoa",
      time: "12 phút trước",
      status: "success",
    },
    {
      key: "4",
      user: "Phạm Thị D",
      action: "Download tài liệu",
      target: "React Tutorial.pdf",
      time: "18 phút trước",
      status: "success",
    },
    {
      key: "5",
      user: "Hoàng Văn E",
      action: "Bị khóa tài khoản",
      target: "Vi phạm quy định",
      time: "25 phút trước",
      status: "error",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "var(--secondary-background-color)",
        minHeight: "100vh",
      }}
    >
      {/* Header Section */}
      <AdminDashboardHeader currentTime={currentTime} />

      {/* Stats Cards */}
      <AdminStatsGrid statsData={statsData} />

      {/* Main Content Grid */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 24px 32px 24px",
        }}
      >
        <Row gutter={[24, 24]}>
          {/* Charts Section */}
          <Col xs={24} lg={16}>
            <AdminChartsSection />
          </Col>

          {/* Quick Actions */}
          <Col xs={24} lg={8}>
            <AdminQuickActions />
          </Col>
        </Row>

        <Divider
          style={{ margin: "32px 0", borderColor: "var(--border-color)" }}
        />

        {/* Recent Activities */}
        <AdminRecentActivities activities={recentActivities} />
      </div>
    </div>
  );
};

export default AdminHomePage;
