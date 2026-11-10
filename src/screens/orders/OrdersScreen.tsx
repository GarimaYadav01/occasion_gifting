import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { AppHeader } from '../../components/AppHeader';
import { Chip } from '../../components/Bits';
import { Tap } from '../../components/Tap';
import { Img } from '../../components/Img';
import { Icon } from '../../components/Icon';
import { EmptyState } from '../../components/States';
import { productById } from '../../data/gifts';
import { eventTypeById } from '../../data/events';
import { useAppDispatch, useAppSelector } from '../../store';
import { setMode } from '../../store/slices/app';
import { EVENT_STATUSES, EventBooking, GIFT_STATUSES, GiftOrder } from '../../store/slices/orders';
import { useNav, useTheme } from '../../utils/hooks';
import { fmtShort, inr, relativeDay } from '../../utils/format';
import { TabParamList } from '../../navigation/types';

export const statusTone = (label: string) => {
  if (label === 'Cancelled') { return ['#FDECEE', '#D93B4A', 'close-circle']; }
  if (label === 'Delivered' || label === 'Completed') { return ['#E4F6EC', '#0C8A4B', 'check-circle']; }
  if (label === 'Pending') { return ['#FFF5DE', '#C98A0B', 'clock-outline']; }
  return ['#E8F0FE', '#2F6FEB', 'progress-check'];
};

export const StatusPill = ({ label }: { label: string }) => {
  const [bg, fg, icon] = statusTone(label);
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Icon name={icon} size={12} color={fg} />
      <Text style={{ color: fg, fontWeight: '800', fontSize: 11, marginLeft: 3 }}>{label}</Text>
    </View>
  );
};

const giftLabel = (o: GiftOrder) => (o.cancelled ? 'Cancelled' : GIFT_STATUSES[o.step]);
const eventLabel = (b: EventBooking) => (b.cancelled ? 'Cancelled' : EVENT_STATUSES[b.step]);

export const OrdersScreen = () => {
  const { c, mode } = useTheme();
  const nav = useNav();
  const dispatch = useAppDispatch();
  const route = useRoute<RouteProp<TabParamList, 'Orders'>>();
  const gifts = useAppSelector(s => s.orders.gifts);
  const bookings = useAppSelector(s => s.orders.bookings);
  const [tab, setTab] = useState<'gifts' | 'events'>(route.params?.tab || (mode === 'events' ? 'events' : 'gifts'));
  const [filter, setFilter] = useState('All');
  useEffect(() => { if (route.params?.tab) { setTab(route.params.tab); } }, [route.params?.tab]);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setTab(mode === 'events' ? 'events' : 'gifts'); setFilter('All');
  }, [mode]);

  const gFilters = ['All', 'Active', 'Delivered', 'Cancelled'];
  const eFilters = ['All', 'Upcoming', 'Completed', 'Cancelled'];
  const gShown = gifts.filter(o => filter === 'All' || (filter === 'Active' ? !o.cancelled && o.step < 4 : giftLabel(o) === filter));
  const eShown = bookings.filter(b => filter === 'All' || (filter === 'Upcoming' ? !b.cancelled && b.step < 4 : eventLabel(b) === filter));

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <AppHeader title="My Orders" subtitle="Track gifts & event bookings" noBack actions={['search']} />
      <View style={{ backgroundColor: c.white, paddingHorizontal: 16, paddingBottom: 10 }}>
        <View style={[styles.seg, { backgroundColor: c.lineSoft }]}>
          {([['gifts', 'Gift Orders', 'gift-outline', gifts.length], ['events', 'Event Bookings', 'party-popper', bookings.length]] as const).map(([k, l, i, n]) => {
            const on = tab === k;
            return (
              <Tap key={k} onPress={() => { setTab(k); setFilter('All'); dispatch(setMode(k)); }} style={[styles.segItem, on && { backgroundColor: c.white }]}>
                <Icon name={i} size={18} color={on ? c.ink : c.sub} />
                <Text style={{ marginLeft: 6, fontWeight: on ? '900' : '600', color: on ? c.ink : c.sub }}>{l}</Text>
                <View style={[styles.count, { backgroundColor: on ? c.primary : c.line }]}><Text style={{ fontSize: 10, fontWeight: '900', color: on ? c.onPrimary : c.sub }}>{n}</Text></View>
              </Tap>
            );
          })}
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ padding: 12, paddingHorizontal: 16 }}>
        {(tab === 'gifts' ? gFilters : eFilters).map(f => <Chip key={f} label={f} on={filter === f} onPress={() => setFilter(f)} />)}
      </ScrollView>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}>
        {tab === 'gifts' ? (
          gShown.length === 0 ? (
            <EmptyState icon="package-variant" title="No gift orders here" body="When you send a gift, you can track it live from here." cta="Send a gift" onCta={() => nav.navigate('Main', { screen: 'Gifts' })} />
          ) : gShown.map(o => {
            const p = productById(o.items[0].productId);
            const label = giftLabel(o);
            return (
              <Tap key={o.id} scale={0.98} onPress={() => nav.navigate('GiftOrderDetails', { id: o.id })} style={[styles.card, { backgroundColor: c.white, borderColor: c.line }]}>
                <View style={styles.cardTop}>
                  <StatusPill label={label} />
                  <Text style={{ fontSize: 11, color: c.muted, fontWeight: '700' }}>#{o.id} · {fmtShort(o.placedAt)}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Img uri={p.image} style={styles.img} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={{ fontWeight: '800', color: c.text }} numberOfLines={1}>{p.name}{o.items.length > 1 ? ` +${o.items.length - 1} more` : ''}</Text>
                    <Text style={{ fontSize: 12, color: c.sub, marginTop: 2 }}>For {o.recipient.name} · {inr(o.total)}</Text>
                    {!o.cancelled && o.step < 4 ? (
                      <Text style={{ fontSize: 12, color: c.success, fontWeight: '800', marginTop: 4 }}>Arriving {relativeDay(o.deliveryDate)}, {o.slot}</Text>
                    ) : o.step === 4 && !o.cancelled ? (
                      <Text style={{ fontSize: 12, color: c.sub, marginTop: 4 }}>Delivered {fmtShort(o.deliveryDate)}</Text>
                    ) : null}
                  </View>
                  <Icon name="chevron-right" size={22} color={c.muted} />
                </View>
                {!o.cancelled && (
                  <View style={styles.progress}>
                    {GIFT_STATUSES.map((s, i) => <View key={s} style={[styles.seg2, { backgroundColor: i <= o.step ? c.success : c.lineSoft }]} />)}
                  </View>
                )}
                {o.step === 4 && !o.cancelled && !o.review && (
                  <Tap onPress={() => nav.navigate('Review', { kind: 'gift', id: o.id })} style={[styles.rate, { borderTopColor: c.lineSoft }]}>
                    <Text style={{ color: c.sub, fontSize: 12, fontWeight: '600' }}>How was your order?</Text>
                    <View style={{ flexDirection: 'row' }}>{[1, 2, 3, 4, 5].map(i => <Icon key={i} name="star-outline" size={20} color={c.gold} />)}</View>
                  </Tap>
                )}
              </Tap>
            );
          })
        ) : eShown.length === 0 ? (
          <EmptyState icon="calendar-blank-outline" title="No event bookings" body="Plan a birthday, wedding or party and manage every vendor here." cta="Plan an event" onCta={() => nav.navigate('Main', { screen: 'Events' })} />
        ) : eShown.map(b => {
          const ev = eventTypeById(b.eventType)!;
          const label = eventLabel(b);
          return (
            <Tap key={b.id} scale={0.98} onPress={() => nav.navigate('BookingDetails', { id: b.id })} style={[styles.card, { backgroundColor: c.white, borderColor: c.line }]}>
              <View style={styles.cardTop}>
                <StatusPill label={label} />
                <Text style={{ fontSize: 11, color: c.muted, fontWeight: '700' }}>#{b.id}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Img uri={ev.image} style={styles.img} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ fontWeight: '900', color: c.text, fontSize: 15 }}>{ev.name}</Text>
                  <Text style={{ fontSize: 12, color: c.sub, marginTop: 2 }}>{fmtShort(b.date)} · {b.time} · {b.guests} guests</Text>
                  <Text style={{ fontSize: 12, color: c.sub, marginTop: 2 }} numberOfLines={1}>{b.venue.name}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontWeight: '900', color: c.text }}>{inr(b.total)}</Text>
                  <Text style={{ fontSize: 11, color: c.sub }}>{b.services.length} services</Text>
                </View>
              </View>
              {!b.cancelled && (
                <View style={styles.progress}>
                  {EVENT_STATUSES.map((s, i) => <View key={s} style={[styles.seg2, { backgroundColor: i <= b.step ? c.primary : c.lineSoft }]} />)}
                </View>
              )}
            </Tap>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' },
  seg: { flexDirection: 'row', padding: 4, borderRadius: 14 },
  segItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 42, borderRadius: 11 },
  count: { marginLeft: 6, minWidth: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  card: { padding: 12, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  img: { width: 62, height: 62, borderRadius: 12 },
  progress: { flexDirection: 'row', gap: 4, marginTop: 12 },
  seg2: { flex: 1, height: 4, borderRadius: 2 },
  rate: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, marginTop: 12, paddingTop: 10 },
});
