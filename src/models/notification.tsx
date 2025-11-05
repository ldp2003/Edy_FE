export interface Notification {
  _id: string;
  user: string | User;
  doc?: Document;
  cmt?: Comment;
  type: NotificationType;
  message: string;
  isRead: boolean;
  redirectTo: RedirectToType;
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

export const RedirectToType = {
  DOCUMENT: "DOCUMENT",
  COMMENT: "COMMENT",
  USER: "USER",
  SYSTEM: "SYSTEM",
  NONE: "NONE",
} as const;

export type RedirectToType =
  (typeof RedirectToType)[keyof typeof RedirectToType];

// Request/Response interfaces
export interface CreateNotificationRequest {
  userId: string;
  docId?: string;
  cmtId?: string;
  type: NotificationType;
  message: string;
  redirectTo?: RedirectToType;
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
  total_notifications: number;
  unread_notifications: number;
  read_notifications: number;
  by_type: Record<string, number>;
}

export interface UnreadCountResponse {
  unread_count: number;
}

// Import related types
import type { User } from "./user";
import type { Document } from "./document";
import type { Comment } from "./comment";
