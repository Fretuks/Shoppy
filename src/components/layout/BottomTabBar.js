import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../utils/constants';

const tabs = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'scan', label: 'Scan', icon: '□' },
  { id: 'list', label: 'Liste', icon: '✓' },
  { id: 'profile', label: 'Profil', icon: '◦' }
];

export default function BottomTabBar({ activeTab, onChange }) {
  return (
    <View style={styles.wrap}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Pressable
            accessibilityRole="button"
            key={tab.id}
            onPress={() => onChange(tab.id)}
            style={[styles.tab, isActive ? styles.activeTab : null]}
          >
            <Text style={[styles.icon, isActive ? styles.activeText : null]}>{tab.icon}</Text>
            <Text style={[styles.label, isActive ? styles.activeText : null]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderTopWidth: 1,
    bottom: 0,
    flexDirection: 'row',
    gap: 8,
    left: 0,
    padding: 10,
    position: 'absolute',
    right: 0
  },
  tab: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    gap: 2,
    paddingVertical: 8
  },
  activeTab: {
    backgroundColor: '#e5f1ec'
  },
  icon: {
    color: colors.muted,
    fontSize: 18,
    fontWeight: '800'
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700'
  },
  activeText: {
    color: colors.primary
  }
});
