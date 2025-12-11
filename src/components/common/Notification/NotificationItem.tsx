import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import { NotificationService } from "../../../utils/NotificationService";
import { UserContext } from "../../../contexts/UserContext";
import type { Notification } from "../../../models/notification";
import { CheckCircle, Circle } from "lucide-react";

interface NotificationItemProps {
  notification: Notification;
  onCloseDropdown?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onCloseDropdown,
}) => {
  const navigate = useNavigate();
  const { role: userRole, refreshNotifications } = useContext(UserContext);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const isAdminRole = Array.isArray(userRole)
    ? userRole.some(
        (role) =>
          typeof role === "string" && role.toUpperCase().includes("ADMIN")
      )
    : typeof userRole === "string" && userRole.toUpperCase().includes("ADMIN");

  const handleClick = async () => {
    // Mark as read if not already read
    if (!notification.isRead) {
      try {
        await NotificationService.markAsRead(notification._id);
        // Refresh notifications in context after marking as read
        refreshNotifications();
      } catch (error) {
        console.error("Failed to mark notification as read", error);
      }
    }

    const docId = notification?.doc?._id;
    const cmtId = notification?.cmt?._id;
    let targetPath = "";

    if (notification.type === "ACCESS_DENIED") {
      targetPath = "/personal-posts";
    } else if (notification.type === "ACCESS_GRANTED" && docId) {
      targetPath = `/personal-posts/document-detail/${docId}`;
    } else {
      switch (notification.redirectTo) {
        case "DOCUMENT":
          if (isAdminRole) {
            targetPath = `/admin/documents/review/${docId ?? ""}`;
          } else {
            targetPath = `/personal-posts/document-detail/${docId ?? ""}`;
          }
          break;
        case "COMMENT":
          targetPath = `/personal-posts/document-detail/${
            docId ?? ""
          }?comment=${cmtId}`;
          break;
        case "USER": {
          const userId =
            typeof notification.user === "string"
              ? notification.user
              : notification.user._id;
          targetPath = `/user/${userId}`;
          break;
        }
        case "POINT":
          targetPath = "/point-management?showHistory=true";
          break;
        case "SYSTEM":
        case "NONE":
        default:
          // Không điều hướng, mở modal chi tiết
          onCloseDropdown?.();
          setIsModalVisible(true);
          return;
      }
    }

    // console.log("targetPath", targetPath);
    if (targetPath) {
      onCloseDropdown?.();
      navigate(targetPath);
    }
  };

  return (
    <>
      <div className="p-2 text-left cursor-pointer" onClick={handleClick}>
        <div className="flex items-center gap-1.5">
          {notification.isRead ? (
            <CheckCircle
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{ color: "var(--secondary-text-color)" }}
            />
          ) : (
            <Circle
              className="w-3.5 h-3.5 flex-shrink-0"
              style={{ color: "var(--green-button-color)" }}
            />
          )}
          <div className="text-xs font-medium flex-1 line-clamp-2">
            {notification.message}
          </div>
        </div>
        <div
          className="text-[10px] mt-0.5 ml-5"
          style={{ color: "var(--secondary-text-color)" }}
        >
          {NotificationService.formatNotificationTime(notification.createdAt)}
        </div>
      </div>
      <Modal
        title="Chi tiết thông báo"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
      >
        <div className="p-4">
          <p className="text-sm mb-2">{notification.message}</p>
          <p className="text-xs text-gray-500">
            {NotificationService.formatNotificationTime(notification.createdAt)}
          </p>
        </div>
      </Modal>
    </>
  );
};

export default NotificationItem;
