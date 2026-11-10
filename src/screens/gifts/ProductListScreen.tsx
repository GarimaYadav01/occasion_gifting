import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { AppHeader } from '../../components/AppHeader';
import { Chip, Skeleton } from '../../components/Bits';
import { ProductCard } from '../../components/ProductCard';
import { Tap } from '../../components/Tap';
import { Img } from '../../components/Img';
import { Icon } from '../../components/Icon';
import { Sheet } from '../../components/Sheet';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/States';
import { giftCategories, occasions, products } from '../../data/gifts';
import { useTheme } from '../../utils/hooks';
import { RootStackParamList } from '../../navigation/types';

const { width } = Dimensions.get('window');
const RAIL = 84;

const SORTS = [['popular', 'Popularity'], ['low', 'Price: Low to High'], ['high', 'Price: High to Low'], ['new', 'Newest first'], ['rating', 'Customer rating']] as const;
const PRICES = [['any', 'Any price'], ['u500', 'Under ₹500'], ['500-1000', '₹500 – ₹1,000'], ['1000-2500', '₹1,000 – ₹2,500'], ['o2500', 'Above ₹2,500']] as const;
const RATINGS = [['any', 'Any'], ['4', '4.0+'], ['4.5', '4.5+'], ['4.8', '4.8+']] as const;
const DELIVERY = [['any', 'Any date'], ['today', 'Today'], ['tomorrow', 'By tomorrow']] as const;

type Filters = { price: string; rating: string; delivery: string };

export const ProductListScreen = () => {
  const { c } = useTheme();
  const { params } = useRoute<RouteProp<RootStackParamList, 'ProductList'>>();
  const cat = giftCategories.find(g => g.id === params.category);
  const occ = occasions.find(o => o.id === params.occasion);
  const [sub, setSub] = useState(params.sub || 'All');
  const [sort, setSort] = useState<string>('popular');
  const [filters, setFilters] = useState<Filters>({ price: 'any', rating: 'any', delivery: params.filter === 'sameDay' ? 'today' : 'any' });
  const [draft, setDraft] = useState<Filters>(filters);
  const [sheet, setSheet] = useState<'sort' | 'filter' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setLoading(true); const t = setTimeout(() => setLoading(false), 550); return () => clearTimeout(t); }, [sub, sort, filters]);

  const list = useMemo(() => {
    let l = products.slice();
    if (cat) { l = l.filter(p => p.category === cat.id); }
    if (occ) { l = l.filter(p => p.occasions.includes(occ.id)); }
    if (params.filter === 'trending') { l = l.filter(p => p.tags.includes('Trending') || p.tags.includes('New')); }
    if (params.filter === 'bestseller') { l = l.filter(p => p.reviews > 900); }
    if (params.filter === 'new') { l = l.filter(p => p.addedDaysAgo < 15); }
    if (sub !== 'All') { l = l.filter(p => p.sub === sub); }
    const pr = filters.price;
    if (pr === 'u500') { l = l.filter(p => p.price < 500); }
    if (pr === '500-1000') { l = l.filter(p => p.price >= 500 && p.price <= 1000); }
    if (pr === '1000-2500') { l = l.filter(p => p.price >= 1000 && p.price <= 2500); }
    if (pr === 'o2500') { l = l.filter(p => p.price > 2500); }
    if (filters.rating !== 'any') { l = l.filter(p => p.rating >= Number(filters.rating)); }
    if (filters.delivery === 'today') { l = l.filter(p => p.sameDay); }
    const s = { popular: (a: any, b: any) => b.popularity - a.popularity, low: (a: any, b: any) => a.price - b.price, high: (a: any, b: any) => b.price - a.price, new: (a: any, b: any) => a.addedDaysAgo - b.addedDaysAgo, rating: (a: any, b: any) => b.rating - a.rating }[sort as 'popular'];
    return l.sort(s);
  }, [cat, occ, params.filter, sub, filters, sort]);

  const activeCount = (filters.price !== 'any' ? 1 : 0) + (filters.rating !== 'any' ? 1 : 0) + (filters.delivery !== 'any' ? 1 : 0);
  const gridW = cat ? width - RAIL : width;
  const cols = cat ? 2 : 2;
  const cardW = (gridW - 12 * 2 - 10 * (cols - 1)) / cols;
  const title = params.title || cat?.name || occ?.name || 'Gifts';

  const resetFilters = () => { const f = { price: 'any', rating: 'any', delivery: 'any' }; setFilters(f); setDraft(f); };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <AppHeader title={title} subtitle={`${list.length} items${cat ? ' · ' + cat.tagline : ''}`} actions={['search', 'cart']} />
      {/* Filter bar */}
      <View style={{ backgroundColor: c.white, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.line }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10 }}>
          <Chip label={activeCount ? `Filters (${activeCount})` : 'Filters'} icon="tune-variant" on={activeCount > 0} onPress={() => { setDraft(filters); setSheet('filter'); }} />
          <Chip label={SORTS.find(s => s[0] === sort)![1]} icon="sort" on={sort !== 'popular'} onPress={() => setSheet('sort')} />
          <Chip label="Same-day" icon="lightning-bolt" on={filters.delivery === 'today'} onPress={() => setFilters(f => ({ ...f, delivery: f.delivery === 'today' ? 'any' : 'today' }))} />
          <Chip label="4.5+ rated" icon="star" on={filters.rating === '4.5'} onPress={() => setFilters(f => ({ ...f, rating: f.rating === '4.5' ? 'any' : '4.5' }))} />
          <Chip label="Under ₹1,000" on={filters.price === '500-1000'} onPress={() => setFilters(f => ({ ...f, price: f.price === '500-1000' ? 'any' : '500-1000' }))} />
        </ScrollView>
      </View>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Blinkit-style sub-category rail */}
        {cat && (
          <ScrollView style={[styles.rail, { backgroundColor: c.white, borderRightColor: c.line }]} showsVerticalScrollIndicator={false}>
            {cat.subs.map(s => {
              const on = s === sub;
              const sample = s === 'All' ? products.find(p => p.category === cat.id) : products.find(p => p.category === cat.id && p.sub === s);
              return (
                <Tap key={s} onPress={() => setSub(s)} style={[styles.railItem, on && { backgroundColor: c.tint }]}>
                  {on && <View style={[styles.railBar, { backgroundColor: c.primary }]} />}
                  <View style={[styles.railImgWrap, { backgroundColor: on ? c.white : c.lineSoft }]}>
                    {sample ? <Img uri={sample.image} style={styles.railImg} /> : <Icon name={cat.icon} size={22} color={c.ink} />}
                  </View>
                  <Text style={{ fontSize: 11, fontWeight: on ? '800' : '600', color: on ? c.ink : c.sub, textAlign: 'center', marginTop: 4 }} numberOfLines={2}>{s}</Text>
                </Tap>
              );
            })}
          </ScrollView>
        )}
        <View style={{ flex: 1 }}>
          {loading ? (
            <View style={[styles.gridWrap, { padding: 12 }]}>
              {[0, 1, 2, 3, 4, 5].map(i => (
                <View key={i} style={{ width: cardW, marginBottom: 12 }}>
                  <Skeleton style={{ height: cardW * 0.92, borderRadius: 14 }} />
                  <Skeleton style={{ height: 12, marginTop: 8, width: '85%' }} />
                  <Skeleton style={{ height: 12, marginTop: 6, width: '50%' }} />
                </View>
              ))}
            </View>
          ) : list.length === 0 ? (
            <EmptyState compact icon="filter-remove-outline" title="No gifts match" body="Try removing a filter or picking a different sub-category." cta="Reset filters" onCta={() => { resetFilters(); setSub('All'); }} />
          ) : (
            <FlatList
              data={list}
              key={cols}
              numColumns={cols}
              keyExtractor={p => p.id}
              columnWrapperStyle={{ gap: 10 }}
              contentContainerStyle={{ padding: 12, gap: 10, paddingBottom: 40 }}
              renderItem={({ item }) => <ProductCard p={item} width={cardW} />}
            />
          )}
        </View>
      </View>

      <Sheet visible={sheet === 'sort'} onClose={() => setSheet(null)} title="Sort by">
        {SORTS.map(([k, l]) => (
          <Tap key={k} onPress={() => { setSort(k); setSheet(null); }} style={styles.radioRow}>
            <Text style={{ flex: 1, fontSize: 15, fontWeight: sort === k ? '800' : '500', color: c.text }}>{l}</Text>
            <Icon name={sort === k ? 'radiobox-marked' : 'radiobox-blank'} size={22} color={sort === k ? c.ink : c.muted} />
          </Tap>
        ))}
      </Sheet>

      <Sheet visible={sheet === 'filter'} onClose={() => setSheet(null)} title="Filters">
        <ScrollView style={{ maxHeight: 420 }}>
          {([['Price', 'price', PRICES], ['Customer rating', 'rating', RATINGS], ['Delivery date', 'delivery', DELIVERY]] as const).map(([label, key, opts]) => (
            <View key={key} style={{ marginBottom: 18 }}>
              <Text style={{ fontSize: 14, fontWeight: '800', color: c.text, marginBottom: 10 }}>{label}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {opts.map(([k, l]) => <Chip key={k} label={l} on={draft[key] === k} onPress={() => setDraft(d => ({ ...d, [key]: k }))} style={{ marginRight: 0 }} />)}
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
          <Button title="Clear all" variant="outline" style={{ flex: 1 }} onPress={() => setDraft({ price: 'any', rating: 'any', delivery: 'any' })} />
          <Button title="Apply" style={{ flex: 1.4 }} onPress={() => { setFilters(draft); setSheet(null); }} />
        </View>
      </Sheet>
    </View>
  );
};

const styles = StyleSheet.create({
  rail: { width: RAIL, flexGrow: 0, borderRightWidth: StyleSheet.hairlineWidth },
  railItem: { alignItems: 'center', paddingVertical: 10, paddingHorizontal: 6 },
  railBar: { position: 'absolute', right: 0, top: 10, bottom: 10, width: 4, borderTopLeftRadius: 4, borderBottomLeftRadius: 4 },
  railImgWrap: { width: 52, height: 52, borderRadius: 26, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  railImg: { width: 52, height: 52 },
  gridWrap: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  radioRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#EFE7EE' },
});
