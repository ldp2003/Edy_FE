import React, { useMemo, useCallback } from "react";
import { Dropdown, Badge, Spin, Menu } from "antd";
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

    // Memoized menu items để tránh re-render không cần thiết
    const menuItems = useMemo(() => {
      const items: Array<
        | {
            key: string;
            label: React.ReactNode;
            disabled?: boolean;
            onClick?: () => void;
            className?: string;
          }
        | {
            type: "divider";
          }
      > = [];

      // Header item
      items.push({
        key: "header",
        label: (
          <div className="flex justify-between items-center gap-2 text-gray-700 font-medium px-2 py-0.5">
            <span className="text-sm">Thông báo</span>
            {unreadCount > 0 && (
              <span className="text-xs text-red-600 font-medium">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </div>
        ),
        disabled: true,
        className: "bg-transparent cursor-default hover:bg-transparent",
      });

      // Loading state
      if (loading) {
        items.push({
          key: "loading",
          label: (
            <div className="flex justify-center items-center gap-2 text-gray-700 px-2 py-2">
              <Spin size="small" />
              <span className="text-xs">Đang tải...</span>
            </div>
          ),
          disabled: true,
          className: "bg-transparent cursor-default hover:bg-transparent",
        });
      }
      // Notifications
      else if (notifications.length > 0) {
        notifications.slice(0, 5).forEach((notification) => {
          items.push({
            key: notification._id,
            label: <NotificationItem notification={notification} />,
            className:
              "border-b border-gray-100 last:border-b-0 hover:bg-gray-50",
          });
        });

        // View all button
        items.push({
          type: "divider",
        });
        items.push({
          key: "view-all",
          label: (
            <div className="flex justify-between items-center gap-2 text-gray-700 hover:text-blue-600 px-2 py-0.5">
              <span className="text-sm">Xem tất cả</span>
              <ChevronRight size={14} />
            </div>
          ),
          onClick: handleViewAllNotifications,
          className: "hover:bg-gray-50",
        });
      }
      // Empty state
      else {
        items.push({
          key: "empty",
          label: (
            <div className="text-center text-gray-500 px-2 py-2 text-xs">
              Chưa có thông báo nào
            </div>
          ),
          disabled: true,
          className: "bg-transparent cursor-default hover:bg-transparent",
        });
      }

      return items;
    }, [notifications, loading, unreadCount, handleViewAllNotifications]);

    const menu = (
      <Menu
        className="border-0 shadow-lg rounded-lg p-1 w-64 bg-white"
        items={menuItems}
        style={{ minWidth: 256 }}
      />
    );

    return (
      <Dropdown
        overlay={menu}
        trigger={["hover", "click"]}
        placement="bottomRight"
      >
        <Badge
          count={unreadCount > 99 ? "99+" : unreadCount}
          overflowCount={99}
          style={{
            backgroundColor: unreadCount > 0 ? "#ef4444" : "transparent",
            color: unreadCount > 0 ? "#ffffff" : "#6b7280",
            border: unreadCount > 0 ? "none" : "1px solid #d1d5db",
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
