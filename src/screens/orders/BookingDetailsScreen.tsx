import React, { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import LinearGradient from '../../components/Gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Divider, Field, InfoBanner, PriceRow } from '../../components/Bits';
import { Timeline } from '../../components/Timeline';
import { Img } from '../../components/Img';
import { Tap } from '../../components/Tap';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { Sheet } from '../../components/Sheet';
import { useToast } from '../../components/Toast';
import { eventTypeById, serviceById, vendorById } from '../../data/events';
import { img } from '../../data/images';
import { useAppDispatch, useAppSelector } from '../../store';
import { advanceBooking, cancelBooking, EVENT_STATUSES } from '../../store/slices/orders';
import { useNav, useStatusBar, useTheme } from '../../utils/hooks';
import { fmtDate, inr } from '../../utils/format';
import { RootStackParamList } from '../../navigation/types';
import { StatusPill } from './OrdersScreen';

const REASONS = ['Event postponed', 'Event cancelled', 'Found another vendor', 'Budget changed', 'Other'];

export const BookingDetailsScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  useStatusBar('light-content');
  const { id } = useRoute<RouteProp<RootStackParamList, 'BookingDetails'>>().params;
  const b = useAppSelector(s => s.orders.bookings.find(x => x.id === id));
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [other, setOther] = useState('');
  if (!b) { return null; }
  const ev = eventTypeById(b.eventType)!;
  const label = b.cancelled ? 'Cancelled' : EVENT_STATUSES[b.step];
  const daysLeft = Math.ceil((new Date(b.date).getTime() - Date.now()) / 86400000);
  const refund = daysLeft >= 7 ? b.paid : daysLeft >= 3 ? Math.round(b.paid / 2) : 0;
  const notes = ['Booking request received', 'Payment verified & booking confirmed', `${b.services.length} vendors assigned · coordinator Priya`, 'Vendors are setting up at the venue', 'Hope you had a wonderful celebration!'];
  const vendorStatus = (i: number) => (b.cancelled ? 'Cancelled' : b.step >= 4 ? 'Completed' : b.step >= 2 ? 'Confirmed' : i === 0 && b.step >= 1 ? 'Confirmed' : 'Awaiting');

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Img uri={ev.image.replace('w=500', 'w=900')} style={{ height: 210 + insets.top }}>
          <LinearGradient colors={['rgba(20,10,46,0.5)', 'rgba(20,10,46,0.1)', 'rgba(20,10,46,0.95)']} style={StyleSheet.absoluteFill} />
          <View style={[styles.top, { top: insets.top + 6 }]}>
            <Tap onPress={() => nav.goBack()} style={styles.btn}><Icon name="arrow-left" size={22} color="#fff" /></Tap>
            <Tap onPress={() => nav.navigate('Help')} style={styles.btn}><Icon name="help-circle-outline" size={22} color="#fff" /></Tap>
          </View>
          <View style={{ position: 'absolute', left: 16, right: 16, bottom: 16 }}>
            <StatusPill label={label} />
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 8 }}>{ev.name}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontWeight: '600', marginTop: 2 }}>#{b.id} · {fmtDate(b.date, true)} · {b.time}</Text>
          </View>
        </Img>

        <View style={{ padding: 16 }}>
          {!b.cancelled && b.step < 4 && daysLeft > 0 && (
            <View style={[styles.countdown, { backgroundColor: c.white, borderColor: c.line }]}>
              {[[daysLeft, 'days to go'], [b.guests, 'guests'], [b.services.length, 'vendors']].map(([n, l]) => (
                <View key={String(l)} style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ fontSize: 22, fontWeight: '900', color: c.ink }}>{n}</Text>
                  <Text style={{ fontSize: 11, color: c.sub, fontWeight: '700' }}>{l}</Text>
                </View>
              ))}
            </View>
          )}

          <Card style={{ marginTop: 14 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <Text style={{ fontWeight: '900', fontSize: 16, color: c.text }}>Booking status</Text>
              {!b.cancelled && b.step < 4 ? (
                <Tap onPress={() => { dispatch(advanceBooking(b.id)); toast.show('Status refreshed', 'refresh'); }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="refresh" size={16} color={c.ink} /><Text style={{ color: c.ink, fontWeight: '800', fontSize: 12, marginLeft: 3 }}>Refresh</Text>
                </Tap>
              ) : null}
            </View>
            <Timeline steps={EVENT_STATUSES} current={b.step} cancelled={b.cancelled} notes={notes} />
            {b.cancelled ? <InfoBanner icon="cash-refund" tone="danger" text={`Cancelled: ${b.cancelReason}. Eligible refund will be credited in 3–5 days.`} /> : null}
          </Card>

          {!b.cancelled && b.step >= 2 && (
            <Card style={{ marginTop: 14, flexDirection: 'row', alignItems: 'center' }}>
              <Img uri={img('avatar6', 120)} style={{ width: 46, height: 46, borderRadius: 23 }} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ fontSize: 11, fontWeight: '900', color: c.ink }}>YOUR EVENT COORDINATOR</Text>
                <Text style={{ fontWeight: '900', color: c.text }}>Priya Nair</Text>
                <Text style={{ fontSize: 12, color: c.sub }}>Available 9 AM – 9 PM</Text>
              </View>
              <Tap onPress={() => Linking.openURL('tel:+918000000000')} style={[styles.round, { backgroundColor: c.successSoft }]}><Icon name="phone" size={20} color={c.success} /></Tap>
              <Tap onPress={() => toast.show('Chat opened with Priya', 'chat')} style={[styles.round, { backgroundColor: c.tint, marginLeft: 8 }]}><Icon name="chat-outline" size={20} color={c.ink} /></Tap>
            </Card>
          )}

          <Text style={styles.h}>Services & vendors</Text>
          {b.services.map((s, i) => {
            const v = vendorById(s.vendorId);
            const pkg = v.packages.find(p => p.id === s.packageId) || v.packages[0];
            const st = vendorStatus(i);
            return (
              <Card key={s.service} style={{ marginBottom: 10 }} onPress={() => nav.navigate('VendorDetails', { id: v.id })}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Img uri={v.image} style={{ width: 54, height: 54, borderRadius: 12 }} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={{ fontSize: 11, fontWeight: '900', color: c.ink }}>{serviceById(s.service).name.toUpperCase()}</Text>
                    <Text style={{ fontWeight: '800', color: c.text }} numberOfLines={1}>{v.name}</Text>
                    <Text style={{ fontSize: 12, color: c.sub }}>{pkg.name} package · {inr(s.amount)}</Text>
                  </View>
                  <View style={[styles.vs, { backgroundColor: st === 'Awaiting' ? c.warnSoft : st === 'Cancelled' ? c.dangerSoft : c.successSoft }]}>
                    <Text style={{ fontSize: 10, fontWeight: '900', color: st === 'Awaiting' ? c.warn : st === 'Cancelled' ? c.danger : c.success }}>{st.toUpperCase()}</Text>
                  </View>
                </View>
                {s.notes ? <Text style={{ fontSize: 12, color: c.sub, fontStyle: 'italic', marginTop: 8 }}>Note: "{s.notes}"</Text> : null}
              </Card>
            );
          })}

          <Card style={{ marginTop: 4 }}>
            <Text style={{ fontWeight: '900', fontSize: 16, color: c.text, marginBottom: 6 }}>Location</Text>
            <View style={{ flexDirection: 'row' }}>
              <Icon name="map-marker" size={20} color={c.ink} />
              <View style={{ marginLeft: 8, flex: 1 }}>
                <Text style={{ fontWeight: '800', color: c.text }}>{b.venue.name}</Text>
                <Text style={{ color: c.sub, fontSize: 13 }}>{b.venue.address}</Text>
              </View>
              <Tap onPress={() => toast.show('Opening directions…', 'directions')}><Text style={{ color: c.ink, fontWeight: '800' }}>Directions</Text></Tap>
            </View>
          </Card>

          <Card style={{ marginTop: 14 }}>
            <Text style={{ fontWeight: '900', fontSize: 16, color: c.text, marginBottom: 6 }}>Payment</Text>
            <PriceRow label="Total event cost" value={inr(b.total)} />
            <PriceRow label={`Paid via ${b.payment}`} value={inr(b.paid)} green />
            <Divider />
            <PriceRow label="Balance due" value={inr(b.total - b.paid)} bold sub={b.total > b.paid ? 'Due 3 days before the event' : undefined} />
            {!b.cancelled && b.total > b.paid && <Button title={`Pay balance ${inr(b.total - b.paid)}`} size="md" style={{ marginTop: 10 }} onPress={() => toast.show('Payment link sent to your phone', 'cellphone-message')} />}
          </Card>

          <View style={{ gap: 10, marginTop: 18 }}>
            {!b.cancelled && b.step === 4 && !b.review && <Button title="Rate your event" icon="star-outline" onPress={() => nav.navigate('Review', { kind: 'event', id: b.id })} />}
            {b.review ? <InfoBanner icon="star" tone="success" text={`You rated this event ${b.review.rating}/5. Thank you!`} /> : null}
            <Button title="Download booking summary" icon="file-download-outline" variant="ghost" onPress={() => toast.show('Summary saved to Downloads', 'file-check')} />
            {!b.cancelled && b.step < 3 && <Button title="Cancel booking" icon="close-circle-outline" variant="danger" onPress={() => setCancelOpen(true)} />}
          </View>
        </View>
      </ScrollView>

      <Sheet visible={cancelOpen} onClose={() => setCancelOpen(false)} title="Cancel this booking?">
        <InfoBanner icon="cash-refund" tone={refund ? 'success' : 'warn'} text={refund ? `You'll get ${inr(refund)} back (${daysLeft >= 7 ? 'full' : '50%'} refund of your advance).` : 'Cancelling within 72 hours of the event is non-refundable.'} />
        <Text style={{ fontWeight: '800', color: c.text, marginTop: 14, marginBottom: 4 }}>Reason for cancellation</Text>
        {REASONS.map(r => (
          <Tap key={r} onPress={() => setReason(r)} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
            <Icon name={reason === r ? 'radiobox-marked' : 'radiobox-blank'} size={22} color={reason === r ? c.ink : c.muted} />
            <Text style={{ marginLeft: 10, color: c.text, fontWeight: reason === r ? '800' : '500' }}>{r}</Text>
          </Tap>
        ))}
        {reason === 'Other' && <Field placeholder="Tell us more" value={other} onChangeText={setOther} style={{ marginTop: 8 }} />}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
          <Button title="Keep booking" variant="outline" style={{ flex: 1 }} onPress={() => setCancelOpen(false)} />
          <Button title="Cancel booking" variant="dark" style={{ flex: 1 }} disabled={!reason} onPress={() => { dispatch(cancelBooking({ id: b.id, reason: reason === 'Other' ? other || 'Other' : reason })); setCancelOpen(false); toast.show('Booking cancelled', 'calendar-remove'); }} />
        </View>
      </Sheet>
    </View>
  );
};

const styles = StyleSheet.create({
  top: { position: 'absolute', left: 12, right: 12, flexDirection: 'row', justifyContent: 'space-between' },
  btn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  countdown: { flexDirection: 'row', padding: 14, borderRadius: 16, borderWidth: 1 },
  round: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  h: { fontSize: 16, fontWeight: '900', color: '#1D1424', marginTop: 20, marginBottom: 10 },
  vs: { paddingHorizontal: 7, paddingVertical: 4, borderRadius: 6 },
});
