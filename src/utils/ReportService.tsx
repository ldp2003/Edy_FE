import { ReportAPI } from "../api/API";
import type { Report } from "../models/report";
import { ReportType } from "../models/report";

/**
 * Service for handling document reports
 */

export interface CreateReportParams {
  docId: string;
  cmtId?: string;
  type: string[];
  reason: string;
}

export interface GetAllReportsParams {
  status?: string;
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ResolveReportParams {
  validTypes: string[];
  action: string;
  resolveReason: string;
}

export interface ReportsResponse {
  reports: Report[];
  total: number;
  page: number;
  totalPages: number;
  have_next: boolean;
}

export interface ReportResponse {
  success: boolean;
  message: string;
  reportId?: string;
}

export class ReportService {
  /**
   * Tạo báo cáo mới
   * @param params - Thông tin báo cáo
   * @returns Promise<ReportResponse>
   */
  static async createReport(
    params: CreateReportParams
  ): Promise<ReportResponse> {
    try {
      const response = await ReportAPI.createReport(params);
      return {
        success: true,
        message: "Báo cáo đã được gửi thành công!",
        reportId: response.data?.id || response.id,
      };
    } catch (error: unknown) {
      console.error("ReportService.createReport error:", error);

      // Handle specific error cases
      const axiosError = error as {
        response?: { status?: number; data?: { message?: string } };
      };

      if (axiosError.response?.status === 401) {
        throw new Error("Bạn cần đăng nhập để báo cáo tài liệu");
      } else if (axiosError.response?.status === 403) {
        throw new Error("Bạn không có quyền báo cáo tài liệu này");
      } else if (axiosError.response?.status === 404) {
        throw new Error("Tài liệu không tồn tại");
      } else if (axiosError.response?.status === 429) {
        throw new Error("Bạn đã báo cáo quá nhiều. Vui lòng thử lại sau");
      } else if (axiosError.response?.data?.message) {
        throw new Error(axiosError.response.data.message);
      }

      throw new Error("Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại!");
    }
  }

  /**
   * Lấy tất cả báo cáo (dành cho admin)
   * @param params - Tham số lọc và phân trang
   * @returns Promise<ReportsResponse>
   */
  static async getAllReports(
    params?: GetAllReportsParams
  ): Promise<ReportsResponse> {
    try {
      const response = await ReportAPI.getAllReports(params);
      return response;
    } catch (error: unknown) {
      console.error("ReportService.getAllReports error:", error);
      throw error;
    }
  }

  /**
   * Giải quyết báo cáo (dành cho admin)
   * @param reportId - ID của báo cáo
   * @param params - Thông tin giải quyết
   * @returns Promise<any>
   */
  static async resolveReport(reportId: string, params: ResolveReportParams) {
    try {
      const response = await ReportAPI.resolveReport(reportId, params);
      return response;
    } catch (error: unknown) {
      console.error("ReportService.resolveReport error:", error);
      throw error;
    }
  }

  /**
   * Lấy báo cáo theo trạng thái
   * @param status - Trạng thái báo cáo (PENDING, RESOLVED, REJECTED)
   * @param params - Tham số bổ sung
   * @returns Promise<ReportsResponse>
   */
  static async getReportsByStatus(
    status: string,
    params?: Omit<GetAllReportsParams, "status">
  ): Promise<ReportsResponse> {
    try {
      const response = await ReportAPI.getAllReports({
        ...params,
        status,
      });
      return response;
    } catch (error: unknown) {
      console.error("ReportService.getReportsByStatus error:", error);
      throw error;
    }
  }

  /**
   * Lấy báo cáo theo loại
   * @param type - Loại báo cáo
   * @param params - Tham số bổ sung
   * @returns Promise<ReportsResponse>
   */
  static async getReportsByType(
    type: string,
    params?: Omit<GetAllReportsParams, "type">
  ): Promise<ReportsResponse> {
    try {
      const response = await ReportAPI.getAllReports({
        ...params,
        type,
      });
      return response;
    } catch (error: unknown) {
      console.error("ReportService.getReportsByType error:", error);
      throw error;
    }
  }

  /**
   * Tìm kiếm báo cáo
   * @param search - Từ khóa tìm kiếm
   * @param params - Tham số bổ sung
   * @returns Promise<ReportsResponse>
   */
  static async searchReports(
    search: string,
    params?: Omit<GetAllReportsParams, "search">
  ): Promise<ReportsResponse> {
    try {
      const response = await ReportAPI.getAllReports({
        ...params,
        search,
      });
      return response;
    } catch (error: unknown) {
      console.error("ReportService.searchReports error:", error);
      throw error;
    }
  }

  /**
   * Báo cáo tài liệu (wrapper cho backward compatibility)
   * @deprecated Sử dụng createReport thay thế
   */
  static async submitDocumentReport(reportData: {
    documentId: string;
    reason: string;
    description?: string;
  }): Promise<ReportResponse> {
    return this.createReport({
      docId: reportData.documentId,
      type: [ReportType.OTHER], // Default type
      reason: reportData.description || reportData.reason,
    });
  }
}
