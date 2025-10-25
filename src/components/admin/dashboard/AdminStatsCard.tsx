import React from "react";
import { TrendingUp } from "lucide-react";

export interface StatCard {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

interface AdminStatsCardProps {
  stat: StatCard;
}

const AdminStatsCard: React.FC<AdminStatsCardProps> = ({ stat }) => {
  return (
    <div
      style={{
        border: `1px solid var(--border-color)`,
        borderRadius: "12px",
        background: "var(--primary-background-color)",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              color: "var(--secondary-text-color)",
              fontSize: "clamp(12px, 2.5vw, 14px)",
              marginBottom: "8px",
              fontWeight: "500",
            }}
          >
            {stat.title}
          </div>
          <div
            style={{
              fontSize: "clamp(20px, 5vw, 28px)",
              fontWeight: "bold",
              color: "var(--primary-text-color)",
              marginBottom: "4px",
            }}
          >
            {stat.value}
          </div>
          {stat.trend && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "clamp(10px, 2vw, 12px)",
                color: stat.trend.isPositive
                  ? "var(--green-button-color)"
                  : "var(--red-button-color)",
              }}
            >
              <TrendingUp size={12} style={{ marginRight: "4px" }} />
              {stat.trend.isPositive ? "+" : ""}
              {stat.trend.value}% so với tuần trước
            </div>
          )}
        </div>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            backgroundColor: stat.bgColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: stat.color,
            flexShrink: 0,
          }}
        >
          {stat.icon}
        </div>
      </div>
    </div>
  );
};

export default AdminStatsCard;
