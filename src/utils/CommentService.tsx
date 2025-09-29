import axios from "axios";
import type {
  Comment,
  CreateCommentData,
  CommentsResponse,
  FetchCommentsParams,
} from "../models/comment";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export class CommentService {
  // Lấy danh sách comment của document
  static async getCommentsByDocument(
    params: FetchCommentsParams
  ): Promise<CommentsResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.parent !== undefined) {
        queryParams.append("parent", params.parent || "null");
      }

      const response = await apiClient.get(
        `/comments/document/${params.doc}?${queryParams.toString()}`
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  }

  // Tạo comment mới
  static async createComment(data: CreateCommentData): Promise<Comment> {
    try {
      const response = await apiClient.post("/comments", data);
      return response.data;
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  }

  // Cập nhật comment
  static async updateComment(
    commentId: string,
    content: string
  ): Promise<Comment> {
    try {
      const response = await apiClient.put(`/comments/${commentId}`, {
        content,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  }

  // Xóa comment
  static async deleteComment(commentId: string): Promise<void> {
    try {
      await apiClient.delete(`/comments/${commentId}`);
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  }

  // Lấy replies của một comment
  static async getReplies(
    commentId: string,
    params?: { page?: number; limit?: number }
  ): Promise<CommentsResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.limit) queryParams.append("limit", params.limit.toString());
      queryParams.append("parent", commentId);

      const response = await apiClient.get(
        `/comments?${queryParams.toString()}`
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching replies:", error);
      throw error;
    }
  }
}
