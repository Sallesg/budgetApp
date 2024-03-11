import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AutoSizeText, ResizeTextMode } from 'react-native-auto-size-text';
import { AntDesign } from '@expo/vector-icons';

interface AmountProps {
  iconName: 'minuscircle' | 'pluscircle';
  color: string;
  amount: number;
}

export default function Amount({ iconName, color, amount }: AmountProps) {
  return (
    <View style={styles.row}>
      <AntDesign name={iconName} size={18} color={color} />
      <AutoSizeText
        fontSize={32}
        mode={ResizeTextMode.max_lines}
        numberOfLines={1}
        style={[styles.amount, { maxWidth: '80%' }]}
      >
        ${amount}
      </AutoSizeText>
    </View>
  );
}

const styles = StyleSheet.create({
  amount: {
    fontSize: 32,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
