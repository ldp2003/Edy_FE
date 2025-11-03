import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationService } from "../../../utils/NotificationService";
import { UserContext } from "../../../contexts/UserContext";
import type { Notification } from "../../../models/notification";

interface NotificationListItemProps {
  notification: Notification;
}

const NotificationListItem: React.FC<NotificationListItemProps> = ({
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
    if (!notification.isRead) {
      try {
        await NotificationService.markAsRead(notification._id);
        console.log("Notification marked as read");
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

    if (docId) {
      navigate(targetPath);
    }
  };

  return (
    <li
      className={`mb-2 shadow rounded-lg p-2 text-sm flex items-center gap-2 text-left cursor-pointer`}
      style={{
        backgroundColor: notification.isRead
          ? "var(--primary-background-color)"
          : "var(--field-background-color)",
      }}
      onClick={handleClick}
    >
      <div className="flex-1">
        <p>{notification.message}</p>
        <small style={{ color: "var(--secondary-text-color)" }}>
          {NotificationService.formatNotificationTime(notification.createdAt)}
        </small>
      </div>
      {!notification.isRead && (
        <span
          className="w-2 h-2 rounded-full ml-auto"
          style={{ backgroundColor: "var(--primary-color)" }}
        ></span>
      )}
    </li>
  );
};

export default NotificationListItem;
