import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { AppHeader } from '../../components/AppHeader';
import { Card, Divider, Field, PriceRow, InfoBanner } from '../../components/Bits';
import { Timeline } from '../../components/Timeline';
import { Img } from '../../components/Img';
import { Tap } from '../../components/Tap';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { Sheet } from '../../components/Sheet';
import { FakeMap } from '../../components/FakeMap';
import { useToast } from '../../components/Toast';
import { productById } from '../../data/gifts';
import { img } from '../../data/images';
import { useAppDispatch, useAppSelector } from '../../store';
import { advanceGift, cancelGift, GIFT_STATUSES } from '../../store/slices/orders';
import { quickQty } from '../../store/slices/shop';
import { useNav, useTheme } from '../../utils/hooks';
import { fmtDate, inr } from '../../utils/format';
import { RootStackParamList } from '../../navigation/types';
import { StatusPill } from './OrdersScreen';

const { width } = Dimensions.get('window');
const REASONS = ['Ordered by mistake', 'Delivery date is too late', 'Want to change the gift', 'Found a better price', 'Other'];

export const GiftOrderDetailsScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const { id } = useRoute<RouteProp<RootStackParamList, 'GiftOrderDetails'>>().params;
  const o = useAppSelector(s => s.orders.gifts.find(g => g.id === id));
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [other, setOther] = useState('');
  if (!o) { return null; }
  const label = o.cancelled ? 'Cancelled' : GIFT_STATUSES[o.step];
  const canCancel = !o.cancelled && o.step < 2;
  const outForDelivery = !o.cancelled && o.step === 3;
  const notes = ['Order received by seller', 'Seller accepted your order', 'Your gift is being freshly prepared', 'Rahul (delivery partner) is on the way', `Delivered to ${o.recipient.name}`];

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <AppHeader title={`Order #${o.id}`} subtitle={`Placed ${fmtDate(o.placedAt)}`} right={<Tap onPress={() => nav.navigate('Help')} style={{ padding: 8 }}><Text style={{ color: c.ink, fontWeight: '800' }}>Help</Text></Tap>} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {outForDelivery && (
          <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 14 }}>
            <FakeMap width={width - 34} height={180} markers={[{ id: 'd', x: 470, y: 380, label: 'Rahul · 8 min' }]} selected="d" />
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }}>
              <Img uri={img('avatar3', 120)} style={{ width: 42, height: 42, borderRadius: 21 }} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ fontWeight: '900', color: c.text }}>Rahul is on the way</Text>
                <Text style={{ fontSize: 12, color: c.success, fontWeight: '700' }}>Arriving in ~8 mins</Text>
              </View>
              <Tap style={[styles.call, { backgroundColor: c.successSoft }]}><Icon name="phone" size={20} color={c.success} /></Tap>
            </View>
          </Card>
        )}
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <StatusPill label={label} />
            {!o.cancelled && o.step < 4 ? (
              <Tap onPress={() => { dispatch(advanceGift(o.id)); toast.show('Status refreshed', 'refresh'); }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="refresh" size={16} color={c.ink} /><Text style={{ color: c.ink, fontWeight: '800', fontSize: 12, marginLeft: 3 }}>Refresh</Text>
              </Tap>
            ) : null}
          </View>
          <Timeline steps={GIFT_STATUSES} current={o.step} cancelled={o.cancelled} notes={notes} />
          {o.cancelled ? <InfoBanner icon="cash-refund" tone="danger" text={`Cancelled: ${o.cancelReason}. Refund of ${inr(o.total)} initiated to ${o.payment}.`} /> : null}
        </Card>

        <Card style={{ marginTop: 14 }}>
          <Text style={styles.k}>DELIVERY DETAILS</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Icon name="calendar-clock" size={18} color={c.ink} />
            <Text style={{ marginLeft: 8, fontWeight: '800', color: c.text }}>{fmtDate(o.deliveryDate, true)} · {o.slot}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Icon name="map-marker-outline" size={18} color={c.ink} />
            <View style={{ marginLeft: 8, flex: 1 }}>
              <Text style={{ fontWeight: '800', color: c.text }}>{o.recipient.name} · {o.recipient.phone}</Text>
              <Text style={{ color: c.sub, fontSize: 13, marginTop: 2 }}>{o.address.line}, {o.address.area}, {o.address.city} {o.address.pin}</Text>
            </View>
          </View>
          {o.message ? (
            <View style={[styles.msg, { backgroundColor: c.tint }]}>
              <Icon name="card-text-outline" size={16} color={c.ink} />
              <Text style={{ flex: 1, marginLeft: 8, color: c.text, fontStyle: 'italic' }}>"{o.message}"</Text>
            </View>
          ) : null}
        </Card>

        <Card style={{ marginTop: 14 }}>
          <Text style={styles.k}>ITEMS</Text>
          {o.items.map(i => {
            const p = productById(i.productId);
            return (
              <Tap key={i.productId} onPress={() => nav.navigate('ProductDetails', { id: p.id })} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Img uri={p.image} style={{ width: 54, height: 54, borderRadius: 12 }} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={{ fontWeight: '700', color: c.text }} numberOfLines={1}>{p.name}</Text>
                  <Text style={{ fontSize: 12, color: c.sub }}>Qty {i.qty}{Object.values(i.options).length ? ' · ' + Object.values(i.options).join(', ') : ''} · {p.seller}</Text>
                </View>
                <Text style={{ fontWeight: '800', color: c.text }}>{inr(i.price * i.qty)}</Text>
              </Tap>
            );
          })}
          <Divider />
          <PriceRow label="Item total" value={inr(o.subtotal)} />
          <PriceRow label="Delivery & handling" value={inr(o.delivery)} />
          {o.discount ? <PriceRow label="Discount" value={`– ${inr(o.discount)}`} green /> : null}
          <Divider />
          <PriceRow label={`Paid via ${o.payment}`} value={inr(o.total)} bold />
        </Card>

        {o.review ? (
          <Card style={{ marginTop: 14 }}>
            <Text style={styles.k}>YOUR REVIEW</Text>
            <View style={{ flexDirection: 'row' }}>{[1, 2, 3, 4, 5].map(i => <Icon key={i} name={i <= o.review!.rating ? 'star' : 'star-outline'} size={20} color={c.gold} />)}</View>
            {o.review.text ? <Text style={{ color: c.sub, marginTop: 6 }}>{o.review.text}</Text> : null}
          </Card>
        ) : null}

        <View style={{ gap: 10, marginTop: 18 }}>
          {!o.cancelled && o.step === 4 && !o.review && <Button title="Rate & review" icon="star-outline" onPress={() => nav.navigate('Review', { kind: 'gift', id: o.id })} />}
          {(o.cancelled || o.step === 4) && <Button title="Reorder" icon="repeat" variant="outline" onPress={() => { o.items.forEach(i => dispatch(quickQty({ productId: i.productId, delta: i.qty }))); nav.navigate('Cart'); }} />}
          <Button title="Download invoice" icon="file-download-outline" variant="ghost" onPress={() => toast.show('Invoice saved to Downloads', 'file-check')} />
          {canCancel && <Button title="Cancel order" icon="close-circle-outline" variant="danger" onPress={() => setCancelOpen(true)} />}
          {!o.cancelled && o.step >= 2 && o.step < 4 && <Text style={{ textAlign: 'center', color: c.muted, fontSize: 12 }}>This order can no longer be cancelled as the seller has started preparing it.</Text>}
        </View>
      </ScrollView>

      <Sheet visible={cancelOpen} onClose={() => setCancelOpen(false)} title="Cancel order?">
        <Text style={{ color: c.sub, marginBottom: 14 }}>Please tell us why. A full refund of <Text style={{ fontWeight: '800', color: c.text }}>{inr(o.total)}</Text> will go to {o.payment} in 3–5 days.</Text>
        {REASONS.map(r => (
          <Tap key={r} onPress={() => setReason(r)} style={styles.reason}>
            <Icon name={reason === r ? 'radiobox-marked' : 'radiobox-blank'} size={22} color={reason === r ? c.ink : c.muted} />
            <Text style={{ marginLeft: 10, color: c.text, fontWeight: reason === r ? '800' : '500' }}>{r}</Text>
          </Tap>
        ))}
        {reason === 'Other' && <Field placeholder="Tell us more" value={other} onChangeText={setOther} style={{ marginTop: 8 }} />}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
          <Button title="Keep order" variant="outline" style={{ flex: 1 }} onPress={() => setCancelOpen(false)} />
          <Button title="Cancel order" variant="dark" style={{ flex: 1 }} disabled={!reason} onPress={() => { dispatch(cancelGift({ id: o.id, reason: reason === 'Other' ? other || 'Other' : reason })); setCancelOpen(false); toast.show('Order cancelled · refund initiated', 'cash-refund'); }} />
        </View>
      </Sheet>
    </View>
  );
};

const styles = StyleSheet.create({
  k: { fontSize: 11, fontWeight: '900', color: '#A39BAD', letterSpacing: 1, marginBottom: 10 },
  msg: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 10, marginTop: 12 },
  call: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  reason: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
});
