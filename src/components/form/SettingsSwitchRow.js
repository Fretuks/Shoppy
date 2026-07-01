import { StyleSheet, Switch, Text, View } from 'react-native';

import { colors } from '../../utils/constants';

export default function SettingsSwitchRow({ label, description, value, onValueChange }) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Switch
        onValueChange={onValueChange}
        thumbColor={value ? colors.primary : '#f4f3f4'}
        trackColor={{ false: colors.border, true: '#b7dbcf' }}
        value={value}
      />
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
  label: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800'
  },
  description: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 3
  }
});
