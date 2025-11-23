/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect, useCallback } from "react";
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
  DoughnutController,
  PolarAreaController,
  RadialLinearScale,
  Filler,
} from "chart.js";
import { documentTypeLabels } from "../../../models/document";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { documentStatisticsService } from "../../../utils/DocumentStatisticsService";
import type { DocumentStatistics } from "../../../models/documentStatistics";
import { AdminBreadcrumb } from "../../../components/admin/common/AdminBreadcrumb";

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
  DoughnutController,
  PolarAreaController,
  RadialLinearScale,
  Filler
);

const DocumentStatisticsPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [chartType, setChartType] = useState("line");
  const [documentChartType, setDocumentChartType] = useState("bar");
  const [approvedFilter, setApprovedFilter] = useState({
    author: "",
    subject: "",
    dateFrom: "",
    dateTo: "",
  });
  const [statisticsData, setStatisticsData] =
    useState<DocumentStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncAllLoading, setSyncAllLoading] = useState(false);
  const [syncMonthLoading, setSyncMonthLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const navigate = useNavigate();

  // Function to translate document types to Vietnamese
  const translateDocumentType = (type: string): string => {
    // Use documentTypeLabels for document types, fallback to file type translation
    if (documentTypeLabels[type as keyof typeof documentTypeLabels]) {
      return documentTypeLabels[type as keyof typeof documentTypeLabels];
    }

    // Fallback to file type translation for backward compatibility
    const typeMap: { [key: string]: string } = {
      // Documents
      pdf: "PDF",
      doc: "Word",
      docx: "Word",
      odt: "OpenDocument",

      // Presentations
      ppt: "PowerPoint",
      pptx: "PowerPoint",
      odp: "OpenDocument",

      // Spreadsheets
      xls: "Excel",
      xlsx: "Excel",
      csv: "CSV",
      ods: "OpenDocument",

      // Text files
      txt: "Văn bản",
      rtf: "Rich Text",

      // Images
      jpg: "Hình ảnh",
      jpeg: "Hình ảnh",
      png: "Hình ảnh",
      gif: "Hình ảnh",
      bmp: "Hình ảnh",
      svg: "Vector",
      webp: "Hình ảnh",
      tiff: "Hình ảnh",
      tif: "Hình ảnh",

      // Videos
      mp4: "Video",
      avi: "Video",
      mov: "Video",
      wmv: "Video",
      flv: "Video",
      mkv: "Video",
      webm: "Video",
      m4v: "Video",
      "3gp": "Video",

      // Audio
      mp3: "Âm thanh",
      wav: "Âm thanh",
      flac: "Âm thanh",
      aac: "Âm thanh",
      ogg: "Âm thanh",

      // Archives
      zip: "Nén",
      rar: "Nén",
      "7z": "Nén",
      tar: "Nén",
      gz: "Nén",

      // Other
      other: "Khác",
    };
    return typeMap[type.toLowerCase()] || type.toUpperCase();
  };

  // Handle navigation to document review page
  const handleDocumentClick = (documentId: string | undefined) => {
    if (!documentId) {
      console.warn("Document ID is undefined");
      return;
    }
    try {
      // Navigate to document review page
      navigate(`/admin/documents/review/${documentId}`);
    } catch (error) {
      console.error("Error navigating to document:", error);
      message.error("Không thể chuyển đến trang tài liệu!");
    }
  };

  // Handle sync all statistics
  const handleSyncAllStatistics = async () => {
    try {
      setSyncAllLoading(true);
      setPageLoading(true);
      await documentStatisticsService.syncAllStatistics();
      message.success("Đã đồng bộ toàn bộ thống kê thành công!");
      // Refresh data
      const params: any = { year: parseInt(selectedYear) };
      if (selectedMonth) {
        params.month = parseInt(selectedMonth.replace("T", ""));
      }
      const data = await documentStatisticsService.getDocumentStatistics(
        params
      );
      setStatisticsData(data);
    } catch (error) {
      console.error("Error syncing all statistics:", error);
      message.error("Đồng bộ toàn bộ thống kê thất bại!");
    } finally {
      setSyncAllLoading(false);
      setPageLoading(false);
    }
  };

  // Handle sync month statistics
  const handleSyncMonthStatistics = async () => {
    try {
      setSyncMonthLoading(true);
      setPageLoading(true);
      const params: any = { year: parseInt(selectedYear) };
      if (selectedMonth) {
        params.month = parseInt(selectedMonth.replace("T", ""));
      }
      await documentStatisticsService.syncMonthStatistics(params);
      message.success("Đã đồng bộ thống kê theo thời gian thành công!");
      // Refresh data
      const data = await documentStatisticsService.getDocumentStatistics(
        params
      );
      setStatisticsData(data);
    } catch (error) {
      console.error("Error syncing month statistics:", error);
      message.error("Đồng bộ thống kê theo thời gian thất bại!");
    } finally {
      setSyncMonthLoading(false);
      setPageLoading(false);
    }
  };

  // Chart refs
  const barChartRef = useRef<HTMLCanvasElement>(null);
  const lineChartRef = useRef<HTMLCanvasElement>(null);
  const monthlyBarChartRef = useRef<HTMLCanvasElement>(null);
  const pieChartRef = useRef<HTMLCanvasElement>(null);

  // Chart instances
  const barChartInstanceRef = useRef<ChartJS | null>(null);
  const lineChartInstanceRef = useRef<ChartJS | null>(null);
  const monthlyBarChartInstanceRef = useRef<ChartJS | null>(null);
  const pieChartInstanceRef = useRef<ChartJS | null>(null);

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

  // Fetch statistics data
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const params: any = { year: parseInt(selectedYear) };
        if (selectedMonth) {
          params.month = parseInt(selectedMonth.replace("T", ""));
        }
        const data = await documentStatisticsService.getDocumentStatistics(
          params
        );
        setStatisticsData(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [selectedYear, selectedMonth]);
  const getFilteredData = useCallback(() => {
    if (!statisticsData?.monthlyData) return [];
    return statisticsData.monthlyData;
  }, [statisticsData]);

  const lineChartData = getFilteredData();

  // Lọc tài liệu đã duyệt
  const filteredApprovedDocuments = (
    statisticsData?.approvedDocuments || []
  ).filter((doc: any) => {
    const matchesAuthor =
      !approvedFilter.author ||
      doc.author?.toLowerCase().includes(approvedFilter.author.toLowerCase());
    const matchesSubject =
      !approvedFilter.subject ||
      doc.subject?.toLowerCase().includes(approvedFilter.subject.toLowerCase());
    const matchesDateFrom =
      !approvedFilter.dateFrom || doc.uploadDate >= approvedFilter.dateFrom;
    const matchesDateTo =
      !approvedFilter.dateTo || doc.uploadDate <= approvedFilter.dateTo;
    return matchesAuthor && matchesSubject && matchesDateFrom && matchesDateTo;
  });

  // Initialize charts
  useEffect(() => {
    // Destroy existing charts
    if (barChartInstanceRef.current) {
      barChartInstanceRef.current.destroy();
      barChartInstanceRef.current = null;
    }
    if (pieChartInstanceRef.current) {
      pieChartInstanceRef.current.destroy();
      pieChartInstanceRef.current = null;
    }
    if (lineChartInstanceRef.current) {
      lineChartInstanceRef.current.destroy();
      lineChartInstanceRef.current = null;
    }
    if (monthlyBarChartInstanceRef.current) {
      monthlyBarChartInstanceRef.current.destroy();
      monthlyBarChartInstanceRef.current = null;
    }

    // Chart for document types - supports multiple chart types (bar, horizontal, area, line, pie, doughnut, polarArea)
    const documentTypes = statisticsData?.documentTypes || {};
    const labels = Object.keys(documentTypes).map((type) =>
      translateDocumentType(type)
    );
    const data = Object.values(documentTypes) as number[];
    const maxValue = Math.max(...data, 10);

    // choose canvas based on chart type: bar/horizontal/area/line -> barChartRef, pie/doughnut/polarArea -> pieChartRef
    const barCtx = barChartRef.current?.getContext("2d");
    const pieCtx = pieChartRef.current?.getContext("2d");

    const commonColors = [
      "#00BFFF",
      "#8A2BE2",
      "#FF6347",
      "#32CD32",
      "#FFD700",
      "#FF69B4",
      "#20B2AA",
      "#87CEEB",
      "#DDA0DD",
    ];

    switch (documentChartType) {
      case "bar":
        if (barCtx) {
          barChartInstanceRef.current = new ChartJS(barCtx, {
            type: "bar",
            data: {
              labels,
              datasets: [
                {
                  data,
                  backgroundColor: commonColors,
                  borderRadius: 4,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      return `Số lượng: ${context.parsed.y}`;
                    },
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: maxValue + 2,
                  ticks: { stepSize: Math.ceil(maxValue / 5) },
                },
              },
            },
          });
        }
        break;
      case "horizontal":
        if (barCtx) {
          barChartInstanceRef.current = new ChartJS(barCtx, {
            type: "bar",
            data: {
              labels,
              datasets: [
                {
                  data,
                  backgroundColor: commonColors,
                  borderRadius: 4,
                },
              ],
            },
            options: {
              indexAxis: "y",
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      return `Số lượng: ${context.parsed.x}`;
                    },
                  },
                },
              },
              scales: {
                x: { beginAtZero: true, max: maxValue + 2 },
              },
            },
          });
        }
        break;
      case "area":
        if (barCtx) {
          // area as a filled line chart
          barChartInstanceRef.current = new ChartJS(barCtx, {
            type: "line",
            data: {
              labels,
              datasets: [
                {
                  label: "Số lượng",
                  data,
                  borderColor: "#06b6d4",
                  backgroundColor: "rgba(6,182,212,0.2)",
                  fill: true,
                  tension: 0.4,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: "bottom" } },
              scales: { y: { beginAtZero: true, max: maxValue + 2 } },
            },
          });
        }
        break;
      case "line":
        if (barCtx) {
          barChartInstanceRef.current = new ChartJS(barCtx, {
            type: "line",
            data: {
              labels,
              datasets: [
                {
                  label: "Số lượng",
                  data,
                  borderColor: "#06b6d4",
                  backgroundColor: "rgba(6,182,212,0.1)",
                  tension: 0.4,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: "bottom" } },
              scales: { y: { beginAtZero: true, max: maxValue + 2 } },
            },
          });
        }
        break;
      case "doughnut":
        if (pieCtx) {
          pieChartInstanceRef.current = new ChartJS(pieCtx, {
            type: "doughnut",
            data: {
              labels,
              datasets: [
                {
                  data,
                  backgroundColor: commonColors,
                  borderWidth: 2,
                  borderColor: "#ffffff",
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "bottom", labels: { padding: 12 } },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const total = (context.dataset.data as number[]).reduce(
                        (a, b) => a + b,
                        0
                      );
                      const percentage = (
                        (context.parsed / total) *
                        100
                      ).toFixed(1);
                      return `${context.label}: ${context.parsed} (${percentage}%)`;
                    },
                  },
                },
              },
            },
          });
        }
        break;
      case "polarArea":
        if (pieCtx) {
          pieChartInstanceRef.current = new ChartJS(pieCtx, {
            type: "polarArea",
            data: {
              labels,
              datasets: [
                {
                  data,
                  backgroundColor: commonColors,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "bottom" },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      return `${context.label}: ${context.parsed}`;
                    },
                  },
                },
              },
              scales: {
                r: {
                  beginAtZero: true,
                },
              },
            },
          });
        }
        break;
      case "pie":
      default:
        if (pieCtx) {
          pieChartInstanceRef.current = new ChartJS(pieCtx, {
            type: "pie",
            data: {
              labels,
              datasets: [
                {
                  data,
                  backgroundColor: commonColors,
                  borderWidth: 2,
                  borderColor: "#ffffff",
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom",
                  labels: { padding: 20, usePointStyle: true },
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const total = (context.dataset.data as number[]).reduce(
                        (a, b) => a + b,
                        0
                      );
                      const percentage = (
                        (context.parsed / total) *
                        100
                      ).toFixed(1);
                      return `${context.label}: ${context.parsed} (${percentage}%)`;
                    },
                  },
                },
              },
            },
          });
        }
        break;
    }

    // Line Chart - Thống kê lượt xem và tải tài liệu
    const lineCtx = lineChartRef.current?.getContext("2d");
    if (lineCtx) {
      const lineChartData = getFilteredData();
      const labels = lineChartData.map((item) =>
        selectedMonth ? (item as any).day : (item as any).month
      );
      const viewsData = lineChartData.map((item) => item.views);
      const downloadsData = lineChartData.map((item) => item.downloads);

      lineChartInstanceRef.current = new ChartJS(lineCtx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Lượt xem",
              data: viewsData,
              borderColor: "#06b6d4",
              backgroundColor: "rgba(6, 182, 212, 0.1)",
              tension: 0.4,
            },
            {
              label: "Lượt tải",
              data: downloadsData,
              borderColor: "#ec4899",
              backgroundColor: "rgba(236, 72, 153, 0.1)",
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
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.dataset.label}: ${context.parsed.y}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }

    // Monthly Bar Chart - Thống kê lượt xem và tải tài liệu dạng cột
    const monthlyBarCtx = monthlyBarChartRef.current?.getContext("2d");
    if (monthlyBarCtx) {
      const lineChartData = getFilteredData();
      const labels = lineChartData.map((item) =>
        selectedMonth ? (item as any).day : (item as any).month
      );
      const viewsData = lineChartData.map((item) => item.views);
      const downloadsData = lineChartData.map((item) => item.downloads);

      monthlyBarChartInstanceRef.current = new ChartJS(monthlyBarCtx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Lượt xem",
              data: viewsData,
              backgroundColor: "#06b6d4",
              borderRadius: 4,
            },
            {
              label: "Lượt tải",
              data: downloadsData,
              backgroundColor: "#ec4899",
              borderRadius: 4,
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
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.dataset.label}: ${context.parsed.y}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
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
      if (pieChartInstanceRef.current) {
        pieChartInstanceRef.current.destroy();
        pieChartInstanceRef.current = null;
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
    selectedMonth,
    chartType,
    documentChartType,
    getFilteredData,
    statisticsData,
  ]);
  return (
    <div className="space-y-6 relative">
      {/* Page Loading Overlay */}
      {pageLoading && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center h-screen justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-color)]"></div>
            <div className="text-base text-[var(--third-text-color)]">
              Đang đồng bộ dữ liệu...
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-[var(--third-text-color)]">
            Đang tải dữ liệu...
          </div>
        </div>
      ) : (
        <>
          {/* Breadcrumb */}
          <AdminBreadcrumb
            items={[
              { label: "Admin", path: "/admin" },
              { label: "Giám sát", path: "/admin/statistics/documents" },
              { label: "Thống kê tài liệu" },
            ]}
          />

          <div className="mt-4">
            {/* Sync Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                disabled={syncAllLoading}
                onClick={handleSyncAllStatistics}
                className="px-4 py-2 bg-[var(--primary-color)] text-white rounded hover:bg-[var(--secondary-color)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {syncAllLoading ? "Đang tải..." : "Tải lại"}
              </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <div className="bg-gray-200 rounded-lg p-3 sm:p-4 text-center">
                <div
                  className="text-2xl sm:text-3xl font-bold"
                  style={{ color: "var(--primary-text-color)" }}
                >
                  {statisticsData?.stats?.totalDocuments || 0}
                </div>
                <div className="text-sm text-[var(--third-text-color)] mt-2">
                  Tài liệu
                </div>
              </div>
              <div className="bg-cyan-400 rounded-lg p-3 sm:p-4 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">
                  {statisticsData?.stats?.totalViews || 0}
                </div>
                <div className="text-sm text-white mt-2">Tổng lượt xem</div>
              </div>
              <div className="bg-yellow-300 rounded-lg p-3 sm:p-4 text-center">
                <div
                  className="text-2xl sm:text-3xl font-bold"
                  style={{ color: "var(--primary-text-color)" }}
                >
                  {statisticsData?.stats?.totalDownloads || 0}
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
                    className="flex-1 text-sm border border-gray-300 rounded cursor-pointer px-2 py-1"
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
                    className="flex-1 text-sm border border-gray-300 cursor-pointer rounded px-2 py-1"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  disabled={syncMonthLoading}
                  onClick={handleSyncMonthStatistics}
                  className="w-full mt-2 px-3 py-2 border border-[var(--primary-color)] text-[var(--primary-color)] rounded hover:border-[var(--secondary-color)] hover:text-[var(--secondary-color)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {syncMonthLoading ? "Đang tải..." : "Tải lại"}
                </button>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              {/* Bar Chart */}
              <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h3
                    className="text-base sm:text-lg font-semibold text-left"
                    style={{ color: "var(--primary-text-color)" }}
                  >
                    Biểu đồ thống kê theo loại tài liệu
                  </h3>
                  <select
                    value={documentChartType}
                    onChange={(e) => setDocumentChartType(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="bar">Biểu đồ cột</option>
                    <option value="horizontal">Biểu đồ cột ngang</option>
                    <option value="area">Biểu đồ miền (Area)</option>
                    <option value="line">Biểu đồ đường</option>
                    <option value="pie">Biểu đồ tròn</option>
                    <option value="doughnut">Biểu đồ vòng</option>
                    <option value="polarArea">Biểu đồ miền</option>
                  </select>
                </div>
                <div className="h-64">
                  {["bar", "horizontal", "area", "line"].includes(
                    documentChartType
                  ) ? (
                    <canvas ref={barChartRef}></canvas>
                  ) : (
                    <canvas ref={pieChartRef}></canvas>
                  )}
                </div>
              </div>

              {/* Top Documents Table */}
              <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                <h3
                  className="text-base sm:text-lg font-semibold mb-3 text-left"
                  style={{ color: "var(--primary-text-color)" }}
                >
                  Top 5 tài liệu phổ biến nhất
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-1.5 px-1 sm:px-1.5 text-[var(--third-text-color)] font-medium">
                          STT
                        </th>
                        <th className="text-left py-1.5 px-1 sm:px-1.5 text-[var(--third-text-color)] font-medium">
                          Tên tài liệu
                        </th>
                        <th className="text-center py-1.5 px-1 sm:px-1.5 text-[var(--third-text-color)] font-medium">
                          Lượt xem
                        </th>
                        <th className="text-center py-1.5 px-1 sm:px-1.5 text-[var(--third-text-color)] font-medium">
                          Lượt tải
                        </th>
                        <th className="text-center py-1.5 px-1 sm:px-1.5 text-[var(--third-text-color)] font-medium">
                          Đánh giá
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {(statisticsData?.topDocuments || []).map(
                        (doc: any, index: number) => (
                          <tr
                            key={doc.document || doc._id || index}
                            className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                            onClick={() =>
                              handleDocumentClick(
                                doc.document || doc._id || doc.id
                              )
                            }
                          >
                            <td
                              className="py-2 px-1 sm:px-1.5"
                              style={{ color: "var(--third-text-color)" }}
                            >
                              {index + 1}
                            </td>
                            <td className="py-2 px-1 sm:px-1.5 text-xs text-left text-[var(--primary-text-color)]">
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
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Line Chart and Approved Documents */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
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
                          <th className="text-left py-1.5 px-1 sm:px-1.5 text-[var(--third-text-color)] font-medium">
                            {selectedMonth ? "Ngày" : "Tháng"}
                          </th>
                          <th className="text-center py-1.5 px-1 sm:px-1.5 text-[var(--third-text-color)] font-medium">
                            Lượt xem
                          </th>
                          <th className="text-center py-1.5 px-1 sm:px-1.5 text-[var(--third-text-color)] font-medium">
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
                ) : chartType === "bar" ? (
                  <div className="h-64 flex items-center justify-center">
                    {lineChartData.length > 0 ? (
                      <canvas ref={monthlyBarChartRef}></canvas>
                    ) : (
                      <div className="text-gray-500 text-lg">
                        Không có dữ liệu
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    {lineChartData.length > 0 ? (
                      <canvas ref={lineChartRef}></canvas>
                    ) : (
                      <div className="text-gray-500 text-lg">
                        Không có dữ liệu
                      </div>
                    )}
                  </div>
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
                  <div className="text-sm text-[var(--third-text-color)]">
                    Tổng số: {filteredApprovedDocuments.length}
                  </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Người đăng"
                    value={approvedFilter.author}
                    onChange={(e) =>
                      setApprovedFilter({
                        ...approvedFilter,
                        author: e.target.value,
                      })
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
                      setApprovedFilter({
                        ...approvedFilter,
                        dateTo: e.target.value,
                      })
                    }
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>

                {/* Approved Documents Table */}
                <div className="overflow-x-auto max-h-48">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-1 px-1 text-[var(--third-text-color)] font-medium">
                          STT
                        </th>
                        <th className="text-left py-1 px-1 text-[var(--third-text-color)] font-medium">
                          Tên tài liệu
                        </th>
                        <th className="text-left py-1 px-1 text-[var(--third-text-color)] font-medium">
                          Người duyệt
                        </th>
                        <th className="text-left py-1 px-1 text-[var(--third-text-color)] font-medium">
                          Ngày duyệt
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApprovedDocuments.map((doc, index) => (
                        <tr
                          key={doc.document || doc._id || index}
                          className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                          onClick={() =>
                            handleDocumentClick(
                              doc.document || doc._id || doc.id
                            )
                          }
                        >
                          <td>
                            <div
                              className="py-1 px-1 text-center"
                              style={{ color: "var(--third-text-color)" }}
                            >
                              {index + 1}
                            </div>
                          </td>
                          <td
                            className="py-1 px-1 text-xs text-left"
                            style={{ color: "var(--third-text-color)" }}
                          >
                            {doc.title.length > 30
                              ? doc.title.substring(0, 30) + "..."
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
        </>
      )}
    </div>
  );
};

export default DocumentStatisticsPage;
