import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Category, Transaction } from '../types';
import { categoryColors, categoryEmojis } from '../constants';
import Card from './ui/Card';
import Amount from './ui/Amount';
import CategoryItem from './ui/CategoryItem';
import TransactionInfo from './ui/TransactionInfo';

interface TransactionListItemProps {
  transaction: Transaction;
  categoryInfo: Category;
}
export default function TransactionsListItem({
  transaction,
  categoryInfo,
}: TransactionListItemProps) {
  const iconName =
    transaction.type === 'Expense' ? 'minuscircle' : 'pluscircle';
  const color = transaction.type === 'Expense' ? 'red' : 'green';
  const categoryColor = categoryColors[categoryInfo?.name] ?? 'Default';
  const categoryEmoji = categoryEmojis[categoryInfo?.name] ?? 'Default';

  return (
    <Card>
      <View style={styles.row}>
        <View style={{ width: '40%', gap: 4 }}>
          <Amount
            amount={transaction.amount}
            color={color}
            iconName={iconName}
          />
          <CategoryItem
            categoryColor={categoryColor}
            categoryInfo={categoryInfo}
            emoji={categoryEmoji}
          />
        </View>
        <TransactionInfo
          id={transaction.id}
          date={transaction.date}
          description={transaction.description}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
