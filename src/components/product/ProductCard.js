import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../utils/constants';
import { formatPrice } from '../../utils/formatPrice';
import ProductImage from './ProductImage';
import ProductScoreBadge from './ProductScoreBadge';

export default function ProductCard({ product, rating, onPress }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.card}>
      <View style={styles.topRow}>
        <ProductImage imageUrl={product.imageUrl} productName={product.name} />
        <View style={styles.copy}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.meta}>
            {product.brand || 'Ohne Marke'} · {formatPrice(product.price, product.currency)}
          </Text>
          <Text style={styles.note}>
            {product.category || 'Produkt'} · Barcode {product.barcode}
          </Text>
          <Text style={styles.source}>{sourceLabel(product.dataSource)}</Text>
        </View>
        {rating ? <ProductScoreBadge status={rating.overallStatus} score={rating.overallScore} /> : null}
      </View>
    </Pressable>
  );
}

function sourceLabel(source) {
  const labels = {
    cache: 'Lokaler Cache',
    local: 'Lokale Beispieldaten',
    'open-food-facts': 'Open Food Facts'
  };

  return labels[source] || 'Quelle unbekannt';
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
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8
  },
  source: {
    alignSelf: 'flex-start',
    backgroundColor: '#eef3ef',
    borderRadius: 8,
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4
  }
});
