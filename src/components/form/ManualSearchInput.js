import { StyleSheet, TextInput, View } from 'react-native';

import PrimaryButton from '../PrimaryButton';
import { colors } from '../../utils/constants';

export default function ManualSearchInput({ value, onChangeText, onSubmit, placeholder = 'Produktname oder Barcode' }) {
  return (
    <View style={styles.row}>
      <TextInput
        autoCapitalize="none"
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        returnKeyType="search"
        style={styles.input}
        value={value}
      />
      <PrimaryButton label="Suchen" onPress={onSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 10
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12
  }
});
