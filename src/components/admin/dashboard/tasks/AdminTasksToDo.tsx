import React from "react";
import { Card, List, Tag, Button, Avatar, Typography, Empty } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import type { PendingDocument } from "../../../../models/AdminStatisticsModel";

const { Text } = Typography;

// Simple task interface matching API response
interface AdminTasksToDoProps {
  tasks: PendingDocument[];
  loading?: boolean;
  onTaskClick?: (task: PendingDocument) => void;
}

const AdminTasksToDo: React.FC<AdminTasksToDoProps> = ({
  tasks,
  loading = false,
  onTaskClick,
}) => {
  // Helper function to get task type info (hardcoded for approval requests)
  const getTaskTypeInfo = () => {
    return {
      icon: <FileTextOutlined />,
      color: "blue",
      text: "Yêu cầu duyệt tài liệu",
    };
  };

  // Helper function to get AI violation level text
  const getAiViolationText = (level: string) => {
    switch (level) {
      case "LOW":
        return "Thấp";
      case "MEDIUM":
        return "Trung bình";
      case "HIGH":
        return "Cao";
      default:
        return level;
    }
  };

  // Helper function to get AI violation level color
  const getAiViolationColor = (level: string) => {
    switch (level) {
      case "LOW":
        return "green";
      case "MEDIUM":
        return "orange";
      case "HIGH":
        return "red";
      default:
        return "default";
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
        styles={{ body: { padding: "8px" } }}
      >
        <List
          loading={loading}
          dataSource={tasks}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Không có nhiệm vụ nào"
                className="py-4"
              />
            ),
          }}
          renderItem={(task) => {
            const typeInfo = getTaskTypeInfo();

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
                    task.user.avatar ? (
                      <Avatar
                        size={{ xs: 28, sm: 32 }}
                        src={task.user.avatar}
                        alt={`${task.user.first_name} ${task.user.last_name}`}
                      />
                    ) : (
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
                    )
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
                    </div>
                  }
                  description={
                    <div style={{ textAlign: "left" }}>
                      <Text
                        style={{ color: "var(--secondary-text-color)" }}
                        className="block mb-0.5 text-[10px] sm:text-xs"
                      >
                        {`${task.user.first_name} ${task.user.last_name} • ${task.subject.name} • ${task.organization.name} • ${task.level} • ${task.file_type} • ${task.page} trang`}
                        {task.ai_violation_level && (
                          <span className="ml-2">
                            <Tag
                              color={getAiViolationColor(
                                task.ai_violation_level
                              )}
                              className="text-[9px]"
                            >
                              {getAiViolationText(task.ai_violation_level)}
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
