/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
// TypeScript interfaces for Activity Log
import type { User } from "./user";

// Activity action constants
export const ActivityAction = {
  DOCUMENT_CREATED: "DOCUMENT_CREATED",
  DOCUMENT_APPROVED: "DOCUMENT_APPROVED",
  DOCUMENT_REJECTED: "DOCUMENT_REJECTED",
  DOCUMENT_DELETED: "DOCUMENT_DELETED",
  DOCUMENT_EDITED: "DOCUMENT_EDITED",
  DOCUMENT_HIDDEN: "DOCUMENT_HIDDEN",
  EDIT_REQUEST_CREATED: "EDIT_REQUEST_CREATED",
  EDIT_REQUEST_APPROVED: "EDIT_REQUEST_APPROVED",
  EDIT_REQUEST_REJECTED: "EDIT_REQUEST_REJECTED",
  APPROVAL_REQUEST_CREATED: "APPROVAL_REQUEST_CREATED",
  APPROVAL_REQUEST_APPROVED: "APPROVAL_REQUEST_APPROVED",
  APPROVAL_REQUEST_REJECTED: "APPROVAL_REQUEST_REJECTED",
  REPORT_CREATED: "REPORT_CREATED",
  REPORT_RESOLVED: "REPORT_RESOLVED",
  REPORT_DISMISSED: "REPORT_DISMISSED",
  COMMENT_CREATED: "COMMENT_CREATED",
  COMMENT_DELETED: "COMMENT_DELETED",
  USER_BANNED: "USER_BANNED",
  USER_UNBANNED: "USER_UNBANNED",
  ORGANIZATION_CREATED: "ORGANIZATION_CREATED",
  ORGANIZATION_UPDATED: "ORGANIZATION_UPDATED",
  SUBJECT_CREATED: "SUBJECT_CREATED",
  SUBJECT_UPDATED: "SUBJECT_UPDATED",
} as const;

export type ActivityActionType =
  (typeof ActivityAction)[keyof typeof ActivityAction];

// Target type constants
export const TargetType = {
  DOCUMENT: "Document",
  USER: "User",
  COMMENT: "Comment",
  REPORT: "Report",
  APPROVAL_REQUEST: "ApprovalRequest",
  EDIT_APPROVAL: "EditApproval",
  ORGANIZATION: "Organization",
  SUBJECT: "Subject",
} as const;

export type TargetTypeValue = (typeof TargetType)[keyof typeof TargetType];

export interface ActivityLog {
  _id: string;
  user: User;
  action: ActivityActionType;
  target_type: TargetTypeValue;
  target_id: string;
  target_title?: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLogsResponse {
  activities: ActivityLog[];
  total: number;
  page: number;
  totalPages: number;
  have_next: boolean;
}

export interface FetchActivityLogsParams {
  page?: number;
  limit?: number;
  user?: string;
  action?: ActivityActionType;
  target_type?: TargetTypeValue;
  target_id?: string;
  start_date?: string;
  end_date?: string;
}

// Activity action labels in Vietnamese
export const activityActionLabels: Record<ActivityActionType, string> = {
  [ActivityAction.DOCUMENT_CREATED]: "Tạo tài liệu",
  [ActivityAction.DOCUMENT_APPROVED]: "Duyệt tài liệu",
  [ActivityAction.DOCUMENT_REJECTED]: "Từ chối tài liệu",
  [ActivityAction.DOCUMENT_DELETED]: "Xóa tài liệu",
  [ActivityAction.DOCUMENT_EDITED]: "Chỉnh sửa tài liệu",
  [ActivityAction.DOCUMENT_HIDDEN]: "Ẩn tài liệu",
  [ActivityAction.EDIT_REQUEST_CREATED]: "Tạo yêu cầu chỉnh sửa",
  [ActivityAction.EDIT_REQUEST_APPROVED]: "Duyệt yêu cầu chỉnh sửa",
  [ActivityAction.EDIT_REQUEST_REJECTED]: "Từ chối yêu cầu chỉnh sửa",
  [ActivityAction.APPROVAL_REQUEST_CREATED]: "Tạo yêu cầu duyệt",
  [ActivityAction.APPROVAL_REQUEST_APPROVED]: "Duyệt yêu cầu duyệt",
  [ActivityAction.APPROVAL_REQUEST_REJECTED]: "Từ chối yêu cầu duyệt",
  [ActivityAction.REPORT_CREATED]: "Tạo báo cáo",
  [ActivityAction.REPORT_RESOLVED]: "Giải quyết báo cáo",
  [ActivityAction.REPORT_DISMISSED]: "Bỏ qua báo cáo",
  [ActivityAction.COMMENT_CREATED]: "Tạo bình luận",
  [ActivityAction.COMMENT_DELETED]: "Xóa bình luận",
  [ActivityAction.USER_BANNED]: "Cấm người dùng",
  [ActivityAction.USER_UNBANNED]: "Bỏ cấm người dùng",
  [ActivityAction.ORGANIZATION_CREATED]: "Tạo tổ chức",
  [ActivityAction.ORGANIZATION_UPDATED]: "Cập nhật tổ chức",
  [ActivityAction.SUBJECT_CREATED]: "Tạo môn học",
  [ActivityAction.SUBJECT_UPDATED]: "Cập nhật môn học",
};

// Target type labels in Vietnamese
export const targetTypeLabels: Record<TargetTypeValue, string> = {
  [TargetType.DOCUMENT]: "Tài liệu",
  [TargetType.USER]: "Người dùng",
  [TargetType.COMMENT]: "Bình luận",
  [TargetType.REPORT]: "Báo cáo",
  [TargetType.APPROVAL_REQUEST]: "Yêu cầu duyệt",
  [TargetType.EDIT_APPROVAL]: "Yêu cầu chỉnh sửa",
  [TargetType.ORGANIZATION]: "Tổ chức",
  [TargetType.SUBJECT]: "Môn học",
};
