import React from "react";
import { Card } from "antd";
import { BarChart3, PieChart } from "lucide-react";

const AdminChartsSection: React.FC = () => {
  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <BarChart3
            size={20}
            style={{ marginRight: "8px", color: "var(--primary-color)" }}
          />
          <span
            style={{
              color: "var(--primary-text-color)",
              fontSize: "clamp(14px, 3vw, 16px)",
            }}
          >
            Thống kê hoạt động
          </span>
        </div>
      }
      style={{
        border: `1px solid var(--border-color)`,
        borderRadius: "12px",
        background: "var(--primary-background-color)",
      }}
      bodyStyle={{ padding: "24px" }}
    >
      <div
        style={{
          height: "300px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{ textAlign: "center", color: "var(--secondary-text-color)" }}
        >
          <PieChart size={48} style={{ marginBottom: "16px", opacity: 0.5 }} />
          <p style={{ fontSize: "clamp(14px, 3vw, 16px)" }}>
            Biểu đồ thống kê sẽ được hiển thị tại đây
          </p>
          <p
            style={{
              fontSize: "clamp(10px, 2vw, 12px)",
              marginTop: "8px",
            }}
          >
            (Tích hợp với thư viện chart như Chart.js hoặc Recharts)
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AdminChartsSection;
