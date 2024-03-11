import { View, Text, StyleSheet } from 'react-native';
import { Category } from '../../types';

interface CategoryItemProps {
  categoryColor: string;
  categoryInfo: Category | undefined;
  emoji: string;
}

export default function CategoryItem({
  categoryColor,
  categoryInfo,
  emoji,
}: CategoryItemProps) {
  return (
    <View
      style={[
        styles.categoryContainer,
        { backgroundColor: categoryColor + '40' },
      ]}
    >
      <Text style={styles.categoryText}>
        {emoji} {categoryInfo?.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryContainer: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
  },
});
