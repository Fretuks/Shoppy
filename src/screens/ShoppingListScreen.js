import { StyleSheet, Text, View } from 'react-native';

import SecondaryButton from '../components/SecondaryButton';
import AppHeader from '../components/layout/AppHeader';
import ScreenContainer from '../components/layout/ScreenContainer';
import ShoppingListItem from '../components/list/ShoppingListItem';
import { colors } from '../utils/constants';
import { formatPrice } from '../utils/formatPrice';

export default function ShoppingListScreen({ shoppingList, onToggleItem, onDeleteItem, onStartScan, onCompleteList }) {
  const openItems = shoppingList.items.filter((item) => !item.checked).length;

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
      </View>

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
          />
        ))
      )}

      {shoppingList.items.length > 0 ? (
        <SecondaryButton label="Einkauf abschließen" onPress={onCompleteList} />
      ) : null}
    </ScreenContainer>
  );
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
