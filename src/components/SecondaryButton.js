import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../utils/constants';

export default function SecondaryButton({ label, onPress, disabled = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed ? styles.buttonPressed : null,
        disabled ? styles.disabled : null
      ]}
    >
      <Text style={[styles.label, disabled ? styles.disabledLabel : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderColor: colors.primary,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 12
  },
  buttonPressed: {
    opacity: 0.75
  },
  disabled: {
    borderColor: colors.border
  },
  label: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700'
  },
  disabledLabel: {
    color: colors.muted
  }
});
