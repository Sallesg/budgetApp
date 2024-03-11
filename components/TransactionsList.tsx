import { TouchableOpacity, View, Text } from 'react-native';
import { Category, Transaction } from '../types';
import TransactionsListItem from './TransactionListItem';

export default function TransactionsList({
  transactions,
  categories,
  deleteTransaction,
}: {
  categories: Category[];
  transactions: Transaction[];
  deleteTransaction: (id: number) => void;
}) {
  function categoryForCurrentItem(id: number): Category | undefined {
    return categories.find((category) => category.id === id);
  }

  return (
    <View style={{ gap: 14 }}>
      {transactions.map((transaction) => (
        <TouchableOpacity
          key={transaction.id}
          activeOpacity={0.7}
          onLongPress={() => deleteTransaction(transaction.id)}
        >
          <TransactionsListItem
            transaction={transaction}
            categoryInfo={categoryForCurrentItem(transaction.category_id)}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}
