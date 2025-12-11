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

      // Debug API response
      this.debugApiResponse(response, "getAccessRequestsByPrivateShare");

      // API trả về cấu trúc: { requests: [...], total, page, totalPages, have_next, privateShare }
      // Chuyển đổi để tương thích với component (accessRequests thay vì requests)
      if (response && response.requests) {
        const result = {
          accessRequests: response.requests, // Map requests -> accessRequests
          total: response.total || 0,
          page: response.page || 1,
          totalPages: response.totalPages || 0,
          have_next: response.have_next || false,
          privateShare: response.privateShare,
        };
        // console.log("🔄 Mapped Response:", result);
        return result;
      }

      // Fallback nếu không có data
      return {
        accessRequests: [],
        total: 0,
        page: 1,
        totalPages: 0,
        have_next: false,
      };
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    try {
      const response = await AccessRequestAPI.denyAccessRequest(
        requestId
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

      // Chuyển đổi cấu trúc nếu API trả về requests thay vì accessRequests
      if (response && response.requests) {
        return {
          accessRequests: response.requests,
          total: response.total || 0,
          page: response.page || 1,
          totalPages: response.totalPages || 0,
          have_next: response.have_next || false,
        };
      }

      // Fallback hoặc nếu đã đúng cấu trúc accessRequests
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

  /**
   * Format user display name
   * @param user - User object or populated user
   * @returns string
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatUserName(user: any): string {
    if (!user) return "Người dùng";
    if (typeof user === "string") return user;
    return (
      `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Người dùng"
    );
  },

  /**
   * Get user email
   * @param user - User object or populated user
   * @returns string
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getUserEmail(user: any): string {
    if (!user) return "Email không có";
    if (typeof user === "string") return "Email không có";
    return user.contact_email || user.email || "Email không có";
  },

  /**
   * Get user avatar
   * @param user - User object or populated user
   * @returns string | null
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getUserAvatar(user: any): string | null {
    if (!user || typeof user === "string") return null;
    return user.avatar || null;
  },

  /**
   * Get user initials for avatar placeholder
   * @param user - User object or populated user
   * @returns string
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getUserInitials(user: any): string {
    if (!user || typeof user === "string") return "U";
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
  },

  /**
   * Debug log API response structure
   * @param response - API response to debug
   * @param context - Context string for logging
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debugApiResponse(response: any, context: string = "API Response"): void {
    console.group(`🔍 ${context}`);
    // console.log("Full Response:", response);
    // console.log("Response Keys:", Object.keys(response || {}));
    if (response?.requests) {
      // console.log("Requests Array:", response.requests);
      // console.log("Number of Requests:", response.requests.length);
      if (response.requests.length > 0) {
        // console.log("First Request Structure:", response.requests[0]);
        // console.log(
        //   "First Request Keys:",
        //   Object.keys(response.requests[0] || {})
        // );
      }
    }
    if (response?.privateShare) {
      // console.log("Private Share Info:", response.privateShare);
    }
    console.groupEnd();
  },
};

export default AccessRequestService;
