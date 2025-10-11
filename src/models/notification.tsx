export interface Notification {
  _id: string;
  user: string | User;
  doc?:  Document;
  cmt?: Comment;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export const NotificationType = {
  APPROVED: "APPROVED",
  REMOVED: "REMOVED",
  REJECTED: "REJECTED",
  HIDDEN: "HIDDEN",
  SYSTEM: "SYSTEM",
  COMMENT: "COMMENT",
  REPLY: "REPLY",
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

// Request/Response interfaces
export interface CreateNotificationRequest {
  userId: string;
  docId?: string;
  cmtId?: string;
  type: NotificationType;
  message: string;
}

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
}

export interface GetNotificationsResponse {
  notifications: Notification[];
  total: number;
  page: number;
  totalPages: number;
  have_next: boolean;
}

export interface NotificationStats {
  total: number;
  unread: number;
  read: number;
}

export interface UnreadCountResponse {
  count: number;
}

// Import related types
import type { User } from "./user";
import type { Document } from "./document";
import type { Comment } from "./comment";
