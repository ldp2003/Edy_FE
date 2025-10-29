/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";

const barChartData = [
  { name: "Tiêu luận", value: 5 },
  { name: "Nguyên cứu khoa học", value: 4 },
  { name: "Khác", value: 2 },
];

// Dữ liệu theo tháng (12 tháng)
const monthlyData = {
  2024: {
    T1: Array.from({ length: 31 }, (_, i) => ({
      day: `01/${String(i + 1).padStart(2, "0")}`,
      views: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 30) + 5,
    })),
    T2: Array.from({ length: 29 }, (_, i) => ({
      day: `02/${String(i + 1).padStart(2, "0")}`,
      views: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 30) + 5,
    })),
    T3: Array.from({ length: 31 }, (_, i) => ({
      day: `03/${String(i + 1).padStart(2, "0")}`,
      views: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 30) + 5,
    })),
    T4: Array.from({ length: 30 }, (_, i) => ({
      day: `04/${String(i + 1).padStart(2, "0")}`,
      views: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 30) + 5,
    })),
    T5: Array.from({ length: 31 }, (_, i) => ({
      day: `05/${String(i + 1).padStart(2, "0")}`,
      views: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 30) + 5,
    })),
    T6: Array.from({ length: 30 }, (_, i) => ({
      day: `06/${String(i + 1).padStart(2, "0")}`,
      views: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 30) + 5,
    })),
    T7: Array.from({ length: 31 }, (_, i) => ({
      day: `07/${String(i + 1).padStart(2, "0")}`,
      views: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 30) + 5,
    })),
    T8: Array.from({ length: 31 }, (_, i) => ({
      day: `08/${String(i + 1).padStart(2, "0")}`,
      views: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 30) + 5,
    })),
    T9: Array.from({ length: 30 }, (_, i) => ({
      day: `09/${String(i + 1).padStart(2, "0")}`,
      views: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 30) + 5,
    })),
    T10: Array.from({ length: 31 }, (_, i) => ({
      day: `10/${String(i + 1).padStart(2, "0")}`,
      views: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 30) + 5,
    })),
    T11: Array.from({ length: 30 }, (_, i) => ({
      day: `11/${String(i + 1).padStart(2, "0")}`,
      views: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 30) + 5,
    })),
    T12: Array.from({ length: 31 }, (_, i) => ({
      day: `12/${String(i + 1).padStart(2, "0")}`,
      views: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 30) + 5,
    })),
  },
  2025: {
    T1: Array.from({ length: 31 }, (_, i) => ({
      day: `01/${String(i + 1).padStart(2, "0")}`,
      views: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 30) + 5,
    })),
    T2: Array.from({ length: 29 }, (_, i) => ({
      day: `02/${String(i + 1).padStart(2, "0")}`,
      views: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 30) + 5,
    })),
    T3: Array.from({ length: 31 }, (_, i) => ({
      day: `03/${String(i + 1).padStart(2, "0")}`,
      views: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 30) + 5,
    })),
    T4: Array.from({ length: 30 }, (_, i) => ({
      day: `04/${String(i + 1).padStart(2, "0")}`,
      views: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 30) + 5,
    })),
    T5: Array.from({ length: 31 }, (_, i) => ({
      day: `05/${String(i + 1).padStart(2, "0")}`,
      views: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 30) + 5,
    })),
    T6: Array.from({ length: 30 }, (_, i) => ({
      day: `06/${String(i + 1).padStart(2, "0")}`,
      views: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 30) + 5,
    })),
    T7: Array.from({ length: 31 }, (_, i) => ({
      day: `07/${String(i + 1).padStart(2, "0")}`,
      views: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 30) + 5,
    })),
    T8: Array.from({ length: 31 }, (_, i) => ({
      day: `08/${String(i + 1).padStart(2, "0")}`,
      views: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 30) + 5,
    })),
    T9: Array.from({ length: 30 }, (_, i) => ({
      day: `09/${String(i + 1).padStart(2, "0")}`,
      views: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 30) + 5,
    })),
    T10: Array.from({ length: 31 }, (_, i) => ({
      day: `10/${String(i + 1).padStart(2, "0")}`,
      views: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 30) + 5,
    })),
    T11: Array.from({ length: 30 }, (_, i) => ({
      day: `11/${String(i + 1).padStart(2, "0")}`,
      views: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 30) + 5,
    })),
    T12: Array.from({ length: 31 }, (_, i) => ({
      day: `12/${String(i + 1).padStart(2, "0")}`,
      views: Math.floor(Math.random() * 50) + 10,
      downloads: Math.floor(Math.random() * 30) + 5,
    })),
  },
};

// Dữ liệu cho các năm
const yearlyData = {
  2024: [
    { month: "T1", views: 25, downloads: 20 },
    { month: "T2", views: 60, downloads: 25 },
    { month: "T3", views: 35, downloads: 18 },
    { month: "T4", views: 25, downloads: 12 },
    { month: "T5", views: 30, downloads: 20 },
    { month: "T6", views: 40, downloads: 35 },
    { month: "T7", views: 20, downloads: 12 },
    { month: "T8", views: 45, downloads: 25 },
    { month: "T9", views: 65, downloads: 30 },
    { month: "T10", views: 25, downloads: 18 },
    { month: "T11", views: 45, downloads: 20 },
    { month: "T12", views: 45, downloads: 25 },
  ],
  2025: [
    { month: "T1", views: 30, downloads: 25 },
    { month: "T2", views: 70, downloads: 30 },
    { month: "T3", views: 40, downloads: 20 },
    { month: "T4", views: 30, downloads: 15 },
    { month: "T5", views: 35, downloads: 25 },
    { month: "T6", views: 45, downloads: 40 },
    { month: "T7", views: 25, downloads: 15 },
    { month: "T8", views: 50, downloads: 30 },
    { month: "T9", views: 70, downloads: 35 },
    { month: "T10", views: 30, downloads: 20 },
    { month: "T11", views: 50, downloads: 25 },
    { month: "T12", views: 50, downloads: 30 },
  ],
};

const topDocuments = [
  {
    id: 1,
    title: "Tài liệu ứng hộp Kinh tế chính trị Mác Lênin",
    views: 154,
    downloads: 28,
    rating: "84%",
  },
  {
    id: 2,
    title: "Tài liệu ứng hộp Kinh tế chính trị Mác Lênin",
    views: 148,
    downloads: 21,
    rating: "84%",
  },
  {
    id: 3,
    title: "Tài liệu ứng hộp Kinh tế chính trị Mác Lênin",
    views: 126,
    downloads: 10,
    rating: "84%",
  },
  {
    id: 4,
    title: "Tài liệu ứng hộp Kinh tế chính trị Mác Lênin",
    views: 148,
    downloads: 21,
    rating: "84%",
  },
  {
    id: 5,
    title: "Tài liệu ứng hộp Kinh tế chính trị Mác Lênin",
    views: 126,
    downloads: 10,
    rating: "84%",
  },
];

const approvedDocuments = [
  {
    id: 1,
    title: "Tài liệu ứng hộp Kinh tế chính trị Mác Lênin",
    author: "Nguyễn Văn A",
    subject: "Kinh tế chính trị",
    uploadDate: "2025-01-15",
    approvedDate: "2025-01-16",
    approvedBy: "AI",
    status: "Đã duyệt",
  },
  {
    id: 2,
    title: "Bài giảng Toán cao cấp A1",
    author: "Trần Thị B",
    subject: "Toán học",
    uploadDate: "2025-01-14",
    approvedDate: "2025-01-15",
    approvedBy: "Admin",
    status: "Đã duyệt",
  },
  {
    id: 3,
    title: "Tài liệu Hóa hữu cơ",
    author: "Lê Văn C",
    subject: "Hóa học",
    uploadDate: "2025-01-13",
    approvedDate: "2025-01-14",
    approvedBy: "AI",
    status: "Đã duyệt",
  },
  {
    id: 4,
    title: "Bài tập Vật lý đại cương",
    author: "Phạm Thị D",
    subject: "Vật lý",
    uploadDate: "2025-01-12",
    approvedDate: "2025-01-13",
    approvedBy: "Admin",
    status: "Đã duyệt",
  },
  {
    id: 5,
    title: "Tài liệu Tiếng Anh chuyên ngành",
    author: "Hoàng Văn E",
    subject: "Tiếng Anh",
    uploadDate: "2025-01-11",
    approvedDate: "2025-01-12",
    approvedBy: "AI",
    status: "Đã duyệt",
  },
];

const DocumentStatisticsPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [chartType, setChartType] = useState("line");
  const [approvedFilter, setApprovedFilter] = useState({
    author: "",
    subject: "",
    dateFrom: "",
    dateTo: "",
  });

  const months = [
    { value: "", label: "Tất cả tháng" },
    { value: "T1", label: "Tháng 1" },
    { value: "T2", label: "Tháng 2" },
    { value: "T3", label: "Tháng 3" },
    { value: "T4", label: "Tháng 4" },
    { value: "T5", label: "Tháng 5" },
    { value: "T6", label: "Tháng 6" },
    { value: "T7", label: "Tháng 7" },
    { value: "T8", label: "Tháng 8" },
    { value: "T9", label: "Tháng 9" },
    { value: "T10", label: "Tháng 10" },
    { value: "T11", label: "Tháng 11" },
    { value: "T12", label: "Tháng 12" },
  ];

  const years = ["2024", "2025"];

  // Lọc dữ liệu theo tháng hoặc năm
  const getFilteredData = () => {
    if (selectedMonth) {
      // Nếu chọn tháng, trả về dữ liệu theo ngày của tháng đó
      const yearData =
        monthlyData[selectedYear as unknown as keyof typeof monthlyData];
      return yearData[selectedMonth as keyof typeof yearData] || [];
    } else {
      // Nếu không chọn tháng, trả về dữ liệu theo tháng của năm đó
      const yearData =
        yearlyData[selectedYear as unknown as keyof typeof yearlyData] || [];
      return yearData;
    }
  };

  const lineChartData = getFilteredData();

  // Lọc tài liệu đã duyệt
  const filteredApprovedDocuments = approvedDocuments.filter((doc) => {
    const matchesAuthor =
      !approvedFilter.author ||
      doc.author.toLowerCase().includes(approvedFilter.author.toLowerCase());
    const matchesSubject =
      !approvedFilter.subject ||
      doc.subject.toLowerCase().includes(approvedFilter.subject.toLowerCase());
    const matchesDateFrom =
      !approvedFilter.dateFrom || doc.uploadDate >= approvedFilter.dateFrom;
    const matchesDateTo =
      !approvedFilter.dateTo || doc.uploadDate <= approvedFilter.dateTo;
    return matchesAuthor && matchesSubject && matchesDateFrom && matchesDateTo;
  });
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 text-left">
        Thống kê <span className="text-gray-400">›</span> Thống kê tài liệu
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gray-200 rounded-lg p-3 sm:p-4 text-center">
          <div
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: "var(--primary-text-color)" }}
          >
            200
          </div>
          <div className="text-sm text-gray-600 mt-2">Bài báo</div>
        </div>
        <div className="bg-cyan-400 rounded-lg p-3 sm:p-4 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-white">
            111.200
          </div>
          <div className="text-sm text-white mt-2">Tổng lượt xem</div>
        </div>
        <div className="bg-yellow-300 rounded-lg p-3 sm:p-4 text-center">
          <div
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: "var(--primary-text-color)" }}
          >
            12.112
          </div>
          <div
            className="text-sm mt-2"
            style={{ color: "var(--primary-text-color)" }}
          >
            Tổng lượt tải
          </div>
        </div>
        <div className="bg-white border border-gray-300 rounded-lg p-3 sm:p-4 text-center">
          <div className="flex gap-2 mb-1.5">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
            >
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="text-xs text-gray-500">Tháng và Năm</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3
              className="text-base sm:text-lg font-semibold text-left"
              style={{ color: "var(--primary-text-color)" }}
            >
              Biểu đồ Thống kê theo loại
            </h3>
            <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
              Tất cả <ChevronDown size={16} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Documents Table */}
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
          <h3
            className="text-base sm:text-lg font-semibold mb-3 text-left"
            style={{ color: "var(--primary-text-color)" }}
          >
            TOP 5 TÀI LIỆU ĐƯỢC XEM VÀ TẢI NHIỀU NHẤT
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-1.5 px-1 sm:px-1.5 text-gray-600 font-medium">
                    STT
                  </th>
                  <th className="text-left py-1.5 px-1 sm:px-1.5 text-gray-600 font-medium">
                    Tên tài liệu
                  </th>
                  <th className="text-center py-1.5 px-1 sm:px-1.5 text-gray-600 font-medium">
                    Lượt xem
                  </th>
                  <th className="text-center py-1.5 px-1 sm:px-1.5 text-gray-600 font-medium">
                    Lượt tải
                  </th>
                  <th className="text-center py-1.5 px-1 sm:px-1.5 text-gray-600 font-medium">
                    Đánh giá
                  </th>
                </tr>
              </thead>
              <tbody>
                {topDocuments.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td
                      className="py-2 px-1 sm:px-1.5"
                      style={{ color: "var(--third-text-color)" }}
                    >
                      {doc.id}
                    </td>
                    <td
                      className="py-2 px-1 sm:px-1.5 text-xs"
                      style={{ color: "var(--third-text-color)" }}
                    >
                      {doc.title}
                    </td>
                    <td
                      className="py-2 px-1 sm:px-1.5 text-center"
                      style={{ color: "var(--third-text-color)" }}
                    >
                      {doc.views}
                    </td>
                    <td
                      className="py-2 px-1 sm:px-1.5 text-center"
                      style={{ color: "var(--third-text-color)" }}
                    >
                      {doc.downloads}
                    </td>
                    <td
                      className="py-2 px-1 sm:px-1.5 text-center"
                      style={{ color: "var(--third-text-color)" }}
                    >
                      {doc.rating}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Line Chart and Approved Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Line Chart */}
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3
              className="text-base sm:text-lg font-semibold text-left"
              style={{ color: "var(--primary-text-color)" }}
            >
              Thống kê lượt xem và tải tài liệu trên toàn hệ thống
            </h3>
            <div className="flex gap-2">
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="line">Biểu đồ đường</option>
                <option value="area">Biểu đồ miền</option>
                <option value="bar">Biểu đồ cột</option>
                <option value="table">Bảng</option>
              </select>
            </div>
          </div>
          {chartType === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-1.5 px-1 sm:px-1.5 text-gray-600 font-medium">
                      {selectedMonth ? "Ngày" : "Tháng"}
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
                  {lineChartData.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td
                        className="py-2 px-1 sm:px-1.5"
                        style={{ color: "var(--third-text-color)" }}
                      >
                        {selectedMonth
                          ? (item as any).day
                          : (item as any).month}
                      </td>
                      <td
                        className="py-2 px-1 sm:px-1.5 text-center"
                        style={{ color: "var(--third-text-color)" }}
                      >
                        {item.views}
                      </td>
                      <td
                        className="py-2 px-1 sm:px-1.5 text-center"
                        style={{ color: "var(--third-text-color)" }}
                      >
                        {item.downloads}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              {chartType === "line" ? (
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey={selectedMonth ? "day" : "month"} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    dot={{ fill: "#06b6d4", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="downloads"
                    stroke="#ec4899"
                    strokeWidth={2}
                    dot={{ fill: "#ec4899", r: 4 }}
                  />
                </LineChart>
              ) : chartType === "bar" ? (
                <BarChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey={selectedMonth ? "day" : "month"} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="views"
                    fill="#06b6d4"
                    radius={[4, 4, 0, 0]}
                    name="Lượt xem"
                  />
                  <Bar
                    dataKey="downloads"
                    fill="#ec4899"
                    radius={[4, 4, 0, 0]}
                    name="Lượt tải"
                  />
                </BarChart>
              ) : (
                <AreaChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey={selectedMonth ? "day" : "month"} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stackId="1"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="downloads"
                    stackId="1"
                    stroke="#ec4899"
                    fill="#ec4899"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          )}
        </div>

        {/* Approved Documents Statistics */}
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h3
              className="text-base sm:text-lg font-semibold text-left"
              style={{ color: "var(--primary-text-color)" }}
            >
              Thống kê tài liệu đã duyệt
            </h3>
            <div className="text-sm text-gray-600">
              Tổng: {filteredApprovedDocuments.length}
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
            <input
              type="text"
              placeholder="Người đăng"
              value={approvedFilter.author}
              onChange={(e) =>
                setApprovedFilter({ ...approvedFilter, author: e.target.value })
              }
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            />
            <input
              type="text"
              placeholder="Chủ đề"
              value={approvedFilter.subject}
              onChange={(e) =>
                setApprovedFilter({
                  ...approvedFilter,
                  subject: e.target.value,
                })
              }
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            />
            <input
              type="date"
              value={approvedFilter.dateFrom}
              onChange={(e) =>
                setApprovedFilter({
                  ...approvedFilter,
                  dateFrom: e.target.value,
                })
              }
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            />
            <input
              type="date"
              value={approvedFilter.dateTo}
              onChange={(e) =>
                setApprovedFilter({ ...approvedFilter, dateTo: e.target.value })
              }
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>

          {/* Approved Documents Table */}
          <div className="overflow-x-auto max-h-48">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-1 px-1 text-gray-600 font-medium">
                    Tên tài liệu
                  </th>
                  <th className="text-left py-1 px-1 text-gray-600 font-medium">
                    Người duyệt
                  </th>
                  <th className="text-left py-1 px-1 text-gray-600 font-medium">
                    Ngày duyệt
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredApprovedDocuments.slice(0, 5).map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td
                      className="py-1 px-1 text-xs"
                      style={{ color: "var(--third-text-color)" }}
                    >
                      {doc.title.length > 20
                        ? doc.title.substring(0, 20) + "..."
                        : doc.title}
                    </td>
                    <td
                      className="py-1 px-1"
                      style={{ color: "var(--third-text-color)" }}
                    >
                      {doc.approvedBy}
                    </td>
                    <td
                      className="py-1 px-1"
                      style={{ color: "var(--third-text-color)" }}
                    >
                      {doc.approvedDate}
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

export default DocumentStatisticsPage;
