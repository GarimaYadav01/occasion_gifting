import React from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import LinearGradient from '../../components/Gradient';
import { Banner } from '../../components/Banner';
import { SectionTitle } from '../../components/Bits';
import { ProductCard } from '../../components/ProductCard';
import { Tap } from '../../components/Tap';
import { Img } from '../../components/Img';
import { Icon } from '../../components/Icon';
import { giftBanners, giftCategories, occasions, products } from '../../data/gifts';
import { serviceCategories } from '../../data/events';
import { useAppDispatch, useAppSelector } from '../../store';
import { setMode } from '../../store/slices/app';
import { useNav, useTheme } from '../../utils/hooks';
import { daysUntilYearly } from '../../utils/format';

const { width } = Dimensions.get('window');

const Row = ({ data }: { data: typeof products }) => (
  <FlatList
    data={data}
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
    keyExtractor={p => p.id}
    renderItem={({ item }) => <ProductCard p={item} width={148} />}
  />
);

export const GiftHome = () => {
  const { c } = useTheme();
  const nav = useNav();
  const dispatch = useAppDispatch();
  const reminders = useAppSelector(s => s.profile.reminders);
  const next = [...reminders].sort((a, b) => daysUntilYearly(a.date) - daysUntilYearly(b.date))[0];
  const trending = products.filter(p => p.tags.includes('Trending') || p.tags.includes('New'));
  const best = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 10);
  const sameDay = products.filter(p => p.eta === 'in 2 hrs' || p.sameDay).slice(0, 9);
  const recommended = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);
  const tileW = (width - 32 - 20) / 3;
  const recW = (width - 32 - 10) / 2;

  return (
    <View>
      {/* Value strip */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8, marginBottom: 14 }}>
        {[['lightning-bolt', '2-hr delivery'], ['weather-night', 'Midnight delivery'], ['truck-fast-outline', 'Free above ₹499'], ['shield-check-outline', '100% fresh']].map(([i, t]) => (
          <View key={t} style={[styles.pill, { backgroundColor: c.white, borderColor: c.line }]}>
            <Icon name={i} size={14} color={c.ink} />
            <Text style={{ fontSize: 12, fontWeight: '700', color: c.text, marginLeft: 5 }}>{t}</Text>
          </View>
        ))}
      </ScrollView>

      <Banner items={giftBanners} onPress={b => nav.navigate('ProductList', { category: (b as any).link.category })} />

      {/* Occasions */}
      <SectionTitle title="Shop by occasion" sub="Gifts for every celebration" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}>
        {occasions.map(o => (
          <Tap key={o.id} onPress={() => nav.navigate('ProductList', { occasion: o.id, title: `${o.name} gifts` })} style={{ alignItems: 'center', width: 72 }}>
            <View style={[styles.occRing, { borderColor: c.accent }]}>
              <Img uri={o.image} style={styles.occImg} />
            </View>
            <Text style={{ fontSize: 12, fontWeight: '700', color: c.text, marginTop: 6, textAlign: 'center' }} numberOfLines={1}>{o.name}</Text>
          </Tap>
        ))}
      </ScrollView>

      {/* Categories grid */}
      <SectionTitle title="Gift categories" action="See all" onAction={() => nav.navigate('Main', { screen: 'Gifts' })} />
      <View style={styles.grid}>
        {giftCategories.map(g => (
          <Tap key={g.id} onPress={() => nav.navigate('ProductList', { category: g.id })} style={{ width: tileW }}>
            <View style={[styles.catTile, { backgroundColor: g.tint }]}>
              <Img uri={g.image} style={styles.catImg} />
            </View>
            <Text style={{ fontSize: 12.5, fontWeight: '700', color: c.text, textAlign: 'center', marginTop: 6 }}>{g.name}</Text>
          </Tap>
        ))}
      </View>

      {/* Reminder nudge */}
      {next && (
        <Tap scale={0.98} onPress={() => nav.navigate('ProductList', { occasion: next.type === 'Birthday' ? 'birthday' : 'anniversary', title: `Gifts for ${next.name.split(' ')[0]}` })} style={[styles.remind, { backgroundColor: c.white, borderColor: c.line }]}>
          <Img uri={next.avatar || ''} style={styles.remindImg} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: c.accent, letterSpacing: 0.6 }}>UPCOMING {next.type.toUpperCase()}</Text>
            <Text style={{ fontSize: 15, fontWeight: '800', color: c.text, marginTop: 2 }}>{next.name} · in {daysUntilYearly(next.date)} days</Text>
            <Text style={{ fontSize: 12, color: c.sub, marginTop: 2 }}>Schedule a surprise delivery now 🎁</Text>
          </View>
          <View style={[styles.remindCta, { backgroundColor: c.primary }]}><Icon name="arrow-right" size={18} color={c.onPrimary} /></View>
        </Tap>
      )}

      <SectionTitle title="Trending gifts 🔥" sub="What everyone's sending this week" action="See all" onAction={() => nav.navigate('ProductList', { filter: 'trending', title: 'Trending gifts' })} />
      <Row data={trending} />

      {/* Same day delivery band */}
      <LinearGradient colors={['#FFF0D6', '#FFE6EF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.band}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 }}>
          <View style={[styles.boltWrap, { backgroundColor: c.primary }]}><Icon name="lightning-bolt" size={20} color="#FFD27A" /></View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: '900', color: c.text }}>Same-day delivery</Text>
            <Text style={{ fontSize: 12, color: c.sub, fontWeight: '600' }}>Order by 6 PM · reaches today</Text>
          </View>
          <Tap onPress={() => nav.navigate('ProductList', { filter: 'sameDay', title: 'Same-day delivery' })}><Text style={{ color: c.ink, fontWeight: '800' }}>View all</Text></Tap>
        </View>
        <Row data={sameDay} />
      </LinearGradient>

      <SectionTitle title="Best sellers" sub="Loved by 1M+ customers" action="See all" onAction={() => nav.navigate('ProductList', { filter: 'bestseller', title: 'Best sellers' })} />
      <Row data={best} />

      {/* Event services cross-sell */}
      <SectionTitle title="Popular event services" sub="Decor, catering, DJs & more" action="Explore" onAction={() => dispatch(setMode('events'))} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
        {serviceCategories.slice(0, 6).map(s => (
          <Tap key={s.id} onPress={() => { dispatch(setMode('events')); nav.navigate('ServiceCategory', { service: s.id }); }} style={styles.svc}>
            <Img uri={s.image} style={StyleSheet.absoluteFill} />
            <LinearGradient colors={['transparent', 'rgba(20,10,46,0.85)']} style={StyleSheet.absoluteFill} />
            <View style={{ position: 'absolute', left: 10, bottom: 10, right: 10 }}>
              <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>{s.name}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '600' }}>{s.blurb}</Text>
            </View>
          </Tap>
        ))}
      </ScrollView>

      <SectionTitle title="Recommended for you" sub="Based on your interests" />
      <View style={[styles.grid, { gap: 10 }]}>
        {recommended.map(p => <ProductCard key={p.id} p={p} width={recW} />)}
      </View>

      <View style={{ alignItems: 'center', marginTop: 30 }}>
        <Text style={{ fontSize: 30, fontWeight: '900', color: '#E4D9E1', letterSpacing: -1 }}>Gift happiness.</Text>
        <Text style={{ fontSize: 12, color: c.muted, marginTop: 4 }}>Made with 💜 by Occasion</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  occRing: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, padding: 3 },
  occImg: { flex: 1, borderRadius: 32 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10, rowGap: 14 },
  catTile: { height: 100, borderRadius: 16, overflow: 'hidden', padding: 6 },
  catImg: { flex: 1, borderRadius: 12 },
  remind: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 22, padding: 12, borderRadius: 16, borderWidth: 1 },
  remindImg: { width: 52, height: 52, borderRadius: 26 },
  remindCta: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  band: { marginTop: 24, paddingVertical: 16 },
  boltWrap: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  svc: { width: 150, height: 180, borderRadius: 16, overflow: 'hidden' },
});
