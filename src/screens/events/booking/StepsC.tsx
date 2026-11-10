import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookingShell } from '../../../components/BookingShell';
import { Card, Divider, InfoBanner, PriceRow } from '../../../components/Bits';
import { PaymentPicker, paymentName } from '../../../components/PaymentPicker';
import { ProcessingOverlay } from '../../../components/ProcessingOverlay';
import { Button } from '../../../components/Button';
import { Tap } from '../../../components/Tap';
import { Img } from '../../../components/Img';
import { Icon } from '../../../components/Icon';
import { SuccessBurst } from '../../cart/OrderSuccessScreen';
import { eventTypeById, serviceById, vendorById } from '../../../data/events';
import { useAppDispatch, useAppSelector } from '../../../store';
import { BookingDraft, resetDraft, setDraft } from '../../../store/slices/booking';
import { placeBooking } from '../../../store/slices/orders';
import { pushNotification } from '../../../store/slices/profile';
import { useNav, useStatusBar, useTheme } from '../../../utils/hooks';
import { bookingTotals, serviceAmount } from '../../../utils/pricing';
import { fmtDate, genId, inr } from '../../../utils/format';
import { RootStackParamList } from '../../../navigation/types';

const venueOf = (d: BookingDraft) =>
  d.venue.mode === 'venue' && d.venue.vendorId
    ? { name: vendorById(d.venue.vendorId).name, address: `${vendorById(d.venue.vendorId).area}, Bengaluru` }
    : { name: 'Your venue', address: [d.venue.address, d.venue.landmark].filter(Boolean).join(' · ') || 'Address to be shared' };

const SummaryHeader = ({ d }: { d: BookingDraft }) => {
  const { c } = useTheme();
  const nav = useNav();
  const ev = eventTypeById(d.eventType || '');
  const venue = venueOf(d);
  const rows: [string, string, string, keyof RootStackParamList][] = [
    ['calendar', fmtDate(d.date, true), d.time, 'BookDate'],
    ['account-group-outline', `${d.guests} guests`, 'Estimated headcount', 'BookGuests'],
    ['map-marker-outline', venue.name, venue.address, 'BookVenue'],
  ];
  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      {ev && (
        <Img uri={ev.image} style={{ height: 110 }}>
          <View style={styles.evOverlay}>
            <Text style={{ color: '#FFD27A', fontWeight: '900', fontSize: 11, letterSpacing: 1 }}>YOUR EVENT</Text>
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 20 }}>{ev.name}</Text>
          </View>
        </Img>
      )}
      <View style={{ padding: 14 }}>
        {rows.map(([i, a, b, r]) => (
          <View key={a} style={styles.sRow}>
            <View style={[styles.sIcon, { backgroundColor: c.tint }]}><Icon name={i} size={18} color={c.ink} /></View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ fontWeight: '800', color: c.text }}>{a}</Text>
              <Text style={{ fontSize: 12, color: c.sub }} numberOfLines={1}>{b}</Text>
            </View>
            <Tap onPress={() => nav.navigate(r as any)}><Text style={{ color: c.ink, fontWeight: '800', fontSize: 12 }}>Edit</Text></Tap>
          </View>
        ))}
      </View>
    </Card>
  );
};

/* Step 9 — Review booking & cost */
export const BookReviewScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const d = useAppSelector(s => s.booking);
  const t = bookingTotals(d);
  return (
    <BookingShell step={9} title="Review your booking" subtitle="Check everything before you pay" cta="Proceed to payment" ctaSub={`Pay ${inr(t.advance)} now to confirm`} onNext={() => nav.navigate('BookPayment')}>
      <SummaryHeader d={d} />
      <Text style={styles.h}>Services ({d.services.length})</Text>
      {d.services.map(s => {
        const p = d.picks[s];
        const v = vendorById(p.vendorId!);
        const pkg = v.packages.find(x => x.id === p.packageId)!;
        return (
          <Card key={s} style={{ marginBottom: 10, flexDirection: 'row' }}>
            <Img uri={v.image} style={{ width: 54, height: 54, borderRadius: 12 }} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ fontSize: 11, fontWeight: '900', color: c.ink }}>{serviceById(s).name.toUpperCase()}</Text>
              <Text style={{ fontWeight: '800', color: c.text }} numberOfLines={1}>{v.name}</Text>
              <Text style={{ fontSize: 12, color: c.sub, marginTop: 2 }}>{pkg.name} package{p.addons.length ? ` · ${p.addons.length} add-on${p.addons.length > 1 ? 's' : ''}` : ''}</Text>
              {p.notes ? <Text style={{ fontSize: 12, color: c.sub, fontStyle: 'italic', marginTop: 2 }} numberOfLines={1}>"{p.notes}"</Text> : null}
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontWeight: '900', color: c.text }}>{inr(serviceAmount(s, p, d.guests))}</Text>
              <Tap onPress={() => nav.navigate('BookCustomize')}><Text style={{ color: c.ink, fontWeight: '800', fontSize: 12, marginTop: 6 }}>Edit</Text></Tap>
            </View>
          </Card>
        );
      })}
      <Card style={{ marginTop: 6 }}>
        <Text style={{ fontWeight: '900', fontSize: 16, color: c.text, marginBottom: 6 }}>Cost breakdown</Text>
        {t.lines.map(l => <PriceRow key={l.service} label={serviceById(l.service).name} value={inr(l.amount)} />)}
        {t.venueAmt ? <PriceRow label="Venue booking" value={inr(t.venueAmt)} /> : null}
        <PriceRow label="Platform & coordination fee" value={inr(t.platform)} />
        <PriceRow label="GST (18%)" value={inr(t.gst)} />
        <Divider />
        <PriceRow label="Total event cost" value={inr(t.total)} bold />
        <View style={[styles.adv, { backgroundColor: c.tint }]}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '900', color: c.text }}>Pay now (20% advance)</Text>
            <Text style={{ fontSize: 12, color: c.sub }}>Balance {inr(t.total - t.advance)} due 3 days before the event</Text>
          </View>
          <Text style={{ fontWeight: '900', fontSize: 18, color: c.ink }}>{inr(t.advance)}</Text>
        </View>
      </Card>
    </BookingShell>
  );
};

/* Step 10 — Payment method */
export const BookPaymentScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const dispatch = useAppDispatch();
  const d = useAppSelector(s => s.booking);
  const t = bookingTotals(d);
  const [full, setFull] = useState(false);
  return (
    <BookingShell step={10} title="Payment method" subtitle="Choose how much and how you'd like to pay" cta="Continue" ctaSub={`${paymentName(d.payment)} · ${inr(full ? t.total : t.advance)}`} onNext={() => nav.navigate('BookConfirm')}>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 18 }}>
        {[[false, 'Pay advance', inr(t.advance), '20% now, rest later'], [true, 'Pay in full', inr(t.total), 'Get ₹500 cashback']].map(([k, l, a, s]) => {
          const on = full === k;
          return (
            <Tap key={String(k)} onPress={() => setFull(k as boolean)} style={[styles.payOpt, { borderColor: on ? c.ink : c.line, backgroundColor: on ? c.tint : c.white }]}>
              <Icon name={on ? 'radiobox-marked' : 'radiobox-blank'} size={20} color={on ? c.ink : c.muted} />
              <Text style={{ fontWeight: '800', color: c.text, marginTop: 6 }}>{l as string}</Text>
              <Text style={{ fontWeight: '900', fontSize: 18, color: c.text }}>{a as string}</Text>
              <Text style={{ fontSize: 11, color: k ? c.success : c.sub, fontWeight: '700' }}>{s as string}</Text>
            </Tap>
          );
        })}
      </View>
      <PaymentPicker hideCod value={d.payment} onChange={id => dispatch(setDraft({ payment: id }))} />
    </BookingShell>
  );
};

/* Step 11 — Confirm booking */
export const BookConfirmScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const dispatch = useAppDispatch();
  const d = useAppSelector(s => s.booking);
  const t = bookingTotals(d);
  const [agree, setAgree] = useState(false);
  const [state, setState] = useState<'idle' | 'processing' | 'failed'>('idle');

  const confirm = () => {
    setState('processing');
    setTimeout(() => {
      if (d.payment === 'netbanking') { setState('failed'); return; }
      const id = genId('OCE');
      dispatch(placeBooking({
        id, eventType: d.eventType || 'birthday', date: d.date!, time: d.time, guests: d.guests,
        services: d.services.map(s => ({ service: s, vendorId: d.picks[s].vendorId!, packageId: d.picks[s].packageId!, addons: d.picks[s].addons, notes: d.picks[s].notes, amount: serviceAmount(s, d.picks[s], d.guests) })),
        venue: venueOf(d), total: t.total, paid: t.advance, step: 0, cancelled: false, payment: paymentName(d.payment), createdAt: new Date().toISOString(),
      }));
      dispatch(pushNotification({ id: 'n' + Date.now(), kind: 'booking', title: 'Booking received 🎉', body: `Your ${eventTypeById(d.eventType || '')?.name} on ${fmtDate(d.date)} is being confirmed with ${d.services.length} vendors.`, time: 'Just now', read: false, image: eventTypeById(d.eventType || '')?.image }));
      dispatch(resetDraft());
      setState('idle');
      nav.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'BookingSuccess', params: { id } }] });
    }, 1700);
  };

  return (
    <BookingShell step={11} title="Confirm booking" subtitle="Almost there! Review the policy and confirm" cta={`Confirm & pay ${inr(t.advance)}`} disabled={!agree} onNext={confirm}>
      <SummaryHeader d={d} />
      <Card style={{ marginTop: 14 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {d.services.map(s => (
            <View key={s} style={[styles.svcPill, { backgroundColor: c.tint }]}>
              <Icon name={serviceById(s).icon} size={14} color={c.ink} />
              <Text style={{ marginLeft: 4, fontSize: 12, fontWeight: '800', color: c.ink }}>{vendorById(d.picks[s].vendorId!).name}</Text>
            </View>
          ))}
        </View>
        <Divider />
        <PriceRow label="Total event cost" value={inr(t.total)} />
        <PriceRow label="Paying now" value={inr(t.advance)} bold />
        <PriceRow label="Payment method" value={paymentName(d.payment)} />
      </Card>
      <Card style={{ marginTop: 14 }}>
        <Text style={{ fontWeight: '900', color: c.text, marginBottom: 8 }}>Cancellation policy</Text>
        {['Free cancellation up to 7 days before the event', '50% refund of advance 3–7 days before', 'No refund within 72 hours of the event', 'Vendors are independent partners; Occasion coordinates & protects your payment'].map(x => (
          <View key={x} style={{ flexDirection: 'row', marginBottom: 6 }}>
            <Icon name="circle-small" size={20} color={c.sub} />
            <Text style={{ flex: 1, color: c.sub, fontSize: 13, lineHeight: 19 }}>{x}</Text>
          </View>
        ))}
      </Card>
      <Tap onPress={() => setAgree(a => !a)} style={styles.agree}>
        <Icon name={agree ? 'checkbox-marked' : 'checkbox-blank-outline'} size={24} color={agree ? c.ink : c.muted} />
        <Text style={{ flex: 1, marginLeft: 8, color: c.text, fontSize: 13 }}>I agree to the booking terms, vendor policies & cancellation policy</Text>
      </Tap>
      <InfoBanner icon="shield-lock-outline" tone="success" text="Your money is held securely and released to vendors only after the event." />
      <ProcessingOverlay state={state} label="Confirming your booking" onRetry={() => { dispatch(setDraft({ payment: 'upi' })); setState('idle'); setTimeout(confirm, 50); }} onChange={() => { setState('idle'); nav.navigate('BookPayment'); }} />
    </BookingShell>
  );
};

/* Step 12 — Booking confirmation */
export const BookingSuccessScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const insets = useSafeAreaInsets();
  useStatusBar('dark-content');
  const { id } = useRoute<RouteProp<RootStackParamList, 'BookingSuccess'>>().params;
  const b = useAppSelector(s => s.orders.bookings.find(x => x.id === id));
  if (!b) { return null; }
  const ev = eventTypeById(b.eventType);
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 24, padding: 20, alignItems: 'center', paddingBottom: 40 }}>
        <SuccessBurst color={c.primary} />
        <Text style={{ fontSize: 26, fontWeight: '900', color: c.text }}>Booking confirmed! 🥳</Text>
        <Text style={{ fontSize: 14, color: c.sub, marginTop: 6, textAlign: 'center' }}>Your vendors are being notified.{'\n'}A dedicated coordinator will call you within 2 hours.</Text>
        <View style={[styles.idPill, { backgroundColor: c.tint }]}><Text style={{ color: c.ink, fontWeight: '900' }}>Booking ID  #{b.id}</Text></View>
        <Card style={{ alignSelf: 'stretch', marginTop: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {ev && <Img uri={ev.image} style={{ width: 56, height: 56, borderRadius: 14 }} />}
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontWeight: '900', fontSize: 17, color: c.text }}>{ev?.name}</Text>
              <Text style={{ color: c.sub, fontSize: 13 }}>{fmtDate(b.date, true)} · {b.time}</Text>
            </View>
          </View>
          <Divider />
          <PriceRow label="Guests" value={String(b.guests)} />
          <PriceRow label="Location" value={b.venue.name} />
          <PriceRow label="Services booked" value={String(b.services.length)} />
          <PriceRow label="Advance paid" value={inr(b.paid)} green />
          <PriceRow label="Balance due" value={inr(b.total - b.paid)} />
        </Card>
        <Button title="Track booking" icon="timeline-check-outline" onPress={() => nav.replace('BookingDetails', { id: b.id })} style={{ alignSelf: 'stretch', marginTop: 20 }} />
        <Button title="Back to home" variant="ghost" onPress={() => nav.goBack()} style={{ alignSelf: 'stretch', marginTop: 6 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  evOverlay: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: 12, backgroundColor: 'rgba(20,10,46,0.55)' },
  sRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7 },
  sIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  h: { fontSize: 16, fontWeight: '900', color: '#1D1424', marginTop: 20, marginBottom: 10 },
  adv: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginTop: 10 },
  payOpt: { flex: 1, padding: 12, borderRadius: 16, borderWidth: 1.5 },
  svcPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8 },
  agree: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  idPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginTop: 14 },
});
