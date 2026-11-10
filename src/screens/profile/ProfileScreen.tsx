import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import LinearGradient from '../../components/Gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, ListRow } from '../../components/Bits';
import { Img } from '../../components/Img';
import { Tap } from '../../components/Tap';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { Sheet } from '../../components/Sheet';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout, setMode } from '../../store/slices/app';
import { useNav, useStatusBar, useTheme } from '../../utils/hooks';
import { daysUntilYearly } from '../../utils/format';

const Group = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <>
    <Text style={styles.group}>{title}</Text>
    <Card style={{ paddingVertical: 4 }}>{children}</Card>
  </>
);

export const ProfileScreen = () => {
  const { c, mode } = useTheme();
  const nav = useNav();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  useStatusBar('light-content');
  const user = useAppSelector(s => s.app.user);
  const gifts = useAppSelector(s => s.orders.gifts.length);
  const bookings = useAppSelector(s => s.orders.bookings.length);
  const wish = useAppSelector(s => s.shop.wishProducts.length + s.shop.wishVendors.length);
  const reminders = useAppSelector(s => s.profile.reminders);
  const addresses = useAppSelector(s => s.profile.addresses.length);
  const [notif, setNotif] = useState(true);
  const [confirm, setConfirm] = useState(false);
  const next = [...reminders].sort((a, b) => daysUntilYearly(a.date) - daysUntilYearly(b.date))[0];

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        <LinearGradient colors={c.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingTop: insets.top + 12, paddingHorizontal: 16, paddingBottom: 60 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Img uri={user.avatar} style={styles.avatar} />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={{ color: '#fff', fontSize: 21, fontWeight: '900' }}>{user.name}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', marginTop: 2, fontWeight: '600' }}>+91 {user.phone}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontWeight: '600', fontSize: 12 }}>{user.email}</Text>
            </View>
            <Tap onPress={() => nav.navigate('EditProfile')} style={styles.edit}><Icon name="pencil" size={18} color="#fff" /></Tap>
          </View>
          <View style={styles.member}>
            <Icon name="crown" size={18} color="#FFD27A" />
            <Text style={{ color: '#fff', fontWeight: '800', marginLeft: 6, flex: 1 }}>Occasion Gold member</Text>
            <Text style={{ color: '#FFD27A', fontWeight: '800', fontSize: 12 }}>₹350 wallet</Text>
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: 16, marginTop: -44 }}>
          <Card style={{ flexDirection: 'row', paddingVertical: 16 }}>
            {[['package-variant', gifts, 'Gift orders', () => nav.navigate('Main', { screen: 'Orders', params: { tab: 'gifts' } })], ['party-popper', bookings, 'Bookings', () => nav.navigate('Main', { screen: 'Orders', params: { tab: 'events' } })], ['heart-outline', wish, 'Wishlist', () => nav.navigate('Wishlist')], ['calendar-heart', reminders.length, 'Reminders', () => nav.navigate('Reminders')]].map(([i, n, l, fn]: any) => (
              <Tap key={l} onPress={fn} style={{ flex: 1, alignItems: 'center' }}>
                <View style={[styles.statIcon, { backgroundColor: c.tint }]}><Icon name={i} size={20} color={c.ink} /></View>
                <Text style={{ fontWeight: '900', color: c.text, fontSize: 16, marginTop: 6 }}>{n}</Text>
                <Text style={{ fontSize: 11, color: c.sub, fontWeight: '600' }}>{l}</Text>
              </Tap>
            ))}
          </Card>

          {next && (
            <Tap scale={0.98} onPress={() => nav.navigate('Reminders')} style={[styles.remind, { backgroundColor: c.accentSoft }]}>
              <Icon name="cake-variant" size={22} color={c.accent} />
              <Text style={{ flex: 1, marginLeft: 10, fontWeight: '700', color: c.text }}>{next.name}'s {next.type.toLowerCase()} is in <Text style={{ fontWeight: '900', color: c.accent }}>{daysUntilYearly(next.date)} days</Text></Text>
              <Icon name="chevron-right" size={20} color={c.accent} />
            </Tap>
          )}

          <Group title="APP MODE">
            <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 10 }}>
              {([['gifts', 'Gifting', 'gift'], ['events', 'Events', 'party-popper']] as const).map(([k, l, i]) => (
                <Tap key={k} onPress={() => dispatch(setMode(k))} style={[styles.modeBtn, { borderColor: mode === k ? c.ink : c.line, backgroundColor: mode === k ? c.tint : c.white }]}>
                  <Icon name={i} size={20} color={mode === k ? c.ink : c.sub} />
                  <Text style={{ marginLeft: 6, fontWeight: '800', color: mode === k ? c.ink : c.sub }}>{l}</Text>
                </Tap>
              ))}
            </View>
          </Group>

          <Group title="MY ACCOUNT">
            <ListRow icon="account-edit-outline" title="Edit profile" sub="Name, email, birthday" onPress={() => nav.navigate('EditProfile')} />
            <ListRow icon="map-marker-outline" title="Saved addresses" sub={`${addresses} saved`} onPress={() => nav.navigate('Addresses')} />
            <ListRow icon="heart-outline" title="My wishlist" sub="Gifts & vendors you saved" onPress={() => nav.navigate('Wishlist')} />
            <ListRow icon="credit-card-outline" title="Payment methods" sub="UPI, cards & wallet" onPress={() => nav.navigate('PaymentMethods')} />
          </Group>

          <Group title="ORDERS & BOOKINGS">
            <ListRow icon="package-variant-closed" title="My gift orders" onPress={() => nav.navigate('Main', { screen: 'Orders', params: { tab: 'gifts' } })} />
            <ListRow icon="calendar-star" title="My event bookings" onPress={() => nav.navigate('Main', { screen: 'Orders', params: { tab: 'events' } })} />
            <ListRow icon="calendar-heart" title="Occasion reminders" sub="Birthdays & anniversaries" onPress={() => nav.navigate('Reminders')} />
            <ListRow icon="bell-outline" title="Notifications" onPress={() => nav.navigate('Notifications')} right={<Switch value={notif} onValueChange={setNotif} trackColor={{ true: c.primary, false: c.line }} thumbColor="#fff" />} />
          </Group>

          <Group title="SUPPORT & LEGAL">
            <ListRow icon="lifebuoy" title="Help & support" sub="FAQs, chat with us" onPress={() => nav.navigate('Help')} />
            <ListRow icon="information-outline" title="About us" onPress={() => nav.navigate('Info', { page: 'about' })} />
            <ListRow icon="shield-lock-outline" title="Privacy policy" onPress={() => nav.navigate('Info', { page: 'privacy' })} />
            <ListRow icon="file-document-outline" title="Terms & conditions" onPress={() => nav.navigate('Info', { page: 'terms' })} />
          </Group>

          <Card style={{ marginTop: 16, paddingVertical: 4 }}>
            <ListRow icon="logout" title="Log out" danger onPress={() => setConfirm(true)} right={<View />} />
          </Card>
          <Text style={{ textAlign: 'center', color: c.muted, fontSize: 11, marginTop: 16 }}>Occasion v1.0.0 · Made in India 🇮🇳</Text>
        </View>
      </ScrollView>

      <Sheet visible={confirm} onClose={() => setConfirm(false)} title="Log out?">
        <Text style={{ color: c.sub, marginBottom: 18 }}>You'll need to verify your mobile number again to sign back in. Your cart and wishlist are saved.</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button title="Cancel" variant="outline" style={{ flex: 1 }} onPress={() => setConfirm(false)} />
          <Button title="Log out" variant="dark" style={{ flex: 1 }} onPress={() => { setConfirm(false); dispatch(logout()); nav.reset({ index: 0, routes: [{ name: 'Login' }] }); }} />
        </View>
      </Sheet>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: { width: 70, height: 70, borderRadius: 35, borderWidth: 3, borderColor: 'rgba(255,255,255,0.8)' },
  edit: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  member: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.12)', padding: 10, borderRadius: 12, marginTop: 16 },
  statIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  remind: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14, marginTop: 14 },
  group: { fontSize: 12, fontWeight: '900', color: '#A39BAD', letterSpacing: 1, marginTop: 22, marginBottom: 8, marginLeft: 4 },
  modeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 46, borderRadius: 12, borderWidth: 1.4 },
});
