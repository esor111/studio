import { apiClient } from '@/lib/api/client';
import { Bank, BankTransaction } from '@/types/bank';

export class BankService {
  static async getBanks(): Promise<Bank[]> {
    const response = await apiClient.get('/banks');
    return response.data;
  }

  static async getBankById(bankId: string): Promise<Bank> {
    const response = await apiClient.get(`/banks/${bankId}`);
    return response.data;
  }

  static async getTransactionHistory(bankName?: string): Promise<BankTransaction[]> {
    const url = bankName ? `/banks/transactions?bank=${bankName}` : '/banks/transactions';
    const response = await apiClient.get(url);
    return response.data;
  }
}