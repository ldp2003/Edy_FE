import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { getContributions } from "../../../utils/UserService";

ChartJS.register(DoughnutController, ArcElement, Tooltip, Legend);

const ChartProfile: React.FC = () => {
  const [contributions, setContributions] = useState({
    total_documents: 0,
    total_reactions: 0,
    total_downloads: 0,
    total_comments: 0,
  });
  const [selectedYear, setSelectedYear] = useState(2025);
  const chartRef = React.useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = React.useRef<ChartJS | null>(null);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const data = await getContributions(selectedYear);
        if (data.success) {
          setContributions(data.contributions);
        }
      } catch (error) {
        console.error("Failed to fetch contributions:", error);
      }
    };

    fetchContributions();
  }, [selectedYear]);

  React.useEffect(() => {
    const ctx = chartRef.current?.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (ctx) {
      const data = [
        contributions.total_documents,
        contributions.total_downloads,
        contributions.total_reactions,
        contributions.total_comments,
      ];

      chartInstanceRef.current = new ChartJS(ctx, {
        type: "doughnut",
        data: {
          labels: ["Đăng bài", "Tải tài liệu", "Đánh giá", "Bình luận"],
          datasets: [
            {
              data,
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
  }, [contributions]);

  const legendItems = [
    {
      color: "bg-green-500",
      label: "Đăng bài",
      value: contributions.total_documents,
    },
    {
      color: "bg-red-500",
      label: "Tải tài liệu",
      value: contributions.total_downloads,
    },
    {
      color: "bg-yellow-500",
      label: "Đánh giá",
      value: contributions.total_reactions,
    },
    {
      color: "bg-blue-500",
      label: "Bình luận",
      value: contributions.total_comments,
    },
  ];

  return (
    <div className="px-6 py-4 border border-[var(--border-color)] rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-bold">Thành tích đóng góp</h2>
        <select
          className="text-xs border rounded px-2 py-1"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        >
          <option value={2025}>2025</option>
          <option value={2024}>2024</option>
          <option value={2023}>2023</option>
        </select>
      </div>
      <div className="relative w-full h-32 mb-3">
        <canvas ref={chartRef}></canvas>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center">
            <span
              className={`w-2 h-2 rounded-full ${item.color} inline-block mr-1.5`}
            ></span>
            <span className="truncate">
              {item.label}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartProfile;
