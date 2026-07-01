import { Pressable, StyleSheet, Text } from 'react-native';

export default function PrimaryButton({ label, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed ? styles.buttonPressed : null
      ]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#256f5b',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 14
  },
  buttonPressed: {
    opacity: 0.82
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700'
  }
});
