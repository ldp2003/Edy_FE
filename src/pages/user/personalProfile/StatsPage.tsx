import React, { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { Select, Table } from "antd";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineController,
  BarController,
} from "chart.js";
import { UserStatisticsAPI } from "../../../api/API";
import type { UserStatistics } from "../../../models/document";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineController,
  BarController
);

const StatsPage: React.FC = () => {
  const { user } = useContext(UserContext);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch statistics data
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        const year = parseInt(selectedYear);
        const data = await UserStatisticsAPI.getMyStatistics(year);
        setStatistics(data);
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError("Không thể tải dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [selectedYear]);

  // Chart refs
  const barChartRef = useRef<HTMLCanvasElement>(null);
  const lineChartRef = useRef<HTMLCanvasElement>(null);
  const monthlyBarChartRef = useRef<HTMLCanvasElement>(null);

  // Chart instances
  const barChartInstanceRef = useRef<ChartJS | null>(null);
  const lineChartInstanceRef = useRef<ChartJS | null>(null);
  const monthlyBarChartInstanceRef = useRef<ChartJS | null>(null);

  // Use real data from API or fallback to mock data
  const stats = statistics
    ? {
        totalUploads: statistics.stats.totalUploads,
        totalContributions: statistics.stats.totalContributions,
        totalComments: statistics.stats.totalComments,
        totalDownloads: statistics.stats.totalDownloads,
      }
    : {
        totalUploads: user?.shared_documents?.length || 6,
        totalContributions: 15,
        totalComments: 120,
        totalDownloads: 45,
      };

  // Table data for top documents
  const topDocuments = statistics?.topDocuments
    ? statistics.topDocuments
        .map((doc) => ({
          ...doc,
          // Tính điểm tổng hợp: views (30%) + downloads (40%) + rating (30%)
          score:
            doc.views * 0.3 +
            doc.downloads * 0.4 +
            parseFloat(doc.rating) * 0.3,
        }))
        .sort((a, b) => b.score - a.score) // Sắp xếp giảm dần theo điểm
        .slice(0, 3) // Lấy top 3
        .map((doc, index) => ({
          ...doc,
          stt: index + 1, // Cập nhật lại STT
        }))
    : [
        {
          key: "1",
          stt: 1,
          title: "Tài liệu tiếng Anh kĩ năng nói chính trị Mac LêNin",
          views: 154,
          downloads: 28,
          rating: "84%",
        },
        {
          key: "2",
          stt: 2,
          title: "Tài liệu tiếng Anh Kinh tế chính trị Mác LêNin",
          views: 148,
          downloads: 21,
          rating: "84%",
        },
        {
          key: "3",
          stt: 3,
          title: "Tài liệu tiếng Anh Kinh tế chính trị Mác LêNin",
          views: 128,
          downloads: 10,
          rating: "84%",
        },
      ];

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      width: 50,
    },
    {
      title: "Tên tài liệu",
      dataIndex: "title",
      key: "title",
      width: 300,
    },
    {
      title: "Lượt xem",
      dataIndex: "views",
      key: "views",
      width: 100,
    },
    {
      title: "Lượt tải",
      dataIndex: "downloads",
      key: "downloads",
      width: 100,
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      width: 100,
    },
  ];

  // Initialize charts
  useEffect(() => {
    // Destroy existing charts
    if (barChartInstanceRef.current) {
      barChartInstanceRef.current.destroy();
      barChartInstanceRef.current = null;
    }
    if (lineChartInstanceRef.current) {
      lineChartInstanceRef.current.destroy();
      lineChartInstanceRef.current = null;
    }
    if (monthlyBarChartInstanceRef.current) {
      monthlyBarChartInstanceRef.current.destroy();
      monthlyBarChartInstanceRef.current = null;
    }

    // Bar Chart - Biểu đồ thống kê theo loại
    const barCtx = barChartRef.current?.getContext("2d");
    if (barCtx) {
      const documentTypesData = statistics
        ? [
            statistics.documentTypes.RESEARCH_REPORT,
            statistics.documentTypes.VIDEO,
            statistics.documentTypes.STUDY_GUIDE,
            statistics.documentTypes.TEXTBOOK,
            statistics.documentTypes.ESSAY,
            statistics.documentTypes.SOLUTION_SET,
            statistics.documentTypes.THESIS,
            statistics.documentTypes.LECTURE,
            statistics.documentTypes.OTHER,
          ]
        : [5, 4, 2];

      barChartInstanceRef.current = new ChartJS(barCtx, {
        type: "bar",
        data: {
          labels: statistics
            ? [
                "Báo cáo nghiên cứu",
                "Video",
                "Hướng dẫn học tập",
                "Sách giáo khoa",
                "Bài luận",
                "Bộ giải",
                "Luận văn",
                "Bài giảng",
                "Khác",
              ]
            : ["Tài liệu", "Nghiên cứu khoa học", "Khác"],
          datasets: [
            {
              data: documentTypesData,
              backgroundColor: [
                "#00BFFF",
                "#8A2BE2",
                "#FF6347",
                "#32CD32",
                "#FFD700",
                "#FF69B4",
                "#DC143C",
                "#4169E1",
                "#FFA500",
              ],
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max: Math.max(...documentTypesData) + 2,
              ticks: {
                stepSize: 1,
              },
            },
          },
        },
      });
    }

    // Line Chart - Biểu đồ lịch sử tích/tiêu điểm
    const lineCtx = lineChartRef.current?.getContext("2d");
    if (lineCtx) {
      const monthlyPointsData = statistics?.monthlyPoints || {
        labels: [
          "T1",
          "T2",
          "T3",
          "T4",
          "T5",
          "T6",
          "T7",
          "T8",
          "T9",
          "T10",
          "T11",
          "T12",
        ],
        earned: [20, 25, 30, 28, 35, 40, 38, 45, 42, 48, 45, 50],
        spent: [15, 18, 22, 20, 25, 30, 28, 32, 30, 35, 32, 38],
      };

      lineChartInstanceRef.current = new ChartJS(lineCtx, {
        type: "line",
        data: {
          labels: monthlyPointsData.labels,
          datasets: [
            {
              label: "Điểm tích lũy",
              data: monthlyPointsData.earned,
              borderColor: "#00BFFF",
              backgroundColor: "rgba(0, 191, 255, 0.1)",
              tension: 0.4,
            },
            {
              label: "Điểm sử dụng",
              data: monthlyPointsData.spent,
              borderColor: "#FF69B4",
              backgroundColor: "rgba(255, 105, 180, 0.1)",
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max:
                Math.max(
                  ...monthlyPointsData.earned,
                  ...monthlyPointsData.spent
                ) + 10,
              ticks: {
                stepSize: 10,
              },
            },
          },
        },
      });
    }

    // Monthly Bar Chart - Số lần bị báo cáo, cảnh cáo
    const monthlyBarCtx = monthlyBarChartRef.current?.getContext("2d");
    if (monthlyBarCtx) {
      const monthlyReportsData = statistics?.monthlyReports || {
        labels: [
          "T1",
          "T2",
          "T3",
          "T4",
          "T5",
          "T6",
          "T7",
          "T8",
          "T9",
          "T10",
          "T11",
          "T12",
        ],
        datasets: [
          {
            label: "Báo cáo nội dung",
            data: [0, 1, 0, 0, 2, 0, 0, 1, 0, 0, 0, 5],
          },
          {
            label: "Tê chia sẻ tài liệu",
            data: [0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 0, 3],
          },
          {
            label: "Ý kiến gây tranh",
            data: [1, 0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 2],
          },
          {
            label: "Khiếu nại khác",
            data: [0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 1, 1],
          },
        ],
      };

      monthlyBarChartInstanceRef.current = new ChartJS(monthlyBarCtx, {
        type: "bar",
        data: {
          labels: monthlyReportsData.labels,
          datasets: monthlyReportsData.datasets.map((dataset, index) => {
            // Việt hóa labels và thêm màu sắc
            const vietnameseLabels = {
              SPAM_OR_MISLEADING: "Spam hoặc gây hiểu lầm",
              DUPLICATE: "Trùng lặp",
              COPYRIGHT: "Vi phạm bản quyền",
              INCORRECT_CATEGORY: "Sai danh mục",
              PERSONAL_INFORMATION: "Thông tin cá nhân",
              LOW_QUALITY: "Chất lượng thấp",
              INAPPROPRIATE: "Không phù hợp",
              OTHER: "Khác",
            };

            const colors = [
              "#FF6B6B", // Spam - đỏ cam
              "#4ECDC4", // Duplicate - xanh ngọc
              "#45B7D1", // Copyright - xanh dương
              "#FFA07A", // Incorrect category - cam nhạt
              "#98D8C8", // Personal info - xanh lá nhạt
              "#F7DC6F", // Low quality - vàng
              "#BB8FCE", // Inappropriate - tím nhạt
              "#85C1E9", // Other - xanh dương nhạt
            ];

            return {
              ...dataset,
              label:
                vietnameseLabels[
                  dataset.label as keyof typeof vietnameseLabels
                ] || dataset.label,
              backgroundColor: colors[index % colors.length],
              borderColor: colors[index % colors.length],
              borderWidth: 1,
            };
          }),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                boxWidth: 12,
                padding: 15,
                font: {
                  size: 11,
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              max:
                Math.max(
                  ...monthlyReportsData.datasets.flatMap((d) => d.data)
                ) + 1,
              ticks: {
                stepSize: 1,
              },
            },
            x: {
              ticks: {
                font: {
                  size: 10,
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (barChartInstanceRef.current) {
        barChartInstanceRef.current.destroy();
        barChartInstanceRef.current = null;
      }
      if (lineChartInstanceRef.current) {
        lineChartInstanceRef.current.destroy();
        lineChartInstanceRef.current = null;
      }
      if (monthlyBarChartInstanceRef.current) {
        monthlyBarChartInstanceRef.current.destroy();
        monthlyBarChartInstanceRef.current = null;
      }
    };
  }, [selectedYear, statistics]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu thống kê...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-900 text-center md:text-left">
            THỐNG KÊ HOẠT ĐỘNG CÁ NHÂN
          </h1>
          <Select
            value={selectedYear}
            onChange={setSelectedYear}
            className="w-24"
          >
            <Select.Option value="2025">2025</Select.Option>
            <Select.Option value="2024">2024</Select.Option>
            <Select.Option value="2023">2023</Select.Option>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-200 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{stats.totalUploads}</div>
            <div className="text-sm">Tài liệu</div>
          </div>
          <div className="bg-green-200 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{stats.totalContributions}</div>
            <div className="text-sm">Tổng điểm đóng góp</div>
          </div>
          <div className="bg-cyan-200 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{stats.totalComments}</div>
            <div className="text-sm">Lần bình luận</div>
          </div>
          <div className="bg-yellow-200 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{stats.totalDownloads}</div>
            <div className="text-sm">Tổng lượt tải</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Bar Chart */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Biểu đồ Thống kê theo loại</h3>
              <span className="text-sm text-gray-500">Tất cả ▼</span>
            </div>
            <div className="h-64">
              <canvas ref={barChartRef}></canvas>
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Biểu đồ lịch sử tích/tiêu điểm</h3>
              <span className="text-sm text-gray-500">Tất cả ▼</span>
            </div>
            <div className="h-64">
              <canvas ref={lineChartRef}></canvas>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Documents Table */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-4">TOP 3 TÀI LIỆU TIÊU BIỂU</h3>
            <Table
              columns={columns}
              dataSource={topDocuments}
              pagination={false}
              size="small"
              className="text-xs"
            />
          </div>

          {/* Monthly Reports Chart */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Số lần bị báo cáo, cảnh cáo</h3>
              <span className="text-sm text-gray-500">Tất cả ▼</span>
            </div>
            <div className="h-64">
              <canvas ref={monthlyBarChartRef}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
