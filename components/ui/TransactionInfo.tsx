import { View, Text, StyleSheet } from 'react-native';

interface TransactionInfoProps {
  id: number;
  date: number;
  description: string;
}

export default function TransactionInfo({
  id,
  date,
  description,
}: TransactionInfoProps) {
  return (
    <View style={{ flexGrow: 1, gap: 6, flexShrink: 1 }}>
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{description}</Text>
      <Text>Transaction number {id}</Text>
      <Text>{new Date(date * 1000).toDateString()}</Text>
    </View>
  );
}
