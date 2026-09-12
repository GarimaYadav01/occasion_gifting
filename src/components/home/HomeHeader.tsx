import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../ui/Icon';
import { colors, radius, spacing, typography } from '../../theme';

interface HomeHeaderProps {
  search: string;
  onSearchChange: (text: string) => void;
  cartCount: number;
  onCartPress: () => void;
  onNotificationPress: () => void;
  unreadCount?: number;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  search,
  onSearchChange,
  cartCount,
  onCartPress,
  onNotificationPress,
  unreadCount = 0,
}) => (
  <SafeAreaView edges={['top']} style={styles.safeArea}>
    <View style={styles.container}>
      <View style={styles.locationRow}>
        <TouchableOpacity style={styles.locationBtn} activeOpacity={0.8}>
          <Icon name="map-marker" size={22} color={colors.skyBlue} />
          <View>
            <Text style={styles.deliverLabel}>Deliver to</Text>
            <View style={styles.locationLine}>
              <Text style={styles.locationText}>Mumbai, 400001</Text>
              <Icon name="chevron-down" size={16} color={colors.textMuted} />
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={onNotificationPress}>
            <Icon name="bell-outline" size={20} color={colors.text} />
            {unreadCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={onCartPress}>
            <Icon name="cart-outline" size={20} color={colors.text} />
            {cartCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchRow}>
        <Icon name="magnify" size={20} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search flowers, cakes, gifts..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={onSearchChange}
        />
      </View>

      <View style={styles.expressStrip}>
        <Icon name="flash" size={16} color={colors.green} />
        <Text style={styles.expressText}>
          Order before <Text style={styles.expressBold}>4 PM</Text> for same-day delivery
        </Text>
      </View>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: { backgroundColor: colors.white },
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  deliverLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  locationLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  locationText: {
    ...typography.body,
    fontWeight: '700',
    fontSize: 15,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.accent,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.white,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    paddingVertical: 0,
  },
  expressStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.greenLight,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  expressText: {
    fontSize: 12,
    color: colors.green,
    flex: 1,
  },
  expressBold: { fontWeight: '700' },
});
