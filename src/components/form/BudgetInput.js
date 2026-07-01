import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../../utils/constants';

export default function BudgetInput({ value, currency, onChangeValue }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Maximales Einkaufsbudget</Text>
      <View style={styles.row}>
        <Text style={styles.currency}>{currency}</Text>
        <TextInput
          keyboardType="decimal-pad"
          onChangeText={(text) => onChangeValue(Number(text.replace(',', '.')) || 0)}
          style={styles.input}
          value={String(value ?? '')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 14
  },
  label: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800'
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10
  },
  currency: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: '800'
  },
  input: {
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10
  }
});
