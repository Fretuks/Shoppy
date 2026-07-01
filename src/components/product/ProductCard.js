import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../utils/constants';
import { formatPrice } from '../../utils/formatPrice';
import ProductScoreBadge from './ProductScoreBadge';

export default function ProductCard({ product, rating, onPress }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.copy}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.meta}>{product.brand || 'Ohne Marke'} · {formatPrice(product.price, product.currency)}</Text>
        </View>
        {rating ? <ProductScoreBadge status={rating.overallStatus} score={rating.overallScore} /> : null}
      </View>
      <Text style={styles.note}>{product.category || 'Produkt'} · Barcode {product.barcode}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 16
  },
  topRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12
  },
  copy: {
    flex: 1
  },
  name: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '800'
  },
  meta: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 4
  },
  note: {
    color: colors.muted,
    fontSize: 13
  }
});
