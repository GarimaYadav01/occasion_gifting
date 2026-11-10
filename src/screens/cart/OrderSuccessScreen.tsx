import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { Card, Divider } from '../../components/Bits';
import { Img } from '../../components/Img';
import { productById } from '../../data/gifts';
import { useAppSelector } from '../../store';
import { useNav, useStatusBar, useTheme } from '../../utils/hooks';
import { fmtDate, inr } from '../../utils/format';
import { RootStackParamList } from '../../navigation/types';


/** Shared celebratory success animation (used for gift orders & event bookings). */
export const SuccessBurst = ({ color }: { color: string }) => {
  const s = useRef(new Animated.Value(0)).current;
  const ring = useRef(new Animated.Value(0)).current;
  const confetti = useRef([...Array(18)].map(() => new Animated.Value(0))).current;
  useEffect(() => {
    Animated.sequence([
      Animated.spring(s, { toValue: 1, useNativeDriver: true, bounciness: 16, speed: 8 }),
      Animated.parallel([
        Animated.timing(ring, { toValue: 1, duration: 900, useNativeDriver: true }),
        ...confetti.map((v, i) => Animated.timing(v, { toValue: 1, duration: 900 + i * 30, useNativeDriver: true })),
      ]),
    ]).start();
  }, [s, ring, confetti]);
  return (
    <View style={{ width: 200, height: 200, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={[styles.ring, { borderColor: color, opacity: ring.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] }), transform: [{ scale: ring.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.8] }) }] }]} />
      {confetti.map((v, i) => {
        const angle = (i / confetti.length) * Math.PI * 2;
        return (
          <Animated.View key={i} style={[styles.conf, {
            backgroundColor: ['#FFD27A', '#FF4F8B', '#7B3FE4', '#0C8A4B'][i % 4],
            opacity: v.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] }),
            transform: [{ translateX: v.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(angle) * 110] }) }, { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(angle) * 110 + 30] }) }, { rotate: `${i * 40}deg` }],
          }]} />
        );
      })}
      <Animated.View style={[styles.check, { backgroundColor: color, transform: [{ scale: s }] }]}>
        <Icon name="check-bold" size={54} color="#fff" />
      </Animated.View>
    </View>
  );
};

export const OrderSuccessScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const insets = useSafeAreaInsets();
  useStatusBar('dark-content');
  const { id } = useRoute<RouteProp<RootStackParamList, 'OrderSuccess'>>().params;
  const o = useAppSelector(s => s.orders.gifts.find(g => g.id === id));
  if (!o) { return null; }
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 30, padding: 20, alignItems: 'center', paddingBottom: 40 }}>
        <SuccessBurst color={c.success} />
        <Text style={{ fontSize: 26, fontWeight: '900', color: c.text, marginTop: 6 }}>Order placed! 🎉</Text>
        <Text style={{ fontSize: 14, color: c.sub, marginTop: 6, textAlign: 'center' }}>Your gift for <Text style={{ fontWeight: '800', color: c.text }}>{o.recipient.name}</Text> is confirmed.{'\n'}We'll notify you at every step.</Text>
        <View style={[styles.idPill, { backgroundColor: c.tint }]}><Text style={{ color: c.ink, fontWeight: '800' }}>Order ID  #{o.id}</Text></View>

        <Card style={{ alignSelf: 'stretch', marginTop: 22 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.etaIcon, { backgroundColor: c.successSoft }]}><Icon name="truck-fast-outline" size={22} color={c.success} /></View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontSize: 12, color: c.sub, fontWeight: '700' }}>ESTIMATED DELIVERY</Text>
              <Text style={{ fontSize: 16, fontWeight: '900', color: c.text }}>{fmtDate(o.deliveryDate, true)}</Text>
              <Text style={{ fontSize: 13, color: c.success, fontWeight: '700' }}>{o.slot}</Text>
            </View>
          </View>
          <Divider />
          <Text style={styles.k}>DELIVERING TO</Text>
          <Text style={{ fontWeight: '800', color: c.text }}>{o.recipient.name} · {o.recipient.phone}</Text>
          <Text style={{ color: c.sub, fontSize: 13, marginTop: 2 }}>{o.address.line}, {o.address.area}, {o.address.city}</Text>
          <Divider />
          {o.items.map(i => (
            <View key={i.productId} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Img uri={productById(i.productId).image} style={{ width: 42, height: 42, borderRadius: 10 }} />
              <Text style={{ flex: 1, marginLeft: 10, color: c.text, fontWeight: '600' }} numberOfLines={1}>{i.qty} × {productById(i.productId).name}</Text>
            </View>
          ))}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
            <Text style={{ color: c.sub }}>Paid via {o.payment}</Text>
            <Text style={{ fontWeight: '900', color: c.text }}>{inr(o.total)}</Text>
          </View>
        </Card>
        <Button title="Track order" icon="map-marker-path" onPress={() => nav.replace('GiftOrderDetails', { id: o.id })} style={{ alignSelf: 'stretch', marginTop: 20 }} />
        <Button title="Continue shopping" variant="ghost" onPress={() => nav.goBack()} style={{ alignSelf: 'stretch', marginTop: 6 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  ring: { position: 'absolute', width: 120, height: 120, borderRadius: 60, borderWidth: 6 },
  conf: { position: 'absolute', width: 8, height: 14, borderRadius: 2 },
  check: { width: 112, height: 112, borderRadius: 56, alignItems: 'center', justifyContent: 'center', shadowColor: '#0C8A4B', shadowOpacity: 0.35, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 10 },
  idPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginTop: 14 },
  etaIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  k: { fontSize: 11, fontWeight: '800', color: '#A39BAD', letterSpacing: 1, marginBottom: 4 },
});
