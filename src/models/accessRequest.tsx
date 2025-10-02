/* eslint-disable react-refresh/only-export-components */
// TypeScript interfaces for Access Request
import type { User } from "./user";
import type { Document } from "./document";

// Access request status constants
export const AccessRequestStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  DENIED: "DENIED",
} as const;

export type AccessRequestStatusType =
  (typeof AccessRequestStatus)[keyof typeof AccessRequestStatus];

// Access request status labels in Vietnamese
export const accessRequestStatusLabels: Record<
  AccessRequestStatusType,
  string
> = {
  PENDING: "Đang chờ xử lý",
  APPROVED: "Đã phê duyệt",
  DENIED: "Đã từ chối",
};

// Private Share interface (basic structure)
export interface PrivateShare {
  _id: string;
  doc: string | Document;
  name: string;
  limited_access: number;
  request: boolean;
  time_limited: boolean;
  share_with_organization?: boolean;
  start_date?: string;
  end_date?: string;
  status: "ACTIVE" | "INACTIVE" | "DISABLED";
  createdAt: string;
  updatedAt?: string;
}

// Access Request interface
export interface AccessRequest {
  _id: string;
  doc: string | Document;
  user: string | User;
  private_share: string | PrivateShare;
  expiredAt?: string | null;
  content?: string | null;
  status: AccessRequestStatusType;
  createdAt: string;
  updatedAt?: string;
}

// Response interfaces
export interface AccessRequestsResponse {
  requests: AccessRequest[];
  total: number;
  page: number;
  totalPages: number;
  have_next: boolean;
  privateShare?: {
    _id: string;
    name: string;
    limited_access: number;
    current_access_count: number;
  };
}

// Legacy interface for backward compatibility
export interface LegacyAccessRequestsResponse {
  accessRequests: AccessRequest[];
  total: number;
  page: number;
  totalPages: number;
  have_next: boolean;
}

// Request interfaces for API calls
export interface CreateAccessRequestData {
  content?: string;
}

export interface AccessRequestListParams {
  status?: AccessRequestStatusType;
  page?: number;
  limit?: number;
  ordering?: string;
  order?: 1 | -1;
}

export interface DenyAccessRequestData {
  reason?: string;
}

// Access request with populated fields for display
export interface PopulatedAccessRequest
  extends Omit<AccessRequest, "doc" | "user" | "private_share"> {
  doc: Document;
  user: User;
  private_share: PrivateShare;
}
