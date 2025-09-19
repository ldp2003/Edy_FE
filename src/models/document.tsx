// TypeScript interfaces for Document

export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  doc_count?: number;
  follower?: string[];
  following?: string[];
  organization?: {
    _id: string;
    name: string;
  };
  avatar?: string;
}

export interface Organization {
  _id: string;
  name: string;
}

export interface Subject {
  _id: string;
  name: string;
}

export interface Document {
  _id: string;
  user: User;
  description?: {
    summary_by_user?: string;
    summary_by_ai?: string;
  };
  author: string[];
  url: string;
  cover_page?: string;
  published_year?: number;
  publisher?: string;
  intensive: boolean;
  organization: Organization;
  level: "STUDENT" | "UNIVERSITY" | "LECTURER" | "RESEARCHER" | "OTHER";
  subject: Subject;
  status?:
    | "PENDING"
    | "APPROVED"
    | "PENDING_SUMMARY"
    | "REJECTED"
    | "REQUESTED_EDIT";
  public_mode?: "PUBLIC" | "PRIVATE" | "PRIVATE_SHARED" | "SHARE_ORGANIZATION";
  page?: number;
  file_type: "WORD" | "PDF" | "EXCEL" | "VIDEO" | "POWERPOINT";
  keyword?: string[];
  title: string;
  doc_type?:
    | "RESEARCH_REPORT"
    | "VIDEO"
    | "STUDY_GUIDE"
    | "TEXTBOOK"
    | "ESSAY"
    | "SOLUTION_SET"
    | "THESIS"
    | "LECTURE"
    | "OTHER";
  view: number;
  comment_count: number;
  download_count: number;
  is_deleted?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface DocumentsResponse {
  documents: Document[];
  total: number;
  page: number;
  totalPages: number;
  have_next: boolean;
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
