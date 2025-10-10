import React from "react";
import { useNavigate } from "react-router-dom";
import { NotificationService } from "../../../utils/NotificationService";
import type { Notification } from "../../../models/notification";
import { CheckCircle, Circle } from "lucide-react";

interface NotificationItemProps {
  notification: Notification;
  userRole: "ADMIN" | "USER";
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  userRole,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const docId = notification?.doc?._id;
    const targetPath =
      userRole === "ADMIN"
        ? `/admin/documents/review/${docId ?? ""}`
        : `/personal-posts/document-detail/${docId ?? ""}`;

    console.log("targetPath", targetPath);
    if (docId) {
      navigate(targetPath);
    }
  };

  return (
    <div
      className={`p-3 border-b text-left cursor-pointer ${
        notification.isRead ? "bg-white" : "bg-gray-100"
      } hover:bg-gray-200`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        {notification.isRead ? (
          <CheckCircle className="w-4 h-4 text-gray-400" />
        ) : (
          <Circle className="w-4 h-4 text-green-500" />
        )}
        <div className="text-sm font-medium flex-1">{notification.message}</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {NotificationService.formatNotificationTime(notification.createdAt)}
      </div>
    </div>
  );
};

export default NotificationItem;
