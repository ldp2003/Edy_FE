import React, { useState, useEffect } from "react";
import { ChevronDown, Search, RefreshCw, Users } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { AdminUserStatisticsService } from "../../../utils/AdminUserStatisticsService";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { AdminBreadcrumb } from "../../../components/admin/common/AdminBreadcrumb";

interface StatisticsData {
  totalUsers?: number;
  activeUsers?: number;
  inactiveUsers?: number;
  bannedUsers?: number;
  newUsers?: number;
  monthlyNewUsers?: Array<{ month: string; newUsers: number }>;
}

interface MonthlyStatsItem {
  month: string;
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  bannedUsers: number;
  newUsers: number;
}

const UserStatisticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statisticsData, setStatisticsData] = useState<StatisticsData | null>(
    null
  );
  // const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const [chartType, setChartType] = useState<"bar" | "line" | "area" | "pie">(
    "bar"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch statistics data with year/month params
        const statsResponse =
          await AdminUserStatisticsService.getAdminUserStatistics({
            year: selectedYear,
            month: selectedMonth || undefined,
          });
        // API returns data in the format: { year, stats: {...}, monthlyStats: [...] }
        const apiData = statsResponse;
        // console.log("Processing stats data:", apiData);
        const processedData = {
          ...apiData?.stats,
          monthlyNewUsers:
            apiData?.monthlyStats?.map((item: MonthlyStatsItem) => ({
              month: item.month,
              newUsers: item.newUsers,
            })) || [],
        };
        // console.log("Setting statistics data:", processedData);
        setStatisticsData(processedData);
      } catch (err) {
        console.error("Error fetching user statistics:", err);
        setError("Không thể tải dữ liệu thống kê người dùng");
        message.error("Không thể tải dữ liệu thống kê người dùng");
        // Set empty data on error
        setStatisticsData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear, selectedMonth]);

  const handleSync = async () => {
    try {
      setSyncLoading(true);
      await AdminUserStatisticsService.syncAdminUserStatistics({
        year: selectedYear,
        month: selectedMonth || undefined,
      });
      message.success("Đồng bộ dữ liệu thành công!");

      // Refresh data after sync
      const statsResponse =
        await AdminUserStatisticsService.getAdminUserStatistics({
          year: selectedYear,
          month: selectedMonth || undefined,
        });
      const apiData = statsResponse;
      setStatisticsData({
        ...apiData?.stats,
        monthlyNewUsers:
          apiData?.monthlyStats?.map((item: MonthlyStatsItem) => ({
            month: item.month,
            newUsers: item.newUsers,
          })) || [],
      });
    } catch (err) {
      console.error("Error syncing user statistics:", err);
      message.error("Không thể đồng bộ dữ liệu thống kê");
    } finally {
      setSyncLoading(false);
    }
  };

  // Prepare pie chart data
  const pieChartData = [
    {
      name: "Đang hoạt động",
      value: statisticsData?.activeUsers || 0,
      color: "#10b981",
    },
    {
      name: "Không hoạt động",
      value: statisticsData?.inactiveUsers || 0,
      color: "#06b6d4",
    },
    {
      name: "Bị cấm",
      value: statisticsData?.bannedUsers || 0,
      color: "#ef4444",
    },
  ].filter((item) => item.value > 0);

  const renderChart = () => {
    const commonProps = {
      data:
        chartType === "pie"
          ? pieChartData
          : statisticsData?.monthlyNewUsers || [],
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="newUsers"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        );
      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="newUsers"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
            />
          </AreaChart>
        );
      case "pie":
        return (
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${((percent as number) * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="newUsers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <AdminBreadcrumb
        items={[
          { label: "Admin", path: "/admin" },
          { label: "Giám sát", path: "/admin/statistics/documents" },
          { label: "Thống kê người dùng" },
        ]}
      />

      <div className="mt-4">
        {/* Year/Month Selection */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Năm:
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 6 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Tháng:
                </label>
                <select
                  value={selectedMonth || ""}
                  onChange={(e) =>
                    setSelectedMonth(
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Tháng {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-gray-600">
                Hiển thị thống kê{" "}
                {selectedMonth ? `tháng ${selectedMonth}` : "cả năm"}{" "}
                {selectedYear}
              </div>
            </div>

            <button
              onClick={handleSync}
              disabled={syncLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw
                size={16}
                className={syncLoading ? "animate-spin" : ""}
              />
              <span>{syncLoading ? "Đang đồng bộ..." : "Làm mới"}</span>
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-yellow-300 rounded-lg p-4 sm:p-6 text-center border-2 border-yellow-400">
            <div
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: "var(--primary-text-color)" }}
            >
              {statisticsData?.totalUsers ?? 0}
            </div>
            <div
              className="text-sm mt-2"
              style={{ color: "var(--primary-text-color)" }}
            >
              Tổng người dùng
            </div>
          </div>
          <div className="bg-green-500 rounded-lg p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {statisticsData?.activeUsers ?? 0}
            </div>
            <div className="text-sm text-white mt-2">Đang hoạt động</div>
          </div>
          <div className="bg-cyan-400 rounded-lg p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {statisticsData?.inactiveUsers ?? 0}
            </div>
            <div className="text-sm text-white mt-2">Không hoạt động</div>
          </div>
          <div className="bg-red-600 rounded-lg p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {statisticsData?.bannedUsers ?? 0}
            </div>
            <div className="text-sm text-white mt-2">Bị cấm</div>
          </div>
          <div className="bg-blue-500 rounded-lg p-4 sm:p-6 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {statisticsData?.newUsers ?? 0}
            </div>
            <div className="text-sm text-white mt-2">Người dùng mới</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none text-sm"
            />
            <button className="text-gray-600 hover:text-gray-900">
              <ChevronDown size={20} />
            </button>
          </div>
          <button
            onClick={() => navigate("/admin/users")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Users size={16} />
            <span>Quản lý người dùng</span>
          </button>
        </div>

        {/* New Users Chart */}
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3
              className="text-sm sm:text-base font-semibold text-left"
              style={{ color: "var(--primary-text-color)" }}
            >
              {chartType === "pie"
                ? "Phân bố trạng thái người dùng"
                : "Thống kê người dùng mới"}{" "}
              {chartType !== "pie" &&
                (selectedMonth ? `tháng ${selectedMonth}` : "")}{" "}
              {chartType !== "pie" && `năm ${selectedYear}`}
            </h3>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Loại biểu đồ:
              </label>
              <select
                value={chartType}
                onChange={(e) =>
                  setChartType(
                    e.target.value as "bar" | "line" | "area" | "pie"
                  )
                }
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="bar">Cột</option>
                <option value="line">Đường</option>
                <option value="area">Khu vực</option>
                <option value="pie">Tròn</option>
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserStatisticsPage;
