import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import AppHeader from '../components/layout/AppHeader';
import ScreenContainer from '../components/layout/ScreenContainer';
import AlternativeProductCard from '../components/product/AlternativeProductCard';
import { findAlternatives } from '../services/alternativesService';
import { colors } from '../utils/constants';

export default function AlternativesScreen({ product, preferences, productCache, onBack, onChoose, onOpenProduct }) {
  const [alternatives, setAlternatives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAlternatives() {
      setIsLoading(true);
      const results = await findAlternatives(product, preferences, productCache);
      if (isMounted) {
        setAlternatives(results);
        setIsLoading(false);
      }
    }

    loadAlternatives();
    return () => {
      isMounted = false;
    };
  }, [product, preferences, productCache]);

  return (
    <ScreenContainer>
      <AppHeader
        title="Alternativen"
        subtitle={`Bessere Optionen für ${product.name}`}
        onBack={onBack}
      />

      {isLoading ? <Text style={styles.note}>Alternativen werden berechnet...</Text> : null}
      {!isLoading && alternatives.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Keine Alternative gefunden</Text>
          <Text style={styles.emptyCopy}>Für dieses Produkt gibt es im lokalen Beispieldatensatz noch keinen besseren Vorschlag.</Text>
        </View>
      ) : null}

      {alternatives.map((item) => (
        <AlternativeProductCard
          item={item}
          key={item.product.id}
          onChoose={() => {
            if (typeof item.product.price === 'number') {
              onChoose(item.product);
              return;
            }

            onOpenProduct(item.product);
          }}
          onOpen={() => onOpenProduct(item.product)}
        />
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  note: {
    color: colors.muted,
    fontSize: 14
  },
  empty: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
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
    lineHeight: 20,
    marginTop: 4
  }
});
