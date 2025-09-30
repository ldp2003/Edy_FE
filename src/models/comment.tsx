// TypeScript interfaces for Comment
import type { User } from "./user";
import type { Document } from "./document";

export interface Comment {
  _id: string;
  doc: Document | string;
  user: User;
  content: string;
  parent?: Comment | string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCommentData {
  doc: string;
  content: string;
  parent?: string | null;
}

export interface CommentsResponse {
  comments: Comment[];
  total: number;
  page: number;
  totalPages: number;
  have_next: boolean;
}

export interface FetchCommentsParams {
  doc: string;
  page?: number;
  limit?: number;
  parent?: string | null;
}
