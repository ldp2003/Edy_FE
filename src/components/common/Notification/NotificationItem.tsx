import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationService } from "../../../utils/NotificationService";
import { UserContext } from "../../../contexts/UserContext";
import type { Notification } from "../../../models/notification";
import { CheckCircle, Circle } from "lucide-react";

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  const navigate = useNavigate();
  const { role: userRole, refreshNotifications } = useContext(UserContext);

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
          // Không điều hướng
          return;
      }
    }

    // console.log("targetPath", targetPath);
    if (targetPath) {
      navigate(targetPath);
    }
  };

  return (
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
  );
};

export default NotificationItem;
