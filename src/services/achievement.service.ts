import { apiClient } from '@/lib/api/client';
import { Achievement, Quote } from '@/types/achievement';

export class AchievementService {
  static async getAchievements(): Promise<Achievement[]> {
    const response = await apiClient.get('/achievements');
    return response.data;
  }

  static async markAchievementAsViewed(achievementId: string): Promise<void> {
    await apiClient.patch(`/achievements/${achievementId}/viewed`);
  }

  static async getQuotes(): Promise<Quote[]> {
    const response = await apiClient.get('/quotes');
    return response.data;
  }

  static async getRandomQuote(): Promise<Quote> {
    const response = await apiClient.get('/quotes/random');
    return response.data;
  }
}