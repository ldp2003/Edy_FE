import type { UserStatistics } from "../models/document";
import { UserStatisticsAPI } from "../api/API";

class UserStatisticsService {
  async getMyStatistics(year?: number): Promise<UserStatistics> {
    return await UserStatisticsAPI.getMyStatistics(year);
  }

  async syncMyStatistics(
    year?: number
  ): Promise<{ message: string; lastSyncAt: string }> {
    return await UserStatisticsAPI.syncMyStatistics(year);
  }

  async getStatisticsByYear(year: number): Promise<UserStatistics> {
    return await UserStatisticsAPI.getStatisticsByYear(year);
  }
}

export const userStatisticsService = new UserStatisticsService();
