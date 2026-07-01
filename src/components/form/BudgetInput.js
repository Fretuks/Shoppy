import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { budgetPeriodLabels, colors } from '../../utils/constants';

const budgetPeriods = ['day', 'week', 'month', 'shoppingTrip'];

export default function BudgetInput({ value, currency, period, onChangePeriod, onChangeValue }) {
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
      <View style={styles.periodGrid}>
        {budgetPeriods.map((option) => {
          const isActive = period === option;
          return (
            <Pressable
              accessibilityRole="button"
              key={option}
              onPress={() => onChangePeriod(option)}
              style={[styles.periodChip, isActive ? styles.activePeriodChip : null]}
            >
              <Text style={[styles.periodText, isActive ? styles.activePeriodText : null]}>
                pro {budgetPeriodLabels[option]}
              </Text>
            </Pressable>
          );
        })}
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
    gap: 10,
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
  },
  periodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  periodChip: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingVertical: 9
  },
  activePeriodChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  periodText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '800'
  },
  activePeriodText: {
    color: colors.surface
  }
});
