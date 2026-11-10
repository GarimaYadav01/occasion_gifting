import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { Chip, Skeleton } from '../../components/Bits';
import { Tap } from '../../components/Tap';
import { Img } from '../../components/Img';
import { Icon } from '../../components/Icon';
import { EmptyState } from '../../components/States';
import { useAppDispatch, useAppSelector } from '../../store';
import { clearNotifications, markAllRead, markRead } from '../../store/slices/profile';
import { useNav, useTheme } from '../../utils/hooks';

const FILTERS = [['all', 'All'], ['order', 'Orders'], ['booking', 'Events'], ['reminder', 'Reminders'], ['promo', 'Offers']] as const;
const ICON = { order: ['truck-delivery', '#2F6FEB'], booking: ['party-popper', '#7B3FE4'], reminder: ['cake-variant', '#FF4F8B'], promo: ['tag', '#C98A0B'] } as const;

export const NotificationsScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const dispatch = useAppDispatch();
  const list = useAppSelector(s => s.profile.notifications);
  const [f, setF] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, []);
  const shown = list.filter(n => f === 'all' || n.kind === f);

  const open = (id: string, kind: string) => {
    dispatch(markRead(id));
    if (kind === 'order') { nav.navigate('Main', { screen: 'Orders', params: { tab: 'gifts' } }); }
    else if (kind === 'booking') { nav.navigate('Main', { screen: 'Orders', params: { tab: 'events' } }); }
    else if (kind === 'reminder') { nav.navigate('Reminders'); }
    else { nav.navigate('ProductList', { category: 'hampers' }); }
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <AppHeader title="Notifications" right={list.length ? <Tap onPress={() => dispatch(markAllRead())} style={{ padding: 8 }}><Text style={{ color: c.ink, fontWeight: '800', fontSize: 13 }}>Mark all read</Text></Tap> : null} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ padding: 12, paddingHorizontal: 16 }}>
        {FILTERS.map(([k, l]) => <Chip key={k} label={l} on={f === k} onPress={() => setF(k)} />)}
      </ScrollView>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
        <Tap onPress={() => nav.navigate('Reminders')} style={[styles.remind, { backgroundColor: c.tint }]}>
          <Icon name="calendar-heart" size={22} color={c.ink} />
          <Text style={{ flex: 1, marginLeft: 10, fontWeight: '700', color: c.text }}>Add birthdays & anniversaries to get reminders</Text>
          <Icon name="chevron-right" size={20} color={c.ink} />
        </Tap>
        {loading ? (
          [0, 1, 2, 3, 4].map(i => (
            <View key={i} style={{ flexDirection: 'row', marginBottom: 16 }}>
              <Skeleton style={{ width: 48, height: 48, borderRadius: 24 }} />
              <View style={{ flex: 1, marginLeft: 12, gap: 8 }}><Skeleton style={{ height: 14, width: '70%' }} /><Skeleton style={{ height: 12, width: '95%' }} /></View>
            </View>
          ))
        ) : shown.length === 0 ? (
          <EmptyState icon="bell-sleep-outline" title="You're all caught up" body="New order updates, event booking alerts and reminders will show up here." />
        ) : (
          shown.map(n => {
            const [icon, col] = ICON[n.kind];
            return (
              <Tap key={n.id} scale={0.98} onPress={() => open(n.id, n.kind)} style={[styles.item, { backgroundColor: n.read ? c.white : '#FFFDF5', borderColor: n.read ? c.line : '#F3E3B5' }]}>
                <View>
                  <Img uri={n.image || ''} style={styles.img} />
                  <View style={[styles.kind, { backgroundColor: col }]}><Icon name={icon} size={11} color="#fff" /></View>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ flex: 1, fontWeight: '800', color: c.text, fontSize: 14 }}>{n.title}</Text>
                    {!n.read && <View style={[styles.unread, { backgroundColor: c.accent }]} />}
                  </View>
                  <Text style={{ color: c.sub, fontSize: 13, marginTop: 3, lineHeight: 18 }}>{n.body}</Text>
                  <Text style={{ color: c.muted, fontSize: 11, marginTop: 6, fontWeight: '600' }}>{n.time}</Text>
                </View>
              </Tap>
            );
          })
        )}
        {!loading && list.length > 0 && (
          <Tap onPress={() => dispatch(clearNotifications())} style={{ alignItems: 'center', padding: 14 }}>
            <Text style={{ color: c.danger, fontWeight: '800' }}>Clear all notifications</Text>
          </Tap>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  remind: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14, marginBottom: 14 },
  item: { flexDirection: 'row', padding: 12, borderRadius: 16, borderWidth: 1, marginBottom: 10 },
  img: { width: 48, height: 48, borderRadius: 24 },
  kind: { position: 'absolute', bottom: -2, right: -2, width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  unread: { width: 8, height: 8, borderRadius: 4, marginLeft: 6 },
});
