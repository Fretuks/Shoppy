import { Pressable, StyleSheet, Text, View } from 'react-native';

import BudgetInput from '../components/form/BudgetInput';
import SettingsSwitchRow from '../components/form/SettingsSwitchRow';
import AppHeader from '../components/layout/AppHeader';
import ScreenContainer from '../components/layout/ScreenContainer';
import SectionTitle from '../components/layout/SectionTitle';
import { colors, dietLabels } from '../utils/constants';

const dietOptions = ['none', 'vegetarian', 'vegan', 'lowSugar', 'highProtein'];
const priorityOptions = ['low', 'medium', 'high'];

export default function ProfileScreen({ preferences, onChangePreferences }) {
  function updatePreference(key, value) {
    onChangePreferences({
      ...preferences,
      [key]: value
    });
  }

  function toggleAllergen(allergen) {
    const current = preferences.avoidAllergens || [];
    const nextAllergens = current.includes(allergen)
      ? current.filter((item) => item !== allergen)
      : [...current, allergen];
    updatePreference('avoidAllergens', nextAllergens);
  }

  return (
    <ScreenContainer>
      <AppHeader
        title="Profil"
        subtitle="Präferenzen steuern die Produktbewertung global."
      />

      <SectionTitle>Ernährungsziel</SectionTitle>
      <View style={styles.optionGrid}>
        {dietOptions.map((option) => (
          <Pressable
            accessibilityRole="button"
            key={option}
            onPress={() => updatePreference('preferredDiet', option)}
            style={[styles.chip, preferences.preferredDiet === option ? styles.activeChip : null]}
          >
            <Text style={[styles.chipText, preferences.preferredDiet === option ? styles.activeChipText : null]}>
              {dietLabels[option]}
            </Text>
          </Pressable>
        ))}
      </View>

      <SectionTitle>Allergien vermeiden</SectionTitle>
      <View style={styles.optionGrid}>
        {['Erdnüsse', 'Milch', 'Hafer', 'Gluten'].map((allergen) => {
          const isActive = preferences.avoidAllergens?.includes(allergen);
          return (
            <Pressable
              accessibilityRole="button"
              key={allergen}
              onPress={() => toggleAllergen(allergen)}
              style={[styles.chip, isActive ? styles.dangerChip : null]}
            >
              <Text style={[styles.chipText, isActive ? styles.dangerChipText : null]}>{allergen}</Text>
            </Pressable>
          );
        })}
      </View>

      <BudgetInput
        currency={preferences.currency}
        onChangePeriod={(value) => updatePreference('budgetPeriod', value)}
        onChangeValue={(value) => updatePreference('maxBudgetPerShoppingTrip', value)}
        period={preferences.budgetPeriod || 'week'}
        value={preferences.maxBudgetPerShoppingTrip}
      />

      <SettingsSwitchRow
        description="Bio-Produkte erhalten in der Nachhaltigkeitsbewertung einen Vorteil."
        label="Bio bevorzugen"
        onValueChange={(value) => updatePreference('preferBio', value)}
        value={preferences.preferBio}
      />

      <SettingsSwitchRow
        description="Es werden nur lokal gespeicherte Produkte bewertet."
        label="Offline-Modus"
        onValueChange={(value) => updatePreference('offlineModeEnabled', value)}
        value={preferences.offlineModeEnabled}
      />

      <SectionTitle>Prioritäten</SectionTitle>
      <PrioritySelector
        label="Ernährung"
        onChange={(value) => updatePreference('nutritionPriority', value)}
        value={preferences.nutritionPriority}
      />
      <PrioritySelector
        label="Nachhaltigkeit"
        onChange={(value) => updatePreference('sustainabilityPriority', value)}
        value={preferences.sustainabilityPriority}
      />
    </ScreenContainer>
  );
}

function PrioritySelector({ label, value, onChange }) {
  return (
    <View style={styles.priorityRow}>
      <Text style={styles.priorityLabel}>{label}</Text>
      <View style={styles.priorityOptions}>
        {priorityOptions.map((option) => (
          <Pressable
            accessibilityRole="button"
            key={option}
            onPress={() => onChange(option)}
            style={[styles.priorityChip, value === option ? styles.activeChip : null]}
          >
            <Text style={[styles.chipText, value === option ? styles.activeChipText : null]}>
              {option === 'low' ? 'Niedrig' : option === 'medium' ? 'Mittel' : 'Hoch'}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  activeChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  dangerChip: {
    backgroundColor: '#fee4e2',
    borderColor: '#fecdca'
  },
  chipText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800'
  },
  activeChipText: {
    color: colors.surface
  },
  dangerChipText: {
    color: colors.danger
  },
  priorityRow: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 14
  },
  priorityLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800'
  },
  priorityOptions: {
    flexDirection: 'row',
    gap: 8
  },
  priorityChip: {
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center'
  }
});
