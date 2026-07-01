import { Modal, StyleSheet, Text, View } from 'react-native';

import PrimaryButton from '../PrimaryButton';
import SecondaryButton from '../SecondaryButton';
import { colors } from '../../utils/constants';

export default function ScanErrorModal({ visible, message, onRetry, onManualSearch, onClose }) {
  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <Text style={styles.title}>Scan nicht erfolgreich</Text>
          <Text style={styles.message}>{message}</Text>
          <PrimaryButton label="Erneut scannen" onPress={onRetry} />
          <SecondaryButton label="Manuell eingeben" onPress={onManualSearch} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    flex: 1,
    justifyContent: 'center',
    padding: 24
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    gap: 14,
    padding: 20,
    width: '100%'
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800'
  },
  message: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21
  }
});
