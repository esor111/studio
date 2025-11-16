import { useQuery } from '@tanstack/react-query';
import { BankService } from '@/services/bank.service';

export function useBanks() {
  return useQuery({
    queryKey: ['banks'],
    queryFn: () => BankService.getBanks(),
  });
}

export function useTransactionHistory(bankName?: string) {
  return useQuery({
    queryKey: ['banks', 'transactions', bankName],
    queryFn: () => BankService.getTransactionHistory(bankName),
  });
}