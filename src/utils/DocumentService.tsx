import { DocumentAPI } from "../api/API";

export const DocumentService = {
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
    author?: string;
    user?: string;
    keyword?: string;
    doc_type?: string;
    level?: string;
    subject?: string;
  }) {
    try {
      return await DocumentAPI.fetchNewestDocuments(params);
    } catch (error) {
      console.error("Error in DocumentService.fetchNewestDocuments:", error);
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

  async deleteDocument(documentId: string, reason?: string) {
    try {
      return await DocumentAPI.deleteDocument(documentId, reason);
    } catch (error) {
      console.error("Error in DocumentService.deleteDocument:", error);
      throw error;
    }
  },

  async getPendingDocuments(params?: {
    page?: number;
    limit?: number;
    ordering?: string;
    order?: 1 | -1;
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
};
