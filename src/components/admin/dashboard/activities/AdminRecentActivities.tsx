import React from "react";
import { Card, Avatar, Typography, Empty, Spin } from "antd";
import type { RecentActivity } from "../../../../models/AdminStatisticsModel";

const { Text } = Typography;

interface AdminRecentActivitiesProps {
  activities: RecentActivity[] | undefined;
  loading: boolean;
}

const AdminRecentActivities: React.FC<AdminRecentActivitiesProps> = ({
  activities,
  loading,
}) => {
  return (
    <div>
      <h2
        className="text-base font-bold mb-3 w-fit text-left"
        style={{ color: "var(--primary-text-color)" }}
      >
        Hoạt động gần đây
      </h2>
      <Card
        className="shadow-md"
        styles={{ body: { padding: "6px" } }}
        style={{
          borderColor: "var(--border-color)",
          backgroundColor: "var(--primary-background-color)",
          overflow: "auto",
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-3">
            <Spin size="small" />
          </div>
        ) : activities && activities.length > 0 ? (
          <div className="space-y-0.5 max-h-96 overflow-y-auto">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-1.5 p-1 rounded-md hover:bg-opacity-50 transition-colors"
              >
                {/* User Avatar */}
                <Avatar
                  src={activity.user.avatar}
                  alt={`${activity.user.first_name} ${activity.user.last_name}`}
                  size={24}
                  style={{
                    backgroundColor: "var(--primary-color)",
                    flexShrink: 0,
                  }}
                >
                  {activity.user.first_name?.charAt(0)?.toUpperCase() || "?"}
                </Avatar>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  {/* First line: User name and time */}
                  <div className="flex items-center justify-between gap-1">
                    <Text
                      strong
                      className="text-[10px] sm:text-xs"
                      style={{ color: "var(--primary-text-color)" }}
                    >
                      {`${activity.user.first_name} ${activity.user.last_name}`.trim() ||
                        "Người dùng"}
                    </Text>
                    <Text
                      className="text-[9px] whitespace-nowrap"
                      style={{ color: "var(--secondary-text-color)" }}
                    >
                      {activity.timestamp
                        ? new Date(activity.timestamp).toLocaleString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                          })
                        : "N/A"}
                    </Text>
                  </div>

                  {/* Second line: Description and points */}
                  <div className="flex items-center gap-1">
                    <Text
                      className="text-[10px] text-left truncate flex-1"
                      style={{ color: "var(--secondary-text-color)" }}
                    >
                      {activity.description || "Không có mô tả"}
                    </Text>
                    {typeof activity.metadata?.pointsEarned === "number" &&
                      activity.metadata.pointsEarned > 0 && (
                        <Text
                          className="text-[9px] whitespace-nowrap"
                          style={{ color: "var(--green-button-color)" }}
                        >
                          +{activity.metadata.pointsEarned} điểm
                        </Text>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty
            description={
              <Text style={{ color: "var(--secondary-text-color)" }}>
                Chưa có hoạt động gần đây
              </Text>
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>
    </div>
  );
};

export default AdminRecentActivities;
