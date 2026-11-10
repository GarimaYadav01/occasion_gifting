import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tap } from './Tap';
import { Img } from './Img';
import { Icon } from './Icon';
import { Price, Rating } from './Bits';
import { Product } from '../data/gifts';
import { useAppDispatch, useAppSelector } from '../store';
import { quickQty, toggleWishProduct } from '../store/slices/shop';
import { useNav, useTheme } from '../utils/hooks';
import { pctOff } from '../utils/format';
import { useToast } from './Toast';

export const AddButton = ({ productId, wide }: { productId: string; wide?: boolean }) => {
  const { c } = useTheme();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const qty = useAppSelector(s => s.shop.cart.filter(i => i.productId === productId).reduce((n, i) => n + i.qty, 0));
  if (qty > 0) {
    return (
      <View style={[styles.stepper, { backgroundColor: c.primary }, wide && { alignSelf: 'stretch' }]}>
        <Tap onPress={() => dispatch(quickQty({ productId, delta: -1 }))} style={styles.stepBtn}><Icon name="minus" size={15} color={c.onPrimary} /></Tap>
        <Text style={{ color: c.onPrimary, fontWeight: '800', fontSize: 13 }}>{qty}</Text>
        <Tap onPress={() => dispatch(quickQty({ productId, delta: 1 }))} style={styles.stepBtn}><Icon name="plus" size={15} color={c.onPrimary} /></Tap>
      </View>
    );
  }
  return (
    <Tap
      onPress={() => { dispatch(quickQty({ productId, delta: 1 })); toast.show('Added to cart', 'check-circle'); }}
      style={[styles.add, { borderColor: c.ink, backgroundColor: c.tint }, wide && { alignSelf: 'stretch' }]}>
      <Text style={{ color: c.ink, fontWeight: '900', fontSize: 13 }}>ADD</Text>
    </Tap>
  );
};

export const WishHeart = ({ productId, style }: { productId: string; style?: any }) => {
  const dispatch = useAppDispatch();
  const on = useAppSelector(s => s.shop.wishProducts.includes(productId));
  const toast = useToast();
  return (
    <Tap
      onPress={() => { dispatch(toggleWishProduct(productId)); toast.show(on ? 'Removed from wishlist' : 'Saved to wishlist', on ? 'heart-off' : 'heart'); }}
      style={[styles.heart, style]}>
      <Icon name={on ? 'heart' : 'heart-outline'} size={18} color={on ? '#FF4F8B' : '#1D1424'} />
    </Tap>
  );
};

/** Compact, dense Blinkit/Zepto-style product tile. */
export const ProductCard = ({ p, width = 150 }: { p: Product; width?: number }) => {
  const { c } = useTheme();
  const nav = useNav();
  const off = pctOff(p.price, p.mrp);
  return (
    <Tap scale={0.97} onPress={() => nav.push('ProductDetails', { id: p.id })} style={[styles.card, { width, borderColor: c.line, backgroundColor: c.white }]}>
      <Img uri={p.image} style={[styles.img, { height: width * 0.92 }]}>
        {off > 0 && (
          <View style={[styles.off, { backgroundColor: c.info }]}>
            <Text style={styles.offTxt}>{off}%</Text>
            <Text style={styles.offTxt}>OFF</Text>
          </View>
        )}
        <WishHeart productId={p.id} style={styles.heartPos} />
        <View style={styles.addPos}><AddButton productId={p.id} /></View>
      </Img>
      <View style={{ padding: 8, paddingTop: 10 }}>
        <View style={[styles.eta, { backgroundColor: p.sameDay ? c.successSoft : c.lineSoft }]}>
          <Icon name={p.sameDay ? 'lightning-bolt' : 'clock-outline'} size={10} color={p.sameDay ? c.success : c.sub} />
          <Text style={{ fontSize: 9.5, fontWeight: '800', color: p.sameDay ? c.success : c.sub, marginLeft: 2 }}>{p.eta.toUpperCase()}</Text>
        </View>
        <Text numberOfLines={2} style={[styles.name, { color: c.text }]}>{p.name}</Text>
        <Text style={{ fontSize: 11, color: c.sub, marginBottom: 4 }}>{p.size}</Text>
        <Rating value={p.rating} count={p.reviews} small />
        <View style={{ marginTop: 6 }}><Price price={p.price} mrp={p.mrp} size={14} /></View>
      </View>
    </Tap>
  );
};

/** Wide horizontal row used in wishlist / search results. */
export const ProductRow = ({ p, right }: { p: Product; right?: React.ReactNode }) => {
  const { c } = useTheme();
  const nav = useNav();
  return (
    <Tap scale={0.98} onPress={() => nav.push('ProductDetails', { id: p.id })} style={[styles.row, { backgroundColor: c.white, borderColor: c.line }]}>
      <Img uri={p.image} style={styles.rowImg} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text numberOfLines={2} style={[styles.name, { color: c.text, minHeight: 0 }]}>{p.name}</Text>
        <Text style={{ fontSize: 12, color: c.sub, marginBottom: 6 }}>{p.size} · {p.seller}</Text>
        <Rating value={p.rating} count={p.reviews} small />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
          <Price price={p.price} mrp={p.mrp} />
          {right ?? <AddButton productId={p.id} />}
        </View>
      </View>
    </Tap>
  );
};

const styles = StyleSheet.create({
  card: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  img: { width: '100%', borderBottomLeftRadius: 0 },
  off: { position: 'absolute', top: 0, left: 8, paddingHorizontal: 5, paddingTop: 3, paddingBottom: 5, borderBottomLeftRadius: 6, borderBottomRightRadius: 6, alignItems: 'center' },
  offTxt: { color: '#fff', fontSize: 9, fontWeight: '900', lineHeight: 10 },
  heartPos: { position: 'absolute', top: 6, right: 6 },
  heart: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  addPos: { position: 'absolute', right: 6, bottom: -1 },
  add: { borderWidth: 1.4, borderRadius: 8, paddingHorizontal: 16, height: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', marginBottom: 6 },
  stepper: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, height: 32, marginBottom: 6 },
  stepBtn: { width: 28, height: 32, alignItems: 'center', justifyContent: 'center' },
  eta: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4, marginBottom: 5 },
  name: { fontSize: 13, fontWeight: '700', lineHeight: 17, minHeight: 34, marginBottom: 2 },
  row: { flexDirection: 'row', padding: 10, borderRadius: 16, borderWidth: 1, marginBottom: 10 },
  rowImg: { width: 96, height: 96, borderRadius: 12 },
});
