import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from './Gradient';
import { Tap } from './Tap';
import { Icon } from './Icon';
import { Img } from './Img';
import { useAppDispatch, useAppSelector } from '../store';
import { setMode } from '../store/slices/app';
import { useTheme } from '../utils/hooks';
import { productById } from '../data/gifts';
import { serviceById } from '../data/events';
import { cartTotals } from '../utils/pricing';
import { inr } from '../utils/format';

const TABS: Record<string, { label: string; icon: string; on: string }> = {
  Home: { label: 'Home', icon: 'home-variant-outline', on: 'home-variant' },
  Gifts: { label: 'Gifts', icon: 'gift-outline', on: 'gift' },
  Events: { label: 'Events', icon: 'party-popper', on: 'party-popper' },
  Orders: { label: 'Orders', icon: 'clipboard-text-outline', on: 'clipboard-text' },
  Profile: { label: 'Profile', icon: 'account-circle-outline', on: 'account-circle' },
};

/** Floating "View cart" (gifting) / "Event plan" (events) pill — Blinkit style. */
const FloatingBar = ({ route, navigate }: { route: string; navigate: (r: string) => void }) => {
  const { c, isEvents } = useTheme();
  const cart = useAppSelector(s => s.shop.cart);
  const coupon = useAppSelector(s => s.shop.coupon);
  const draft = useAppSelector(s => s.booking);
  const y = useRef(new Animated.Value(80)).current;
  const showGift = !isEvents && cart.length > 0 && (route === 'Home' || route === 'Gifts');
  const showEvent = isEvents && draft.services.length > 0 && (route === 'Home' || route === 'Events');
  const visible = showGift || showEvent;
  useEffect(() => {
    Animated.spring(y, { toValue: visible ? 0 : 80, useNativeDriver: true, bounciness: 6 }).start();
  }, [visible, y]);
  if (!visible) { return null; }
  if (showGift) {
    const t = cartTotals(cart, coupon);
    return (
      <Animated.View style={[styles.floatWrap, { transform: [{ translateY: y }] }]}>
        <Tap scale={0.98} onPress={() => navigate('Cart')} style={[styles.float, { backgroundColor: c.primary }]}>
          <View style={styles.thumbs}>
            {cart.slice(0, 3).map((i, k) => (
              <Img key={i.key} uri={productById(i.productId).image} style={[styles.thumb, { marginLeft: k ? -14 : 0, zIndex: 3 - k }]} />
            ))}
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.floatTitle}>View cart</Text>
            <Text style={styles.floatSub}>{t.count} item{t.count > 1 ? 's' : ''} · {inr(t.total)}</Text>
          </View>
          <View style={styles.floatCta}><Icon name="chevron-right" size={22} color="#fff" /></View>
        </Tap>
      </Animated.View>
    );
  }
  return (
    <Animated.View style={[styles.floatWrap, { transform: [{ translateY: y }] }]}>
      <Tap scale={0.98} onPress={() => navigate(draft.date ? 'BookProviders' : 'BookEventType')} style={[styles.float, { backgroundColor: '#1F1240' }]}>
        <View style={[styles.evIcon, { backgroundColor: c.primary }]}><Icon name="clipboard-list" size={20} color={c.onPrimary} /></View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.floatTitle}>Your event plan</Text>
          <Text style={styles.floatSub} numberOfLines={1}>{draft.services.map(s => serviceById(s).short).join(' · ')}</Text>
        </View>
        <Text style={{ color: c.primary, fontWeight: '800', marginRight: 4 }}>Continue</Text>
        <Icon name="chevron-right" size={22} color={c.primary} />
      </Tap>
    </Animated.View>
  );
};

/** Floating, mode-aware bottom navigation. */
export const TabBar = ({ state, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const { c, mode } = useTheme();
  const dispatch = useAppDispatch();
  const current = state.routes[state.index].name;

  // Keep app mode in sync with the Gifts / Events tabs.
  useEffect(() => {
    if (current === 'Gifts' && mode !== 'gifts') { dispatch(setMode('gifts')); }
    if (current === 'Events' && mode !== 'events') { dispatch(setMode('events')); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  return (
    <View style={{ backgroundColor: c.bg }}>
      <FloatingBar route={current} navigate={r => navigation.getParent()?.navigate(r as never)} />
      <View style={[styles.bar, { marginBottom: Math.max(insets.bottom, 10) }]}>
        {state.routes.map((r, i) => {
          const focused = state.index === i;
          const t = TABS[r.name];
          const isModeTab = (r.name === 'Gifts' && mode === 'gifts') || (r.name === 'Events' && mode === 'events');
          const activeBg = mode === 'events' ? c.primary : c.primary;
          const activeFg = c.onPrimary;
          return (
            <Tap
              key={r.key}
              scale={0.9}
              onPress={() => {
                const e = navigation.emit({ type: 'tabPress', target: r.key, canPreventDefault: true });
                if (!focused && !e.defaultPrevented) { navigation.navigate(r.name as never); }
              }}
              style={styles.item}>
              {focused ? (
                <View style={[styles.active, { backgroundColor: activeBg }]}>
                  <Icon name={t.on} size={20} color={activeFg} />
                  <Text style={[styles.activeTxt, { color: activeFg }]}>{t.label}</Text>
                </View>
              ) : (
                <View style={{ alignItems: 'center' }}>
                  <Icon name={t.icon} size={23} color={isModeTab ? c.ink : '#B8AFC0'} />
                  <Text style={[styles.label, { color: isModeTab ? c.ink : '#8E8597' }]}>{t.label}</Text>
                  {isModeTab ? <View style={[styles.dot, { backgroundColor: c.accent }]} /> : null}
                </View>
              )}
            </Tap>
          );
        })}
      </View>
      {mode === 'events' ? <LinearGradient pointerEvents="none" colors={['rgba(227,167,47,0)', 'rgba(227,167,47,0.08)']} style={StyleSheet.absoluteFill} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', marginHorizontal: 12, backgroundColor: '#fff', borderRadius: 24, height: 64, alignItems: 'center', paddingHorizontal: 6, shadowColor: '#3B1450', shadowOpacity: 0.14, shadowRadius: 18, shadowOffset: { width: 0, height: 6 }, elevation: 14 },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', height: 64 },
  active: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 40, borderRadius: 20 },
  activeTxt: { fontSize: 12, fontWeight: '800', marginLeft: 5 },
  label: { fontSize: 10.5, fontWeight: '700', marginTop: 2 },
  dot: { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
  floatWrap: { paddingHorizontal: 16, marginBottom: 8 },
  float: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, paddingVertical: 9, paddingHorizontal: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 10 },
  thumbs: { flexDirection: 'row' },
  thumb: { width: 38, height: 38, borderRadius: 10, borderWidth: 2, borderColor: '#fff' },
  floatTitle: { color: '#fff', fontWeight: '800', fontSize: 15 },
  floatSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '600', marginTop: 1 },
  floatCta: { width: 34, height: 34, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  evIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});
