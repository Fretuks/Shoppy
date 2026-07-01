import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../utils/constants';

export default function AppHeader({ title, subtitle, onBack, rightAction }) {
  return (
    <View style={styles.header}>
      <View style={styles.row}>
        {onBack ? (
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
        ) : null}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {rightAction ? <View style={styles.rightAction}>{rightAction}</View> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 6
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12
  },
  backButton: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40
  },
  backText: {
    color: colors.primary,
    fontSize: 30,
    lineHeight: 34
  },
  titleBlock: {
    flex: 1
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800'
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
    marginTop: 4
  },
  rightAction: {
    alignItems: 'flex-end'
  }
});
