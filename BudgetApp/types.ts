export interface Transaction {
  id: number;
  category_id: number;
  amount: number;
  date: number;
  description: string;
  type: 'Income' | 'Expense';
}

export interface Category {
  id: number;
  name: string;
  type: 'Income' | 'Expense';
}

export interface TransactionsByMonth {
  totalExpenses: number;
  totalIncome: number;
}
