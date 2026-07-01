import { StyleSheet, Text, View } from 'react-native';

import PrimaryButton from '../components/PrimaryButton';
import AppHeader from '../components/layout/AppHeader';
import ScreenContainer from '../components/layout/ScreenContainer';
import SectionTitle from '../components/layout/SectionTitle';
import ProductCard from '../components/product/ProductCard';
import { calculateProductRating } from '../services/ratingService';
import { colors } from '../utils/constants';

export default function HomeScreen({ preferences, recentProducts, onStartScan, onOpenProduct }) {
  return (
    <ScreenContainer>
      <AppHeader
        title="Shoppy"
        subtitle="Scanne Produkte im Supermarkt und erhalte eine persönliche Kaufempfehlung."
      />

      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Smart Shopping Companion</Text>
        <Text style={styles.title}>Bereit für den nächsten Einkauf?</Text>
        <Text style={styles.copy}>
          Prüfe Allergien, Ernährung, Budget und Nachhaltigkeit direkt am Regal.
        </Text>
        <PrimaryButton label="Produkt scannen" onPress={onStartScan} />
      </View>

      <SectionTitle>Letzte Scans</SectionTitle>
      {recentProducts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Noch keine Produkte gescannt</Text>
          <Text style={styles.emptyCopy}>Starte einen Scan oder nutze die manuelle Suche.</Text>
        </View>
      ) : (
        recentProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            rating={calculateProductRating(product, preferences)}
            onPress={() => onOpenProduct(product)}
          />
        ))
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 18
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  title: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '800',
    lineHeight: 31
  },
  copy: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    padding: 18
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800'
  },
  emptyCopy: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4
  }
});
