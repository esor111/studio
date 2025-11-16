import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);