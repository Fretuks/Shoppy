import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../utils/constants';
import ProductScoreBadge from './ProductScoreBadge';

const labels = {
  allergies: 'Allergien',
  budget: 'Budget',
  nutrition: 'Ernährung',
  sustainability: 'Nachhaltigkeit'
};

export default function RatingCategoryRow({ category, rating }) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text style={styles.title}>{labels[category] || category}</Text>
        <Text style={styles.message}>{rating.message}</Text>
        {(rating.missingData || []).map((message) => (
          <Text key={message} style={styles.missingData}>{message}</Text>
        ))}
      </View>
      <ProductScoreBadge status={rating.status} score={rating.score} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14
  },
  copy: {
    flex: 1
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4
  },
  message: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20
  },
  missingData: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: 4
  }
});
