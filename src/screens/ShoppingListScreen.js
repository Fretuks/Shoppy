import { StyleSheet, Text, View } from 'react-native';

import SecondaryButton from '../components/SecondaryButton';
import AppHeader from '../components/layout/AppHeader';
import ScreenContainer from '../components/layout/ScreenContainer';
import ShoppingListItem from '../components/list/ShoppingListItem';
import { calculateShoppingListWarnings } from '../services/shoppingListWarningsService';
import { budgetPeriodLabels, colors } from '../utils/constants';
import { formatPrice } from '../utils/formatPrice';

export default function ShoppingListScreen({
  preferences,
  shoppingList,
  onToggleItem,
  onDeleteItem,
  onUpdateItemPrice,
  onStartScan,
  onCompleteList
}) {
  const openItems = shoppingList.items.filter((item) => !item.checked).length;
  const budget = preferences.maxBudgetPerShoppingTrip;
  const budgetShare = typeof budget === 'number' && budget > 0 ? shoppingList.estimatedTotal / budget : 0;
  const budgetStatus = budgetShare <= 0.75 ? 'good' : budgetShare <= 1 ? 'medium' : 'critical';
  const dailyWarnings = calculateShoppingListWarnings(shoppingList);

  return (
    <ScreenContainer>
      <AppHeader
        title="Einkaufsliste"
        subtitle={`${openItems} offene Produkte · ${formatPrice(shoppingList.estimatedTotal, shoppingList.currency)}`}
      />

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>{shoppingList.title}</Text>
        <Text style={styles.summaryCopy}>
          Produkte abhaken, löschen oder nach dem Einkauf abschließen.
        </Text>
        <View style={styles.budgetBox}>
          <View style={styles.budgetHeader}>
            <Text style={styles.budgetLabel}>Budget pro {budgetPeriodLabels[preferences.budgetPeriod] || 'Woche'}</Text>
            <Text style={[styles.budgetValue, styles[budgetStatus]]}>
              {formatPrice(shoppingList.estimatedTotal, shoppingList.currency)} von {formatPrice(budget, shoppingList.currency)}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                styles[`${budgetStatus}Fill`],
                { width: `${Math.min(budgetShare * 100, 100)}%` }
              ]}
            />
          </View>
        </View>
      </View>

      {dailyWarnings.length > 0 ? (
        <View style={styles.warningList}>
          {dailyWarnings.map((warning) => (
            <View
              key={warning.key}
              style={[
                styles.warningBox,
                warning.severity === 'critical' ? styles.criticalWarningBox : styles.mediumWarningBox
              ]}
            >
              <Text style={[
                styles.warningTitle,
                warning.severity === 'critical' ? styles.critical : styles.medium
              ]}>
                {warning.label}: {formatAmount(warning.total, warning.unit)} von {formatAmount(warning.limit, warning.unit)}
              </Text>
              <Text style={styles.warningCopy}>{warning.message}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {shoppingList.items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Die Liste ist leer</Text>
          <Text style={styles.emptyCopy}>Scanne ein Produkt und füge es aus der Bewertung heraus hinzu.</Text>
          <SecondaryButton label="Produkt scannen" onPress={onStartScan} />
        </View>
      ) : (
        shoppingList.items.map((item) => (
          <ShoppingListItem
            item={item}
            key={item.id}
            onDelete={() => onDeleteItem(item.id)}
            onToggle={() => onToggleItem(item.id)}
            onUpdatePrice={onUpdateItemPrice}
          />
        ))
      )}

      {shoppingList.items.length > 0 ? (
        <SecondaryButton label="Einkauf abschließen" onPress={onCompleteList} />
      ) : null}
    </ScreenContainer>
  );
}

function formatAmount(value, unit) {
  const roundedValue = unit === 'mg'
    ? Math.round(value)
    : Math.round(value * 10) / 10;

  return `${roundedValue} ${unit}`;
}

const styles = StyleSheet.create({
  summary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 16
  },
  summaryTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '800'
  },
  summaryCopy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4
  },
  budgetBox: {
    marginTop: 14
  },
  budgetHeader: {
    alignItems: 'flex-start',
    gap: 4,
    justifyContent: 'space-between'
  },
  budgetLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '800'
  },
  budgetValue: {
    fontSize: 15,
    fontWeight: '800'
  },
  progressTrack: {
    backgroundColor: '#edf1ee',
    borderRadius: 999,
    height: 10,
    marginTop: 10,
    overflow: 'hidden'
  },
  progressFill: {
    borderRadius: 999,
    height: '100%'
  },
  good: {
    color: colors.success
  },
  medium: {
    color: colors.warning
  },
  critical: {
    color: colors.danger
  },
  goodFill: {
    backgroundColor: colors.success
  },
  mediumFill: {
    backgroundColor: colors.warning
  },
  criticalFill: {
    backgroundColor: colors.danger
  },
  warningList: {
    gap: 10
  },
  warningBox: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    padding: 14
  },
  mediumWarningBox: {
    borderColor: colors.warning
  },
  criticalWarningBox: {
    borderColor: colors.danger
  },
  warningTitle: {
    fontSize: 15,
    fontWeight: '800'
  },
  warningCopy: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4
  },
  empty: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 16
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800'
  },
  emptyCopy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  }
});
