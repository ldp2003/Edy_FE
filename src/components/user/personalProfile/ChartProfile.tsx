import React, { useContext } from "react";
import {
  Chart as ChartJS,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { UserContext } from "../../../contexts/UserContext";

ChartJS.register(DoughnutController, ArcElement, Tooltip, Legend);

const ChartProfile: React.FC = () => {
  const { user } = useContext(UserContext);
  const chartRef = React.useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = React.useRef<ChartJS | null>(null);

  React.useEffect(() => {
    const ctx = chartRef.current?.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (ctx) {
      const data = [
        user?.shared_documents.length || 0,
        user?.free_download_count || 0,
        user?.rank_point || 0,
        user?.point || 0,
      ]; // Ensure no undefined values

      chartInstanceRef.current = new ChartJS(ctx, {
        type: "doughnut",
        data: {
          labels: ["Đăng bài", "Tải tài liệu", "Đánh giá", "Bình luận"],
          datasets: [
            {
              data, // Use the filtered data array
              backgroundColor: ["#4CAF50", "#F44336", "#FF9800", "#2196F3"],
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
        },
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [user]);

  return (
    <div className="px-10 py-6 border rounded-lg shadow-md min-h-[365px] w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Thành tích đóng góp</h2>
        <select className="text-sm border rounded px-2 py-1">
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>
      </div>
      <div className="relative w-full h-40">
        <canvas ref={chartRef}></canvas>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block mr-2"></span>
          Đăng bài
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block mr-2"></span>
          Tải tài liệu
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block mr-2"></span>
          Đánh giá
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block mr-2"></span>
          Bình luận
        </div>
      </div>
    </div>
  );
};

export default ChartProfile;
