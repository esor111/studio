import { apiClient } from '@/lib/api/client';
import { Battle, BattleResponse, BattleStats, CreateBattleRequest } from '@/types/battle';

export class BattleService {
  static async createBattle(battleData: CreateBattleRequest): Promise<BattleResponse> {
    const response = await apiClient.post('/battles', battleData);
    return response.data;
  }

  static async getBattleHistory(page = 1, limit = 20): Promise<Battle[]> {
    const response = await apiClient.get(`/battles/history?page=${page}&limit=${limit}`);
    return response.data;
  }

  static async getBattleStats(): Promise<BattleStats> {
    const response = await apiClient.get('/battles/stats');
    return response.data;
  }

  static async getBattleById(battleId: string): Promise<Battle> {
    const response = await apiClient.get(`/battles/${battleId}`);
    return response.data;
  }
}