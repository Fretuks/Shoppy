import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import AppHeader from '../components/layout/AppHeader';
import ScreenContainer from '../components/layout/ScreenContainer';
import SectionTitle from '../components/layout/SectionTitle';
import ProductImage from '../components/product/ProductImage';
import ProductScoreBadge from '../components/product/ProductScoreBadge';
import RatingCategoryRow from '../components/product/RatingCategoryRow';
import { calculateProductRating } from '../services/ratingService';
import { colors } from '../utils/constants';
import { formatPrice } from '../utils/formatPrice';

export default function ProductDetailScreen({ product, preferences, onBack, onAddToList, onShowAlternatives }) {
  const [savedMessage, setSavedMessage] = useState('');
  const rating = useMemo(() => calculateProductRating(product, preferences), [product, preferences]);

  function addToList() {
    onAddToList(product);
    setSavedMessage('Produkt wurde zur Einkaufsliste hinzugefügt.');
  }

  return (
    <ScreenContainer>
      <AppHeader title="Produktbewertung" subtitle="Persönliche Einschätzung" onBack={onBack} />

      <View style={styles.productPanel}>
        <ProductImage imageUrl={product.imageUrl} size="large" />
        <View style={styles.topRow}>
          <View style={styles.copy}>
            <Text style={styles.brand}>{product.brand || 'Ohne Marke'}</Text>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.meta}>{product.category} · {formatPrice(product.price, product.currency)}</Text>
          </View>
          <ProductScoreBadge status={rating.overallStatus} score={rating.overallScore} />
        </View>
        <Text style={styles.summary}>
          Empfehlung: {rating.overallStatus === 'good' ? 'kaufen' : rating.overallStatus === 'medium' ? 'prüfen' : 'meiden'}.
        </Text>
      </View>

      <SectionTitle>Bewertungskriterien</SectionTitle>
      {Object.entries(rating.categoryScores).map(([category, categoryRating]) => (
        <RatingCategoryRow category={category} key={category} rating={categoryRating} />
      ))}

      <SectionTitle>Produktdaten</SectionTitle>
      <View style={styles.dataPanel}>
        <Text style={styles.dataText}>Barcode: {product.barcode}</Text>
        <Text style={styles.dataText}>Zutaten: {(product.ingredients || []).join(', ') || 'Keine Angaben'}</Text>
        <Text style={styles.dataText}>Allergene: {(product.allergens || []).join(', ') || 'Keine'}</Text>
        <Text style={styles.dataText}>Nutri-Score: {product.nutrition?.nutriScore || 'Keine Angabe'}</Text>
        <Text style={styles.dataText}>Eco-Score: {product.sustainability?.ecoScore || 'Keine Angabe'}</Text>
      </View>

      {savedMessage ? <Text style={styles.saved}>{savedMessage}</Text> : null}
      <PrimaryButton label="Zur Einkaufsliste hinzufügen" onPress={addToList} />
      <SecondaryButton label="Alternative anzeigen" onPress={() => onShowAlternatives(product)} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  productPanel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    padding: 18
  },
  topRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12
  },
  copy: {
    flex: 1
  },
  brand: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  name: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '800',
    lineHeight: 31,
    marginTop: 4
  },
  meta: {
    color: colors.muted,
    fontSize: 15,
    marginTop: 6
  },
  summary: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700'
  },
  dataPanel: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 14
  },
  dataText: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  saved: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '800'
  }
});
