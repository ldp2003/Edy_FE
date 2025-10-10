import { NotificationAPI } from "../api/API";
import type {
  Notification,
  GetNotificationsParams,
  GetNotificationsResponse,
  CreateNotificationRequest,
  NotificationStats,
  UnreadCountResponse,
  NotificationType,
} from "../models/notification";

export class NotificationService {
  /**
   * Lấy danh sách thông báo của người dùng hiện tại
   */
  static async getNotifications(
    params?: GetNotificationsParams
  ): Promise<GetNotificationsResponse> {
    try {
      const response = await NotificationAPI.getNotifications(params);
      return response;
    } catch (error) {
      console.error("Error in NotificationService.getNotifications:", error);
      throw new Error("Không thể tải danh sách thông báo");
    }
  }

  /**
   * Lấy số lượng thông báo chưa đọc
   */
  static async getUnreadCount(): Promise<UnreadCountResponse> {
    try {
      const response = await NotificationAPI.getUnreadCount();
      return response;
    } catch (error) {
      console.error("Error in NotificationService.getUnreadCount:", error);
      throw new Error("Không thể tải số lượng thông báo chưa đọc");
    }
  }

  /**
   * Lấy thống kê thông báo
   */
  static async getNotificationStats(): Promise<NotificationStats> {
    try {
      const response = await NotificationAPI.getNotificationStats();
      return response;
    } catch (error) {
      console.error(
        "Error in NotificationService.getNotificationStats:",
        error
      );
      throw new Error("Không thể tải thống kê thông báo");
    }
  }

  /**
   * Đánh dấu thông báo đã đọc
   */
  static async markAsRead(
    notificationId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await NotificationAPI.markAsRead(notificationId);
      return {
        success: true,
        message: response.message || "Đã đánh dấu thông báo đã đọc",
      };
    } catch (error) {
      console.error("Error in NotificationService.markAsRead:", error);
      throw new Error("Không thể đánh dấu thông báo đã đọc");
    }
  }

  /**
   * Đánh dấu tất cả thông báo đã đọc
   */
  static async markAllAsRead(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await NotificationAPI.markAllAsRead();
      return {
        success: true,
        message: response.message || "Đã đánh dấu tất cả thông báo đã đọc",
      };
    } catch (error) {
      console.error("Error in NotificationService.markAllAsRead:", error);
      throw new Error("Không thể đánh dấu tất cả thông báo đã đọc");
    }
  }

  /**
   * Xóa thông báo
   */
  static async deleteNotification(
    notificationId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await NotificationAPI.deleteNotification(notificationId);
      return {
        success: true,
        message: response.message || "Đã xóa thông báo",
      };
    } catch (error) {
      console.error("Error in NotificationService.deleteNotification:", error);
      throw new Error("Không thể xóa thông báo");
    }
  }

  /**
   * Xóa tất cả thông báo đã đọc
   */
  static async deleteAllRead(): Promise<{
    success: boolean;
    message: string;
    deletedCount: number;
  }> {
    try {
      const response = await NotificationAPI.deleteAllRead();
      return {
        success: true,
        message: response.message || "Đã xóa tất cả thông báo đã đọc",
        deletedCount: response.deletedCount || 0,
      };
    } catch (error) {
      console.error("Error in NotificationService.deleteAllRead:", error);
      throw new Error("Không thể xóa tất cả thông báo đã đọc");
    }
  }

  /**
   * Tạo thông báo mới (chỉ dành cho admin)
   */
  static async createNotification(data: CreateNotificationRequest): Promise<{
    success: boolean;
    message: string;
    notification: Notification;
    docId?: string;
    cmtId?: string;
  }> {
    try {
      const response = await NotificationAPI.createNotification(data);
      return {
        success: true,
        message: response.message || "Đã tạo thông báo thành công",
        notification: response.notification,
        docId: response.docId,
        cmtId: response.cmtId,
      };
    } catch (error) {
      console.error("Error in NotificationService.createNotification:", error);
      throw new Error("Không thể tạo thông báo");
    }
  }

  /**
   * Lấy thông báo theo loại
   */
  static async getNotificationsByType(
    type: NotificationType,
    params?: Omit<GetNotificationsParams, "isRead">
  ): Promise<GetNotificationsResponse> {
    try {
      // Gọi API với filter theo type (nếu backend hỗ trợ)
      const response = await NotificationAPI.getNotifications({
        ...params,
        // type: type // Uncomment khi backend hỗ trợ filter theo type
      });

      // Filter phía client nếu backend chưa hỗ trợ
      const filteredNotifications = response.notifications.filter(
        (notification: Notification) => notification.type === type
      );

      return {
        ...response,
        notifications: filteredNotifications,
        total: filteredNotifications.length,
      };
    } catch (error) {
      console.error(
        "Error in NotificationService.getNotificationsByType:",
        error
      );
      throw new Error("Không thể tải thông báo theo loại");
    }
  }

  /**
   * Lấy thông báo chưa đọc
   */
  static async getUnreadNotifications(
    params?: Omit<GetNotificationsParams, "isRead">
  ): Promise<GetNotificationsResponse> {
    try {
      const response = await NotificationAPI.getNotifications({
        ...params,
        isRead: false,
      });
      return response;
    } catch (error) {
      console.error(
        "Error in NotificationService.getUnreadNotifications:",
        error
      );
      throw new Error("Không thể tải thông báo chưa đọc");
    }
  }

  /**
   * Lấy thông báo đã đọc
   */
  static async getReadNotifications(
    params?: Omit<GetNotificationsParams, "isRead">
  ): Promise<GetNotificationsResponse> {
    try {
      const response = await NotificationAPI.getNotifications({
        ...params,
        isRead: true,
      });
      return response;
    } catch (error) {
      console.error(
        "Error in NotificationService.getReadNotifications:",
        error
      );
      throw new Error("Không thể tải thông báo đã đọc");
    }
  }

  /**
   * Utility function để format thời gian thông báo
   */
  static formatNotificationTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return "Vừa xong";
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    if (diffInMinutes < 43200)
      return `${Math.floor(diffInMinutes / 1440)} ngày trước`;

    return date.toLocaleDateString("vi-VN");
  }

  /**
   * Utility function để lấy icon theo loại thông báo
   */
  static getNotificationIcon(type: NotificationType): string {
    switch (type) {
      case "APPROVED":
        return "✅";
      case "REJECTED":
        return "❌";
      case "REMOVED":
        return "🗑️";
      case "HIDDEN":
        return "👁️‍🗨️";
      case "COMMENT":
        return "💬";
      case "REPLY":
        return "↩️";
      case "SYSTEM":
        return "🔔";
      default:
        return "📢";
    }
  }

  /**
   * Utility function để lấy màu theo loại thông báo
   */
  static getNotificationColor(type: NotificationType): string {
    switch (type) {
      case "APPROVED":
        return "#52c41a"; // green
      case "REJECTED":
        return "#ff4d4f"; // red
      case "REMOVED":
        return "#ff7a45"; // orange
      case "HIDDEN":
        return "#faad14"; // yellow
      case "COMMENT":
        return "#1890ff"; // blue
      case "REPLY":
        return "#722ed1"; // purple
      case "SYSTEM":
        return "#595959"; // gray
      default:
        return "#1890ff"; // blue
    }
  }
}
