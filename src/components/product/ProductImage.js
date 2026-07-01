import { Image, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../utils/constants';

export default function ProductImage({ imageUrl, productName, size = 'card' }) {
  const style = size === 'large' ? styles.large : styles.card;

  if (!imageUrl) {
    return (
      <View style={[styles.placeholder, style]}>
        <Text style={[styles.placeholderText, size === 'large' ? styles.largePlaceholderText : null]}>
          {initialsFromName(productName)}
        </Text>
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

function initialsFromName(name) {
  const words = String(name || 'Produkt')
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);

  return words.slice(0, 2).map((word) => word[0].toUpperCase()).join('');
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
    color: colors.primaryDark,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center'
  },
  largePlaceholderText: {
    fontSize: 54
  }
});
