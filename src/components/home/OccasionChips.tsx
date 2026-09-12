import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Icon } from '../ui/Icon';
import { colors, radius, spacing } from '../../theme';

interface OccasionChip {
  id: string;
  label: string;
  icon: string;
}

interface OccasionChipsProps {
  chips: OccasionChip[];
  onPress: (id: string) => void;
}

export const OccasionChips: React.FC<OccasionChipsProps> = ({
  chips,
  onPress,
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.scroll}>
    {chips.map(chip => (
      <TouchableOpacity
        key={chip.id}
        style={styles.chip}
        activeOpacity={0.85}
        onPress={() => onPress(chip.id)}>
        <Icon name={chip.icon} size={16} color={colors.skyBlue} />
        <Text style={styles.label}>{chip.label}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  scroll: {
    paddingRight: spacing.lg,
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    gap: spacing.xs,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
});
