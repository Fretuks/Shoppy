import { StyleSheet, Text, View } from 'react-native';

const labels = {
  good: 'Gut',
  medium: 'Prüfen',
  critical: 'Meiden'
};

const statusStyles = {
  good: {
    backgroundColor: '#dff4e8',
    color: '#1f7a4d'
  },
  medium: {
    backgroundColor: '#fff4d8',
    color: '#9a650f'
  },
  critical: {
    backgroundColor: '#fee4e2',
    color: '#b42318'
  }
};

export default function ProductScoreBadge({ status, score }) {
  const style = statusStyles[status] || statusStyles.medium;

  return (
    <View style={[styles.badge, { backgroundColor: style.backgroundColor }]}>
      <Text style={[styles.text, { color: style.color }]}>
        {labels[status] || 'Prüfen'} · {score}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  text: {
    fontSize: 13,
    fontWeight: '800'
  }
});
