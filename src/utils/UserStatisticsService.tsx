import type { UserStatistics } from "../models/document";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

class UserStatisticsService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  }

  async getMyStatistics(year?: number): Promise<UserStatistics> {
    try {
      const url = year
        ? `${API_BASE_URL}/user-statistics/me?year=${year}`
        : `${API_BASE_URL}/user-statistics/me`;

      const response = await fetch(url, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user statistics:", error);
      throw error;
    }
  }

  async syncMyStatistics(
    year?: number
  ): Promise<{ message: string; lastSyncAt: string }> {
    try {
      const url = year
        ? `${API_BASE_URL}/user-statistics/sync?year=${year}`
        : `${API_BASE_URL}/user-statistics/sync`;

      const response = await fetch(url, {
        method: "POST",
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error syncing user statistics:", error);
      throw error;
    }
  }

  async getStatisticsByYear(year: number): Promise<UserStatistics> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user-statistics/year/${year}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching statistics by year:", error);
      throw error;
    }
  }
}

export const userStatisticsService = new UserStatisticsService();
