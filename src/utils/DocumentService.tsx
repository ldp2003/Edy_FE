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
};
