export interface Bank {
  bank_id: string;
  bank_name: 'Nabil Bank' | 'Rastriya Banijya Bank';
  balance: number;
  is_loan: boolean;
  loan_amount: number;
}

export interface BankTransaction {
  transaction_id: string;
  bank_name: string;
  transaction_type: 'WIN' | 'LOSE';
  amount: number;
  balance_before: number;
  balance_after: number;
  battle_id: string;
  transaction_date: string;
}