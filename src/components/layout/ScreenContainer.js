import { ScrollView, StyleSheet, View } from 'react-native';

import { colors } from '../../utils/constants';

export default function ScreenContainer({ children, scroll = true }) {
  if (!scroll) {
    return <View style={styles.container}>{children}</View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.container}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1
  },
  content: {
    gap: 18,
    padding: 20,
    paddingBottom: 110
  }
});
