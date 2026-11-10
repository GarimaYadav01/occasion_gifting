import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import LinearGradient from '../../components/Gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Img } from '../../components/Img';
import { Tap } from '../../components/Tap';
import { Icon } from '../../components/Icon';
import { Chip, Skeleton } from '../../components/Bits';
import { VendorRow } from '../../components/VendorCard';
import { EmptyState } from '../../components/States';
import { useToast } from '../../components/Toast';
import { serviceById, vendorsFor } from '../../data/events';
import { useAppDispatch, useAppSelector } from '../../store';
import { pickVendor, removeService } from '../../store/slices/booking';
import { useNav, useStatusBar, useTheme } from '../../utils/hooks';
import { RootStackParamList } from '../../navigation/types';

export const ServiceCategoryScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  useStatusBar('light-content');
  const { params } = useRoute<RouteProp<RootStackParamList, 'ServiceCategory'>>();
  const s = serviceById(params.service);
  const picked = useAppSelector(st => st.booking.picks[s.id]?.vendorId);
  const [sub, setSub] = useState(params.sub || 'All');
  const [sort, setSort] = useState<'rating' | 'low' | 'high' | 'exp'>('rating');
  const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(true); const t = setTimeout(() => setLoading(false), 450); return () => clearTimeout(t); }, [sub, sort]);

  const list = useMemo(() => {
    let l = vendorsFor(s.id);
    if (sub !== 'All') { l = l.filter(v => v.subs.includes(sub)); }
    const f = { rating: (a: any, b: any) => b.rating - a.rating, low: (a: any, b: any) => a.priceFrom - b.priceFrom, high: (a: any, b: any) => b.priceFrom - a.priceFrom, exp: (a: any, b: any) => b.experience - a.experience }[sort];
    return l.slice().sort(f);
  }, [s.id, sub, sort]);

  const toggle = (vid: string) => {
    if (picked === vid) { dispatch(removeService(s.id)); toast.show('Removed from event plan', 'close-circle'); }
    else { dispatch(pickVendor({ service: s.id, vendorId: vid })); toast.show('Added to your event plan', 'clipboard-check'); }
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Img uri={s.image.replace('w=500', 'w=900')} style={{ height: 200 + insets.top }}>
        <LinearGradient colors={['rgba(20,10,46,0.5)', 'rgba(20,10,46,0.2)', 'rgba(20,10,46,0.95)']} style={StyleSheet.absoluteFill} />
        <View style={[styles.top, { top: insets.top + 6 }]}>
          <Tap onPress={() => nav.goBack()} style={styles.btn}><Icon name="arrow-left" size={22} color="#fff" /></Tap>
          <Tap onPress={() => nav.navigate('Search')} style={styles.btn}><Icon name="magnify" size={22} color="#fff" /></Tap>
        </View>
        <View style={styles.title}>
          <View style={[styles.icon, { backgroundColor: c.primary }]}><Icon name={s.icon} size={22} color={c.onPrimary} /></View>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: '900' }}>{s.name}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' }}>{list.length} verified vendors · {s.blurb}</Text>
          </View>
        </View>
      </Img>
      <View style={{ backgroundColor: c.white, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.line }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 12 }}>
          {['All', ...s.subs].map(x => <Chip key={x} label={x} on={sub === x} onPress={() => setSub(x)} />)}
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 10 }}>
          {([['rating', 'Top rated', 'star'], ['low', 'Price ↑', 'sort-ascending'], ['high', 'Price ↓', 'sort-descending'], ['exp', 'Most experienced', 'medal']] as const).map(([k, l, i]) => (
            <Chip key={k} label={l} icon={i} on={sort === k} onPress={() => setSort(k)} style={{ height: 30 }} />
          ))}
        </ScrollView>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {loading ? (
          [0, 1, 2].map(i => (
            <View key={i} style={{ flexDirection: 'row', marginBottom: 14 }}>
              <Skeleton style={{ width: 108, height: 124 }} />
              <View style={{ flex: 1, marginLeft: 12, gap: 8 }}><Skeleton style={{ height: 16, width: '80%' }} /><Skeleton style={{ height: 12, width: '60%' }} /><Skeleton style={{ height: 12, width: '40%' }} /><Skeleton style={{ height: 30, width: '50%' }} /></View>
            </View>
          ))
        ) : list.length === 0 ? (
          <EmptyState compact icon="store-search-outline" title="No vendors yet" body={`We're onboarding ${sub.toLowerCase()} partners in your city. Try another sub-category.`} cta="Show all" onCta={() => setSub('All')} />
        ) : (
          list.map(v => <VendorRow key={v.id} v={v} selected={picked === v.id} onSelect={() => toggle(v.id)} />)
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  top: { position: 'absolute', left: 12, right: 12, flexDirection: 'row', justifyContent: 'space-between' },
  btn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  title: { position: 'absolute', left: 16, right: 16, bottom: 16, flexDirection: 'row', alignItems: 'center' },
  icon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
