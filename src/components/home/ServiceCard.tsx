import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { EventService } from '../../types';
import { formatPrice } from '../../data/mockData';
import { Icon } from '../ui/Icon';
import { colors, radius, spacing } from '../../theme';

interface ServiceCardProps {
  service: EventService;
  selected?: boolean;
  onPress: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  selected = false,
  onPress,
}) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    style={[styles.container, selected && styles.selected]}>
    <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
      <Icon name={service.icon} size={22} color={selected ? colors.skyBlue : colors.textSecondary} />
    </View>
    <Text style={styles.name} numberOfLines={1}>
      {service.name}
    </Text>
    <Text style={styles.price}>From {formatPrice(service.priceFrom)}</Text>
    {selected ? (
      <View style={styles.checkmark}>
        <Icon name="check" size={14} color={colors.white} />
      </View>
    ) : null}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    position: 'relative',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  selected: {
    borderColor: colors.skyBlue,
    backgroundColor: colors.purpleLight,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  iconWrapSelected: {
    backgroundColor: colors.white,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  price: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  checkmark: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.skyBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
