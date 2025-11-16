import { create } from 'zustand';

export interface Bank {
  bank_id: string;
  bank_name: 'Nabil Bank' | 'Rastriya Banijya Bank';
  balance: number;
  is_loan: boolean;
  loan_amount: number;
}

interface BankState {
  banks: Bank[];
  setBanks: (banks: Bank[]) => void;
  updateBankBalance: (bankName: string, newBalance: number) => void;
}

export const useBankStore = create<BankState>((set) => ({
  banks: [],
  setBanks: (banks) => set({ banks }),
  updateBankBalance: (bankName, newBalance) =>
    set((state) => ({
      banks: state.banks.map((bank) =>
        bank.bank_name === bankName
          ? {
              ...bank,
              balance: newBalance,
              is_loan: newBalance < 0,
              loan_amount: newBalance < 0 ? Math.abs(newBalance) : 0,
            }
          : bank
      ),
    })),
}));