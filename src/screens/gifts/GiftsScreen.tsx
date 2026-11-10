import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import LinearGradient from '../../components/Gradient';
import { AppHeader } from '../../components/AppHeader';
import { SearchBar } from '../../components/SearchBar';
import { Chip, SectionTitle } from '../../components/Bits';
import { Tap } from '../../components/Tap';
import { Img } from '../../components/Img';
import { Icon } from '../../components/Icon';
import { giftCategories, occasions, products } from '../../data/gifts';
import { useNav, useTheme } from '../../utils/hooks';

const { width } = Dimensions.get('window');

export const GiftsScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const count = (id: string) => products.filter(p => p.category === id).length;
  const half = (width - 42) / 2;
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <AppHeader title="Gift Store" subtitle={`${products.length * 37}+ gifts from 120 local sellers`} noBack actions={['wishlist', 'cart']} />
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 16, paddingBottom: 6 }}>
          <SearchBar onPress={() => nav.navigate('Search')} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <Chip label="Same-day" icon="lightning-bolt" onPress={() => nav.navigate('ProductList', { filter: 'sameDay', title: 'Same-day delivery' })} />
          <Chip label="Bestsellers" icon="fire" onPress={() => nav.navigate('ProductList', { filter: 'bestseller', title: 'Best sellers' })} />
          <Chip label="New arrivals" icon="new-box" onPress={() => nav.navigate('ProductList', { filter: 'new', title: 'New arrivals' })} />
          <Chip label="Trending" icon="trending-up" onPress={() => nav.navigate('ProductList', { filter: 'trending', title: 'Trending' })} />
        </ScrollView>

        {/* Hero category banners */}
        <View style={{ paddingHorizontal: 16, gap: 10, marginTop: 6 }}>
          {giftCategories.slice(0, 2).map((g, i) => (
            <Tap key={g.id} scale={0.98} onPress={() => nav.navigate('ProductList', { category: g.id })} style={styles.hero}>
              <LinearGradient colors={i ? ['#7A3B12', '#D9A43A'] : ['#6A1B84', '#FF4F8B']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <Img uri={g.image.replace('w=400', 'w=800')} style={styles.heroImg} />
              <View style={styles.heroTxt}>
                <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900' }}>{g.name}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '600', marginTop: 2 }}>{g.tagline}</Text>
                <View style={styles.count}><Text style={{ fontSize: 11, fontWeight: '800', color: '#1D1424' }}>{count(g.id) * 23}+ products</Text><Icon name="arrow-right" size={13} color="#1D1424" /></View>
              </View>
            </Tap>
          ))}
        </View>

        <SectionTitle title="All categories" />
        <View style={styles.grid}>
          {giftCategories.map(g => (
            <Tap key={g.id} scale={0.97} onPress={() => nav.navigate('ProductList', { category: g.id })} style={[styles.cat, { width: half, backgroundColor: g.tint }]}>
              <View style={{ padding: 12, paddingBottom: 0 }}>
                <Text style={{ fontSize: 15, fontWeight: '800', color: c.text }}>{g.name}</Text>
                <Text style={{ fontSize: 11, color: c.sub, fontWeight: '600', marginTop: 2 }}>{count(g.id) * 23}+ items</Text>
              </View>
              <Img uri={g.image} style={styles.catImg} />
            </Tap>
          ))}
        </View>

        <SectionTitle title="Gifts by occasion" />
        <View style={styles.grid}>
          {occasions.map(o => (
            <Tap key={o.id} onPress={() => nav.navigate('ProductList', { occasion: o.id, title: `${o.name} gifts` })} style={[styles.occ, { backgroundColor: c.white, borderColor: c.line, width: half }]}>
              <View style={[styles.occIcon, { backgroundColor: o.tint }]}><Icon name={o.icon} size={20} color={c.ink} /></View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ fontWeight: '800', color: c.text }}>{o.name}</Text>
                <Text style={{ fontSize: 11, color: c.sub }}>{products.filter(p => p.occasions.includes(o.id)).length * 19}+ gifts</Text>
              </View>
              <Icon name="chevron-right" size={18} color={c.muted} />
            </Tap>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  hero: { height: 130, borderRadius: 20, overflow: 'hidden' },
  heroImg: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '48%', borderTopLeftRadius: 60, borderBottomLeftRadius: 60 },
  heroTxt: { padding: 16, flex: 1, justifyContent: 'center', width: '58%' },
  count: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', backgroundColor: '#fff', paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8, marginTop: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10 },
  cat: { height: 170, borderRadius: 18, overflow: 'hidden' },
  catImg: { position: 'absolute', bottom: -10, right: -10, width: '78%', height: 110, borderRadius: 20 },
  occ: { flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 14, borderWidth: 1 },
  occIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
