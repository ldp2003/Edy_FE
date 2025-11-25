/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
// TypeScript interfaces for Document
import type { User, Organization } from "./user";

export interface Subject {
  _id: string;
  name: string;
}

// Public mode constants for reusability
export const PublicMode = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE",
  PRIVATE_SHARED: "PRIVATE_SHARED",
  SHARE_ORGANIZATION: "SHARE_ORGANIZATION",
} as const;

export type PublicModeType = (typeof PublicMode)[keyof typeof PublicMode];

export const publicModeLabels: Record<PublicModeType, string> = {
  [PublicMode.PUBLIC]: "Công khai",
  [PublicMode.PRIVATE]: "Riêng tư",
  [PublicMode.PRIVATE_SHARED]: "Chia sẻ cá nhân",
  [PublicMode.SHARE_ORGANIZATION]: "Chia sẻ tổ chức",
};

// Document status constants
export const DocumentStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  REQUESTED_EDIT: "REQUESTED_EDIT",
  PENDING_EDIT: "PENDING_EDIT",
} as const;

export type DocumentStatusType =
  (typeof DocumentStatus)[keyof typeof DocumentStatus];

// Document level constants
export const DocumentLevel = {
  STUDENT: "STUDENT",
  UNIVERSITY: "UNIVERSITY",
  LECTURER: "LECTURER",
  RESEARCHER: "RESEARCHER",
  OTHER: "OTHER",
} as const;

export type DocumentLevelType =
  (typeof DocumentLevel)[keyof typeof DocumentLevel];

// File type constants
export const FileType = {
  WORD: "WORD",
  PDF: "PDF",
  EXCEL: "EXCEL",
  VIDEO: "VIDEO",
  POWERPOINT: "POWERPOINT",
} as const;

export type FileTypeType = (typeof FileType)[keyof typeof FileType];

// Document type constants
export const DocumentType = {
  RESEARCH_REPORT: "RESEARCH_REPORT",
  VIDEO: "VIDEO",
  STUDY_GUIDE: "STUDY_GUIDE",
  TEXTBOOK: "TEXTBOOK",
  ESSAY: "ESSAY",
  SOLUTION_SET: "SOLUTION_SET",
  THESIS: "THESIS",
  LECTURE: "LECTURE",
  OTHER: "OTHER",
} as const;

export interface Document {
  _id: string;
  user: User;
  description?: {
    summary_by_user?: string;
    summary_by_ai?: string;
  };
  author: string[];
  url: string;
  preview_url?: string;
  cover_page?: string;
  published_year?: number;
  publisher?: string;
  intensive: boolean;
  organization: Organization;
  level: DocumentLevelType;
  subject: Subject;
  status?: DocumentStatusType;
  public_mode?: PublicModeType;
  page?: number;
  file_type: FileTypeType;
  keyword?: string[];
  title: string;
  doc_type?: string;
  view: number;
  comment_count: number;
  download_count: number;
  is_deleted?: boolean;
  is_favorite?: boolean;
  last_approved_at?: string;
  createdAt: string;
  updatedAt?: string;
  like?: number;
  dislike?: number;
  content_rejection?: {
    _id: string;
    doc: string;
    reviewed_by: {
      _id: string;
      first_name: string;
      last_name: string;
    };
    reviewed_at: string;
    message: string;
  };
  
  
  
  
  is_delete_by_admin?: boolean;
  delete_by_admin_reason?: string;
  delete_by_admin_at?: string;
  expiredAt?: string;
}

export interface DocumentsResponse {
  documents: Document[];
  total: number;
  page: number;
  totalPages: number;
  have_next: boolean;
}

export interface PendingRequest {
  _id: string;
  doc: string;
  requester?: string;
  status: string;
  message: string;
  reviewed_by?: any;
  reviewed_at?: any;
  createdAt: string;
  updatedAt: string;
  ai_checked: boolean;
  ai_violation_level: string;
  ai_action_suggest: string;
  ai_reason: string;
}

export interface FetchDocumentsParams {
  search?: string;
  ordering?: string;
  order?: 1 | -1;
  page?: number;
  limit?: number;
  organization?: string;
  publisher?: string;
  published_year?: number;
  intensive?: boolean;
  author?: string;
  user?: string;
  keyword?: string;
  doc_type?: string;
  level?: string;
  subject?: string;
}

export interface UploadDocumentData {
  url: string;
  title: string;
  doc_type: string;
  file_type: string;
  subject: string;
  author: string[];
  published_year?: number;
  publisher?: string;
  organization?: string;
  level: string;
  intensive?: boolean;
  keyword?: string[];
  description?: string;
  page?: number;
}

// Document type labels in Vietnamese
export const documentTypeLabels: Record<keyof typeof DocumentType, string> = {
  RESEARCH_REPORT: "Báo cáo nghiên cứu",
  VIDEO: "Video bài giảng",
  STUDY_GUIDE: "Đề cương học tập",
  TEXTBOOK: "Giáo trình",
  ESSAY: "Tiểu luận",
  SOLUTION_SET: "Bài giải",
  THESIS: "Luận văn",
  LECTURE: "Bài giảng",
  OTHER: "Khác",
};

/**
 * Determine document type based on filename
 * @param fileName - Name of the document file
 * @returns DocumentTypeType
 */
export const getDocumentTypeFromFileName = (
  fileName: string
): keyof typeof DocumentType => {
  const name = fileName.toLowerCase();

  if (name.includes("báo cáo") || name.includes("report"))
    return "RESEARCH_REPORT";
  if (name.includes("đề cương") || name.includes("outline"))
    return "STUDY_GUIDE";
  if (name.includes("giáo trình") || name.includes("textbook"))
    return "TEXTBOOK";
  if (name.includes("tiểu luận") || name.includes("essay")) return "ESSAY";
  if (name.includes("bài giải") || name.includes("solution"))
    return "SOLUTION_SET";
  if (name.includes("luận văn") || name.includes("thesis")) return "THESIS";
  if (name.includes("bài giảng") || name.includes("lecture")) return "LECTURE";
  if (name.includes("video") || name.includes(".mp4") || name.includes(".avi"))
    return "VIDEO";

  return "OTHER";
};

// User Statistics interfaces
export interface UserStats {
  totalUploads: number;
  totalContributions: number;
  totalComments: number;
  totalDownloads: number;
}

export interface DocumentTypes {
  RESEARCH_REPORT: number;
  VIDEO: number;
  STUDY_GUIDE: number;
  TEXTBOOK: number;
  ESSAY: number;
  SOLUTION_SET: number;
  THESIS: number;
  LECTURE: number;
  OTHER: number;
}

export interface MonthlyPoints {
  labels: string[];
  earned: number[];
  spent: number[];
}

export interface TopDocument {
  key: string;
  stt: number;
  title: string;
  views: number;
  downloads: number;
  rating: string;
}

export interface MonthlyReportsDataset {
  label: string;
  data: number[];
}

export interface MonthlyReports {
  labels: string[];
  datasets: MonthlyReportsDataset[];
}

export interface UserStatistics {
  stats: UserStats;
  documentTypes: DocumentTypes;
  monthlyPoints: MonthlyPoints;
  topDocuments: TopDocument[];
  monthlyReports: MonthlyReports;
  lastSyncAt: string;
}
