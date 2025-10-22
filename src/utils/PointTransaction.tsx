import { PointTransactionAPI } from "../api/API";

export const PointTransactionService = {
  /**
   * Get point transaction history for a user
   * @param userId - ID of the user
   * @param params - Query parameters (page, limit)
   * @returns Promise with transaction history data
   */
  async getTransactionHistory(
    userId: string,
    params?: {
      page?: number;
      limit?: number;
    }
  ) {
    try {
      const response = await PointTransactionAPI.getTransactionHistory(
        userId,
        params
      );
      console.log("Fetched point transaction history:", response);
      return response;
    } catch (error) {
      console.error(
        "Error in PointTransactionService.getTransactionHistory:",
        error
      );
      throw error;
    }
  },
};

// Legacy export for backward compatibility
export const getTransactionHistory =
  PointTransactionService.getTransactionHistory;
