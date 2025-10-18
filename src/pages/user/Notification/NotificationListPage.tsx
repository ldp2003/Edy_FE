import React, { useContext, useEffect, useState } from "react";
import { NotificationService } from "../../../utils/NotificationService";
import NotificationListItem from "../../../components/common/Notification/NotificationListItem";
import { UserContext } from "../../../contexts/UserContext";

const NotificationListPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { notifications, setNotifications } = useContext(UserContext);

  // Fetch notifications with pagination
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await NotificationService.getNotifications({
          page,
          limit: 10,
        });
        setNotifications(response.notifications);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [page, setNotifications]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="p-4 bg-white rounded shadow mt-6 text-left">
      <h1 className="text-base text-[var(--primary-text-color)] font-bold mb-4">
        Danh sách thông báo
      </h1>
      {loading ? (
        <p>Đang tải...</p>
      ) : notifications.length > 0 ? (
        <ul>
          {notifications.map((notification) => (
            <NotificationListItem
              key={notification._id}
              notification={notification}
            />
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
