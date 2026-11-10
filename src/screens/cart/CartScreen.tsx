import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { Card, Divider, PriceRow, QtyStepper, SectionTitle } from '../../components/Bits';
import { Img } from '../../components/Img';
import { Tap } from '../../components/Tap';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { BottomBar } from '../../components/BottomBar';
import { Sheet } from '../../components/Sheet';
import { EmptyState } from '../../components/States';
import { ProductCard } from '../../components/ProductCard';
import { useToast } from '../../components/Toast';
import { coupons, productById, products } from '../../data/gifts';
import { useAppDispatch, useAppSelector } from '../../store';
import { applyCoupon, changeQty, removeFromCart } from '../../store/slices/shop';
import { useNav, useTheme } from '../../utils/hooks';
import { cartTotals, linePrice } from '../../utils/pricing';
import { inr, relativeDay } from '../../utils/format';

export const CartScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const cart = useAppSelector(s => s.shop.cart);
  const coupon = useAppSelector(s => s.shop.coupon);
  const [sheet, setSheet] = useState(false);
  const [code, setCode] = useState('');
  const [codeErr, setCodeErr] = useState('');
  const t = cartTotals(cart, coupon);

  const tryCoupon = (raw: string) => {
    const k = raw.trim().toUpperCase();
    const cp = coupons.find(x => x.code === k);
    if (!cp) { setCodeErr('This coupon code is not valid'); return; }
    if (t.subtotal < cp.min) { setCodeErr(`Add items worth ${inr(cp.min - t.subtotal)} more to use ${k}`); return; }
    dispatch(applyCoupon(k));
    setSheet(false); setCode(''); setCodeErr('');
    toast.show(`${k} applied 🎉`, 'ticket-percent');
  };

  if (!cart.length) {
    return (
      <View style={{ flex: 1, backgroundColor: c.bg }}>
        <AppHeader title="My Cart" />
        <EmptyState icon="cart-outline" title="Your cart is empty" body="Looks like you haven't added any gifts yet. Let's find something special!" cta="Start shopping" onCta={() => nav.navigate('Main', { screen: 'Gifts' })} />
        <SectionTitle title="Popular right now" />
        <FlatList data={products.slice(0, 8)} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }} keyExtractor={p => p.id} renderItem={({ item }) => <ProductCard p={item} width={148} />} />
      </View>
    );
  }

  const suggestions = products.filter(p => !cart.some(i => i.productId === p.id) && p.price < 700).slice(0, 8);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <AppHeader title="My Cart" subtitle={`${t.count} item${t.count > 1 ? 's' : ''} · Delivering to ${'Home'}`} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        {t.savings > 0 && (
          <View style={[styles.save, { backgroundColor: c.successSoft }]}>
            <Icon name="party-popper" size={18} color={c.success} />
            <Text style={{ color: c.success, fontWeight: '800', marginLeft: 8 }}>Yay! You're saving {inr(t.savings)} on this order</Text>
          </View>
        )}
        <Card style={{ padding: 0 }}>
          <View style={[styles.etaRow, { borderBottomColor: c.line }]}>
            <View style={[styles.etaIcon, { backgroundColor: c.tint }]}><Icon name="timer-outline" size={20} color={c.ink} /></View>
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontWeight: '800', fontSize: 15, color: c.text }}>Delivery in 2 hours</Text>
              <Text style={{ fontSize: 12, color: c.sub }}>Shipment of {t.count} item{t.count > 1 ? 's' : ''} · scheduled slots honoured</Text>
            </View>
          </View>
          {cart.map(i => {
            const p = productById(i.productId);
            const optText = Object.values(i.options).join(' · ');
            return (
              <View key={i.key} style={[styles.item, { borderBottomColor: c.lineSoft }]}>
                <Tap onPress={() => nav.navigate('ProductDetails', { id: p.id })}><Img uri={p.image} style={styles.img} /></Tap>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={{ fontWeight: '700', color: c.text, fontSize: 14 }} numberOfLines={2}>{p.name}</Text>
                  <Text style={{ fontSize: 12, color: c.sub, marginTop: 2 }}>{optText || p.size}</Text>
                  {i.slot ? (
                    <View style={styles.meta}><Icon name="calendar-clock" size={13} color={c.ink} /><Text style={[styles.metaTxt, { color: c.ink }]}>{relativeDay(i.date!)} · {i.slot}</Text></View>
                  ) : (
                    <Tap onPress={() => nav.navigate('ProductDetails', { id: p.id })} style={styles.meta}><Icon name="calendar-alert" size={13} color={c.warn} /><Text style={[styles.metaTxt, { color: c.warn }]}>Earliest slot · tap to schedule</Text></Tap>
                  )}
                  {i.message ? <View style={styles.meta}><Icon name="card-text-outline" size={13} color={c.sub} /><Text style={[styles.metaTxt, { color: c.sub }]} numberOfLines={1}>"{i.message}"</Text></View> : null}
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                    <View>
                      <Text style={{ fontWeight: '800', fontSize: 15, color: c.text }}>{inr(linePrice(i))}</Text>
                      <Tap onPress={() => { dispatch(removeFromCart(i.key)); toast.show('Item removed', 'trash-can-outline'); }}><Text style={{ color: c.danger, fontSize: 12, fontWeight: '700', marginTop: 2 }}>Remove</Text></Tap>
                    </View>
                    <QtyStepper small qty={i.qty} onChange={d => dispatch(changeQty({ key: i.key, delta: d }))} />
                  </View>
                </View>
              </View>
            );
          })}
          <Tap onPress={() => nav.navigate('Main', { screen: 'Gifts' })} style={styles.addMore}>
            <Icon name="plus-circle-outline" size={18} color={c.ink} />
            <Text style={{ color: c.ink, fontWeight: '800', marginLeft: 6 }}>Add more items</Text>
          </Tap>
        </Card>

        <Text style={{ fontSize: 16, fontWeight: '800', color: c.text, marginTop: 22, marginBottom: 10 }}>Did you forget? 🎈</Text>
        <FlatList data={suggestions} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }} keyExtractor={p => p.id} renderItem={({ item }) => <ProductCard p={item} width={136} />} />

        {/* Coupon */}
        <Tap scale={0.98} onPress={() => setSheet(true)} style={[styles.coupon, { backgroundColor: c.white, borderColor: coupon ? c.success : c.line }]}>
          <View style={[styles.etaIcon, { backgroundColor: coupon ? c.successSoft : c.accentSoft }]}><Icon name="ticket-percent" size={20} color={coupon ? c.success : c.accent} /></View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={{ fontWeight: '800', color: c.text, fontSize: 15 }}>{coupon ? `'${coupon}' applied` : 'Apply coupon'}</Text>
            <Text style={{ fontSize: 12, color: coupon ? c.success : c.sub, fontWeight: '600' }}>{coupon ? `You saved ${inr(t.discount)}` : `${coupons.length} offers available for you`}</Text>
          </View>
          {coupon ? (
            <Tap onPress={() => dispatch(applyCoupon(null))}><Text style={{ color: c.danger, fontWeight: '800' }}>Remove</Text></Tap>
          ) : <Icon name="chevron-right" size={22} color={c.muted} />}
        </Tap>
        {coupon && t.discount === 0 ? <Text style={{ color: c.warn, fontSize: 12, fontWeight: '700', marginTop: 6 }}>Cart value is below the minimum for this coupon.</Text> : null}

        {/* Bill */}
        <Card style={{ marginTop: 16 }}>
          <Text style={{ fontWeight: '800', fontSize: 16, color: c.text, marginBottom: 6 }}>Bill details</Text>
          <PriceRow label="Item total (MRP)" value={inr(t.mrp)} />
          <PriceRow label="Product discount" value={`– ${inr(t.mrp - t.subtotal)}`} green />
          {t.discount ? <PriceRow label={`Coupon (${coupon})`} value={`– ${inr(t.discount)}`} green /> : null}
          <PriceRow label="Delivery fee" value={t.delivery ? inr(t.delivery) : 'FREE'} green={!t.delivery} sub={t.delivery ? `Add ${inr(499 - t.subtotal)} more for free delivery` : undefined} />
          {t.slotFee ? <PriceRow label="Special slot fee" value={inr(t.slotFee)} /> : null}
          <PriceRow label="Handling charge" value={inr(t.handling)} />
          <Divider />
          <PriceRow label="To pay" value={inr(t.total)} bold />
        </Card>

        <Card style={{ marginTop: 16, flexDirection: 'row' }}>
          <Icon name="information-outline" size={18} color={c.sub} />
          <Text style={{ flex: 1, marginLeft: 8, fontSize: 12, color: c.sub, lineHeight: 18 }}>Orders can be cancelled free of charge until the seller starts preparing them. Products are sold and fulfilled by independent sellers on Occasion.</Text>
        </Card>
      </ScrollView>

      <BottomBar style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: '900', color: c.text }}>{inr(t.total)}</Text>
          <Text style={{ fontSize: 12, color: c.ink, fontWeight: '700' }}>View bill details</Text>
        </View>
        <Button title="Proceed to checkout" iconRight="arrow-right" onPress={() => nav.navigate('Checkout')} style={{ flex: 1.6 }} />
      </BottomBar>

      <Sheet visible={sheet} onClose={() => { setSheet(false); setCodeErr(''); }} title="Apply coupon">
        <View style={[styles.codeRow, { borderColor: codeErr ? c.danger : c.line, backgroundColor: c.white }]}>
          <TextInput value={code} onChangeText={x => { setCode(x); setCodeErr(''); }} placeholder="Enter coupon code" placeholderTextColor={c.muted} autoCapitalize="characters" style={{ flex: 1, fontSize: 15, fontWeight: '700', color: c.text, paddingVertical: 0 }} />
          <Tap onPress={() => tryCoupon(code)}><Text style={{ color: code ? c.ink : c.muted, fontWeight: '900' }}>APPLY</Text></Tap>
        </View>
        {codeErr ? <Text style={{ color: c.danger, fontWeight: '700', fontSize: 12, marginTop: 6 }}>{codeErr}</Text> : null}
        <Text style={{ fontSize: 12, fontWeight: '800', color: c.muted, letterSpacing: 1, marginTop: 18, marginBottom: 8 }}>AVAILABLE OFFERS</Text>
        {coupons.map(cp => {
          const ok = t.subtotal >= cp.min;
          return (
            <View key={cp.code} style={[styles.cpCard, { backgroundColor: c.white, borderColor: c.line }]}>
              <View style={[styles.cpSide, { backgroundColor: ok ? c.accent : c.muted }]}><Text style={styles.cpSideTxt}>{cp.pct ? `${cp.pct}% OFF` : `₹${cp.off} OFF`}</Text></View>
              <View style={{ flex: 1, padding: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontWeight: '900', fontSize: 15, color: c.text, letterSpacing: 0.5 }}>{cp.code}</Text>
                  <Tap onPress={() => tryCoupon(cp.code)}><Text style={{ color: ok ? c.ink : c.muted, fontWeight: '900' }}>APPLY</Text></Tap>
                </View>
                <Text style={{ fontSize: 12, color: c.success, fontWeight: '700', marginTop: 3 }}>{cp.title}</Text>
                <Text style={{ fontSize: 11, color: ok ? c.sub : c.danger, marginTop: 4 }}>{ok ? `Valid on orders above ${inr(cp.min)}` : `Add ${inr(cp.min - t.subtotal)} more to unlock`}</Text>
              </View>
            </View>
          );
        })}
      </Sheet>
    </View>
  );
};

const styles = StyleSheet.create({
  save: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 12 },
  etaRow: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: StyleSheet.hairlineWidth },
  etaIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  item: { flexDirection: 'row', padding: 14, borderBottomWidth: 1 },
  img: { width: 72, height: 72, borderRadius: 12 },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  metaTxt: { fontSize: 11.5, fontWeight: '700', marginLeft: 4, flexShrink: 1 },
  addMore: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14 },
  coupon: { flexDirection: 'row', alignItems: 'center', marginTop: 22, padding: 12, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed' },
  codeRow: { flexDirection: 'row', alignItems: 'center', height: 52, borderRadius: 12, borderWidth: 1.4, paddingHorizontal: 14 },
  cpCard: { flexDirection: 'row', borderRadius: 14, borderWidth: 1, marginBottom: 10, overflow: 'hidden' },
  cpSide: { width: 46, alignItems: 'center', justifyContent: 'center' },
  cpSideTxt: { color: '#fff', fontWeight: '900', fontSize: 11, transform: [{ rotate: '-90deg' }], width: 80, textAlign: 'center' },
});
