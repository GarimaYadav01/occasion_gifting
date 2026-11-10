import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tap } from './Tap';
import { Icon } from './Icon';
import { useNav, useStatusBar, useTheme } from '../utils/hooks';
import { useAppSelector } from '../store';
import { font } from '../theme';

interface Props {
  title: string;
  subtitle?: string;
  actions?: ('search' | 'wishlist' | 'cart' | 'share' | 'bell')[];
  onBack?: () => void;
  right?: React.ReactNode;
  transparent?: boolean;
  noBack?: boolean;
}

export const HeaderIcon = ({ name, onPress, badge, light }: { name: string; onPress?: () => void; badge?: number; light?: boolean }) => {
  const { c } = useTheme();
  return (
    <Tap onPress={onPress} style={[styles.icon, light && { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
      <Icon name={name} size={22} color={light ? c.white : c.text} />
      {badge ? (
        <View style={[styles.badge, { backgroundColor: c.accent }]}>
          <Text style={styles.badgeTxt}>{badge > 9 ? '9+' : badge}</Text>
        </View>
      ) : null}
    </Tap>
  );
};

export const AppHeader = ({ title, subtitle, actions = [], onBack, right, noBack }: Props) => {
  const insets = useSafeAreaInsets();
  const nav = useNav();
  const { c } = useTheme();
  useStatusBar('dark-content');
  const cartCount = useAppSelector(s => s.shop.cart.reduce((n, i) => n + i.qty, 0));
  const wishCount = useAppSelector(s => s.shop.wishProducts.length + s.shop.wishVendors.length);
  const unread = useAppSelector(s => s.profile.notifications.filter(n => !n.read).length);
  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 6, backgroundColor: c.white, borderBottomColor: c.line }]}>
      {!noBack && (
        <Tap onPress={onBack || (() => nav.goBack())} style={styles.icon}>
          <Icon name="arrow-left" size={24} />
        </Tap>
      )}
      <View style={{ flex: 1, marginLeft: noBack ? 8 : 2 }}>
        <Text style={[font.h2, { color: c.text }]} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={[font.small, { color: c.sub, marginTop: 1 }]} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      {right}
      {actions.includes('search') && <HeaderIcon name="magnify" onPress={() => nav.navigate('Search')} />}
      {actions.includes('bell') && <HeaderIcon name="bell-outline" badge={unread} onPress={() => nav.navigate('Notifications')} />}
      {actions.includes('share') && <HeaderIcon name="share-variant-outline" />}
      {actions.includes('wishlist') && <HeaderIcon name="heart-outline" badge={wishCount} onPress={() => nav.navigate('Wishlist')} />}
      {actions.includes('cart') && <HeaderIcon name="shopping-outline" badge={cartCount} onPress={() => nav.navigate('Cart')} />}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingBottom: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  icon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 3, right: 2, minWidth: 17, height: 17, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3, borderWidth: 1.5, borderColor: '#fff' },
  badgeTxt: { color: '#fff', fontSize: 9, fontWeight: '800' },
});
