import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import PrimaryButton from '../components/PrimaryButton';

export default function HomeScreen() {
  const [status, setStatus] = useState('Bereit für deinen ersten Produkt-Scan.');

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Smart Shopping Companion</Text>
        <Text style={styles.title}>Shoppy</Text>
        <Text style={styles.subtitle}>
          Scanne Produkte im Supermarkt und erhalte eine persönliche Kaufempfehlung.
        </Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Startseite</Text>
        <Text style={styles.status}>{status}</Text>
        <PrimaryButton
          label="Produkt scannen"
          onPress={() => setStatus('Demo-Status: Scanner und Bewertung werden vorbereitet.')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    padding: 24
  },
  header: {
    marginBottom: 28
  },
  eyebrow: {
    color: '#256f5b',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  title: {
    color: '#18201d',
    fontSize: 42,
    fontWeight: '800',
    marginBottom: 10
  },
  subtitle: {
    color: '#4f5f59',
    fontSize: 17,
    lineHeight: 24
  },
  panel: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    gap: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: {
      height: 4,
      width: 0
    },
    shadowOpacity: 0.08,
    shadowRadius: 12
  },
  panelTitle: {
    color: '#18201d',
    fontSize: 20,
    fontWeight: '700'
  },
  status: {
    color: '#4f5f59',
    fontSize: 16,
    lineHeight: 22
  }
});
