import React, { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const users = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    role: "Quản trị hệ thống",
    email: "admin@example.com",
    posts: 10,
    status: "Hoạt động",
    score: 90,
  },
  {
    id: 2,
    name: "Nguyễn Thị C",
    role: "Quản trị tài liệu",
    email: "mod@example.com",
    posts: 8,
    status: "Hoạt động",
    score: 43,
  },
  {
    id: 3,
    name: "Phạm Hoàng E",
    role: "Quản trị người dùng",
    email: "john@example.com",
    posts: 5,
    status: "Hoạt động",
    score: 25,
  },
  {
    id: 4,
    name: "Nguyễn Văn B",
    role: "Người dùng",
    email: "jane@example.com",
    posts: 3,
    status: "Hoạt động",
    score: 12,
  },
];

// Dữ liệu thống kê người dùng mới theo tháng
const newUsersData = [
  { month: "T1", newUsers: 25 },
  { month: "T2", newUsers: 45 },
  { month: "T3", newUsers: 35 },
  { month: "T4", newUsers: 55 },
  { month: "T5", newUsers: 40 },
  { month: "T6", newUsers: 60 },
  { month: "T7", newUsers: 30 },
  { month: "T8", newUsers: 50 },
  { month: "T9", newUsers: 65 },
  { month: "T10", newUsers: 45 },
  { month: "T11", newUsers: 55 },
  { month: "T12", newUsers: 70 },
];

// Dữ liệu thống kê lượt đăng tài liệu theo tháng
const documentUploadsData = [
  { month: "T1", uploads: 120 },
  { month: "T2", uploads: 150 },
  { month: "T3", uploads: 180 },
  { month: "T4", uploads: 200 },
  { month: "T5", uploads: 170 },
  { month: "T6", uploads: 220 },
  { month: "T7", uploads: 190 },
  { month: "T8", uploads: 240 },
  { month: "T9", uploads: 210 },
  { month: "T10", uploads: 230 },
  { month: "T11", uploads: 250 },
  { month: "T12", uploads: 280 },
];

// Dữ liệu thống kê lượt tải tài liệu theo tháng
const documentDownloadsData = [
  { month: "T1", downloads: 450 },
  { month: "T2", downloads: 520 },
  { month: "T3", downloads: 480 },
  { month: "T4", downloads: 600 },
  { month: "T5", downloads: 550 },
  { month: "T6", downloads: 650 },
  { month: "T7", downloads: 580 },
  { month: "T8", downloads: 700 },
  { month: "T9", downloads: 620 },
  { month: "T10", downloads: 680 },
  { month: "T11", downloads: 720 },
  { month: "T12", downloads: 750 },
];

// Top 5 loại tài liệu được xem và tải nhiều nhất
const topDocumentTypes = [
  {
    id: 1,
    type: "Bài giảng",
    views: 15420,
    downloads: 2840,
  },
  {
    id: 2,
    type: "Đề thi",
    views: 12850,
    downloads: 2150,
  },
  {
    id: 3,
    type: "Tài liệu tham khảo",
    views: 11260,
    downloads: 1890,
  },
  {
    id: 4,
    type: "Bài tập",
    views: 9840,
    downloads: 1650,
  },
  {
    id: 5,
    type: "Sách giáo khoa",
    views: 8760,
    downloads: 1420,
  },
];

const UserStatisticsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 text-left">
        Thống kê <span className="text-gray-400">›</span> Thống kê người dùng
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-yellow-300 rounded-lg p-4 sm:p-6 text-center border-2 border-yellow-400">
          <div
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: "var(--primary-text-color)" }}
          >
            200
          </div>
          <div
            className="text-sm mt-2"
            style={{ color: "var(--primary-text-color)" }}
          >
            Tổng người dùng
          </div>
        </div>
        <div className="bg-green-500 rounded-lg p-4 sm:p-6 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-white">120</div>
          <div className="text-sm text-white mt-2">Đang hoạt động</div>
        </div>
        <div className="bg-cyan-400 rounded-lg p-4 sm:p-6 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-white">5</div>
          <div className="text-sm text-white mt-2">Bị tạm khóa</div>
        </div>
        <div className="bg-red-600 rounded-lg p-4 sm:p-6 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-white">5</div>
          <div className="text-sm text-white mt-2">Bị cấm</div>
        </div>
        <div className="bg-blue-500 rounded-lg p-4 sm:p-6 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-white">45</div>
          <div className="text-sm text-white mt-2">Người dùng mới</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 flex items-center gap-4">
        <Search size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên tài khoản"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 outline-none text-sm"
        />
        <button className="text-gray-600 hover:text-gray-900">
          <ChevronDown size={20} />
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-1 sm:px-4 text-gray-600 font-medium">
                  STT
                </th>
                <th className="text-left py-3 px-1 sm:px-4 text-gray-600 font-medium">
                  NGƯỜI DÙNG
                </th>
                <th className="text-left py-3 px-1 sm:px-4 text-gray-600 font-medium">
                  VAI TRÒ
                </th>
                <th className="text-left py-3 px-1 sm:px-4 text-gray-600 font-medium">
                  EMAIL
                </th>
                <th className="text-center py-3 px-1 sm:px-4 text-gray-600 font-medium">
                  TỔNG BÀI
                </th>
                <th className="text-left py-3 px-1 sm:px-4 text-gray-600 font-medium">
                  TRẠNG THÁI
                </th>
                <th className="text-center py-3 px-1 sm:px-4 text-gray-600 font-medium">
                  ĐIỂM HẠNG
                </th>
                <th className="text-left py-3 px-1 sm:px-4 text-gray-600 font-medium">
                  XEM CHI TIẾT
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td
                    className="py-4 px-1 sm:px-4"
                    style={{ color: "var(--third-text-color)" }}
                  >
                    {user.id}
                  </td>
                  <td
                    className="py-4 px-1 sm:px-4 font-medium"
                    style={{ color: "var(--third-text-color)" }}
                  >
                    {user.name}
                  </td>
                  <td
                    className="py-4 px-1 sm:px-4"
                    style={{ color: "var(--third-text-color)" }}
                  >
                    {user.role}
                  </td>
                  <td
                    className="py-4 px-1 sm:px-4"
                    style={{ color: "var(--third-text-color)" }}
                  >
                    {user.email}
                  </td>
                  <td
                    className="py-4 px-1 sm:px-4 text-center"
                    style={{ color: "var(--third-text-color)" }}
                  >
                    {user.posts}
                  </td>
                  <td
                    className="py-4 px-1 sm:px-4"
                    style={{ color: "var(--third-text-color)" }}
                  >
                    {user.status}
                  </td>
                  <td
                    className="py-4 px-1 sm:px-4 text-center"
                    style={{ color: "var(--third-text-color)" }}
                  >
                    {user.score}
                  </td>
                  <td className="py-4 px-1 sm:px-4">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 border-t border-gray-200 px-2 sm:px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">50 dòng:</span>
            <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
              5 <ChevronDown size={16} />
            </button>
          </div>
          <div className="text-sm text-gray-600">1-2 of 250</div>
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-gray-200 rounded">
              <ChevronLeft size={18} className="text-gray-600" />
            </button>
            <button className="p-1 hover:bg-gray-200 rounded">
              <ChevronRight size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* New Users Chart */}
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
          <h3
            className="text-base sm:text-lg font-semibold mb-3 text-left"
            style={{ color: "var(--primary-text-color)" }}
          >
            Thống kê người dùng mới
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={newUsersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="newUsers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Document Uploads Chart */}
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
          <h3
            className="text-base sm:text-lg font-semibold mb-3 text-left"
            style={{ color: "var(--primary-text-color)" }}
          >
            Thống kê lượt đăng tài liệu
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={documentUploadsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="uploads"
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ fill: "#06b6d4", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Downloads and Top Types Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Document Downloads Chart */}
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
          <h3
            className="text-base sm:text-lg font-semibold mb-3 text-left"
            style={{ color: "var(--primary-text-color)" }}
          >
            Thống kê lượt tải tài liệu
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={documentDownloadsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="downloads"
                stroke="#ec4899"
                strokeWidth={2}
                dot={{ fill: "#ec4899", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Document Types */}
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
          <h3
            className="text-base sm:text-lg font-semibold mb-3 text-left"
            style={{ color: "var(--primary-text-color)" }}
          >
            TOP 5 loại tài liệu được xem và tải nhiều nhất
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-1.5 px-1 sm:px-1.5 text-gray-600 font-medium">
                    STT
                  </th>
                  <th className="text-left py-1.5 px-1 sm:px-1.5 text-gray-600 font-medium">
                    Loại tài liệu
                  </th>
                  <th className="text-center py-1.5 px-1 sm:px-1.5 text-gray-600 font-medium">
                    Lượt xem
                  </th>
                  <th className="text-center py-1.5 px-1 sm:px-1.5 text-gray-600 font-medium">
                    Lượt tải
                  </th>
                </tr>
              </thead>
              <tbody>
                {topDocumentTypes.map((type) => (
                  <tr
                    key={type.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td
                      className="py-2 px-1 sm:px-1.5"
                      style={{ color: "var(--third-text-color)" }}
                    >
                      {type.id}
                    </td>
                    <td
                      className="py-2 px-1 sm:px-1.5 font-medium"
                      style={{ color: "var(--third-text-color)" }}
                    >
                      {type.type}
                    </td>
                    <td
                      className="py-2 px-1 sm:px-1.5 text-center"
                      style={{ color: "var(--third-text-color)" }}
                    >
                      {type.views.toLocaleString()}
                    </td>
                    <td
                      className="py-2 px-1 sm:px-1.5 text-center"
                      style={{ color: "var(--third-text-color)" }}
                    >
                      {type.downloads.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatisticsPage;
