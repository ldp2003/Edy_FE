import React from "react";
import { Card, Button, Space } from "antd";
import { Activity, Plus, Users, AlertTriangle, Calendar } from "lucide-react";

const AdminQuickActions: React.FC = () => {
  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          <Activity
            size={20}
            style={{ marginRight: "8px", color: "var(--primary-color)" }}
          />
          <span
            style={{
              color: "var(--primary-text-color)",
              fontSize: "clamp(14px, 3vw, 16px)",
            }}
          >
            Hành động nhanh
          </span>
        </div>
      }
      style={{
        border: `1px solid var(--border-color)`,
        borderRadius: "12px",
        background: "var(--primary-background-color)",
      }}
      styles={{ body: { padding: "24px" } }}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          block
          style={{
            height: "44px",
            borderRadius: "8px",
            backgroundColor: "var(--primary-color)",
            borderColor: "var(--primary-color)",
            fontSize: "clamp(12px, 2.5vw, 14px)",
          }}
        >
          Thêm tài liệu mới
        </Button>
        <Button
          icon={<Users size={16} />}
          block
          style={{
            height: "44px",
            borderRadius: "8px",
            borderColor: "var(--border-color)",
            fontSize: "clamp(12px, 2.5vw, 14px)",
          }}
        >
          Quản lý người dùng
        </Button>
        <Button
          icon={<AlertTriangle size={16} />}
          block
          style={{
            height: "44px",
            borderRadius: "8px",
            borderColor: "var(--border-color)",
            fontSize: "clamp(12px, 2.5vw, 14px)",
          }}
        >
          Xem báo cáo
        </Button>
        <Button
          icon={<Calendar size={16} />}
          block
          style={{
            height: "44px",
            borderRadius: "8px",
            borderColor: "var(--border-color)",
            fontSize: "clamp(12px, 2.5vw, 14px)",
          }}
        >
          Lịch sử hoạt động
        </Button>
      </Space>
    </Card>
  );
};

export default AdminQuickActions;
