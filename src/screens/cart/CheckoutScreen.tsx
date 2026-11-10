import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { Card, Divider, Field, InfoBanner, PriceRow } from '../../components/Bits';
import { Img } from '../../components/Img';
import { Tap } from '../../components/Tap';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { BottomBar } from '../../components/BottomBar';
import { PaymentPicker, paymentName } from '../../components/PaymentPicker';
import { ProcessingOverlay } from '../../components/ProcessingOverlay';
import { productById, timeSlots } from '../../data/gifts';
import { useAppDispatch, useAppSelector } from '../../store';
import { clearCart } from '../../store/slices/shop';
import { placeGiftOrder } from '../../store/slices/orders';
import { pushNotification, selectAddress } from '../../store/slices/profile';
import { useNav, useTheme } from '../../utils/hooks';
import { cartTotals } from '../../utils/pricing';
import { addDays, dayName, genId, inr } from '../../utils/format';

export const CheckoutScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const dispatch = useAppDispatch();
  const cart = useAppSelector(s => s.shop.cart);
  const coupon = useAppSelector(s => s.shop.coupon);
  const addresses = useAppSelector(s => s.profile.addresses);
  const selected = useAppSelector(s => s.profile.selectedAddress);
  const t = cartTotals(cart, coupon);
  const addr = addresses.find(a => a.id === selected);
  const first = cart[0];

  const [name, setName] = useState(first?.receiver || addr?.name || '');
  const [phone, setPhone] = useState(addr?.phone || '');
  const [date, setDate] = useState(first?.date || addDays(0).toISOString());
  const [slot, setSlot] = useState(first?.slot || timeSlots[2].label);
  const [message, setMessage] = useState(first?.message || '');
  const [pay, setPay] = useState('upi');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<'idle' | 'processing' | 'failed'>('idle');
  const [summaryOpen, setSummaryOpen] = useState(false);

  const place = () => {
    const e: Record<string, string> = {};
    if (!addr) { e.addr = 'Please add a delivery address'; }
    if (name.trim().length < 2) { e.name = "Enter recipient's name"; }
    if (phone.replace(/\D/g, '').length < 10) { e.phone = 'Enter a valid 10-digit number'; }
    setErrors(e);
    if (Object.keys(e).length) { return; }
    setState('processing');
    setTimeout(() => {
      if (pay === 'netbanking') { setState('failed'); return; }
      const id = genId('OCG');
      dispatch(placeGiftOrder({
        id, items: cart.map(i => ({ productId: i.productId, qty: i.qty, price: productById(i.productId).price + i.extra, options: i.options })),
        subtotal: t.subtotal, delivery: t.delivery + t.handling + t.slotFee, discount: t.discount, total: t.total, step: 0, cancelled: false,
        placedAt: new Date().toISOString(), deliveryDate: date, slot, address: addr!, recipient: { name, phone }, message, payment: paymentName(pay),
      }));
      dispatch(pushNotification({ id: 'n' + Date.now(), kind: 'order', title: 'Order placed 🎁', body: `Order #${id} is confirmed and will reach ${name} on ${dayName(new Date(date).getDay())}, ${slot}.`, time: 'Just now', read: false, image: productById(cart[0].productId).image }));
      dispatch(clearCart());
      setState('idle');
      nav.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'OrderSuccess', params: { id } }] });
    }, 1600);
  };

  const dates = Array.from({ length: 5 }, (_, i) => addDays(i));

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppHeader title="Checkout" subtitle="Secure checkout · 3 quick steps" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Address */}
        <Step n={1} title="Delivery address" />
        {addresses.map(a => {
          const on = a.id === selected;
          return (
            <Tap key={a.id} scale={0.99} onPress={() => { dispatch(selectAddress(a.id)); setName(a.name); setPhone(a.phone); }} style={[styles.addr, { backgroundColor: c.white, borderColor: on ? c.ink : c.line, borderWidth: on ? 1.6 : 1 }]}>
              <Icon name={on ? 'radiobox-marked' : 'radiobox-blank'} size={22} color={on ? c.ink : c.muted} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontWeight: '800', color: c.text }}>{a.label}</Text>
                  <Text style={{ color: c.sub, fontSize: 12, marginLeft: 6 }}>· {a.name}</Text>
                </View>
                <Text style={{ color: c.sub, fontSize: 12, marginTop: 2 }} numberOfLines={2}>{a.line}, {a.area}, {a.city} {a.pin}</Text>
              </View>
              {on ? <Tap onPress={() => nav.navigate('AddressForm', { id: a.id })}><Text style={{ color: c.ink, fontWeight: '800', fontSize: 12 }}>Edit</Text></Tap> : null}
            </Tap>
          );
        })}
        <Tap onPress={() => nav.navigate('AddressForm')} style={[styles.addNew, { borderColor: c.ink }]}>
          <Icon name="plus" size={18} color={c.ink} /><Text style={{ color: c.ink, fontWeight: '800', marginLeft: 6 }}>Add new address</Text>
        </Tap>
        {errors.addr ? <Text style={styles.err}>{errors.addr}</Text> : null}

        {/* Recipient */}
        <Step n={2} title="Recipient & schedule" />
        <Card>
          <Field label="Recipient name" icon="account-heart-outline" value={name} onChangeText={setName} error={errors.name} />
          <Field label="Recipient mobile" icon="phone-outline" value={phone} onChangeText={setPhone} keyboardType="phone-pad" error={errors.phone} />
          <Text style={styles.label}>Delivery date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {dates.map((d, i) => {
              const on = date.slice(0, 10) === d.toISOString().slice(0, 10);
              return (
                <Tap key={i} onPress={() => setDate(d.toISOString())} style={[styles.date, { borderColor: on ? c.ink : c.line, backgroundColor: on ? c.primary : c.white }]}>
                  <Text style={{ fontSize: 10, fontWeight: '800', color: on ? c.onPrimary : c.sub }}>{i === 0 ? 'TODAY' : i === 1 ? 'TMRW' : dayName(d.getDay()).toUpperCase()}</Text>
                  <Text style={{ fontSize: 18, fontWeight: '900', color: on ? c.onPrimary : c.text }}>{d.getDate()}</Text>
                </Tap>
              );
            })}
          </ScrollView>
          <Text style={[styles.label, { marginTop: 14 }]}>Time slot</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {timeSlots.map(ts => {
              const on = slot === ts.label;
              return (
                <Tap key={ts.id} onPress={() => setSlot(ts.label)} style={[styles.slot, { borderColor: on ? c.ink : c.line, backgroundColor: on ? c.tint : c.white }]}>
                  <Text style={{ fontSize: 12, fontWeight: on ? '800' : '600', color: on ? c.ink : c.text }}>{ts.label}{ts.fee ? `  +₹${ts.fee}` : ''}</Text>
                </Tap>
              );
            })}
          </View>
          <Field label="Gift message" icon="card-text-outline" placeholder="Add a personal note (optional)" value={message} onChangeText={setMessage} multiline style={{ marginBottom: 0 }} />
        </Card>

        {/* Summary */}
        <Card style={{ marginTop: 16 }}>
          <Tap onPress={() => setSummaryOpen(o => !o)} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row' }}>
              {cart.slice(0, 4).map((i, k) => <Img key={i.key} uri={productById(i.productId).image} style={[styles.thumb, { marginLeft: k ? -10 : 0 }]} />)}
            </View>
            <Text style={{ flex: 1, marginLeft: 10, fontWeight: '800', color: c.text }}>Order summary ({t.count})</Text>
            <Icon name={summaryOpen ? 'chevron-up' : 'chevron-down'} size={22} color={c.sub} />
          </Tap>
          {summaryOpen && cart.map(i => (
            <View key={i.key} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
              <Text style={{ flex: 1, color: c.sub, fontSize: 13 }} numberOfLines={1}>{i.qty} × {productById(i.productId).name}</Text>
              <Text style={{ fontWeight: '700', color: c.text }}>{inr((productById(i.productId).price + i.extra) * i.qty)}</Text>
            </View>
          ))}
          <Divider />
          <PriceRow label="Subtotal" value={inr(t.subtotal)} />
          <PriceRow label="Delivery & handling" value={inr(t.delivery + t.handling + t.slotFee)} />
          {t.discount ? <PriceRow label="Coupon discount" value={`– ${inr(t.discount)}`} green /> : null}
          <Divider />
          <PriceRow label="Total payable" value={inr(t.total)} bold />
        </Card>

        {/* Payment */}
        <Step n={3} title="Payment method" />
        <PaymentPicker value={pay} onChange={setPay} />
        <View style={{ marginTop: 14 }}><InfoBanner icon="shield-check" tone="success" text="Your gift is protected by Occasion Assurance — full refund if it doesn't arrive fresh & on time." /></View>
      </ScrollView>
      <BottomBar style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 11, color: c.sub, fontWeight: '700' }}>PAY USING</Text>
          <Text style={{ fontSize: 14, fontWeight: '800', color: c.text }} numberOfLines={1}>{paymentName(pay)}</Text>
        </View>
        <Button title={`Place order · ${inr(t.total)}`} onPress={place} style={{ flex: 2 }} disabled={!cart.length} />
      </BottomBar>
      <ProcessingOverlay state={state} onRetry={() => { setPay('upi'); setState('idle'); setTimeout(place, 50); }} onChange={() => setState('idle')} />
    </KeyboardAvoidingView>
  );
};

const Step = ({ n, title }: { n: number; title: string }) => {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: n === 1 ? 0 : 22, marginBottom: 10 }}>
      <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: c.onPrimary, fontWeight: '900', fontSize: 12 }}>{n}</Text>
      </View>
      <Text style={{ fontSize: 16, fontWeight: '800', color: c.text, marginLeft: 8 }}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  addr: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14, marginBottom: 8 },
  addNew: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 14, borderWidth: 1.3, borderStyle: 'dashed' },
  err: { color: '#D93B4A', fontWeight: '700', fontSize: 12, marginTop: 6 },
  label: { fontSize: 13, fontWeight: '700', color: '#6B6275', marginBottom: 8 },
  date: { width: 56, height: 60, borderRadius: 12, borderWidth: 1.3, alignItems: 'center', justifyContent: 'center' },
  slot: { paddingHorizontal: 10, height: 34, borderRadius: 9, borderWidth: 1.2, justifyContent: 'center' },
  thumb: { width: 34, height: 34, borderRadius: 9, borderWidth: 2, borderColor: '#fff' },
});
