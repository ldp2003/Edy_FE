import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Divider, Select, Button, Spin } from "antd";
import {
  FileText,
  Users,
  Clock,
  AlertTriangle,
  Eye,
  Download,
  BookOpen,
  UserCheck,
  RefreshCw,
} from "lucide-react";
import AdminDashboardHeader from "../../../components/admin/dashboard/AdminDashboardHeader";
import AdminStatsGrid from "../../../components/admin/dashboard/AdminStatsGrid";
import AdminChartsSection from "../../../components/admin/dashboard/AdminChartsSection";
import AdminQuickActions from "../../../components/admin/dashboard/AdminQuickActions";
import AdminRecentActivities from "../../../components/admin/dashboard/AdminRecentActivities";
import { type StatCard } from "../../../components/admin/dashboard/AdminStatsCard";
import {
  adminStatisticsService,
  type AdminDashboardStats,
} from "../../../utils/AdminStatisticsService";

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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedPeriod, setSelectedPeriod] = useState<
    "day" | "week" | "month" | "year"
  >("month");
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [statsData, setStatsData] = useState<AdminDashboardStats | null>(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchStatistics = useCallback(async () => {
    setIsLoading(true);
    try {
      const stats = await adminStatisticsService.getDashboardStats({
        period: selectedPeriod,
        year: selectedYear,
      });
      setStatsData(stats);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      // Fallback to mock data if API fails
      setStatsData(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedYear, selectedPeriod]);

  // Fetch statistics when year or period changes
  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const handleSyncStatistics = async () => {
    setIsSyncing(true);
    try {
      await adminStatisticsService.syncDashboardStats({
        period: selectedPeriod,
        year: selectedYear,
      });
      // Refresh data after sync
      await fetchStatistics();
    } catch (error) {
      console.error("Error syncing statistics:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Generate years for selector (current year and 4 previous years)
  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year, label: `${year}` };
  });

  const periodOptions = [
    { value: "day", label: "Hôm nay" },
    { value: "week", label: "Tuần này" },
    { value: "month", label: "Tháng này" },
    { value: "year", label: "Năm này" },
  ];

  // Convert API data to StatCard format or use mock data
  const getStatsCards = useCallback((): StatCard[] => {
    if (!statsData) {
      // Mock data as fallback
      return [
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
          title: "Lượt xem",
          value: "2.4K",
          icon: <Eye size={24} />,
          color: "var(--secondary-color)",
          bgColor: "rgba(53, 134, 219, 0.1)",
          trend: { value: 18.7, isPositive: true },
        },
        {
          title: "Download",
          value: 156,
          icon: <Download size={24} />,
          color: "var(--favorite-color)",
          bgColor: "rgba(255, 184, 0, 0.1)",
          trend: { value: 22.1, isPositive: true },
        },
        {
          title: "Tài liệu mới",
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
    }

    return [
      {
        title: "Tổng tài liệu",
        value: statsData.totalDocuments,
        icon: <FileText size={24} />,
        color: "var(--primary-color)",
        bgColor: "rgba(13, 153, 255, 0.1)",
        trend: { value: 12.5, isPositive: true },
      },
      {
        title: "Người dùng hoạt động",
        value: statsData.activeUsers,
        icon: <Users size={24} />,
        color: "var(--green-button-color)",
        bgColor: "rgba(39, 167, 67, 0.1)",
        trend: { value: 8.2, isPositive: true },
      },
      {
        title: "Chờ duyệt",
        value: statsData.pendingApprovals,
        icon: <Clock size={24} />,
        color: "var(--intensive-color)",
        bgColor: "rgba(255, 213, 87, 0.1)",
        trend: { value: -5.1, isPositive: false },
      },
      {
        title: "Báo cáo vi phạm",
        value: statsData.violationReports,
        icon: <AlertTriangle size={24} />,
        color: "var(--red-button-color)",
        bgColor: "rgba(214, 56, 71, 0.1)",
        trend: { value: -15.3, isPositive: false },
      },
      {
        title: "Lượt xem",
        value: statsData.dailyViews,
        icon: <Eye size={24} />,
        color: "var(--secondary-color)",
        bgColor: "rgba(53, 134, 219, 0.1)",
        trend: { value: 18.7, isPositive: true },
      },
      {
        title: "Download",
        value: statsData.dailyDownloads,
        icon: <Download size={24} />,
        color: "var(--favorite-color)",
        bgColor: "rgba(255, 184, 0, 0.1)",
        trend: { value: 22.1, isPositive: true },
      },
      {
        title: "Tài liệu mới",
        value: statsData.weeklyNewDocuments,
        icon: <BookOpen size={24} />,
        color: "var(--primary-text-color)",
        bgColor: "rgba(23, 67, 113, 0.1)",
        trend: { value: 14.8, isPositive: true },
      },
      {
        title: "Tỷ lệ phê duyệt",
        value: `${statsData.approvalRate}%`,
        icon: <UserCheck size={24} />,
        color: "var(--green-button-color)",
        bgColor: "rgba(39, 167, 67, 0.1)",
        trend: { value: 2.3, isPositive: true },
      },
    ];
  }, [statsData]);

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

      {/* Time Period Selector and Sync Button */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "24px 24px 0 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            backgroundColor: "var(--card-background-color)",
            padding: "16px 24px",
            borderRadius: "8px",
            border: "1px solid var(--border-color)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span
              style={{ fontWeight: "500", color: "var(--primary-text-color)" }}
            >
              Thời gian thống kê:
            </span>
            <Select
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              style={{ width: 120 }}
              options={periodOptions}
            />
            <Select
              value={selectedYear}
              onChange={setSelectedYear}
              style={{ width: 100 }}
              options={yearOptions}
            />
          </div>
          <Button
            type="primary"
            icon={<RefreshCw size={16} />}
            loading={isSyncing}
            onClick={handleSyncStatistics}
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            Đồng bộ dữ liệu
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
          <div
            style={{ marginTop: "16px", color: "var(--secondary-text-color)" }}
          >
            Đang tải dữ liệu thống kê...
          </div>
        </div>
      ) : (
        <AdminStatsGrid statsData={getStatsCards()} />
      )}

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
