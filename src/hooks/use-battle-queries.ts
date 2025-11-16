import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BattleService } from '@/services/battle.service';
import { CreateBattleRequest } from '@/types/battle';
import { useBattleStore } from '@/store/battle-store';
import { useBankStore } from '@/store/bank-store';

export function useBattleHistory() {
  return useQuery({
    queryKey: ['battles', 'history'],
    queryFn: () => BattleService.getBattleHistory(),
  });
}

export function useBattleStats() {
  return useQuery({
    queryKey: ['battles', 'stats'],
    queryFn: () => BattleService.getBattleStats(),
  });
}

export function useCreateBattle() {
  const queryClient = useQueryClient();
  const { setShowMoneyAnimation, resetCurrentBattle } = useBattleStore();
  const { updateBankBalance } = useBankStore();

  return useMutation({
    mutationFn: (battleData: CreateBattleRequest) => 
      BattleService.createBattle(battleData),
    onSuccess: (data) => {
      // Update bank balance
      updateBankBalance(data.battle.bank_name, data.updated_balance);
      
      // Show money animation for wins
      if (data.battle.result === 'WIN') {
        setShowMoneyAnimation(true);
      }
      
      // Reset battle form
      resetCurrentBattle();
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['battles'] });
      queryClient.invalidateQueries({ queryKey: ['banks'] });
    },
  });
}