export interface User {
  user_id: string;
  username: string;
  email: string;
  total_battles: number;
  total_wins: number;
  total_losses: number;
  current_win_streak: number;
  best_win_streak: number;
  total_earned: number;
  total_lost: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}