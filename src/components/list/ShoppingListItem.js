import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../../utils/constants';
import { formatPrice } from '../../utils/formatPrice';

export default function ShoppingListItem({ item, onToggle, onDelete, onUpdatePrice }) {
  const [priceText, setPriceText] = useState(priceToInputValue(item.estimatedPrice));
  const [priceError, setPriceError] = useState('');

  useEffect(() => {
    setPriceText(priceToInputValue(item.estimatedPrice));
  }, [item.estimatedPrice]);

  function savePrice() {
    const parsedPrice = parsePrice(priceText);

    if (parsedPrice === undefined) {
      setPriceError('Preis prüfen');
      return;
    }

    setPriceError('');
    onUpdatePrice(item.id, parsedPrice);
  }

  return (
    <View style={styles.row}>
      <Pressable accessibilityRole="checkbox" onPress={onToggle} style={[styles.checkbox, item.checked ? styles.checked : null]}>
        <Text style={styles.checkText}>{item.checked ? '✓' : ''}</Text>
      </Pressable>
      <View style={styles.copy}>
        <Text style={[styles.name, item.checked ? styles.done : null]}>{item.productName}</Text>
        <Text style={styles.meta}>Menge {item.quantity} · {formatPrice(item.estimatedPrice, item.currency || 'CHF')}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.currency}>{item.currency || 'CHF'}</Text>
          <TextInput
            accessibilityLabel={`Preis für ${item.productName}`}
            keyboardType="decimal-pad"
            onBlur={savePrice}
            onChangeText={(value) => {
              setPriceText(value);
              setPriceError('');
            }}
            onSubmitEditing={savePrice}
            placeholder="0.00"
            placeholderTextColor={colors.muted}
            style={styles.priceInput}
            value={priceText}
          />
        </View>
        {priceError ? <Text style={styles.errorText}>{priceError}</Text> : null}
      </View>
      <Pressable accessibilityRole="button" onPress={onDelete} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Löschen</Text>
      </Pressable>
    </View>
  );
}

function priceToInputValue(price) {
  return typeof price === 'number' ? price.toFixed(2) : '';
}

function parsePrice(value) {
  const normalizedValue = value.trim().replace(',', '.');
  const parsedValue = Number(normalizedValue);

  if (!normalizedValue || !Number.isFinite(parsedValue) || parsedValue < 0) {
    return undefined;
  }

  return Math.round(parsedValue * 100) / 100;
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
  priceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 10
  },
  currency: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800'
  },
  priceInput: {
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    fontSize: 14,
    minWidth: 92,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 4
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
