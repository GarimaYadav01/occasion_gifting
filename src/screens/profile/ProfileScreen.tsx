import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout, openLoginModal } from '../../store/slices/authSlice';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { colors, radius, spacing, typography } from '../../theme';
import { Icon } from '../../components/ui/Icon';
import { GradientButton } from '../../components/ui/GradientButton';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Profile'>;

const menuItems = [
  { id: 'orders', label: 'My Orders', icon: 'package-variant', screen: 'OrdersTab' as const, needsAuth: true },
  { id: 'wishlist', label: 'Wishlist', icon: 'heart-outline', screen: 'WishlistTab' as const, needsAuth: true },
  { id: 'notifications', label: 'Notifications', icon: 'bell-outline', screen: 'Notifications' as const, needsAuth: true },
  { id: 'reminders', label: 'Smart Reminders', icon: 'alarm', screen: null, needsAuth: true },
  { id: 'addresses', label: 'Saved Addresses', icon: 'map-marker-outline', screen: null, needsAuth: true },
  { id: 'support', label: 'Help & Support', icon: 'help-circle-outline', screen: null, needsAuth: false },
];

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { requireAuth, isAuthenticated } = useRequireAuth();
  const user = useAppSelector(state => state.auth.user);
  const unreadCount = useAppSelector(
    state => state.app.notifications.filter(n => !n.read).length,
  );

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => dispatch(logout()),
      },
    ]);
  };

  const handleMenuPress = (item: (typeof menuItems)[0]) => {
    const navigate = () => {
      if (item.screen === 'Notifications') {
        navigation.navigate('Notifications');
      } else if (item.screen === 'OrdersTab' || item.screen === 'WishlistTab') {
        navigation.getParent()?.navigate(item.screen);
      }
    };

    if (item.needsAuth) {
      requireAuth(navigate, `Login to access ${item.label.toLowerCase()}`);
    } else {
      navigate();
    }
  };

  return (
    <ScreenContainer contentStyle={styles.content}>
      <Header title="Profile" subtitle="Manage your account" />

      <Card variant="cream" style={styles.profileCard}>
        <View style={styles.avatar}>
          <Icon
            name={isAuthenticated ? 'account-circle' : 'account-outline'}
            size={40}
            color={colors.skyBlue}
          />
        </View>
        <Text style={styles.userName}>
          {isAuthenticated ? user?.name ?? 'User' : 'Welcome, Guest'}
        </Text>
        {isAuthenticated ? (
          <>
            <Text style={styles.userPhone}>+91 {user?.phone}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </>
        ) : (
          <Text style={styles.guestHint}>
            Login to track orders, save wishlist & more
          </Text>
        )}
        {!isAuthenticated ? (
          <GradientButton
            title="Login / Sign Up"
            onPress={() => dispatch(openLoginModal('Login to your account'))}
            style={styles.loginBtn}
            fullWidth
          />
        ) : null}
      </Card>

      {isAuthenticated ? (
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Gifts Sent</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Events</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Reminders</Text>
          </Card>
        </View>
      ) : null}

      <Text style={styles.menuTitle}>Account</Text>
      {menuItems.map(item => (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.85}
          onPress={() => handleMenuPress(item)}>
          <Card style={styles.menuItem}>
            <Icon name={item.icon} size={22} color={colors.skyBlue} style={styles.menuIcon} />
            <Text style={styles.menuLabel}>{item.label}</Text>
            {item.id === 'notifications' && unreadCount > 0 && isAuthenticated ? (
              <View style={styles.menuBadge}>
                <Text style={styles.menuBadgeText}>{unreadCount}</Text>
              </View>
            ) : null}
            <Icon name="chevron-right" size={20} color={colors.textMuted} />
          </Card>
        </TouchableOpacity>
      ))}

      {isAuthenticated ? (
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          fullWidth
          style={styles.logoutBtn}
        />
      ) : null}

      <Text style={styles.version}>ONG · Occasion & Gifting v1.0</Text>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.huge,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.purpleLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  userName: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  userPhone: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  userEmail: {
    ...typography.bodySmall,
  },
  guestHint: {
    ...typography.bodySmall,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  loginBtn: {
    marginTop: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  statValue: {
    ...typography.h2,
    color: colors.skyBlue,
  },
  statLabel: {
    ...typography.caption,
    textTransform: 'none',
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  menuTitle: {
    ...typography.label,
    marginBottom: spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingVertical: spacing.md,
  },
  menuIcon: {
    marginRight: spacing.md,
  },
  menuLabel: {
    ...typography.body,
    flex: 1,
    fontWeight: '500',
  },
  menuBadge: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginRight: spacing.sm,
  },
  menuBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  menuArrow: {
    display: 'none',
  },
  logoutBtn: {
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
  version: {
    ...typography.caption,
    textAlign: 'center',
    textTransform: 'none',
    marginBottom: spacing.lg,
  },
});
