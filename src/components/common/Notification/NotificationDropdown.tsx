import React from "react";
import { Dropdown } from "antd";
import { useNavigate } from "react-router-dom";
import type { Notification } from "../../../models/notification";
import { Bell } from "lucide-react";
import NotificationItem from "./NotificationItem";

interface NotificationDropdownProps {
  notifications: Notification[];
  loading: boolean;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  loading,
}) => {
  const navigate = useNavigate();

  const handleViewAllNotifications = () => {
    navigate("/notifications");
  };

  return (
    <Dropdown
      overlay={
        <div className="bg-white shadow-md rounded-md w-80">
          <div className="p-4 border-b border-gray-200 font-medium">
            Thông báo
          </div>
          <div className="max-h-64 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">Đang tải...</div>
            ) : notifications.length > 0 ? (
              notifications.map(
                (notification) => (
                  console.log("notification", notification),
                  (
                    <NotificationItem
                      key={notification._id}
                      notification={notification}
                    />
                  )
                )
              )
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
      }
      trigger={["hover"]}
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
    </Dropdown>
  );
};

export default NotificationDropdown;
