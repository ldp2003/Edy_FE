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

  // ==================== NOTIFICATION TEMPLATES ====================

  /**
   * Tạo thông báo follow user
   */
  static async createFollowNotification(
    followerUser: { _id: string; first_name: string; last_name: string },
    targetUserId: string
  ): Promise<{
    success: boolean;
    message: string;
    notification: Notification;
  }> {
    try {
      const message = `${followerUser.first_name} ${followerUser.last_name} đã theo dõi bạn.`;

      const response = await this.createNotification({
        userId: targetUserId,
        type: "SYSTEM",
        message,
        redirectTo: "USER",
      });

      return {
        success: response.success,
        message: response.message,
        notification: response.notification,
      };
    } catch (error) {
      console.error("Error in createFollowNotification:", error);
      throw new Error("Không thể tạo thông báo theo dõi");
    }
  }

  /**
   * Tạo thông báo comment trên tài liệu
   */
  static async createCommentNotification(
    commenterUser: { _id: string; first_name: string; last_name: string },
    documentOwnerId: string,
    documentId: string
  ): Promise<{
    success: boolean;
    message: string;
    notification: Notification;
  }> {
    try {
      // Kiểm tra nếu người comment là chủ sở hữu tài liệu thì không tạo thông báo
      if (commenterUser._id === documentOwnerId) {
        return {
          success: true,
          message: "Không tạo thông báo cho thao tác của chính chủ sở hữu",
          notification: {} as Notification,
        };
      }

      const message = `${commenterUser.first_name} ${commenterUser.last_name} đã bình luận vào tài liệu của bạn.`;

      const response = await this.createNotification({
        userId: documentOwnerId,
        docId: documentId,
        type: "COMMENT",
        message,
        redirectTo: "COMMENT",
      });

      return {
        success: response.success,
        message: response.message,
        notification: response.notification,
      };
    } catch (error) {
      console.error("Error in createCommentNotification:", error);
      throw new Error("Không thể tạo thông báo bình luận");
    }
  }

  /**
   * Tạo thông báo reply comment
   */
  static async createReplyNotification(
    replierUser: { _id: string; first_name: string; last_name: string },
    originalCommenterId: string,
    documentId: string,
    commentId: string
  ): Promise<{
    success: boolean;
    message: string;
    notification: Notification;
  }> {
    try {
      // Kiểm tra nếu người reply là người tạo comment gốc thì không tạo thông báo
      if (replierUser._id === originalCommenterId) {
        return {
          success: true,
          message:
            "Không tạo thông báo cho thao tác của chính người tạo comment",
          notification: {} as Notification,
        };
      }

      const message = `${replierUser.first_name} ${replierUser.last_name} đã trả lời bình luận của bạn.`;

      const response = await this.createNotification({
        userId: originalCommenterId,
        docId: documentId,
        cmtId: commentId,
        type: "REPLY",
        message,
        redirectTo: "COMMENT",
      });

      return {
        success: response.success,
        message: response.message,
        notification: response.notification,
      };
    } catch (error) {
      console.error("Error in createReplyNotification:", error);
      throw new Error("Không thể tạo thông báo trả lời");
    }
  }

  /**
   * Tạo thông báo tài liệu được duyệt
   */
  static async createDocumentApprovedNotification(
    documentOwnerId: string,
    documentId: string,
    documentTitle: string
  ): Promise<{
    success: boolean;
    message: string;
    notification: Notification;
  }> {
    try {
      const message = `Tài liệu "${documentTitle}" của bạn đã được duyệt và công khai.`;

      const response = await this.createNotification({
        userId: documentOwnerId,
        docId: documentId,
        type: "APPROVED",
        message,
        redirectTo: "DOCUMENT",
      });

      return {
        success: response.success,
        message: response.message,
        notification: response.notification,
      };
    } catch (error) {
      console.error("Error in createDocumentApprovedNotification:", error);
      throw new Error("Không thể tạo thông báo duyệt tài liệu");
    }
  }

  /**
   * Tạo thông báo tài liệu bị từ chối
   */
  static async createDocumentRejectedNotification(
    documentOwnerId: string,
    documentId: string,
    documentTitle: string,
    reason?: string
  ): Promise<{
    success: boolean;
    message: string;
    notification: Notification;
  }> {
    try {
      const message = reason
        ? `Tài liệu "${documentTitle}" của bạn đã bị từ chối. Lý do: ${reason}`
        : `Tài liệu "${documentTitle}" của bạn đã bị từ chối.`;

      const response = await this.createNotification({
        userId: documentOwnerId,
        docId: documentId,
        type: "REJECTED",
        message,
        redirectTo: "DOCUMENT",
      });

      return {
        success: response.success,
        message: response.message,
        notification: response.notification,
      };
    } catch (error) {
      console.error("Error in createDocumentRejectedNotification:", error);
      throw new Error("Không thể tạo thông báo từ chối tài liệu");
    }
  }

  /**
   * Tạo thông báo tài liệu bị xóa
   */
  static async createDocumentRemovedNotification(
    documentOwnerId: string,
    documentId: string,
    documentTitle: string,
    reason?: string
  ): Promise<{
    success: boolean;
    message: string;
    notification: Notification;
  }> {
    try {
      const message = reason
        ? `Tài liệu "${documentTitle}" của bạn đã bị xóa. Lý do: ${reason}`
        : `Tài liệu "${documentTitle}" của bạn đã bị xóa.`;

      const response = await this.createNotification({
        userId: documentOwnerId,
        docId: documentId,
        type: "REMOVED",
        message,
        redirectTo: "NONE",
      });

      return {
        success: response.success,
        message: response.message,
        notification: response.notification,
      };
    } catch (error) {
      console.error("Error in createDocumentRemovedNotification:", error);
      throw new Error("Không thể tạo thông báo xóa tài liệu");
    }
  }

  /**
   * Tạo thông báo tài liệu bị ẩn
   */
  static async createDocumentHiddenNotification(
    documentOwnerId: string,
    documentId: string,
    documentTitle: string,
    reason?: string
  ): Promise<{
    success: boolean;
    message: string;
    notification: Notification;
  }> {
    try {
      const message = reason
        ? `Tài liệu "${documentTitle}" của bạn đã bị ẩn. Lý do: ${reason}`
        : `Tài liệu "${documentTitle}" của bạn đã bị ẩn.`;

      const response = await this.createNotification({
        userId: documentOwnerId,
        docId: documentId,
        type: "HIDDEN",
        message,
        redirectTo: "DOCUMENT",
      });

      return {
        success: response.success,
        message: response.message,
        notification: response.notification,
      };
    } catch (error) {
      console.error("Error in createDocumentHiddenNotification:", error);
      throw new Error("Không thể tạo thông báo ẩn tài liệu");
    }
  }

  /**
   * Tạo thông báo reaction (thích/không thích) trên tài liệu
   */
  static async createReactionNotification(
    reactorUser: { _id: string; first_name: string; last_name: string },
    documentOwnerId: string,
    documentId: string,
    documentTitle: string,
    reactionType: "LIKE" | "DISLIKE"
  ): Promise<{
    success: boolean;
    message: string;
    notification: Notification;
  }> {
    try {
      // Kiểm tra nếu người reaction là chủ sở hữu tài liệu thì không tạo thông báo
      if (reactorUser._id === documentOwnerId) {
        return {
          success: true,
          message: "Không tạo thông báo cho thao tác của chính chủ sở hữu",
          notification: {} as Notification,
        };
      }

      const reactionText = reactionType === "LIKE" ? "thích" : "không thích";
      const message = `${reactorUser.first_name} ${reactorUser.last_name} đã ${reactionText} tài liệu "${documentTitle}" của bạn.`;

      const response = await this.createNotification({
        userId: documentOwnerId,
        docId: documentId,
        type: "SYSTEM",
        message,
        redirectTo: "DOCUMENT",
      });

      return {
        success: response.success,
        message: response.message,
        notification: response.notification,
      };
    } catch (error) {
      console.error("Error in createReactionNotification:", error);
      throw new Error("Không thể tạo thông báo reaction");
    }
  }

  /**
   * Tạo thông báo hệ thống chung
   */
  static async createSystemNotification(
    userId: string,
    message: string,
    docId?: string,
    cmtId?: string
  ): Promise<{
    success: boolean;
    message: string;
    notification: Notification;
  }> {
    try {
      const response = await this.createNotification({
        userId,
        docId,
        cmtId,
        type: "SYSTEM",
        message,
        redirectTo: "NONE",
      });

      return {
        success: response.success,
        message: response.message,
        notification: response.notification,
      };
    } catch (error) {
      console.error("Error in createSystemNotification:", error);
      throw new Error("Không thể tạo thông báo hệ thống");
    }
  }
}
