export interface Battle {
  battle_id: string;
  battle_type: 'Battle' | 'Kill List';
  price: number;
  result: 'WIN' | 'LOSE';
  bank_name: string;
  balance_before: number;
  balance_after: number;
  money_printed: boolean;
  battle_date: string;
  created_at: string;
}

export interface CreateBattleRequest {
  battle_type: 'Battle' | 'Kill List';
  price: number;
  result: 'WIN' | 'LOSE';
  bank_name: 'Nabil Bank' | 'Rastriya Banijya Bank';
}

export interface BattleResponse {
  success: boolean;
  message: string;
  battle: Battle;
  updated_balance: number;
}

export interface BattleStats {
  total_battles: number;
  total_wins: number;
  total_losses: number;
  win_rate: number;
  current_win_streak: number;
  best_win_streak: number;
  total_earned: number;
  total_lost: number;
  net_profit: number;
}