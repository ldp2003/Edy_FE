// TypeScript interfaces for Document

export interface Document {
  id: string;
  user: string;
  description: {
    summary_by_user?: string;
    summary_by_ai?: string;
  };
  author: string[];
  url: string;
  published_year?: number;
  publisher?: string;
  intensive?: boolean;
  organization?: string;
  level: "Student" | "University" | "Lecturer" | "Researcher" | "Other";
  subject: string;
  status:
    | "pending"
    | "approved"
    | "pending_summary"
    | "rejected"
    | "requested_edit";
  public_mode: "public" | "private" | "private_shared" | "share_organization";
  page?: number;
  file_type: "Word" | "PDF" | "Excel" | "Video" | "Powerpoint";
  keyword: string[];
  title: string;
  doc_type:
    | "Research Report"
    | "Video"
    | "Study Guide"
    | "Textbook"
    | "Essay"
    | "Solution Set"
    | "Thesis"
    | "Lecture"
    | "Other";
  view: number;
  comment_count: number;
  download_count: number;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
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
