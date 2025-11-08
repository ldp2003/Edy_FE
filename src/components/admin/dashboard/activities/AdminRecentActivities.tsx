import React from "react";
import { Card, Avatar, Typography, Empty, Spin } from "antd";
import type {
  ActivityActionType,
  TargetTypeValue,
} from "../../../../models/activityLog";

const { Text } = Typography;

interface RecentActivity {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    email: string;
  };
  action: ActivityActionType;
  actionLabel: string;
  targetType: TargetTypeValue;
  targetId: string;
  targetTitle: string;
  description: string;
  metadata?: {
    requestId?: string;
    requesterId?: string;
    isIntensive?: boolean;
    pointsEarned?: number;
  };
  timestamp: string;
}

interface AdminRecentActivitiesProps {
  activities: RecentActivity[] | undefined;
  loading: boolean;
  onActivityClick: (activity: RecentActivity) => void;
}

const AdminRecentActivities: React.FC<AdminRecentActivitiesProps> = ({
  activities,
  loading,
  onActivityClick,
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
          <div className="space-y-0.5">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-1.5 p-1 rounded-md hover:bg-opacity-50 transition-colors cursor-pointer"
                onClick={() => onActivityClick(activity)}
              >
                {/* User Avatar */}
                <Avatar
                  src={activity.user.avatar}
                  alt={activity.user.name}
                  size={24}
                  style={{
                    backgroundColor: "var(--primary-color)",
                    flexShrink: 0,
                  }}
                >
                  {activity.user.name.charAt(0).toUpperCase()}
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
                      {activity.user.name}
                    </Text>
                    <Text
                      className="text-[9px] whitespace-nowrap"
                      style={{ color: "var(--secondary-text-color)" }}
                    >
                      {new Date(activity.timestamp).toLocaleString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </Text>
                  </div>

                  {/* Second line: Description and points */}
                  <div className="flex items-center gap-1">
                    <Text
                      className="text-[10px] text-left truncate flex-1"
                      style={{ color: "var(--secondary-text-color)" }}
                    >
                      {activity.description}
                    </Text>
                    {activity.metadata?.pointsEarned && (
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
