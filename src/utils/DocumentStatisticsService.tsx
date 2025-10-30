import { DocumentStatisticsAPI } from "../api/API";
import type { DocumentStatistics } from "../models/documentStatistics";

class DocumentStatisticsService {
  // Get document statistics for a specific year and month
  async getDocumentStatistics(params?: {
    year?: number;
    month?: number;
  }): Promise<DocumentStatistics> {
    try {
      const response = await DocumentStatisticsAPI.getDocumentStatistics(
        params
      );
      return response.data || response;
    } catch (error) {
      console.error(
        "Error in DocumentStatisticsService.getDocumentStatistics:",
        error
      );
      throw error;
    }
  }

  // Sync statistics for a specific month/year
  async syncMonthStatistics(params?: {
    year?: number;
    month?: number;
  }): Promise<void> {
    try {
      const response = await DocumentStatisticsAPI.syncMonthStatistics(params);
      return response.data || response;
    } catch (error) {
      console.error(
        "Error in DocumentStatisticsService.syncMonthStatistics:",
        error
      );
      throw error;
    }
  }

  // Sync all statistics for the entire system
  async syncAllStatistics(): Promise<void> {
    try {
      const response = await DocumentStatisticsAPI.syncAllStatistics();
      return response.data || response;
    } catch (error) {
      console.error(
        "Error in DocumentStatisticsService.syncAllStatistics:",
        error
      );
      throw error;
    }
  }
}

export const documentStatisticsService = new DocumentStatisticsService();
