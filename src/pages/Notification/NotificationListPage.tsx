import React, { useEffect, useState } from "react";
import { NotificationService } from "../../utils/NotificationService";
import type { Notification } from "../../models/notification";

const NotificationListPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    NotificationService.getNotifications({ page, limit: 10 })
      .then((response) => {
        setNotifications(response.notifications);
        setTotalPages(response.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Danh sách thông báo</h1>
      {loading ? (
        <p>Đang tải...</p>
      ) : notifications.length > 0 ? (
        <ul>
          {notifications.map((notification) => (
            <li key={notification._id} className="mb-2 border-b pb-2">
              <p>{notification.message}</p>
              <small className="text-gray-500">
                {NotificationService.formatNotificationTime(
                  notification.createdAt
                )}
              </small>
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có thông báo nào.</p>
      )}
      <div className="mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 border ${
              page === index + 1 ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NotificationListPage;
