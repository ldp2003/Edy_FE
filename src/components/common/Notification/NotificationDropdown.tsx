import React, { useCallback } from "react";
import { Dropdown, Badge, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import type { Notification } from "../../../models/notification";
import { Bell, ChevronRight } from "lucide-react";
import NotificationItem from "./NotificationItem";

interface NotificationDropdownProps {
  notifications: Notification[];
  loading?: boolean;
  unreadCount?: number;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = React.memo(
  ({ notifications, loading = false, unreadCount = 0 }) => {
    const navigate = useNavigate();

    const handleViewAllNotifications = useCallback(() => {
      navigate("/notifications");
    }, [navigate]);

    const handleBellClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        handleViewAllNotifications();
      },
      [handleViewAllNotifications]
    );

    const menu = (
      <div
        className="bg-white shadow-lg rounded-lg overflow-hidden"
        style={{ minWidth: 320, maxWidth: 380 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gray-50">
          <span className="text-sm font-semibold text-gray-800">Thông báo</span>
          {unreadCount > 0 && (
            <span className="text-xs bg-red-500 text-white font-semibold px-2 py-0.5 rounded-full">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center gap-2 text-gray-600 py-8">
              <Spin size="small" />
              <span className="text-sm">Đang tải...</span>
            </div>
          ) : notifications.length > 0 ? (
            <>
              {notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification._id}
                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  <NotificationItem notification={notification} />
                </div>
              ))}
            </>
          ) : (
            <div className="text-center text-gray-500 py-8 text-sm">
              Chưa có thông báo nào
            </div>
          )}
        </div>

        {/* Footer - View all button */}
        {!loading && notifications.length > 0 && (
          <div className="border-t border-gray-200">
            <button
              onClick={handleViewAllNotifications}
              className="w-full cursor-pointer flex justify-center items-center gap-2 px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <span>Xem tất cả</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    );

    return (
      <Dropdown
        popupRender={() => menu}
        trigger={["hover", "click"]}
        placement="bottomRight"
      >
        <Badge
          count={unreadCount > 99 ? "99+" : unreadCount}
          overflowCount={99}
          style={{
            backgroundColor:
              unreadCount > 0 ? "var(--red-button-color)" : "transparent",
            color:
              unreadCount > 0
                ? "var(--primary-background-color)"
                : "var(--secondary-text-color)",
            border: unreadCount > 0 ? "none" : "1px solid var(--border-color)",
          }}
          offset={[-2, 2]}
          size="small"
          showZero={false}
        >
          <button
            className="cursor-pointer relative p-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            onClick={handleBellClick}
            aria-label={`Thông báo ${
              unreadCount > 0 ? `(${unreadCount} chưa đọc)` : ""
            }`}
            title={`Thông báo ${
              unreadCount > 0 ? `(${unreadCount} chưa đọc)` : ""
            }`}
          >
            <Bell
              className={`w-5 h-5 transition-colors duration-200 ${
                unreadCount > 0 ? "text-red-500" : "text-gray-600"
              }`}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </Badge>
      </Dropdown>
    );
  }
);

NotificationDropdown.displayName = "NotificationDropdown";

export default NotificationDropdown;
