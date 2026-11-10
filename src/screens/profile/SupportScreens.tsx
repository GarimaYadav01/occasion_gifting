import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { AppHeader } from '../../components/AppHeader';
import { Card, ListRow } from '../../components/Bits';
import { Tap } from '../../components/Tap';
import { Icon } from '../../components/Icon';
import { Logo } from '../../components/Logo';
import { useToast } from '../../components/Toast';
import { faqs } from '../../data/user';
import { useNav, useTheme } from '../../utils/hooks';
import { RootStackParamList } from '../../navigation/types';

export const HelpScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const toast = useToast();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <AppHeader title="Help & support" subtitle="We're here 24×7" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {[['chat-processing-outline', 'Chat with us', 'Replies in 2 min'], ['phone-outline', 'Call us', '1800-123-4567'], ['email-outline', 'Email', 'help@occasion.app']].map(([i, t, s]) => (
            <Tap key={t} onPress={() => toast.show(`${t} — connecting…`, i)} style={{ flex: 1, backgroundColor: c.white, borderColor: c.line, borderWidth: 1, borderRadius: 16, padding: 12, alignItems: 'center' }}>
              <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: c.tint, alignItems: 'center', justifyContent: 'center' }}><Icon name={i} size={20} color={c.ink} /></View>
              <Text style={{ fontWeight: '800', color: c.text, marginTop: 8, fontSize: 13 }}>{t}</Text>
              <Text style={{ fontSize: 10, color: c.sub, marginTop: 2, textAlign: 'center' }}>{s}</Text>
            </Tap>
          ))}
        </View>
        <Text style={{ fontSize: 12, fontWeight: '900', color: c.muted, letterSpacing: 1, marginTop: 22, marginBottom: 8 }}>QUICK HELP</Text>
        <Card style={{ paddingVertical: 4 }}>
          <ListRow icon="package-variant" title="Issue with a gift order" onPress={() => nav.navigate('Main', { screen: 'Orders', params: { tab: 'gifts' } })} />
          <ListRow icon="calendar-alert" title="Issue with an event booking" onPress={() => nav.navigate('Main', { screen: 'Orders', params: { tab: 'events' } })} />
          <ListRow icon="cash-refund" title="Refunds & payments" onPress={() => setOpen(4)} />
        </Card>
        <Text style={{ fontSize: 12, fontWeight: '900', color: c.muted, letterSpacing: 1, marginTop: 22, marginBottom: 8 }}>FREQUENTLY ASKED</Text>
        {faqs.map((f, i) => (
          <Card key={f.q} style={{ marginBottom: 8 }} onPress={() => setOpen(open === i ? null : i)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ flex: 1, fontWeight: '800', color: c.text }}>{f.q}</Text>
              <Icon name={open === i ? 'chevron-up' : 'chevron-down'} size={22} color={c.sub} />
            </View>
            {open === i && <Text style={{ color: c.sub, marginTop: 8, lineHeight: 20 }}>{f.a}</Text>}
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const PAGES = {
  about: {
    title: 'About us',
    body: [
      ['Who we are', 'Occasion is an all-in-one marketplace for gifting and celebrations. We connect you with hundreds of verified local florists, bakers, chocolatiers, decorators, caterers, photographers, entertainers and venues.'],
      ['Our promise', 'Fresh gifts delivered on time, transparent event pricing, and a real human coordinator for every booking.'],
      ['How it works', 'Products and services are listed and fulfilled by independent third-party sellers and vendors. Occasion handles discovery, secure payments, quality checks and customer support.'],
    ],
  },
  privacy: {
    title: 'Privacy policy',
    body: [
      ['Information we collect', 'Your name, mobile number, email, delivery addresses, order history and reminders you choose to save.'],
      ['How we use it', 'To process orders and bookings, share necessary delivery details with sellers and vendors, send updates and personalised recommendations.'],
      ['Your choices', 'You can edit or delete your profile, addresses and reminders at any time, and opt out of promotional notifications in settings.'],
      ['Security', 'Payments are processed by PCI-DSS compliant partners. We never store your full card number or CVV.'],
    ],
  },
  terms: {
    title: 'Terms & conditions',
    body: [
      ['Marketplace', 'Occasion is a marketplace platform. Products and event services are sold by third-party sellers and vendors who are responsible for their fulfilment.'],
      ['Orders', 'Gift orders may be cancelled free of charge until the seller begins preparation. Perishable items cannot be returned once delivered.'],
      ['Event bookings', 'A 20% advance confirms a booking. Cancellations 7+ days before the event receive a full refund of the advance; 3–7 days, 50%; within 72 hours, no refund.'],
      ['Liability', 'Occasion mediates disputes between customers and vendors and may issue refunds as per these terms.'],
    ],
  },
};

export const InfoScreen = () => {
  const { c } = useTheme();
  const { page } = useRoute<RouteProp<RootStackParamList, 'Info'>>().params;
  const p = PAGES[page];
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <AppHeader title={p.title} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {page === 'about' && <View style={{ alignItems: 'center', paddingVertical: 20 }}><Logo size={64} light={false} /></View>}
        {p.body.map(([h, t]) => (
          <Card key={h} style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: '900', color: c.text, fontSize: 15, marginBottom: 6 }}>{h}</Text>
            <Text style={{ color: c.sub, lineHeight: 21 }}>{t}</Text>
          </Card>
        ))}
        <Text style={{ textAlign: 'center', color: c.muted, fontSize: 11, marginTop: 10 }}>Last updated 1 Nov 2026</Text>
      </ScrollView>
    </View>
  );
};
