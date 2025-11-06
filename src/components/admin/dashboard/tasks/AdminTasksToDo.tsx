import React from "react";
import { Card, List, Tag, Button, Avatar, Typography } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  AlertOutlined,
  FileTextOutlined,
  FlagOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

// Simple task interface matching API response
interface TaskItem {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "completed";
  createdAt: string;
  data: {
    requestId: string;
    documentId: string;
    documentTitle: string;
    requester: {
      _id: string;
      first_name: string;
      last_name: string;
    };
    aiChecked: boolean;
    aiViolationLevel: string;
  };
}

interface AdminTasksToDoProps {
  tasks: TaskItem[];
  loading?: boolean;
  onTaskClick?: (task: TaskItem) => void;
}

const AdminTasksToDo: React.FC<AdminTasksToDoProps> = ({
  tasks,
  loading = false,
  onTaskClick,
}) => {
  // Helper function to get priority color and icon
  const getPriorityInfo = (priority: TaskItem["priority"]) => {
    switch (priority) {
      case "urgent":
        return { color: "red", icon: <AlertOutlined />, text: "Khẩn cấp" };
      case "high":
        return { color: "orange", icon: <FlagOutlined />, text: "Cao" };
      case "medium":
        return {
          color: "blue",
          icon: <ClockCircleOutlined />,
          text: "Trung bình",
        };
      case "low":
        return { color: "green", icon: <CheckCircleOutlined />, text: "Thấp" };
      default:
        return {
          color: "default",
          icon: <ClockCircleOutlined />,
          text: "Không xác định",
        };
    }
  };

  // Helper function to get task type icon and color
  const getTaskTypeInfo = (type: TaskItem["type"]) => {
    switch (type) {
      case "approval_request":
        return {
          icon: <FileTextOutlined />,
          color: "blue",
          text: "Yêu cầu duyệt tài liệu",
        };
      case "document":
        return {
          icon: <FileTextOutlined />,
          color: "blue",
          text: "Tài liệu chờ duyệt",
        };
      case "report":
        return {
          icon: <FlagOutlined />,
          color: "red",
          text: "Báo cáo chờ xử lý",
        };
      default:
        return {
          icon: <FileTextOutlined />,
          color: "default",
          text: "Công việc khác",
        };
    }
  };

  return (
    <div>
      <h2
        className="text-base font-bold mb-3 w-fit text-left"
        style={{ color: "var(--primary-text-color)" }}
      >
        Nhiệm vụ cần làm
      </h2>
      <Card
        className="shadow-md"
        style={{
          borderColor: "var(--border-color)",
          backgroundColor: "var(--primary-background-color)",
        }}
        bodyStyle={{ padding: "8px" }}
      >
        <List
          loading={loading}
          dataSource={tasks}
          renderItem={(task) => {
            const priorityInfo = getPriorityInfo(task.priority);
            const typeInfo = getTaskTypeInfo(task.type);

            return (
              <List.Item
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                style={{
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border-color)",
                }}
                onClick={() => onTaskClick?.(task)}
                actions={[
                  <Button
                    size="small"
                    className="w-full sm:w-auto text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskClick?.(task);
                    }}
                  >
                    Xem chi tiết
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      size={{ xs: 28, sm: 32 }}
                      icon={typeInfo.icon}
                      style={{
                        backgroundColor: `var(--${
                          typeInfo.color === "blue"
                            ? "primary"
                            : typeInfo.color === "red"
                            ? "red-button"
                            : "secondary"
                        }-color)`,
                      }}
                    />
                  }
                  title={
                    <div
                      className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2"
                      style={{ textAlign: "left" }}
                    >
                      <Text
                        strong
                        className="text-xs sm:text-sm"
                        style={{ color: "var(--primary-text-color)" }}
                      >
                        {task.title}
                      </Text>
                      <Tag
                        color={priorityInfo.color}
                        icon={priorityInfo.icon}
                        className="self-start sm:self-auto text-[10px]"
                      >
                        {priorityInfo.text}
                      </Tag>
                    </div>
                  }
                  description={
                    <div style={{ textAlign: "left" }}>
                      <Text
                        style={{ color: "var(--secondary-text-color)" }}
                        className="block mb-0.5 text-[10px] sm:text-xs"
                      >
                        {task.description}
                        {task.data.aiChecked && (
                          <span className="ml-2">
                            <Tag
                              color={
                                task.data.aiViolationLevel === "MEDIUM"
                                  ? "orange"
                                  : "red"
                              }
                              className="text-[9px]"
                            >
                              AI: {task.data.aiViolationLevel}
                            </Tag>
                          </span>
                        )}
                      </Text>
                      <Text type="secondary" className="text-[9px]">
                        {new Date(task.createdAt).toLocaleString("vi-VN")}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            );
          }}
        />
      </Card>
    </div>
  );
};

export default AdminTasksToDo;
