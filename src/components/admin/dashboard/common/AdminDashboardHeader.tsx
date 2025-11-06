import React from "react";

interface AdminDashboardHeaderProps {
  currentTime: Date;
}

const AdminDashboardHeader: React.FC<AdminDashboardHeaderProps> = ({
  currentTime,
}) => {
  return (
    <div style={{ padding: "24px 0 32px 0" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "clamp(24px, 6vw, 32px)",
                fontWeight: "bold",
                color: "var(--primary-text-color)",
                margin: 0,
              }}
            >
              Trang tổng quan
            </h1>
            <p
              style={{
                color: "var(--secondary-text-color)",
                margin: "4px 0 0 0",
                fontSize: "clamp(12px, 3vw, 14px)",
              }}
            >
              Chào mừng trở lại, Admin!
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "clamp(12px, 2.5vw, 14px)",
                color: "var(--secondary-text-color)",
              }}
            >
              {currentTime.toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div
              style={{
                fontSize: "clamp(10px, 2vw, 12px)",
                color: "var(--third-text-color)",
              }}
            >
              {currentTime.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHeader;
