export interface Report {
  _id: string;
  doc: string | Document; // Can be populated
  cmt?: string; // Optional comment reference
  reporter: string | User; // Can be populated
  type: ReportType[];
  reason: string;
  status: ReportStatus;
  validTypes?: ReportType[]; // Confirmed violation types after processing
  resolvedAt?: Date;
  resolveBy?: string | User; // Can be populated
  action?: ReportAction;
  resolveReason?: string;
  createdAt: string;
  updatedAt: string;
}

export const ReportType = {
  SPAM_OR_MISLEADING: "SPAM_OR_MISLEADING",
  DUPLICATE: "DUPLICATE",
  COPYRIGHT: "COPYRIGHT",
  INCORRECT_CATEGORY: "INCORRECT_CATEGORY",
  PERSONAL_INFORMATION: "PERSONAL_INFORMATION",
  LOW_QUALITY: "LOW_QUALITY",
  INAPPROPRIATE: "INAPPROPRIATE",
  OTHER: "OTHER",
} as const;

export type ReportType = (typeof ReportType)[keyof typeof ReportType];

export const ReportStatus = {
  PROCESSING: "PROCESSING",
  RESOLVED: "RESOLVED",
} as const;

export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus];

export const ReportAction = {
  EDIT_REQUESTED: "EDIT_REQUESTED",
  DELETE: "DELETE",
  FALSE_REPORT: "FALSE_REPORT",
} as const;

export type ReportAction = (typeof ReportAction)[keyof typeof ReportAction];

// Request/Response interfaces
export interface CreateReportRequest {
  docId: string;
  cmtId?: string;
  type: ReportType[];
  reason: string;
}

export interface ResolveReportRequest {
  validTypes: ReportType[];
  action: ReportAction;
  resolveReason: string;
}

export interface GetReportsParams {
  status?: ReportStatus;
  type?: ReportType;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetReportsResponse {
  reports: Report[];
  total: number;
  page: number;
  totalPages: number;
  have_next: boolean;
}

// Import User and Document types
import type { User } from "./user";
import type { Document } from "./document";
