import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Header } from '../../components/layout/Header';
import { Card } from '../../components/ui/Card';
import { Icon } from '../../components/ui/Icon';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Support'>;

const faqs = [
  {
    q: 'How does same-day delivery work?',
    a: 'Order before 4 PM in select cities for delivery within 3–6 hours.',
  },
  {
    q: 'Can I track my gift order?',
    a: 'Yes — open My Orders and tap Track Order for live status updates.',
  },
  {
    q: 'How do I book an occasion package?',
    a: 'Go to the Occasions tab, pick an event type, then choose services and a venue.',
  },
];

const contacts = [
  {
    id: 'chat',
    label: 'Chat with us',
    icon: 'chat-outline',
    value: 'Usually replies in minutes',
  },
  {
    id: 'call',
    label: 'Call support',
    icon: 'phone-outline',
    value: '+91 1800 123 4567',
    action: () => Linking.openURL('tel:18001234567'),
  },
  {
    id: 'email',
    label: 'Email us',
    icon: 'email-outline',
    value: 'hello@ong.gifts',
    action: () => Linking.openURL('mailto:hello@ong.gifts'),
  },
];

export const SupportScreen: React.FC<Props> = ({ navigation }) => (
  <ScreenContainer contentStyle={styles.content}>
    <Header
      title="Help & Support"
      subtitle="We're here for you"
      showBack
      onBack={() => navigation.goBack()}
    />

    <Text style={styles.sectionTitle}>Contact</Text>
    {contacts.map(item => (
      <TouchableOpacity
        key={item.id}
        activeOpacity={0.85}
        onPress={item.action}>
        <Card style={styles.contactCard}>
          <View style={styles.iconWrap}>
            <Icon name={item.icon} size={22} color={colors.skyBlue} />
          </View>
          <View style={styles.contactText}>
            <Text style={styles.contactLabel}>{item.label}</Text>
            <Text style={styles.contactValue}>{item.value}</Text>
          </View>
          <Icon name="chevron-right" size={20} color={colors.textMuted} />
        </Card>
      </TouchableOpacity>
    ))}

    <Text style={[styles.sectionTitle, styles.faqTitle]}>FAQs</Text>
    {faqs.map(faq => (
      <Card key={faq.q} style={styles.faqCard}>
        <Text style={styles.faqQ}>{faq.q}</Text>
        <Text style={styles.faqA}>{faq.a}</Text>
      </Card>
    ))}
  </ScreenContainer>
);

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.huge,
  },
  sectionTitle: {
    ...typography.label,
    marginBottom: spacing.md,
  },
  faqTitle: {
    marginTop: spacing.xl,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
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
  contactText: {
    flex: 1,
  },
  contactLabel: {
    ...typography.body,
    fontWeight: '600',
  },
  contactValue: {
    ...typography.caption,
    textTransform: 'none',
    marginTop: 2,
  },
  faqCard: {
    marginBottom: spacing.md,
  },
  faqQ: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  faqA: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
});
