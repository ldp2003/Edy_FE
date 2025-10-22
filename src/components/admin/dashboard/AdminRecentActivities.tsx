import React from "react";
import { Card, Table, Avatar, Space, Tag } from "antd";
import { Activity } from "lucide-react";
import type { ColumnsType } from "antd/es/table";

interface ActivityData {
  key: string;
  user: string;
  action: string;
  target: string;
  time: string;
  status: "success" | "warning" | "error";
}

interface AdminRecentActivitiesProps {
  activities: ActivityData[];
}

const AdminRecentActivities: React.FC<AdminRecentActivitiesProps> = ({
  activities,
}) => {
  const columns: ColumnsType<ActivityData> = [
    {
      title: "Người dùng",
      dataIndex: "user",
      key: "user",
      render: (text) => (
        <Space>
          <Avatar
            size="small"
            style={{ backgroundColor: "var(--primary-color)" }}
          >
            {text.charAt(0)}
          </Avatar>
          <span style={{ fontSize: "clamp(12px, 2.5vw, 14px)" }}>{text}</span>
        </Space>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <span style={{ fontSize: "clamp(12px, 2.5vw, 14px)" }}>
          {text}{" "}
          <Tag
            color={
              record.status === "success"
                ? "green"
                : record.status === "warning"
                ? "orange"
                : "red"
            }
          >
            {record.target}
          </Tag>
        </span>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "time",
      key: "time",
      align: "right",
      render: (text) => (
        <span
          style={{
            color: "var(--secondary-text-color)",
            fontSize: "clamp(10px, 2vw, 12px)",
          }}
        >
          {text}
        </span>
      ),
    },
  ];

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
            Hoạt động gần đây
          </span>
        </div>
      }
      style={{
        border: `1px solid var(--border-color)`,
        borderRadius: "12px",
        background: "var(--primary-background-color)",
      }}
      styles={{ body: { padding: "0" } }}
    >
      <Table
        columns={columns}
        dataSource={activities}
        pagination={false}
        size="middle"
        style={{ borderRadius: "12px" }}
      />
    </Card>
  );
};

export default AdminRecentActivities;
