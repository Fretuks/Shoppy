import { CameraView } from 'expo-camera';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../utils/constants';

export default function BarcodeScannerView({ isLoadingProduct, isScanning, onBarcodeScanned }) {
  return (
    <View style={styles.wrap}>
      <CameraView
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'qr']
        }}
        onBarcodeScanned={isScanning ? onBarcodeScanned : undefined}
        style={styles.camera}
      >
        <View style={styles.overlay}>
          <View style={styles.frame} />
          <Text style={styles.hint}>
            {isLoadingProduct ? 'Produkt wird geladen...' : 'Barcode in den Rahmen halten. Bei Problemen manuell suchen.'}
          </Text>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#000000',
    borderRadius: 8,
    height: 320,
    overflow: 'hidden'
  },
  camera: {
    flex: 1
  },
  overlay: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24
  },
  frame: {
    borderColor: colors.surface,
    borderRadius: 8,
    borderWidth: 3,
    height: 150,
    width: '82%'
  },
  hint: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderRadius: 8,
    color: colors.surface,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 18,
    padding: 10,
    textAlign: 'center'
  }
});
