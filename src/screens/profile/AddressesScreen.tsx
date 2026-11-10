import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { Icon } from '../../components/ui/Icon';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Addresses'>;

const addresses = [
  {
    id: '1',
    label: 'Home',
    name: 'Aarav Sharma',
    line: '123 Celebration Lane, Andheri West',
    city: 'Mumbai, 400001',
    phone: '+91 98765 43210',
    isDefault: true,
  },
  {
    id: '2',
    label: 'Office',
    name: 'Aarav Sharma',
    line: 'WeWork BKC, Plot C-20, G Block',
    city: 'Mumbai, 400051',
    phone: '+91 98765 43210',
    isDefault: false,
  },
];

export const AddressesScreen: React.FC<Props> = ({ navigation }) => (
  <ScreenContainer contentStyle={styles.content}>
    <Header
      title="Saved Addresses"
      subtitle={`${addresses.length} addresses`}
      showBack
      onBack={() => navigation.goBack()}
    />

    {addresses.map(addr => (
      <TouchableOpacity key={addr.id} activeOpacity={0.9}>
        <Card style={styles.card}>
          <View style={styles.topRow}>
            <View style={styles.labelRow}>
              <Icon name="map-marker" size={18} color={colors.skyBlue} />
              <Text style={styles.label}>{addr.label}</Text>
              {addr.isDefault ? (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>Default</Text>
                </View>
              ) : null}
            </View>
            <Icon name="pencil-outline" size={18} color={colors.textMuted} />
          </View>
          <Text style={styles.name}>{addr.name}</Text>
          <Text style={styles.line}>{addr.line}</Text>
          <Text style={styles.line}>{addr.city}</Text>
          <Text style={styles.phone}>{addr.phone}</Text>
        </Card>
      </TouchableOpacity>
    ))}
  </ScreenContainer>
);

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.huge,
  },
  card: {
    marginBottom: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  label: {
    ...typography.body,
    fontWeight: '700',
  },
  defaultBadge: {
    backgroundColor: colors.greenLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: spacing.xs,
  },
  defaultText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.green,
  },
  name: {
    ...typography.body,
    fontWeight: '500',
    marginBottom: 2,
  },
  line: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  phone: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
});
