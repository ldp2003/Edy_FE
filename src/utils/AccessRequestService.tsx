import { AccessRequestAPI } from "../api/API";

const AccessRequestService = {
  /**
   * Create access request for private share
   * @param privateShareId - ID của private share
   * @param data - Dữ liệu yêu cầu truy cập
   * @returns Promise<any>
   */
  async createAccessRequest(
    privateShareId: string,
    data?: { content?: string }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    try {
      const response = await AccessRequestAPI.createAccessRequest(
        privateShareId,
        data
      );
      return response.data || response;
    } catch (error) {
      console.error(
        "Error in AccessRequestService.createAccessRequest:",
        error
      );
      throw error;
    }
  },

  /**
   * Get access requests by private share (owner only)
   * @param privateShareId - ID của private share
   * @param params - Parameters for filtering and pagination
   * @returns Promise<any>
   */
  async getAccessRequestsByPrivateShare(
    privateShareId: string,
    params?: {
      status?: string;
      page?: number;
      limit?: number;
      ordering?: string;
      order?: 1 | -1;
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    try {
      const response = await AccessRequestAPI.getAccessRequestsByPrivateShare(
        privateShareId,
        params
      );
      return (
        response || {
          accessRequests: [],
          total: 0,
          page: 1,
          totalPages: 0,
          have_next: false,
        }
      );
    } catch (error) {
      console.error(
        "Error in AccessRequestService.getAccessRequestsByPrivateShare:",
        error
      );
      throw error;
    }
  },

  /**
   * Approve access request
   * @param requestId - ID của access request
   * @returns Promise<any>
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async approveAccessRequest(requestId: string): Promise<any> {
    try {
      const response = await AccessRequestAPI.approveAccessRequest(requestId);
      return response.data || response;
    } catch (error) {
      console.error(
        "Error in AccessRequestService.approveAccessRequest:",
        error
      );
      throw error;
    }
  },

  /**
   * Deny access request
   * @param requestId - ID của access request
   * @param data - Lý do từ chối (tùy chọn)
   * @returns Promise<any>
   */
  async denyAccessRequest(
    requestId: string,
    data?: { reason?: string }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    try {
      const response = await AccessRequestAPI.denyAccessRequest(
        requestId,
        data
      );
      return response.data || response;
    } catch (error) {
      console.error("Error in AccessRequestService.denyAccessRequest:", error);
      throw error;
    }
  },

  /**
   * Get my access requests
   * @param params - Parameters for filtering and pagination
   * @returns Promise<any>
   */
  async getMyAccessRequests(params?: {
    status?: string;
    page?: number;
    limit?: number;
    ordering?: string;
    order?: 1 | -1;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }): Promise<any> {
    try {
      const response = await AccessRequestAPI.getMyAccessRequests(params);
      return (
        response || {
          accessRequests: [],
          total: 0,
          page: 1,
          totalPages: 0,
          have_next: false,
        }
      );
    } catch (error) {
      console.error(
        "Error in AccessRequestService.getMyAccessRequests:",
        error
      );
      throw error;
    }
  },

  /**
   * Cancel access request (only requester can cancel)
   * @param requestId - ID của access request
   * @returns Promise<void>
   */
  async cancelAccessRequest(requestId: string): Promise<void> {
    try {
      await AccessRequestAPI.cancelAccessRequest(requestId);
    } catch (error) {
      console.error(
        "Error in AccessRequestService.cancelAccessRequest:",
        error
      );
      throw error;
    }
  },

  /**
   * Get status label in Vietnamese
   * @param status - Access request status
   * @returns string
   */
  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: "Đang chờ xử lý",
      APPROVED: "Đã phê duyệt",
      DENIED: "Đã từ chối",
    };
    return labels[status] || status;
  },

  /**
   * Get status color for UI
   * @param status - Access request status
   * @returns string
   */
  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      PENDING: "warning",
      APPROVED: "success",
      DENIED: "error",
    };
    return colors[status] || "default";
  },

  /**
   * Check if request is actionable (can be approved/denied)
   * @param status - Access request status
   * @returns boolean
   */
  isActionable(status: string): boolean {
    return status === "PENDING";
  },

  /**
   * Check if request can be cancelled
   * @param status - Access request status
   * @returns boolean
   */
  canCancel(status: string): boolean {
    return status === "PENDING";
  },
};

export default AccessRequestService;
