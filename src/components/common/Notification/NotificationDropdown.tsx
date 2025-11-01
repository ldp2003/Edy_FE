import React from "react";
import { Dropdown, Badge } from "antd";
import { useNavigate } from "react-router-dom";
import type { Notification } from "../../../models/notification";
import { Bell } from "lucide-react";
import NotificationItem from "./NotificationItem";

interface NotificationDropdownProps {
  notifications: Notification[];
  loading?: boolean;
  unreadCount?: number;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  loading = false,
  unreadCount = 0,
}) => {
  const navigate = useNavigate();

  const handleViewAllNotifications = () => {
    navigate("/notifications");
  };

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: "notification",
            label: (
              <div className="bg-white shadow-md rounded-md w-80">
                <div className="p-4 border-b border-gray-200 font-medium">
                  Thông báo
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-center">Đang tải...</div>
                  ) : notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <NotificationItem
                        key={notification._id}
                        notification={notification}
                      />
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      Không có thông báo nào.
                    </div>
                  )}
                </div>
                <div className="p-4 text-center">
                  <button
                    className="text-blue-500 hover:underline cursor-pointer"
                    onClick={handleViewAllNotifications}
                  >
                    Xem tất cả
                  </button>
                </div>
              </div>
            ),
          },
        ],
      }}
      trigger={["hover"]}
    >
      <Badge
        count={unreadCount > 9 ? "9+" : unreadCount}
        overflowCount={9}
        style={{ backgroundColor: "#ff4d4f" }}
        offset={[-4, 8]}
        size="small"
      >
        <button
          className="p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
          onClick={(e) => {
            e.stopPropagation(); // Ngăn chặn sự kiện dropdown
            handleViewAllNotifications();
          }}
        >
          <Bell className="w-5 h-5" />
        </button>
      </Badge>
    </Dropdown>
  );
};

export default NotificationDropdown;
