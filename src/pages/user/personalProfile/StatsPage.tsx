/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import { Select, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { ExternalLink, RefreshCw } from "lucide-react";
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
  PieController,
  DoughnutController,
  Filler,
} from "chart.js";
import { userStatisticsService } from "../../../utils/UserStatisticsService";
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
  BarController,
  PieController,
  DoughnutController,
  Filler
);

const StatsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(2025);

  // Handle sync statistics
  const handleSyncStatistics = async () => {
    try {
      setIsSyncing(true);
      setSyncError(null);
      const year = selectedYear
        ? parseInt(selectedYear.toString())
        : new Date().getFullYear();
      await userStatisticsService.syncMyStatistics(year);

      // Reload statistics after sync
      const data = await userStatisticsService.getMyStatistics(year);
      setStatistics(data);
    } catch (err) {
      console.error("Error syncing statistics:", err);
      setSyncError("Không thể đồng bộ dữ liệu thống kê");
    } finally {
      setIsSyncing(false);
    }
  };

  // Chart type states
  const [documentTypeChartType, setDocumentTypeChartType] = useState("bar");
  const [pointsChartType, setPointsChartType] = useState("line");
  const [reportsChartType, setReportsChartType] = useState("bar");

  // Fetch statistics data
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        const year = selectedYear
          ? parseInt(selectedYear.toString())
          : new Date().getFullYear();
        const data = await userStatisticsService.getMyStatistics(year);
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

  // Use real data from API or show no data
  const stats = statistics
    ? {
        totalUploads: statistics.stats.totalUploads,
        totalContributions: statistics.stats.totalContributions,
        totalComments: statistics.stats.totalComments,
        totalDownloads: statistics.stats.totalDownloads,
      }
    : null;

  // Table data for top documents
  const topDocuments = statistics?.topDocuments
    ? statistics.topDocuments
        .map((doc) => ({
          ...doc,
          // Tính điểm tổng hợp: views (30%) + downloads (40%) + rating (30%)
          score:
            doc.views * 0.3 +
            doc.downloads * 0.4 +
            (parseFloat(doc.rating.replace("%", "")) / 100) * 0.3, // Chuyển rating từ % sang decimal
        }))
        .sort((a, b) => b.score - a.score) // Sắp xếp giảm dần theo điểm
        .slice(0, 3) // Lấy top 3
        .map((doc, index) => ({
          ...doc,
          stt: index + 1, // Cập nhật lại STT
        }))
    : [];
  // Handle row click to navigate to personal post detail
  const handleRowClick = (record: { key: string; [key: string]: unknown }) => {
    navigate(`/personal-posts/document-detail/${record.key}`);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Tên tài liệu",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Lượt xem",
      dataIndex: "views",
      key: "views",
    },
    {
      title: "Lượt tải",
      dataIndex: "downloads",
      key: "downloads",
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
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

    // Bar Chart - Biểu đồ thống kê theo loại tài liệu
    const barCtx = barChartRef.current?.getContext("2d");
    if (barCtx && statistics) {
      const documentTypesData = [
        statistics.documentTypes.RESEARCH_REPORT,
        statistics.documentTypes.VIDEO,
        statistics.documentTypes.STUDY_GUIDE,
        statistics.documentTypes.TEXTBOOK,
        statistics.documentTypes.ESSAY,
        statistics.documentTypes.SOLUTION_SET,
        statistics.documentTypes.THESIS,
        statistics.documentTypes.LECTURE,
        statistics.documentTypes.OTHER,
      ];

      const baseConfig = {
        data: {
          labels: [
            "Báo cáo nghiên cứu",
            "Video",
            "Hướng dẫn học tập",
            "Sách giáo khoa",
            "Bài luận",
            "Bộ giải",
            "Luận văn",
            "Bài giảng",
            "Khác",
          ],
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
              borderRadius: documentTypeChartType === "bar" ? 4 : 0,
              fill: documentTypeChartType === "area",
              borderWidth:
                documentTypeChartType === "pie" ||
                documentTypeChartType === "doughnut"
                  ? 2
                  : 1,
              borderColor: "#ffffff",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display:
                documentTypeChartType === "pie" ||
                documentTypeChartType === "doughnut",
              position: "bottom" as const,
              labels: {
                boxWidth: 12,
                padding: 10,
                font: {
                  size: 11,
                },
              },
            },
          },
          scales:
            documentTypeChartType !== "pie" &&
            documentTypeChartType !== "doughnut"
              ? {
                  y: {
                    beginAtZero: true,
                    max: Math.max(...documentTypesData) + 2,
                    ticks: {
                      stepSize: 1,
                    },
                  },
                }
              : undefined,
        },
      };

      // Chọn loại chart dựa trên state
      let chartType = documentTypeChartType;
      if (chartType === "area") chartType = "line"; // Area chart sử dụng line với fill

      barChartInstanceRef.current = new ChartJS(barCtx, {
        type: chartType as "bar" | "line" | "pie" | "doughnut",
        ...baseConfig,
      });
    }

    // Line Chart - Biểu đồ lịch sử tích/tiêu điểm
    const lineCtx = lineChartRef.current?.getContext("2d");
    if (lineCtx && statistics?.monthlyPoints) {
      const monthlyPointsData = statistics.monthlyPoints;

      const baseConfig = {
        data: {
          labels: monthlyPointsData.labels,
          datasets: [
            {
              label: "Điểm tích lũy",
              data: monthlyPointsData.earned,
              borderColor: "#00BFFF",
              backgroundColor:
                pointsChartType === "area"
                  ? "rgba(0, 191, 255, 0.1)"
                  : "#00BFFF",
              fill: pointsChartType === "area",
              tension:
                pointsChartType === "line" || pointsChartType === "area"
                  ? 0.4
                  : 0,
              borderRadius: pointsChartType === "bar" ? 4 : 0,
            },
            {
              label: "Điểm sử dụng",
              data: monthlyPointsData.spent,
              borderColor: "#FF69B4",
              backgroundColor:
                pointsChartType === "area"
                  ? "rgba(255, 105, 180, 0.1)"
                  : "#FF69B4",
              fill: pointsChartType === "area",
              tension:
                pointsChartType === "line" || pointsChartType === "area"
                  ? 0.4
                  : 0,
              borderRadius: pointsChartType === "bar" ? 4 : 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom" as const,
            },
          },
          scales:
            pointsChartType !== "pie" && pointsChartType !== "doughnut"
              ? {
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
                }
              : undefined,
        },
      };

      // Chọn loại chart dựa trên state
      let chartType = pointsChartType;
      if (chartType === "area") chartType = "line"; // Area chart sử dụng line với fill

      lineChartInstanceRef.current = new ChartJS(lineCtx, {
        type: chartType as "bar" | "line",
        ...baseConfig,
      });
    }

    // Monthly Bar Chart - Số lần bị báo cáo, cảnh cáo
    const monthlyBarCtx = monthlyBarChartRef.current?.getContext("2d");
    if (monthlyBarCtx && statistics?.monthlyReports) {
      const monthlyReportsData = statistics.monthlyReports;

      // Chọn loại chart dựa trên state
      let chartType = reportsChartType;
      if (chartType === "area") chartType = "line"; // Area chart sử dụng line với fill

      monthlyBarChartInstanceRef.current = new ChartJS(monthlyBarCtx, {
        type: chartType as "bar" | "line",
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
              fill: reportsChartType === "area",
              tension:
                reportsChartType === "line" || reportsChartType === "area"
                  ? 0.4
                  : 0,
              borderRadius: reportsChartType === "bar" ? 4 : 0,
            };
          }),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom" as const,
              labels: {
                boxWidth: 12,
                padding: 15,
                font: {
                  size: 11,
                },
              },
            },
          },
          scales:
            reportsChartType !== "pie" && reportsChartType !== "doughnut"
              ? {
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
                }
              : undefined,
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
  }, [
    selectedYear,
    statistics,
    documentTypeChartType,
    pointsChartType,
    reportsChartType,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-[var(--primary-text-color)]">Đang tải dữ liệu thống kê...</p>
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
          <h1 className="text-base font-bold text-[var(--primary-text-color)] text-center md:text-left">
            THỐNG KÊ HOẠT ĐỘNG CÁ NHÂN
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSyncStatistics}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw
                size={16}
                className={isSyncing ? "animate-spin" : ""}
              />
              {isSyncing ? "Đang đồng bộ..." : "Đồng bộ"}
            </button>
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
        </div>

        {/* Sync Error */}
        {syncError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{syncError}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-200 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">
              {stats ? stats.totalUploads : "Không có dữ liệu"}
            </div>
            <div className="text-sm">Tài liệu</div>
          </div>
          <div className="bg-green-200 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">
              {stats ? stats.totalContributions : "Không có dữ liệu"}
            </div>
            <div className="text-sm">Tổng điểm đóng góp</div>
          </div>
          <div className="bg-cyan-200 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">
              {stats ? stats.totalComments : "Không có dữ liệu"}
            </div>
            <div className="text-sm">Lần bình luận</div>
          </div>
          <div className="bg-yellow-200 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">
              {stats ? stats.totalDownloads : "Không có dữ liệu"}
            </div>
            <div className="text-sm">Tổng lượt tải</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Bar Chart */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[var(--primary-text-color)]">
                Biểu đồ thống kê theo loại tài liệu
              </h3>
              <div className="flex items-center gap-2">
                <Select
                  value={documentTypeChartType}
                  onChange={setDocumentTypeChartType}
                  className="w-24"
                  size="small"
                >
                  <Select.Option value="bar">Cột</Select.Option>
                  <Select.Option value="line">Đường</Select.Option>
                  <Select.Option value="area">Diện tích</Select.Option>
                  <Select.Option value="pie">Tròn</Select.Option>
                  <Select.Option value="doughnut">Donut</Select.Option>
                </Select>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center">
              {statistics ? (
                <canvas ref={barChartRef}></canvas>
              ) : (
                <div className="text-gray-500 text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <p>Không có dữ liệu</p>
                </div>
              )}
            </div>
          </div>

          {/* Line Chart */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[var(--primary-text-color)]">
                Biểu đồ lịch sử tích/tiêu điểm
              </h3>
              <div className="flex items-center gap-2">
                <Select
                  value={pointsChartType}
                  onChange={setPointsChartType}
                  className="w-24"
                  size="small"
                >
                  <Select.Option value="line">Đường</Select.Option>
                  <Select.Option value="bar">Cột</Select.Option>
                  <Select.Option value="area">Diện tích</Select.Option>
                </Select>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center">
              {statistics?.monthlyPoints ? (
                <canvas ref={lineChartRef}></canvas>
              ) : (
                <div className="text-gray-500 text-center">
                  <div className="text-2xl mb-2">📈</div>
                  <p>Không có dữ liệu</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Documents Table */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-bold mb-4 text-left text-[var(--primary-text-color)] flex items-center gap-2">
              Top 3 tài liệu
              <ExternalLink size={14} className="text-gray-400" />
              <span className="text-sm font-normal text-gray-500">
                (Click để xem chi tiết)
              </span>
            </h3>
            {topDocuments && topDocuments.length > 0 ? (
              <Table
                columns={columns}
                dataSource={topDocuments}
                pagination={false}
                size="small"
                className="text-xs"
                scroll={{ x: "max-content" }}
                onRow={(record) => ({
                  onClick: () => handleRowClick(record),
                  style: { cursor: "pointer" },
                  className:
                    "hover:bg-blue-50 hover:shadow-sm transition-all duration-200 border-b border-gray-100",
                })}
              />
            ) : (
              <div className="text-gray-500 text-center py-8">
                <div className="text-2xl mb-2">📄</div>
                <p>Không có dữ liệu</p>
              </div>
            )}
          </div>

          {/* Monthly Reports Chart */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-[var(--primary-text-color)]">
                Số lần bị báo cáo, cảnh cáo
              </h3>
              <div className="flex items-center gap-2">
                <Select
                  value={reportsChartType}
                  onChange={setReportsChartType}
                  className="w-24"
                  size="small"
                >
                  <Select.Option value="bar">Cột</Select.Option>
                  <Select.Option value="line">Đường</Select.Option>
                  <Select.Option value="area">Diện tích</Select.Option>
                </Select>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center">
              {statistics?.monthlyReports ? (
                <canvas ref={monthlyBarChartRef}></canvas>
              ) : (
                <div className="text-gray-500 text-center">
                  <div className="text-2xl mb-2">📋</div>
                  <p>Không có dữ liệu</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
