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
    const targetPath = isAdminRole
      ? `/admin/documents/review/${docId ?? ""}`
      : `/personal-posts/document-detail/${docId ?? ""}`;

    console.log("targetPath", targetPath);
    if (docId) {
      navigate(targetPath);
    }
  };

  return (
    <div className="p-2 text-left cursor-pointer" onClick={handleClick}>
      <div className="flex items-center gap-1.5">
        {notification.isRead ? (
          <CheckCircle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        ) : (
          <Circle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
        )}
        <div className="text-xs font-medium flex-1 line-clamp-2">
          {notification.message}
        </div>
      </div>
      <div className="text-[10px] text-gray-500 mt-0.5 ml-5">
        {NotificationService.formatNotificationTime(notification.createdAt)}
      </div>
    </div>
  );
};

export default NotificationItem;
