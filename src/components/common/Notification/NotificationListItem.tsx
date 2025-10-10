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
  const { role: userRole } = useContext(UserContext);

  const handleClick = async () => {
    if (!notification.isRead) {
      try {
        await NotificationService.markAsRead(notification._id);
        console.log("Notification marked as read");
      } catch (error) {
        console.error("Failed to mark notification as read", error);
      }
    }

    const docId = notification?.doc?._id;
    const targetPath =
      userRole === "ADMIN"
        ? `/admin/documents/review/${docId ?? ""}`
        : `/personal-posts/document-detail/${docId ?? ""}`;

    if (docId) {
      navigate(targetPath);
    }
  };

  return (
    <li
      className={`mb-2 shadow rounded-lg p-2 text-sm ${
        notification.isRead ? "bg-white" : "bg-[var(--field-background-color)]"
      } flex items-center gap-2 text-left cursor-pointer`}
      onClick={handleClick}
    >
      <div className="flex-1">
        <p>{notification.message}</p>
        <small className="text-gray-500">
          {NotificationService.formatNotificationTime(notification.createdAt)}
        </small>
      </div>
      {!notification.isRead && (
        <span className="w-2 h-2 bg-blue-500 rounded-full ml-auto"></span>
      )}
    </li>
  );
};

export default NotificationListItem;
