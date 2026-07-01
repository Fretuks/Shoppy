import { Image, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../utils/constants';

export default function ProductImage({ imageUrl, size = 'card' }) {
  const style = size === 'large' ? styles.large : styles.card;

  if (!imageUrl) {
    return (
      <View style={[styles.placeholder, style]}>
        <Text style={styles.placeholderText}>Kein Bild</Text>
      </View>
    );
  }

  return (
    <Image
      accessibilityIgnoresInvertColors
      resizeMode="contain"
      source={{ uri: imageUrl }}
      style={[styles.image, style]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1
  },
  card: {
    borderRadius: 8,
    height: 76,
    width: 76
  },
  large: {
    alignSelf: 'center',
    borderRadius: 8,
    height: 220,
    width: '100%'
  },
  placeholder: {
    alignItems: 'center',
    backgroundColor: '#eef3ef',
    borderColor: colors.border,
    borderWidth: 1,
    justifyContent: 'center'
  },
  placeholderText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center'
  }
});
