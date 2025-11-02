import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  RefreshCw,
  Users,
} from "lucide-react";
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
import { UserService } from "../../../utils/UserService";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import type { User } from "../../../models/user";

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
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
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
        console.log("Processing stats data:", apiData);
        const processedData = {
          ...apiData?.stats,
          monthlyNewUsers:
            apiData?.monthlyStats?.map((item: MonthlyStatsItem) => ({
              month: item.month,
              newUsers: item.newUsers,
            })) || [],
        };
        console.log("Setting statistics data:", processedData);
        setStatisticsData(processedData);

        // Fetch users list using UserService (same as AdminUserTable)
        const usersResponse = await UserService.getAllUsers();
        const usersData = usersResponse;
        console.log("Processing users data:", usersData);
        setUsersList(usersData || []);
      } catch (err) {
        console.error("Error fetching user statistics:", err);
        setError("Không thể tải dữ liệu thống kê người dùng");
        message.error("Không thể tải dữ liệu thống kê người dùng");
        // Set empty data on error
        setStatisticsData(null);
        setUsersList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedYear, selectedMonth, currentPage, pageSize, searchTerm]);

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

  const filteredUsers = (usersList || []).filter(
    (user: User) =>
      `${user.first_name || ""} ${user.last_name || ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.contact_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply pagination to filtered users
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  console.log("Current state:", {
    statisticsData,
    usersList: usersList?.length,
    filteredUsers: filteredUsers.length,
    paginatedUsers: paginatedUsers.length,
    loading,
    error,
  });

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
      <div className="text-sm text-gray-600 text-left">
        Thống kê <span className="text-gray-400">›</span> Thống kê người dùng
      </div>

      {/* Year/Month Selection */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Năm:</label>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
      <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center justify-between gap-4">
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

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-center">
                <th className="text-center py-3 px-2 text-gray-600 font-medium w-12">
                  STT
                </th>
                <th className=" py-3 px-2 text-gray-600 font-medium">Tên</th>
                <th className=" py-3 px-2 text-gray-600 font-medium ">Email</th>
                <th className=" py-3 px-2 text-gray-600 font-medium ">
                  Vai trò
                </th>
                <th className="text-center py-3 px-2 text-gray-600 font-medium ">
                  Trạng thái
                </th>
                <th className="text-center py-3 px-2 text-gray-600 font-medium">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    Không có dữ liệu người dùng
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user: User, index: number) => (
                  <tr
                    key={user._id || index}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td
                      className="py-3 px-2 text-center"
                      style={{ color: "var(--third-text-color)" }}
                    >
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td
                      className="py-3 px-2 font-medium"
                      style={{ color: "var(--third-text-color)" }}
                    >
                      {`${user.first_name || ""} ${
                        user.last_name || ""
                      }`.trim() || "N/A"}
                    </td>
                    <td
                      className="py-3 px-2"
                      style={{ color: "var(--third-text-color)" }}
                    >
                      {user.contact_email || "N/A"}
                    </td>
                    <td
                      className="py-3 px-2"
                      style={{ color: "var(--third-text-color)" }}
                    >
                      {user.role === "ADMIN"
                        ? "Admin"
                        : user.role === "MODERATOR"
                        ? "Moderator"
                        : "Người dùng"}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : user.status === "INACTIVE"
                            ? "bg-yellow-100 text-yellow-800"
                            : user.status === "BANNED"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.status === "ACTIVE"
                          ? "Hoạt động"
                          : user.status === "INACTIVE"
                          ? "Không hoạt động"
                          : user.status === "BANNED"
                          ? "Bị cấm"
                          : user.status || "Hoạt động"}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 border-t border-gray-200 px-3 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Hiển thị:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Trang {currentPage} / {Math.ceil(filteredUsers.length / pageSize)} (
            {filteredUsers.length} người dùng)
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
              className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} className="text-gray-600" />
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(Math.ceil(filteredUsers.length / pageSize), prev + 1)
                )
              }
              disabled={
                currentPage >= Math.ceil(filteredUsers.length / pageSize)
              }
              className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
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
                setChartType(e.target.value as "bar" | "line" | "area" | "pie")
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
  );
};

export default UserStatisticsPage;
