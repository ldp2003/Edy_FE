import React, { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
            <span className="text-sm text-gray-600">50 hàng:</span>
            <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
              5 <ChevronDown size={16} />
            </button>
          </div>
          <div className="text-sm text-gray-600">1-2 trong 250</div>
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

      {/* New Users Chart */}
      <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
        <h3
          className="text-base sm:text-lg font-semibold mb-3 text-left"
          style={{ color: "var(--primary-text-color)" }}
        >
          Thống kê người dùng mới
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={newUsersData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="newUsers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserStatisticsPage;
