import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { BookingShell } from '../../../components/BookingShell';
import { Calendar } from '../../../components/Calendar';
import { Card, Chip, InfoBanner } from '../../../components/Bits';
import { Tap } from '../../../components/Tap';
import { Img } from '../../../components/Img';
import { Icon } from '../../../components/Icon';
import { eventTypes, eventTypeById, guestPresets, serviceCategories } from '../../../data/events';
import { useAppDispatch, useAppSelector } from '../../../store';
import { setDraft, toggleService } from '../../../store/slices/booking';
import { useNav, useTheme } from '../../../utils/hooks';
import { fmtDate, inr } from '../../../utils/format';
import { RootStackParamList } from '../../../navigation/types';

const { width } = Dimensions.get('window');

/* Step 1 — Event type */
export const BookEventTypeScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const dispatch = useAppDispatch();
  const route = useRoute<RouteProp<RootStackParamList, 'BookEventType'>>();
  const current = useAppSelector(s => s.booking.eventType);
  useEffect(() => { if (route.params?.eventType) { dispatch(setDraft({ eventType: route.params.eventType })); } }, [route.params?.eventType, dispatch]);
  const w = (width - 42) / 2;
  return (
    <BookingShell step={1} title="What's the occasion?" subtitle="Select the type of event you're planning" cta="Continue" disabled={!current} onNext={() => nav.navigate('BookDate')}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {eventTypes.map(e => {
          const on = current === e.id;
          return (
            <Tap key={e.id} scale={0.97} onPress={() => dispatch(setDraft({ eventType: e.id }))} style={[styles.evCard, { width: w, borderColor: on ? c.ink : c.line, borderWidth: on ? 2 : 1, backgroundColor: c.white }]}>
              <Img uri={e.image} style={{ height: 96, borderRadius: 12 }}>
                {on && <View style={[styles.check, { backgroundColor: c.primary }]}><Icon name="check-bold" size={14} color={c.onPrimary} /></View>}
              </Img>
              <Text style={{ fontWeight: '900', color: c.text, marginTop: 8, fontSize: 14 }}>{e.name}</Text>
              <Text style={{ fontSize: 11, color: c.sub, marginTop: 1 }}>{e.blurb}</Text>
              <Text style={{ fontSize: 11, color: c.ink, fontWeight: '800', marginTop: 4 }}>from {inr(e.from)}</Text>
            </Tap>
          );
        })}
      </View>
    </BookingShell>
  );
};

/* Step 2 — Date */
const TIMES = ['10:00 AM', '01:00 PM', '04:00 PM', '07:00 PM', '09:00 PM'];
export const BookDateScreen = () => {
  const nav = useNav();
  const dispatch = useAppDispatch();
  const d = useAppSelector(s => s.booking);
  return (
    <BookingShell step={2} title="When is the event?" subtitle={eventTypeById(d.eventType || '')?.name} cta="Continue" ctaSub={d.date ? `${fmtDate(d.date, true)} · ${d.time}` : undefined} disabled={!d.date} onNext={() => nav.navigate('BookGuests')}>
      <Card><Calendar value={d.date} onChange={iso => dispatch(setDraft({ date: iso }))} busyDays={[6, 13, 14, 20, 27, 28]} /></Card>
      <Text style={styles.h}>Start time</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {TIMES.map(t => <Chip key={t} label={t} icon="clock-outline" on={d.time === t} onPress={() => dispatch(setDraft({ time: t }))} style={{ marginRight: 0 }} />)}
      </View>
      <View style={{ marginTop: 16 }}><InfoBanner icon="lightbulb-on-outline" tone="warn" text="Weekends in Nov–Dec fill up fast. Book 3+ weeks ahead for the best vendors." /></View>
    </BookingShell>
  );
};

/* Step 3 — Guests */
export const BookGuestsScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const dispatch = useAppDispatch();
  const guests = useAppSelector(s => s.booking.guests);
  const set = (n: number) => dispatch(setDraft({ guests: Math.max(2, Math.min(1500, n)) }));
  const size = guests <= 30 ? 'Intimate' : guests <= 100 ? 'Medium' : guests <= 300 ? 'Large' : 'Grand';
  const pct = Math.min(1, guests / 600);
  return (
    <BookingShell step={3} title="How many guests?" subtitle="An estimate is fine — you can change this later" cta="Continue" ctaSub={`${guests} guests`} onNext={() => nav.navigate('BookServices')}>
      <Card style={{ alignItems: 'center', paddingVertical: 26 }}>
        <View style={[styles.sizeTag, { backgroundColor: c.tint }]}><Text style={{ color: c.ink, fontWeight: '900', fontSize: 12 }}>{size.toUpperCase()} GATHERING</Text></View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
          <Tap onPress={() => set(guests - (guests > 50 ? 10 : 5))} style={[styles.round, { borderColor: c.line }]}><Icon name="minus" size={26} color={c.text} /></Tap>
          <View style={{ alignItems: 'center', width: 150 }}>
            <Text style={{ fontSize: 56, fontWeight: '900', color: c.text, letterSpacing: -2 }}>{guests}</Text>
            <Text style={{ color: c.sub, fontWeight: '700', marginTop: -4 }}>guests</Text>
          </View>
          <Tap onPress={() => set(guests + (guests >= 50 ? 10 : 5))} style={[styles.round, { backgroundColor: c.primary, borderColor: c.primary }]}><Icon name="plus" size={26} color={c.onPrimary} /></Tap>
        </View>
        <View style={[styles.track, { backgroundColor: c.lineSoft }]}>
          <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: c.primary }]} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch', paddingHorizontal: 4 }}>
          <Text style={styles.scale}>2</Text><Text style={styles.scale}>150</Text><Text style={styles.scale}>300</Text><Text style={styles.scale}>600+</Text>
        </View>
      </Card>
      <Text style={styles.h}>Quick select</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {guestPresets.map(g => <Chip key={g} label={`${g} guests`} on={guests === g} onPress={() => set(g)} style={{ marginRight: 0 }} />)}
      </View>
      <View style={{ marginTop: 16 }}><InfoBanner icon="information-outline" text={`For ${guests} guests we'll show caterers priced per plate and venues that fit ${Math.ceil(guests * 1.1)}+ people.`} /></View>
    </BookingShell>
  );
};

/* Step 4 — Services */
const SUGGEST: Record<string, string[]> = {
  birthday: ['decoration', 'catering', 'entertainment'], anniversary: ['decoration', 'photography', 'catering'], wedding: ['venue', 'decoration', 'catering', 'photography', 'makeup'],
  engagement: ['decoration', 'photography', 'makeup'], babyshower: ['decoration', 'catering'], corporate: ['venue', 'catering', 'additional'], houseparty: ['entertainment', 'catering', 'additional'], proposal: ['decoration', 'photography'],
};
export const BookServicesScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const dispatch = useAppDispatch();
  const d = useAppSelector(s => s.booking);
  const sug = SUGGEST[d.eventType || 'birthday'] || [];
  const addAll = () => sug.forEach(s => { if (!d.services.includes(s)) { dispatch(toggleService(s)); } });
  return (
    <BookingShell step={4} title="What do you need?" subtitle="Select all the services you want to book — one vendor per service" cta="Browse vendors" ctaSub={d.services.length ? `${d.services.length} service${d.services.length > 1 ? 's' : ''} selected` : undefined} disabled={!d.services.length} onNext={() => nav.navigate('BookProviders')}>
      <Tap onPress={addAll} style={[styles.suggest, { backgroundColor: c.tint }]}>
        <Icon name="auto-fix" size={20} color={c.ink} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={{ fontWeight: '800', color: c.text }}>Popular for {eventTypeById(d.eventType || '')?.name || 'your event'}</Text>
          <Text style={{ fontSize: 12, color: c.sub }}>{sug.map(s => serviceCategories.find(x => x.id === s)?.short).join(' · ')}</Text>
        </View>
        <Text style={{ color: c.ink, fontWeight: '900' }}>Add all</Text>
      </Tap>
      {serviceCategories.map(s => {
        const on = d.services.includes(s.id);
        return (
          <Tap key={s.id} scale={0.99} onPress={() => dispatch(toggleService(s.id))} style={[styles.svc, { backgroundColor: on ? c.tint : c.white, borderColor: on ? c.ink : c.line, borderWidth: on ? 1.8 : 1 }]}>
            <Img uri={s.image} style={styles.svcImg} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontWeight: '900', fontSize: 15, color: c.text }}>{s.name}</Text>
                {sug.includes(s.id) && <View style={[styles.pop, { backgroundColor: c.accentSoft }]}><Text style={{ fontSize: 9, fontWeight: '900', color: c.accent }}>SUGGESTED</Text></View>}
              </View>
              <Text style={{ fontSize: 12, color: c.sub, marginTop: 2 }} numberOfLines={2}>{s.subs.join(', ')}</Text>
            </View>
            <Icon name={on ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'} size={26} color={on ? c.ink : c.muted} />
          </Tap>
        );
      })}
    </BookingShell>
  );
};

const styles = StyleSheet.create({
  evCard: { padding: 8, borderRadius: 16 },
  check: { position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  h: { fontSize: 16, fontWeight: '900', color: '#1D1424', marginTop: 20, marginBottom: 10 },
  sizeTag: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  round: { width: 58, height: 58, borderRadius: 29, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  track: { height: 8, borderRadius: 4, alignSelf: 'stretch', marginTop: 24, overflow: 'hidden' },
  fill: { height: 8, borderRadius: 4 },
  scale: { fontSize: 10, color: '#A39BAD', fontWeight: '700', marginTop: 4 },
  suggest: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14, marginBottom: 12 },
  svc: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 16, marginBottom: 10 },
  svcImg: { width: 62, height: 62, borderRadius: 12 },
  pop: { marginLeft: 6, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
});
