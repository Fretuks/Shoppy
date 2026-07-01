import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../utils/constants';
import { formatPrice } from '../../utils/formatPrice';

export default function ShoppingListItem({ item, onToggle, onDelete }) {
  return (
    <View style={styles.row}>
      <Pressable accessibilityRole="checkbox" onPress={onToggle} style={[styles.checkbox, item.checked ? styles.checked : null]}>
        <Text style={styles.checkText}>{item.checked ? '✓' : ''}</Text>
      </Pressable>
      <View style={styles.copy}>
        <Text style={[styles.name, item.checked ? styles.done : null]}>{item.productName}</Text>
        <Text style={styles.meta}>Menge {item.quantity} · {formatPrice(item.estimatedPrice, 'CHF')}</Text>
      </View>
      <Pressable accessibilityRole="button" onPress={onDelete} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Löschen</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14
  },
  checkbox: {
    alignItems: 'center',
    borderColor: colors.primary,
    borderRadius: 6,
    borderWidth: 2,
    height: 28,
    justifyContent: 'center',
    width: 28
  },
  checked: {
    backgroundColor: colors.primary
  },
  checkText: {
    color: colors.surface,
    fontWeight: '800'
  },
  copy: {
    flex: 1
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800'
  },
  done: {
    textDecorationLine: 'line-through'
  },
  meta: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 3
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 6
  },
  deleteText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '800'
  }
});
