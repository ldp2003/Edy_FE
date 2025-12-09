import { DocumentAPI } from "../api/API";

export const DocumentService = {
  async getAllDocuments(params: {
    search?: string;
    ordering?: string;
    order?: 1 | -1;
    page?: number;
    limit?: number;
    organization?: string;
    publisher?: string;
    published_year?: number;
    intensive?: boolean;
    author?: string | string[];
    user?: string;
    keyword?: string | string[];
    doc_type?: string;
    level?: string;
    subject?: string;
    status?: string;
    public_mode?: string;
  }) {
    try {
      return await DocumentAPI.getAllDocuments(params);
    } catch (error) {
      console.error("Error in DocumentService.getAllDocuments:", error);
      throw error;
    }
  },
  async addViewCount(documentId: string) {
    try {
      return await DocumentAPI.addViewCount(documentId);
    } catch (error) {
      console.error("Error in DocumentService.addViewCount:", error);
      throw error;
    }
  },
  async fetchNewestDocuments(params: {
    search?: string;
    ordering?: string;
    order?: 1 | -1;
    page?: number;
    limit?: number;
    organization?: string;
    publisher?: string;
    published_year?: number;
    intensive?: boolean;
    author?: string | string[];
    user?: string;
    keyword?: string | string[];
    doc_type?: string;
    level?: string;
    subject?: string;
    status?: string;
    public_mode?: string;
  }) {
    try {
      return await DocumentAPI.fetchNewestDocuments(params);
    } catch (error) {
      console.error("Error in DocumentService.fetchNewestDocuments:", error);
      throw error;
    }
  },
  async fetchRecommendedDocuments(params: {
    search?: string;
    ordering?: string;
    order?: 1 | -1;
    page?: number;
    limit?: number;
    organization?: string;
    publisher?: string;
    published_year?: number;
    intensive?: boolean;
    author?: string | string[];
    user?: string;
    keyword?: string | string[];
    doc_type?: string;
    level?: string;
    subject?: string;
    status?: string;
    public_mode?: string;
  }) {
    try {
      return await DocumentAPI.fetchRecommendedDocuments(params);
    } catch (error) {
      console.error(
        "Error in DocumentService.fetchRecommendedDocuments:",
        error
      );
      throw error;
    }
  },
  async fetchFeaturedDocuments(params: {
    search?: string;
    ordering?: string;
    order?: 1 | -1;
    page?: number;
    limit?: number;
    organization?: string;
    publisher?: string;
    published_year?: number;
    intensive?: boolean;
    author?: string | string[];
    user?: string;
    keyword?: string | string[];
    doc_type?: string;
    level?: string;
    subject?: string;
    status?: string;
    public_mode?: string;
  }) {
    try {
      return await DocumentAPI.fetchFeaturedDocuments(params);
    } catch (error) {
      console.error("Error in DocumentService.fetchFeaturedDocuments:", error);
      throw error;
    }
  },
  async getMyDocuments(params?: {
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
    keyword?: string;
    doc_type?: string;
    level?: string;
    subject?: string;
    status?: string;
    public_mode?: string;
    created_from?: string;
    created_to?: string;
  }) {
    try {
      const response = await DocumentAPI.getMyDocuments(params);
      return response;
    } catch (error) {
      console.error("Error in DocumentService.getMyDocuments:", error);
      throw error;
    }
  },

  async getOldDocuments(params?: { page?: number; limit?: number }) {
    try {
      return await DocumentAPI.getOldDocuments(params);
    } catch (error) {
      console.error("Error in DocumentService.getOldDocuments:", error);
      throw error;
    }
  },

  async deleteDocuments(documentIds: string[], reason?: string) {
    try {
      return await DocumentAPI.deleteDocuments(documentIds, reason);
    } catch (error) {
      console.error("Error in DocumentService.deleteDocuments:", error);
      throw error;
    }
  },

  async uploadDocument(documentData: {
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
  }) {
    try {
      return await DocumentAPI.uploadDocument(documentData);
    } catch (error) {
      console.error("Error in DocumentService.uploadDocument:", error);
      throw error;
    }
  },

  async getDocumentById(documentId: string) {
    try {
      return await DocumentAPI.getDocumentById(documentId);
    } catch (error) {
      console.error("Error in DocumentService.getDocumentById:", error);
      throw error;
    }
  },

  async approveDocument(documentId: string) {
    try {
      return await DocumentAPI.approveDocument(documentId);
    } catch (error) {
      console.error("Error in DocumentService.approveDocument:", error);
      throw error;
    }
  },

  async rejectDocument(documentId: string, reason?: string) {
    try {
      return await DocumentAPI.rejectDocument(documentId, reason);
    } catch (error) {
      console.error("Error in DocumentService.rejectDocument:", error);
      throw error;
    }
  },

  async requestEditDocument(documentId: string, reason?: string) {
    try {
      return await DocumentAPI.requestEditDocument(documentId, reason);
    } catch (error) {
      console.error("Error in DocumentService.requestEditDocument:", error);
      throw error;
    }
  },

  async requestEditDirectDocument(documentId: string, reason?: string) {
    try {
      return await DocumentAPI.requestEditDirectDocument(documentId, reason);
    } catch (error) {
      console.error(
        "Error in DocumentService.requestEditDirectDocument:",
        error
      );
      throw error;
    }
  },

  async deleteDocument(documentId: string, reason?: string) {
    try {
      return await DocumentAPI.deleteDocument(documentId, reason);
    } catch (error) {
      console.error("Error in DocumentService.deleteDocument:", error);
      throw error;
    }
  },

  async getPendingDocuments(params?: {
    search?: string;
    title?: string;
    page?: number;
    limit?: number;
    ordering?: string;
    order?: 1 | -1;
    doc_type?: string;
    level?: string;
    intensive?: boolean;
    published_year?: number;
    start_date?: string;
    end_date?: string;
  }) {
    try {
      return await DocumentAPI.getPendingDocuments(params);
    } catch (error) {
      console.error("Error in DocumentService.getPendingDocuments:", error);
      throw error;
    }
  },

  // Lấy danh sách đơn duyệt của một tài liệu
  async getPendingRequestsByDocument(documentId: string) {
    try {
      return await DocumentAPI.getPendingRequests(documentId);
    } catch (error) {
      console.error(
        "Error in DocumentService.getPendingRequestsByDocument:",
        error
      );
      throw error;
    }
  },

  // Duyệt đơn bằng requestId
  async approveDocumentByRequestId(
    requestId: string,
    data?: {
      isIntensive?: boolean;
    }
  ) {
    try {
      return await DocumentAPI.approveDocumentByRequestId(requestId, data);
    } catch (error) {
      console.error(
        "Error in DocumentService.approveDocumentByRequestId:",
        error
      );
      throw error;
    }
  },

  // Từ chối đơn bằng requestId
  async rejectDocumentByRequestId(requestId: string, reason: string) {
    try {
      return await DocumentAPI.rejectDocumentByRequestId(requestId, reason);
    } catch (error) {
      console.error(
        "Error in DocumentService.rejectDocumentByRequestId:",
        error
      );
      throw error;
    }
  },

  // Cập nhật thông tin tài liệu
  async updateDocument(
    documentId: string,
    updateData: {
      title?: string;
      doc_type?: string;
      author?: string[];
      published_year?: number;
      publisher?: string;
      level?: string;
      intensive?: boolean;
      keyword?: string[];
      description?: string;
      page?: number;
    }
  ) {
    try {
      return await DocumentAPI.updateDocument(documentId, updateData);
    } catch (error) {
      console.error("Error in DocumentService.updateDocument:", error);
      throw error;
    }
  },

  // Cập nhật chế độ công khai của tài liệu
  async updateDocumentPublicMode(
    documentId: string,
    public_mode: "PUBLIC" | "PRIVATE" | "PRIVATE_SHARED" | "SHARE_ORGANIZATION"
  ) {
    try {
      return await DocumentAPI.updatePublicMode(documentId, public_mode);
    } catch (error) {
      console.error(
        "Error in DocumentService.updateDocumentPublicMode:",
        error
      );
      throw error;
    }
  },

  // Tạo link tải xuống
  async createDownloadLink(documentId: string) {
    try {
      return await DocumentAPI.createDownloadLink(documentId);
    } catch (error) {
      console.error("Error in DocumentService.createDownloadLink:", error);
      throw error;
    }
  },

  // Tải xuống file bằng link
  async downloadFile(linkId: string) {
    try {
      return await DocumentAPI.downloadFile(linkId);
    } catch (error) {
      console.error("Error in DocumentService.downloadFile:", error);
      throw error;
    }
  },

  // Lấy danh sách share links của tài liệu
  async getShareLinks(documentId: string) {
    try {
      return await DocumentAPI.getShareLinks(documentId);
    } catch (error) {
      console.error("Error in DocumentService.getShareLinks:", error);
      throw error;
    }
  },

  // Tạo share link mới
  async createShareLink(
    documentId: string,
    data: {
      name: string;
      limited_access: number;
      request: boolean;
      time_limited: boolean;
      share_with_organization?: boolean;
      start_date?: string;
      end_date?: string;
    }
  ) {
    try {
      return await DocumentAPI.createShareLink(documentId, data);
    } catch (error) {
      console.error("Error in DocumentService.createShareLink:", error);
      throw error;
    }
  },

  // Cập nhật trạng thái share link
  async updateShareLinkStatus(
    linkId: string,
    status: "ACTIVE" | "INACTIVE" | "DISABLED"
  ) {
    try {
      return await DocumentAPI.updateShareLinkStatus(linkId, status);
    } catch (error) {
      console.error("Error in DocumentService.updateShareLinkStatus:", error);
      throw error;
    }
  },

  // Truy cập share link
  async accessShareLink(linkId: string) {
    try {
      return await DocumentAPI.accessShareLink(linkId);
    } catch (error) {
      console.error("Error in DocumentService.accessShareLink:", error);
      throw error;
    }
  },

  // Lấy danh sách tài liệu tương tự
  async getSimilarDocuments(documentId: string, limit?: number) {
    try {
      return await DocumentAPI.getSimilarDocuments(documentId, limit);
    } catch (error) {
      console.error("Error in DocumentService.getSimilarDocuments:", error);
      throw error;
    }
  },

  async getSimilarDocumentsForAdmin(documentId: string, limit?: number) {
    try {
      return await DocumentAPI.getSimilarDocumentsForAdmin(documentId, limit);
    } catch (error) {
      console.error("Error in DocumentService.getSimilarDocForAdmin:", error);
      throw error;
    }
  },
  // Thực hiện phản ứng với tài liệu (like/dislike/unreact)
  async reactDocument(
    documentId: string,
    reaction: "LIKE" | "DISLIKE" | "UNREACT"
  ) {
    try {
      return await DocumentAPI.reactDocument(documentId, reaction);
    } catch (error) {
      console.error("Error in DocumentService.reactDocument:", error);
      throw error;
    }
  },

  // Lấy thông tin phản ứng của tài liệu
  async getDocumentReactions(documentId: string) {
    try {
      return await DocumentAPI.getDocumentReactions(documentId);
    } catch (error) {
      console.error("Error in DocumentService.getDocumentReactions:", error);
      throw error;
    }
  },
  async getDocumentByUser(
    userId: string,
    params?: {
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
      keyword?: string;
      doc_type?: string;
      level?: string;
      subject?: string;
      status?: string;
      public_mode?: string;
    }
  ) {
    try {
      return await DocumentAPI.getDocumentByUser(userId, params);
    } catch (error) {
      console.error("Error in DocumentService.getDocumentByUser:", error);
      throw error;
    }
  },

  // Create or update edit document
  async createEditDocument(
    documentId: string,
    editData: {
      title?: string;
      doc_type?: string;
      subject?: string;
      author?: string[];
      published_year?: number;
      publisher?: string;
      level?: string;
      keyword?: string[];
      summary_by_user?: string;
      page?: number;
      organization?: string;
      url?: string;
      file_type?: string;
    }
  ) {
    try {
      return await DocumentAPI.createEditDocument(documentId, editData);
    } catch (error) {
      console.error("Error in DocumentService.createEditDocument:", error);
      throw error;
    }
  },

  // Update edit document
  async updateEditDocument(
    editId: string,
    editData: {
      title?: string;
      doc_type?: string;
      subject?: string;
      author?: string[];
      published_year?: number;
      publisher?: string;
      level?: string;
      keyword?: string[];
      summary_by_user?: string;
      page?: number;
      organization?: string;
      url?: string;
      file_type?: string;
    }
  ) {
    try {
      return await DocumentAPI.updateEditDocument(editId, editData);
    } catch (error) {
      console.error("Error in DocumentService.updateEditDocument:", error);
      throw error;
    }
  },

  // Delete edit document
  async deleteEditDocument(editId: string) {
    try {
      return await DocumentAPI.deleteEditDocument(editId);
    } catch (error) {
      console.error("Error in DocumentService.deleteEditDocument:", error);
      throw error;
    }
  },

  // Get edit document by original document
  async getEditDocument(documentId: string) {
    try {
      return await DocumentAPI.getEditDocument(documentId);
    } catch (error) {
      console.error("Error in DocumentService.getEditDocument:", error);
      throw error;
    }
  },

  // Get edit approval by document ID
  async getEditApprovalByDocumentId(documentId: string) {
    try {
      return await DocumentAPI.getEditApprovalByDocumentId(documentId);
    } catch (error) {
      console.error(
        "Error in DocumentService.getEditApprovalByDocumentId:",
        error
      );
      throw error;
    }
  },

  // Handle edit approval (approve/reject)
  async handleEditApproval(
    editApprovalId: string,
    actionData: {
      action: "APPROVE" | "REJECT";
      message?: string;
    }
  ) {
    try {
      return await DocumentAPI.handleEditApproval(editApprovalId, actionData);
    } catch (error) {
      console.error("Error in DocumentService.handleEditApproval:", error);
      throw error;
    }
  },
};

// Legacy exports for backward compatibility
export const getAllDocuments = DocumentService.getAllDocuments;
export const fetchNewestDocuments = DocumentService.fetchNewestDocuments;
export const fetchRecommendedDocuments =
  DocumentService.fetchRecommendedDocuments;
export const fetchFeaturedDocuments = DocumentService.fetchFeaturedDocuments;
export const getMyDocuments = DocumentService.getMyDocuments;
export const getOldDocuments = DocumentService.getOldDocuments;
export const deleteDocuments = DocumentService.deleteDocuments;
