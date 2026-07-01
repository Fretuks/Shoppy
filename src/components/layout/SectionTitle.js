import { StyleSheet, Text } from 'react-native';

import { colors } from '../../utils/constants';

export default function SectionTitle({ children }) {
  return <Text style={styles.title}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4
  }
});
