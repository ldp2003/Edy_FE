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

  // Chart refs
  const barChartRef = useRef<HTMLCanvasElement>(null);
  const lineChartRef = useRef<HTMLCanvasElement>(null);
  const monthlyBarChartRef = useRef<HTMLCanvasElement>(null);

  // Chart instances
  const barChartInstanceRef = useRef<ChartJS | null>(null);
  const lineChartInstanceRef = useRef<ChartJS | null>(null);
  const monthlyBarChartInstanceRef = useRef<ChartJS | null>(null);

  // Mock data
  const stats = {
    totalUploads: user?.shared_documents?.length || 6,
    totalContributions: 15,
    totalComments: 120,
    totalDownloads: 45,
  };

  // Table data for top documents
  const topDocuments = [
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
      barChartInstanceRef.current = new ChartJS(barCtx, {
        type: "bar",
        data: {
          labels: ["Tài liệu", "Nghiên cứu khoa học", "Khác"],
          datasets: [
            {
              data: [5, 4, 2],
              backgroundColor: ["#00BFFF", "#8A2BE2", "#FF6347"],
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
              max: 10,
              ticks: {
                stepSize: 2,
              },
            },
          },
        },
      });
    }

    // Line Chart - Biểu đồ lịch sử tích/tiêu điểm
    const lineCtx = lineChartRef.current?.getContext("2d");
    if (lineCtx) {
      lineChartInstanceRef.current = new ChartJS(lineCtx, {
        type: "line",
        data: {
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
              label: "Điểm tích lũy",
              data: [20, 25, 30, 28, 35, 40, 38, 45, 42, 48, 45, 50],
              borderColor: "#00BFFF",
              backgroundColor: "rgba(0, 191, 255, 0.1)",
              tension: 0.4,
            },
            {
              label: "Điểm sử dụng",
              data: [15, 18, 22, 20, 25, 30, 28, 32, 30, 35, 32, 38],
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
              max: 100,
              ticks: {
                stepSize: 25,
              },
            },
          },
        },
      });
    }

    // Monthly Bar Chart - Số lần bị báo cáo, cảnh cáo
    const monthlyBarCtx = monthlyBarChartRef.current?.getContext("2d");
    if (monthlyBarCtx) {
      monthlyBarChartInstanceRef.current = new ChartJS(monthlyBarCtx, {
        type: "bar",
        data: {
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
              backgroundColor: "#FF6347",
            },
            {
              label: "Tê chia sẻ tài liệu",
              data: [0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 0, 3],
              backgroundColor: "#4169E1",
            },
            {
              label: "Ý kiến gây tranh",
              data: [1, 0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 2],
              backgroundColor: "#32CD32",
            },
            {
              label: "Khiếu nại khác",
              data: [0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 1, 1],
              backgroundColor: "#FFD700",
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
              max: 6,
              ticks: {
                stepSize: 1,
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
  }, [selectedYear]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="p-6"> 
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-900">
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
