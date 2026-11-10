import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import LinearGradient from '../../components/Gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchBar } from '../../components/SearchBar';
import { SectionTitle } from '../../components/Bits';
import { HeaderIcon } from '../../components/AppHeader';
import { Tap } from '../../components/Tap';
import { Img } from '../../components/Img';
import { Icon } from '../../components/Icon';
import { eventTypes, serviceCategories, vendorsFor } from '../../data/events';
import { useAppDispatch, useAppSelector } from '../../store';
import { resetDraft, setDraft } from '../../store/slices/booking';
import { useNav, useStatusBar, useTheme } from '../../utils/hooks';

export const EventsScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const wish = useAppSelector(s => s.shop.wishVendors.length);
  useStatusBar('light-content');
  const start = (eventType?: string) => {
    dispatch(resetDraft());
    if (eventType) { dispatch(setDraft({ eventType })); }
    nav.navigate('BookEventType', { eventType });
  };
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }} stickyHeaderIndices={[1]}>
        <LinearGradient colors={c.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingTop: insets.top + 10, paddingHorizontal: 16, paddingBottom: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: c.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1.4 }}>OCCASION EVENTS</Text>
              <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900', marginTop: 2 }}>Book your celebration</Text>
            </View>
            <HeaderIcon name="heart-outline" light badge={wish} onPress={() => nav.navigate('Wishlist')} />
            <HeaderIcon name="bell-outline" light onPress={() => nav.navigate('Notifications')} />
          </View>
          <View style={styles.stats}>
            {[['500+', 'Vendors'], ['4.8★', 'Avg rating'], ['12k+', 'Events done']].map(([a, b]) => (
              <View key={b} style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ color: '#FFD27A', fontWeight: '900', fontSize: 17 }}>{a}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '600' }}>{b}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
        <LinearGradient colors={[c.header[2], c.header[2]]} style={{ paddingHorizontal: 16, paddingBottom: 14, paddingTop: 6 }}>
          <SearchBar onPress={() => nav.navigate('Search')} />
        </LinearGradient>

        <Tap scale={0.98} onPress={() => start()} style={[styles.cta, { backgroundColor: c.primary }]}>
          <Icon name="calendar-star" size={26} color={c.onPrimary} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontWeight: '900', fontSize: 16, color: c.onPrimary }}>Start planning an event</Text>
            <Text style={{ fontSize: 12, color: c.onPrimary, opacity: 0.8, fontWeight: '600' }}>Book multiple services in one go</Text>
          </View>
          <Icon name="arrow-right-circle" size={30} color={c.onPrimary} />
        </Tap>

        <SectionTitle title="Event categories" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
          {eventTypes.map(e => (
            <Tap key={e.id} onPress={() => start(e.id)} style={styles.evCard}>
              <Img uri={e.image} style={StyleSheet.absoluteFill} />
              <LinearGradient colors={['transparent', 'rgba(20,10,46,0.9)']} style={StyleSheet.absoluteFill} />
              <View style={{ position: 'absolute', left: 10, right: 10, bottom: 10 }}>
                <Text style={{ color: '#fff', fontWeight: '900', fontSize: 14 }}>{e.name}</Text>
                <Text style={{ color: '#FFD27A', fontSize: 11, fontWeight: '700', marginTop: 2 }}>from ₹{e.from.toLocaleString('en-IN')}</Text>
              </View>
            </Tap>
          ))}
        </ScrollView>

        <SectionTitle title="Event services" sub="Tap a service to browse vendors" />
        {serviceCategories.map(s => (
          <View key={s.id} style={[styles.svc, { backgroundColor: c.white, borderColor: c.line }]}>
            <Tap scale={0.99} onPress={() => nav.navigate('ServiceCategory', { service: s.id })} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Img uri={s.image} style={styles.svcImg} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontWeight: '900', fontSize: 16, color: c.text }}>{s.name}</Text>
                <Text style={{ fontSize: 12, color: c.sub, marginTop: 2 }}>{vendorsFor(s.id).length * 24}+ vendors · {s.blurb}</Text>
              </View>
              <View style={[styles.arrow, { backgroundColor: c.tint }]}><Icon name="chevron-right" size={20} color={c.ink} /></View>
            </Tap>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingTop: 10 }}>
              {s.subs.map(sub => (
                <Tap key={sub} onPress={() => nav.navigate('ServiceCategory', { service: s.id, sub })} style={[styles.sub, { backgroundColor: s.tint }]}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: c.text }}>{sub}</Text>
                </Tap>
              ))}
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 14, paddingVertical: 10, marginTop: 14, marginBottom: 8 },
  cta: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 10, padding: 14, borderRadius: 18 },
  evCard: { width: 130, height: 170, borderRadius: 16, overflow: 'hidden' },
  svc: { marginHorizontal: 16, marginBottom: 10, padding: 12, borderRadius: 18, borderWidth: 1 },
  svcImg: { width: 60, height: 60, borderRadius: 14 },
  arrow: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  sub: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
});
