import { StyleSheet, Text, View } from 'react-native';

import PrimaryButton from '../PrimaryButton';
import { colors } from '../../utils/constants';
import ProductCard from './ProductCard';

export default function AlternativeProductCard({ item, onChoose, onOpen }) {
  return (
    <View style={styles.wrap}>
      <ProductCard product={item.product} rating={item.rating} onPress={onOpen} />
      <Text style={styles.reason}>{item.reason}</Text>
      <PrimaryButton label="Beste Alternative wählen" onPress={onChoose} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 10
  },
  reason: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  }
});
