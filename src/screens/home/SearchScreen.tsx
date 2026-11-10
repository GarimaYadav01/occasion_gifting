import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SearchBar } from '../../components/SearchBar';
import { Tap } from '../../components/Tap';
import { Icon } from '../../components/Icon';
import { Chip, Skeleton } from '../../components/Bits';
import { ProductRow } from '../../components/ProductCard';
import { VendorRow } from '../../components/VendorCard';
import { EmptyState } from '../../components/States';
import { products, giftCategories } from '../../data/gifts';
import { vendors, serviceCategories } from '../../data/events';
import { useAppDispatch } from '../../store';
import { setMode } from '../../store/slices/app';
import { useNav, useStatusBar, useTheme } from '../../utils/hooks';

export const SearchScreen = () => {
  const { c, mode } = useTheme();
  const nav = useNav();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  useStatusBar('dark-content');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState(['red roses', 'chocolate cake', 'balloon decoration', 'DJ']);

  const onChange = (t: string) => {
    setQ(t);
    setLoading(true);
    setTimeout(() => setLoading(false), 350);
  };

  const term = q.trim().toLowerCase();
  const pr = useMemo(() => (term ? products.filter(p => `${p.name} ${p.category} ${p.sub} ${p.seller} ${p.occasions.join(' ')}`.toLowerCase().includes(term)) : []), [term]);
  const vr = useMemo(() => (term ? vendors.filter(v => `${v.name} ${v.service} ${v.subs.join(' ')} ${v.area}`.toLowerCase().includes(term)) : []), [term]);
  const giftsFirst = mode === 'gifts';

  const trendingGift = ['Red roses', 'Black forest', 'Midnight cake', 'Truffles', 'Hamper', 'Balloons'];
  const trendingEvent = ['Balloon decoration', 'Photographer', 'DJ', 'Banquet hall', 'Bridal makeup', 'Catering'];

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={[styles.head, { paddingTop: insets.top + 8, backgroundColor: c.white, borderBottomColor: c.line }]}>
        <Tap onPress={() => nav.goBack()} style={{ padding: 6, marginRight: 4 }}><Icon name="arrow-left" size={24} /></Tap>
        <View style={{ flex: 1 }}><SearchBar value={q} onChangeText={onChange} autoFocus style={{ shadowOpacity: 0, elevation: 0 }} /></View>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {!term ? (
          <>
            {recent.length > 0 && (
              <>
                <View style={styles.rowBetween}>
                  <Text style={styles.label}>RECENT SEARCHES</Text>
                  <Tap onPress={() => setRecent([])}><Text style={{ color: c.ink, fontWeight: '800', fontSize: 12 }}>Clear</Text></Tap>
                </View>
                <View style={styles.wrap}>
                  {recent.map(r => <Chip key={r} label={r} icon="history" onPress={() => onChange(r)} style={{ marginBottom: 8 }} />)}
                </View>
              </>
            )}
            <Text style={[styles.label, { marginTop: 18 }]}>TRENDING {giftsFirst ? 'GIFTS' : 'EVENT SERVICES'}</Text>
            <View style={styles.wrap}>
              {(giftsFirst ? trendingGift : trendingEvent).map(r => <Chip key={r} label={r} icon="trending-up" onPress={() => onChange(r)} style={{ marginBottom: 8 }} />)}
            </View>
            <Text style={[styles.label, { marginTop: 18 }]}>BROWSE {giftsFirst ? 'CATEGORIES' : 'SERVICES'}</Text>
            <View style={[styles.wrap, { gap: 10 }]}>
              {giftsFirst
                ? giftCategories.map(g => (
                  <Tap key={g.id} onPress={() => nav.replace('ProductList', { category: g.id })} style={[styles.catBox, { backgroundColor: g.tint }]}>
                    <Icon name={g.icon} size={22} color={c.ink} />
                    <Text style={{ fontWeight: '700', marginTop: 6, color: c.text, fontSize: 12 }}>{g.name}</Text>
                  </Tap>
                ))
                : serviceCategories.map(s => (
                  <Tap key={s.id} onPress={() => nav.replace('ServiceCategory', { service: s.id })} style={[styles.catBox, { backgroundColor: s.tint }]}>
                    <Icon name={s.icon} size={22} color={c.ink} />
                    <Text style={{ fontWeight: '700', marginTop: 6, color: c.text, fontSize: 12 }}>{s.name}</Text>
                  </Tap>
                ))}
            </View>
          </>
        ) : loading ? (
          [0, 1, 2, 3].map(i => (
            <View key={i} style={{ flexDirection: 'row', marginBottom: 14 }}>
              <Skeleton style={{ width: 90, height: 90 }} />
              <View style={{ flex: 1, marginLeft: 12, gap: 8 }}>
                <Skeleton style={{ height: 14, width: '80%' }} />
                <Skeleton style={{ height: 12, width: '50%' }} />
                <Skeleton style={{ height: 24, width: '35%' }} />
              </View>
            </View>
          ))
        ) : pr.length + vr.length === 0 ? (
          <EmptyState icon="magnify-close" title="No results found" body={`We couldn't find anything for "${q}". Try "cake", "roses" or "decorator".`} cta="Clear search" onCta={() => setQ('')} />
        ) : (
          <>
            {(giftsFirst ? [['gifts', pr], ['events', vr]] : [['events', vr], ['gifts', pr]]).map(([k, list]: any) =>
              list.length ? (
                <View key={k} style={{ marginBottom: 12 }}>
                  <View style={[styles.rowBetween, { marginBottom: 10 }]}>
                    <Text style={styles.label}>{k === 'gifts' ? `GIFTS (${list.length})` : `EVENT VENDORS (${list.length})`}</Text>
                    {k !== mode && (
                      <Tap onPress={() => dispatch(setMode(k))}><Text style={{ color: c.ink, fontWeight: '800', fontSize: 12 }}>Switch to {k === 'gifts' ? 'Gifting' : 'Events'}</Text></Tap>
                    )}
                  </View>
                  {list.map((it: any) => (k === 'gifts' ? <ProductRow key={it.id} p={it} /> : <VendorRow key={it.id} v={it} />))}
                </View>
              ) : null,
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingBottom: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  label: { fontSize: 12, fontWeight: '800', color: '#A39BAD', letterSpacing: 1, marginBottom: 10 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  catBox: { width: '31%', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
});
