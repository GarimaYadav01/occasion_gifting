import React from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import LinearGradient from '../../components/Gradient';
import { Banner } from '../../components/Banner';
import { SectionTitle, Rating } from '../../components/Bits';
import { VendorTile } from '../../components/VendorCard';
import { Tap } from '../../components/Tap';
import { Img } from '../../components/Img';
import { Icon } from '../../components/Icon';
import { eventBanners, eventTypes, serviceCategories, vendors, eventTypeById, vendorById } from '../../data/events';
import { img } from '../../data/images';
import { useAppDispatch, useAppSelector } from '../../store';
import { setMode } from '../../store/slices/app';
import { resetDraft, setDraft } from '../../store/slices/booking';
import { EVENT_STATUSES } from '../../store/slices/orders';
import { useNav, useTheme } from '../../utils/hooks';
import { fmtShort } from '../../utils/format';

const { width } = Dimensions.get('window');

export const EventHome = () => {
  const { c } = useTheme();
  const nav = useNav();
  const dispatch = useAppDispatch();
  const active = useAppSelector(s => s.orders.bookings.find(b => !b.cancelled && b.step < 4));
  const startBooking = (eventType?: string) => {
    dispatch(resetDraft());
    if (eventType) { dispatch(setDraft({ eventType })); }
    nav.navigate('BookEventType', { eventType });
  };
  const topVendors = [...vendors].filter(v => v.service !== 'venue').sort((a, b) => b.rating - a.rating).slice(0, 8);
  const venues = vendors.filter(v => v.service === 'venue');
  const evW = (width - 32 - 30) / 4;

  return (
    <View>
      <Banner items={eventBanners} onPress={b => startBooking((b as any).event)} />

      {/* Plan CTA */}
      <Tap scale={0.98} onPress={() => startBooking()} style={styles.planWrap}>
        <LinearGradient colors={['#1F1240', '#3B1C5A']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.plan}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: c.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1.2 }}>EVENT PLANNER</Text>
            <Text style={{ color: '#fff', fontSize: 19, fontWeight: '900', marginTop: 4 }}>Plan your celebration{'\n'}in a few easy steps</Text>
            <View style={{ flexDirection: 'row', marginTop: 10, gap: 6 }}>
              {['Event', 'Date', 'Vendors', 'Pay'].map((s, i) => (
                <View key={s} style={styles.stepPill}><Text style={styles.stepTxt}>{i + 1}. {s}</Text></View>
              ))}
            </View>
          </View>
          <View style={[styles.planBtn, { backgroundColor: c.primary }]}><Icon name="arrow-right" size={22} color={c.onPrimary} /></View>
        </LinearGradient>
      </Tap>

      {/* Active booking */}
      {active && (
        <Tap scale={0.98} onPress={() => nav.navigate('BookingDetails', { id: active.id })} style={[styles.active, { backgroundColor: c.white, borderColor: c.line }]}>
          <Img uri={eventTypeById(active.eventType)!.image} style={styles.activeImg} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: c.ink }}>UPCOMING · {fmtShort(active.date)}</Text>
            <Text style={{ fontSize: 15, fontWeight: '800', color: c.text, marginTop: 2 }}>{eventTypeById(active.eventType)!.name}</Text>
            <Text style={{ fontSize: 12, color: c.success, fontWeight: '700', marginTop: 2 }}>● {EVENT_STATUSES[active.step]} · {active.services.length} services</Text>
          </View>
          <Icon name="chevron-right" size={24} color={c.muted} />
        </Tap>
      )}

      <SectionTitle title="What are you celebrating?" sub="Pick an event to start planning" />
      <View style={styles.grid}>
        {eventTypes.map(e => (
          <Tap key={e.id} onPress={() => startBooking(e.id)} style={{ width: evW, alignItems: 'center' }}>
            <View style={[styles.evTile, { backgroundColor: e.tint }]}>
              <Img uri={e.image} style={styles.evImg} />
            </View>
            <Text numberOfLines={2} style={{ fontSize: 11.5, fontWeight: '700', color: c.text, textAlign: 'center', marginTop: 6 }}>{e.name}</Text>
          </Tap>
        ))}
      </View>

      <SectionTitle title="Book event services" sub="7 categories · 500+ verified vendors" />
      <View style={{ paddingHorizontal: 16, gap: 10 }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {serviceCategories.slice(0, 2).map(s => (
            <Tap key={s.id} onPress={() => nav.navigate('ServiceCategory', { service: s.id })} style={[styles.bigSvc]}>
              <Img uri={s.image} style={StyleSheet.absoluteFill} />
              <LinearGradient colors={['transparent', 'rgba(20,10,46,0.9)']} style={StyleSheet.absoluteFill} />
              <View style={styles.svcText}>
                <Text style={styles.svcTitle}>{s.name}</Text>
                <Text style={styles.svcSub}>{s.blurb}</Text>
              </View>
            </Tap>
          ))}
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {serviceCategories.slice(2).map(s => (
            <Tap key={s.id} onPress={() => nav.navigate('ServiceCategory', { service: s.id })} style={[styles.smallSvc, { backgroundColor: c.white, borderColor: c.line, width: (width - 42) / 2 }]}>
              <View style={[styles.svcIcon, { backgroundColor: s.tint }]}><Icon name={s.icon} size={22} color={c.ink} /></View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ fontWeight: '800', fontSize: 14, color: c.text }} numberOfLines={1}>{s.name}</Text>
                <Text style={{ fontSize: 11, color: c.sub }} numberOfLines={1}>{s.blurb}</Text>
              </View>
            </Tap>
          ))}
        </View>
      </View>

      <SectionTitle title="Top-rated vendors ⭐" sub="Handpicked & verified by Occasion" />
      <FlatList data={topVendors} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }} keyExtractor={v => v.id} renderItem={({ item }) => <VendorTile v={item} />} />

      <LinearGradient colors={['#FFF3DA', '#FBF7F2']} style={{ marginTop: 24, paddingVertical: 4 }}>
        <SectionTitle title="Venues near you" sub="Banquets, farmhouses & rooftops" action="See all" onAction={() => nav.navigate('ServiceCategory', { service: 'venue' })} style={{ marginTop: 16 }} />
        <FlatList data={venues} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12, paddingBottom: 16 }} keyExtractor={v => v.id} renderItem={({ item }) => <VendorTile v={item} width={260} />} />
      </LinearGradient>

      <SectionTitle title="Real celebrations" sub="Moments planned on Occasion" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
        {([['aisle', 'v2', 'Riya & Kunal’s wedding'], ['balloons', 'v1', 'Aanya turns 5'], ['partyLights', 'v13', 'Rooftop house party'], ['audience', 'v15', 'Startup launch night'], ['balloonCouple', 'v7', 'The big yes!']] as const).map(([k, vid, cap]) => (
          <Tap key={k} onPress={() => nav.navigate('VendorDetails', { id: vid })} style={styles.story}>
            <Img uri={img(k, 500)} style={StyleSheet.absoluteFill} />
            <LinearGradient colors={['transparent', 'rgba(0,0,0,0.75)']} style={StyleSheet.absoluteFill} />
            <View style={{ position: 'absolute', left: 10, right: 10, bottom: 10 }}>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 13 }}>{cap}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Rating value={vendorById(vid).rating} small />
                <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 10, marginLeft: 5 }} numberOfLines={1}>{vendorById(vid).name}</Text>
              </View>
            </View>
          </Tap>
        ))}
      </ScrollView>

      {/* Why us */}
      <View style={[styles.why, { backgroundColor: c.white, borderColor: c.line }]}>
        {[['shield-check', 'Verified vendors'], ['cash-refund', 'Easy refunds'], ['account-tie', 'Event manager'], ['tag-heart', 'Best prices']].map(([i, t]) => (
          <View key={t} style={{ alignItems: 'center', flex: 1 }}>
            <View style={[styles.whyIcon, { backgroundColor: c.tint }]}><Icon name={i} size={20} color={c.ink} /></View>
            <Text style={{ fontSize: 11, fontWeight: '700', color: c.text, textAlign: 'center', marginTop: 6 }}>{t}</Text>
          </View>
        ))}
      </View>

      <Tap scale={0.98} onPress={() => dispatch(setMode('gifts'))} style={[styles.cross, { backgroundColor: '#F4E9F7' }]}>
        <Img uri={img('kraftGift', 200)} style={{ width: 54, height: 54, borderRadius: 14 }} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ fontWeight: '800', fontSize: 15, color: '#4A0E5E' }}>Can't make it? Send a gift instead</Text>
          <Text style={{ fontSize: 12, color: '#6B6275', marginTop: 2 }}>Switch to Gifting · delivery in 2 hours</Text>
        </View>
        <Icon name="swap-horizontal" size={22} color="#6A1B84" />
      </Tap>
    </View>
  );
};

const styles = StyleSheet.create({
  planWrap: { marginHorizontal: 16, marginTop: 18 },
  plan: { borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center' },
  stepPill: { backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 7, paddingVertical: 4, borderRadius: 8 },
  stepTxt: { color: '#fff', fontSize: 10, fontWeight: '700' },
  planBtn: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  active: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 14, padding: 12, borderRadius: 16, borderWidth: 1 },
  activeImg: { width: 56, height: 56, borderRadius: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10, rowGap: 16 },
  evTile: { width: '100%', aspectRatio: 1, borderRadius: 18, padding: 5 },
  evImg: { flex: 1, borderRadius: 14 },
  bigSvc: { flex: 1, height: 150, borderRadius: 18, overflow: 'hidden' },
  svcText: { position: 'absolute', left: 12, bottom: 12, right: 12 },
  svcTitle: { color: '#fff', fontSize: 17, fontWeight: '900' },
  svcSub: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '600', marginTop: 2 },
  smallSvc: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 14, borderWidth: 1 },
  svcIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  story: { width: 140, height: 200, borderRadius: 16, overflow: 'hidden' },
  why: { flexDirection: 'row', marginHorizontal: 16, marginTop: 24, padding: 14, borderRadius: 16, borderWidth: 1 },
  whyIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  cross: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 18, padding: 12, borderRadius: 16 },
});
