import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { Icon } from '../../components/ui/Icon';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Reminders'>;

const reminders = [
  {
    id: '1',
    title: "Mom's Birthday",
    date: '28 Mar 2026',
    daysLeft: 12,
    occasion: 'Birthday',
  },
  {
    id: '2',
    title: 'Anniversary — Priya',
    date: '14 Feb 2026',
    daysLeft: 5,
    occasion: 'Anniversary',
  },
  {
    id: '3',
    title: "Rahul's Housewarming",
    date: '5 Apr 2026',
    daysLeft: 20,
    occasion: 'Housewarming',
  },
];

export const RemindersScreen: React.FC<Props> = ({ navigation }) => {
  if (reminders.length === 0) {
    return (
      <ScreenContainer scroll={false}>
        <Header
          title="Smart Reminders"
          subtitle="Never miss an occasion"
          showBack
          onBack={() => navigation.goBack()}
        />
        <EmptyState
          icon="alarm"
          title="No Reminders Yet"
          message="Add birthdays and anniversaries to get timely gift suggestions."
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer contentStyle={styles.content}>
      <Header
        title="Smart Reminders"
        subtitle={`${reminders.length} upcoming`}
        showBack
        onBack={() => navigation.goBack()}
      />

      {reminders.map(item => (
        <TouchableOpacity key={item.id} activeOpacity={0.9}>
          <Card style={styles.card}>
            <View style={styles.iconWrap}>
              <Icon name="alarm" size={22} color={colors.skyBlue} />
            </View>
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.meta}>
                {item.occasion} · {item.date}
              </Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.daysLeft}d</Text>
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.purpleLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  title: {
    ...typography.body,
    fontWeight: '600',
  },
  meta: {
    ...typography.caption,
    textTransform: 'none',
    marginTop: 2,
  },
  badge: {
    backgroundColor: colors.skyBlue,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
});
