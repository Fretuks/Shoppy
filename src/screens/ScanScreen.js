import { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useCameraPermissions } from 'expo-camera';

import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import ManualSearchInput from '../components/form/ManualSearchInput';
import AppHeader from '../components/layout/AppHeader';
import ScreenContainer from '../components/layout/ScreenContainer';
import SectionTitle from '../components/layout/SectionTitle';
import ProductCard from '../components/product/ProductCard';
import BarcodeScannerView from '../components/scan/BarcodeScannerView';
import ScanErrorModal from '../components/scan/ScanErrorModal';
import { searchProducts } from '../services/productApi';
import { calculateProductRating } from '../services/ratingService';
import { colors } from '../utils/constants';

export default function ScanScreen({ preferences, productCache, onScanBarcode, onOpenProduct }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [scanError, setScanError] = useState('');
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [manualSearchQuery, setManualSearchQuery] = useState('');
  const [manualResults, setManualResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  async function handleBarcodeScanned(event) {
    if (!isScanning) return;

    setIsScanning(false);
    setIsLoadingProduct(true);
    const result = await onScanBarcode(event.data).finally(() => {
      setIsLoadingProduct(false);
    });

    if (result?.status !== 'found') {
      setScanError(result?.errorMessage || 'Der Barcode konnte nicht verarbeitet werden.');
      setIsErrorModalVisible(true);
    }
  }

  async function handleManualSearch() {
    setIsSearching(true);
    const results = await searchProducts(manualSearchQuery, productCache, preferences.offlineModeEnabled);
    setManualResults(results);
    setIsSearching(false);
  }

  function retryScan() {
    setIsErrorModalVisible(false);
    setScanError('');
    setIsScanning(true);
  }

  const hasCameraAccess = permission?.granted && Platform.OS !== 'web';

  return (
    <ScreenContainer>
      <AppHeader
        title="Scan"
        subtitle={preferences.offlineModeEnabled ? 'Offline-Modus aktiv: nur Cache-Produkte verfügbar.' : 'Barcode scannen oder Produkt manuell suchen.'}
      />

      {!permission?.granted && Platform.OS !== 'web' ? (
        <View style={styles.permissionBox}>
          <Text style={styles.permissionTitle}>Kamera-Berechtigung benötigt</Text>
          <Text style={styles.permissionCopy}>
            Shoppy braucht die Kamera, um Barcodes direkt im Laden zu erfassen.
          </Text>
          <PrimaryButton label="Kamera erlauben" onPress={requestPermission} />
        </View>
      ) : null}

      {hasCameraAccess ? (
        <>
          <BarcodeScannerView isLoadingProduct={isLoadingProduct} isScanning={isScanning} onBarcodeScanned={handleBarcodeScanned} />
          <SecondaryButton
            label={isScanning ? 'Scan pausieren' : 'Scan fortsetzen'}
            onPress={() => setIsScanning((current) => !current)}
          />
        </>
      ) : (
        <View style={styles.permissionBox}>
          <Text style={styles.permissionTitle}>Scanner-Simulation</Text>
          <Text style={styles.permissionCopy}>
            Auf Web oder ohne Kamera kannst du Open-Food-Facts-Barcodes testen.
          </Text>
          {isLoadingProduct ? <Text style={styles.note}>Produkt wird geladen...</Text> : null}
          <View style={styles.demoRow}>
            <SecondaryButton label="Nutella" onPress={() => handleBarcodeScanned({ data: '3017620422003' })} />
            <SecondaryButton label="OpenFoodFacts Beispiel" onPress={() => handleBarcodeScanned({ data: '737628064502' })} />
          </View>
        </View>
      )}

      <SectionTitle>Manuelle Suche</SectionTitle>
      <ManualSearchInput
        onChangeText={setManualSearchQuery}
        onSubmit={handleManualSearch}
        value={manualSearchQuery}
      />
      {isSearching ? <Text style={styles.note}>Suche läuft...</Text> : null}
      {!isSearching && manualSearchQuery && manualResults.length === 0 ? (
        <Text style={styles.note}>Keine Treffer gefunden.</Text>
      ) : null}
      {manualResults.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          rating={calculateProductRating(product, preferences)}
          onPress={() => onOpenProduct(product)}
        />
      ))}

      <ScanErrorModal
        message={scanError}
        onClose={retryScan}
        onManualSearch={() => setIsErrorModalVisible(false)}
        onRetry={retryScan}
        visible={isErrorModalVisible}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  permissionBox: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 16
  },
  permissionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800'
  },
  permissionCopy: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21
  },
  demoRow: {
    gap: 10
  },
  note: {
    color: colors.muted,
    fontSize: 14
  }
});
