import { create } from 'zustand';

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

export interface BattleForm {
  battle_type: 'Battle' | 'Kill List' | null;
  price: number | null;
  result: 'WIN' | 'LOSE' | null;
  bank_name: 'Nabil Bank' | 'Rastriya Banijya Bank' | null;
}

interface BattleState {
  currentBattle: BattleForm;
  isCreatingBattle: boolean;
  showMoneyAnimation: boolean;
  setCurrentBattle: (battle: Partial<BattleForm>) => void;
  resetCurrentBattle: () => void;
  setIsCreatingBattle: (isCreating: boolean) => void;
  setShowMoneyAnimation: (show: boolean) => void;
}

const initialBattleForm: BattleForm = {
  battle_type: null,
  price: null,
  result: null,
  bank_name: null,
};

export const useBattleStore = create<BattleState>((set) => ({
  currentBattle: initialBattleForm,
  isCreatingBattle: false,
  showMoneyAnimation: false,
  setCurrentBattle: (battle) =>
    set((state) => ({
      currentBattle: { ...state.currentBattle, ...battle },
    })),
  resetCurrentBattle: () => set({ currentBattle: initialBattleForm }),
  setIsCreatingBattle: (isCreating) => set({ isCreatingBattle: isCreating }),
  setShowMoneyAnimation: (show) => set({ showMoneyAnimation: show }),
}));