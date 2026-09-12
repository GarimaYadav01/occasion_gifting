import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList, HomeStackParamList } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  markNotificationRead,
  markAllNotificationsRead,
} from '../../store/slices/appSlice';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/layout/Header';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Icon } from '../../components/ui/Icon';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<
  ProfileStackParamList & HomeStackParamList,
  'Notifications'
>;

const typeIcons: Record<string, string> = {
  reminder: 'alarm',
  order: 'package-variant',
  promo: 'sale',
  occasion: 'party-popper',
};

export const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(state => state.app.notifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <ScreenContainer contentStyle={styles.content}>
      <Header
        title="Notifications"
        subtitle={`${unreadCount} unread`}
        showBack
        onBack={() => navigation.goBack()}
      />

      {unreadCount > 0 ? (
        <Button
          title="Mark All as Read"
          onPress={() => dispatch(markAllNotificationsRead())}
          variant="ghost"
          size="sm"
          style={styles.markAllBtn}
        />
      ) : null}

      {notifications.map(notification => (
        <TouchableOpacity
          key={notification.id}
          activeOpacity={0.9}
          onPress={() => dispatch(markNotificationRead(notification.id))}>
          <Card
            style={
              !notification.read
                ? [styles.notification, styles.unread]
                : styles.notification
            }>
            <View style={styles.notifHeader}>
              <View style={styles.iconWrap}>
                <Icon
                  name={typeIcons[notification.type] ?? 'bell-outline'}
                  size={22}
                  color={colors.skyBlue}
                />
              </View>
              <View style={styles.notifContent}>
                <Text style={styles.notifTitle}>{notification.title}</Text>
                <Text style={styles.notifMessage}>{notification.message}</Text>
                <Text style={styles.notifTime}>
                  {new Date(notification.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
              {!notification.read ? <View style={styles.unreadDot} /> : null}
            </View>
          </Card>
        </TouchableOpacity>
      ))}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.huge,
  },
  markAllBtn: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  notification: {
    marginBottom: spacing.md,
  },
  unread: {
    borderColor: colors.purpleLight,
    backgroundColor: colors.purpleLight,
  },
  notifHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  notifMessage: {
    ...typography.bodySmall,
    marginBottom: spacing.sm,
  },
  notifTime: {
    ...typography.caption,
    textTransform: 'none',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.skyBlue,
    marginTop: spacing.sm,
  },
});
