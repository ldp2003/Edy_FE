/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommentAPI } from "../api/API";
import type {
  Comment,
  CommentCreateRequest,
  CommentUpdateRequest,
  CommentListResponse,
  CommentRepliesResponse,
  CommentStats,
  CommentDeleteResponse,
} from "../models/comment";

export const CommentService = {
  // Tạo bình luận mới
  async createComment(
    documentId: string,
    data: CommentCreateRequest
  ): Promise<{ success: boolean; data: Comment }> {
    try {
      const response = await CommentAPI.createComment(documentId, data);
      return {
        success: true,
        data: response.comment,
      };
    } catch (error) {
      console.error("Error in CommentService.createComment:", error);
      throw error;
    }
  },

  // Lấy danh sách bình luận theo tài liệu
  async getCommentsByDocument(
    documentId: string,
    params?: { page?: number; limit?: number }
  ): Promise<{ success: boolean; data: CommentListResponse }> {
    try {
      const response = await CommentAPI.getCommentsByDocument(
        documentId,
        params
      );
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error("Error in CommentService.getCommentsByDocument:", error);
      throw error;
    }
  },

  // Lấy danh sách replies cho một bình luận
  async getRepliesByComment(
    commentId: string,
    params?: { page?: number; limit?: number }
  ): Promise<{ success: boolean; data: CommentRepliesResponse }> {
    try {
      const response = await CommentAPI.getRepliesByComment(commentId, params);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error("Error in CommentService.getRepliesByComment:", error);
      throw error;
    }
  },

  // Cập nhật bình luận
  async updateComment(
    commentId: string,
    data: CommentUpdateRequest
  ): Promise<{ success: boolean; data: Comment }> {
    try {
      const response = await CommentAPI.updateComment(commentId, data);
      return {
        success: true,
        data: response.comment,
      };
    } catch (error: any) {
      console.error("Error in CommentService.updateComment:", error);
      throw error;
    }
  },

  // Xóa bình luận
  async deleteComment(
    commentId: string
  ): Promise<{ success: boolean; data: CommentDeleteResponse }> {
    try {
      const response = await CommentAPI.deleteComment(commentId);
      return {
        success: true,
        data: response,
      };
    } catch (error: any) {
      console.error("Error in CommentService.deleteComment:", error);
      throw error;
    }
  },

  // Lấy thống kê bình luận
  async getCommentStats(
    documentId: string
  ): Promise<{ success: boolean; data: CommentStats }> {
    try {
      const response = await CommentAPI.getCommentStats(documentId);
      return {
        success: true,
        data: response,
      };
    } catch (error: any) {
      console.error("Error in CommentService.getCommentStats:", error);
      throw error;
    }
  },
};
