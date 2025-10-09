// TypeScript interfaces for Comment

export interface Comment {
  _id: string;
  doc: string;
  user: {
    _id: string;
    first_name: string;
    last_name: string;
    avatar?: string;
    organization?: {
      _id: string;
      name: string;
    };
  };
  content: string;
  parent?: string | null;
  replies?: Comment[];
  reply_count?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommentCreateRequest {
  content: string;
  parentId?: string | null;
}

export interface CommentUpdateRequest {
  content: string;
}

export interface CommentListResponse {
  comments: Comment[];
  total: number;
  page: number;
  totalPages: number;
  have_next: boolean;
}

export interface CommentRepliesResponse {
  replies: Comment[];
  total: number;
  page: number;
  totalPages: number;
  have_next: boolean;
  parent_comment: Comment;
}

export interface CommentStats {
  document_id: string;
  total_comments: number;
  main_comments: number;
  replies: number;
  document_comment_count: number;
}

export interface CommentDeleteResponse {
  message: string;
  deleted_count: number;
}
