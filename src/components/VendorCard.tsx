import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from './Gradient';
import { Tap } from './Tap';
import { Img } from './Img';
import { Icon } from './Icon';
import { Rating, Tag } from './Bits';
import { Vendor, serviceById } from '../data/events';
import { useAppDispatch, useAppSelector } from '../store';
import { toggleWishVendor } from '../store/slices/shop';
import { useNav, useTheme } from '../utils/hooks';
import { inr } from '../utils/format';

export const VendorHeart = ({ id }: { id: string }) => {
  const dispatch = useAppDispatch();
  const on = useAppSelector(s => s.shop.wishVendors.includes(id));
  return (
    <Tap onPress={() => dispatch(toggleWishVendor(id))} style={styles.heart}>
      <Icon name={on ? 'heart' : 'heart-outline'} size={18} color={on ? '#FF4F8B' : '#1D1424'} />
    </Tap>
  );
};

/** Horizontal-scroll vendor tile. */
export const VendorTile = ({ v, width = 230, fromBooking }: { v: Vendor; width?: number; fromBooking?: boolean }) => {
  const { c } = useTheme();
  const nav = useNav();
  return (
    <Tap scale={0.97} onPress={() => nav.push('VendorDetails', { id: v.id, fromBooking })} style={[styles.tile, { width, backgroundColor: c.white, borderColor: c.line }]}>
      <Img uri={v.image} style={{ height: width * 0.6 }}>
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.55)']} style={StyleSheet.absoluteFill} />
        <View style={styles.heartPos}><VendorHeart id={v.id} /></View>
        {v.tags[0] ? <View style={styles.tagPos}><Tag label={v.tags[0]} bg={c.goldSoft} color="#8A5A00" /></View> : null}
        <Text style={styles.overlayTxt}>{serviceById(v.service).name}</Text>
      </Img>
      <View style={{ padding: 10 }}>
        <View style={styles.rowBetween}>
          <Text numberOfLines={1} style={[styles.name, { color: c.text }]}>{v.name}</Text>
          {v.verified && <Icon name="check-decagram" size={15} color={c.info} />}
        </View>
        <View style={[styles.row, { marginTop: 4 }]}>
          <Rating value={v.rating} count={v.reviews} small />
          <Text style={{ fontSize: 11, color: c.sub, marginLeft: 6 }} numberOfLines={1}>· {v.area}</Text>
        </View>
        <Text style={{ fontSize: 12, color: c.sub, marginTop: 6 }}>
          From <Text style={{ fontWeight: '800', color: c.text, fontSize: 14 }}>{inr(v.priceFrom)}</Text> {v.unit}
        </Text>
      </View>
    </Tap>
  );
};

/** Full-width vendor card used in listings & booking flow. */
export const VendorRow = ({ v, selected, onSelect, fromBooking }: { v: Vendor; selected?: boolean; onSelect?: () => void; fromBooking?: boolean }) => {
  const { c } = useTheme();
  const nav = useNav();
  return (
    <Tap scale={0.98} onPress={() => nav.push('VendorDetails', { id: v.id, fromBooking })} style={[styles.row2, { backgroundColor: c.white, borderColor: selected ? c.ink : c.line, borderWidth: selected ? 2 : 1 }]}>
      <Img uri={v.image} style={styles.rowImg}>
        <View style={styles.heartPos}><VendorHeart id={v.id} /></View>
      </Img>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <View style={styles.row}>
          <Text numberOfLines={1} style={[styles.name, { color: c.text, flexShrink: 1 }]}>{v.name}</Text>
          {v.verified && <Icon name="check-decagram" size={14} color={c.info} style={{ marginLeft: 4 }} />}
        </View>
        <Text style={{ fontSize: 12, color: c.sub, marginTop: 2 }} numberOfLines={1}>{v.subs.slice(0, 2).join(' · ')}</Text>
        <View style={[styles.row, { marginTop: 6 }]}>
          <Rating value={v.rating} count={v.reviews} small />
          <Text style={{ fontSize: 11, color: c.sub, marginLeft: 6 }}>{v.experience} yrs · {v.area}</Text>
        </View>
        <View style={[styles.rowBetween, { marginTop: 8 }]}>
          <Text style={{ fontSize: 11, color: c.sub }}>
            From <Text style={{ fontWeight: '800', color: c.text, fontSize: 15 }}>{inr(v.priceFrom)}</Text>{'\n'}{v.unit}
          </Text>
          {onSelect ? (
            <Tap onPress={onSelect} style={[styles.select, { backgroundColor: selected ? c.primary : c.tint, borderColor: selected ? c.primary : c.ink }]}>
              <Icon name={selected ? 'check' : 'plus'} size={15} color={selected ? c.onPrimary : c.ink} />
              <Text style={{ color: selected ? c.onPrimary : c.ink, fontWeight: '800', fontSize: 12, marginLeft: 3 }}>{selected ? 'Selected' : 'Select'}</Text>
            </Tap>
          ) : null}
        </View>
      </View>
    </Tap>
  );
};

const styles = StyleSheet.create({
  tile: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  heart: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  heartPos: { position: 'absolute', top: 8, right: 8 },
  tagPos: { position: 'absolute', top: 10, left: 10 },
  overlayTxt: { position: 'absolute', left: 10, bottom: 8, color: '#fff', fontWeight: '800', fontSize: 12 },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { fontSize: 15, fontWeight: '800', flex: 1 },
  row2: { flexDirection: 'row', padding: 10, borderRadius: 16, marginBottom: 12 },
  rowImg: { width: 108, height: 124, borderRadius: 12 },
  select: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 34, borderRadius: 9, borderWidth: 1.3 },
});
