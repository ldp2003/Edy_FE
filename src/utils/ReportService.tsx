/**
 * Service for handling document reports
 */

export interface ReportData {
  documentId: string;
  reason: string;
  description?: string;
}

export interface ReportResponse {
  success: boolean;
  message: string;
  reportId?: string;
}

interface ApiResponse {
  data?: {
    id?: string;
    hasReported?: boolean;
  };
}

export class ReportService {
  /**
   * Submit a document report
   */
  static async submitDocumentReport(
    reportData: ReportData
  ): Promise<ReportResponse> {
    try {
      const response = (await ReportAPI.submitDocumentReport(
        reportData
      )) as ApiResponse;
      return {
        success: true,
        message: "Báo cáo đã được gửi thành công!",
        reportId: response.data?.id,
      };
    } catch (error: unknown) {
      console.error("Error submitting report:", error);

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
      } else if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        if (axiosError.response?.data?.message) {
          throw new Error(axiosError.response.data.message);
        }
      }

      throw new Error("Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại!");
    }
  }

  /**
   * Get user's report history
   */
  static async getUserReportHistory(): Promise<unknown[]> {
    try {
      const response = (await ReportAPI.getUserReportHistory()) as ApiResponse;
      return (response.data as unknown[]) || [];
    } catch (error) {
      console.error("Error getting report history:", error);
      return [];
    }
  }

  /**
   * Check if user has already reported this document
   */
  static async checkExistingReport(documentId: string): Promise<boolean> {
    try {
      const response = (await ReportAPI.checkExistingReport(
        documentId
      )) as ApiResponse;
      return response.data?.hasReported || false;
    } catch (error) {
      console.error("Error checking existing report:", error);
      return false;
    }
  }
}

// API placeholder - this should be implemented in your API service
class ReportAPI {
  static async submitDocumentReport(reportData: ReportData) {
    // TODO: Replace with actual API endpoint
    // Example: return axiosInstance.post('/api/reports/documents', reportData);

    console.log(
      "Mock API: Submitting report for document:",
      reportData.documentId
    );

    // Temporary mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            id: `report_${Date.now()}`,
            status: "pending",
          },
        });
      }, 1000);
    });
  }

  static async getUserReportHistory() {
    // TODO: Replace with actual API endpoint
    // Example: return axiosInstance.get('/api/reports/user/history');

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [],
        });
      }, 500);
    });
  }

  static async checkExistingReport(documentId: string) {
    // TODO: Replace with actual API endpoint
    // Example: return axiosInstance.get(`/api/reports/check/${documentId}`);

    console.log("Mock API: Checking existing report for document:", documentId);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            hasReported: false,
          },
        });
      }, 500);
    });
  }
}
