import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextStyle, StyleSheet } from 'react-native';
import { Category, Transaction, TransactionsByMonth } from '../types';
import { useSQLiteContext } from 'expo-sqlite/next';
import TransactionsList from '../components/TransactionsList';
import Card from '../components/ui/Card';
import AddTransaction from '../components/AddTransaction';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsByMonth, setTransactionsByMonth] =
    useState<TransactionsByMonth>({
      totalIncome: 0,
      totalExpenses: 0,
    });

  const db = useSQLiteContext();

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
    });
  }, [db]);

  async function getData() {
    const transactionResult = await db.getAllAsync<Transaction>(
      `SELECT * FROM Transactions ORDER BY date DESC;`,
    );
    setTransactions(transactionResult);

    const categoriesResult = await db.getAllAsync<Category>(
      `SELECT * FROM Categories;`,
    );
    setCategories(categoriesResult);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setMilliseconds(endOfMonth.getMilliseconds() - 1);

    const startOfMonthTimestamp = Math.floor(startOfMonth.getTime() / 1000);
    const endofMonthTimestamp = Math.floor(endOfMonth.getTime() / 1000);

    const transactionsByMonth = await db.getAllAsync<TransactionsByMonth>(
      `
    SELECT
      COALESCE(SUM(CASE WHEN type = 'Expense' THEN amount ELSE 0 END), 0) AS totalExpenses,
      COALESCE(SUM(CASE WHEN type = 'Income' THEN amount ELSE 0 END), 0) AS totalIncome
    FROM Transactions
    WHERE date >= ? AND date <= ?;
    `,
      [startOfMonthTimestamp, endofMonthTimestamp],
    );
    setTransactionsByMonth(transactionsByMonth[0]);
  }

  function deleteTransaction(id: number) {
    db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Transactions WHERE id = ?;`, [id]);
      await getData();
    });
  }

  async function insertTransaction(transaction: Transaction) {
    db.withTransactionAsync(async () => {
      await db.runAsync(
        `
        INSERT INTO Transactions (amount, description, category_id, date, type) VALUES (?, ?, ?, ?, ?);
        `,
        [
          transaction.amount,
          transaction.description,
          transaction.category_id,
          transaction.date,
          transaction.type,
        ],
      );
      await getData();
    });
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 15, paddingVertical: 170 }}>
      <AddTransaction insertTransaction={insertTransaction} />
      <TransactionSummary
        totalIncome={transactionsByMonth.totalIncome}
        totalExpenses={transactionsByMonth.totalExpenses}
      />
      <TransactionsList
        categories={categories}
        transactions={transactions}
        deleteTransaction={deleteTransaction}
      />
    </ScrollView>
  );
}

function TransactionSummary({
  totalIncome,
  totalExpenses,
}: TransactionsByMonth) {
  const savings = totalIncome - totalExpenses;
  const readablePeriod = new Date().toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const getMoneyTextStyle = (value: number): TextStyle => ({
    fontWeight: 'bold',
    color: value < 0 ? '#ff4500' : '#2e8b57', // red for negative, green for positive
  });

  //helper function to format money values
  const formatMoney = (value: number) => {
    const absValue = Math.abs(value).toFixed(2);
    return `${value < 0 ? '-' : ''}$${absValue}`;
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.periodTitle}>Summary for {readablePeriod}</Text>
      <Text style={styles.periodTitle}>
        Income:{' '}
        <Text style={getMoneyTextStyle(totalIncome)}>
          {formatMoney(totalIncome)}
        </Text>
      </Text>
      <Text style={styles.summaryText}>
        Total Expenses:{' '}
        <Text style={getMoneyTextStyle(totalExpenses)}>
          {formatMoney(totalExpenses)}
        </Text>
      </Text>
      <Text style={styles.summaryText}>
        Savings:{' '}
        <Text style={getMoneyTextStyle(savings)}>{formatMoney(savings)}</Text>
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    paddingBottom: 7,
    // Add other container styles as necessary
  },
  periodTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  summaryText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  // Removed moneyText style since we're now generating it dynamically
});
