import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import LinearGradient from './Gradient';
import { Tap } from './Tap';
import { Img } from './Img';
import { Icon } from './Icon';

const { width } = Dimensions.get('window');
const W = width - 32;

export interface BannerItem { id: string; title: string; sub: string; cta: string; image: string; colors: string[] }

export const Banner = ({ items, onPress }: { items: BannerItem[]; onPress: (b: BannerItem) => void }) => {
  const ref = useRef<FlatList>(null);
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setI(p => {
        const n = (p + 1) % items.length;
        ref.current?.scrollToOffset({ offset: n * (W + 12), animated: true });
        return n;
      });
    }, 3800);
    return () => clearInterval(t);
  }, [items.length]);
  return (
    <View>
      <FlatList
        ref={ref}
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={W + 12}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 16 }}
        onMomentumScrollEnd={e => setI(Math.round(e.nativeEvent.contentOffset.x / (W + 12)))}
        keyExtractor={b => b.id}
        renderItem={({ item }) => (
          <Tap scale={0.98} onPress={() => onPress(item)} style={[styles.card, { width: W, marginRight: 12 }]}>
            <LinearGradient colors={item.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            <Img uri={item.image} style={styles.img}>
              <LinearGradient colors={[item.colors[0], 'transparent']} start={{ x: 0, y: 0.5 }} end={{ x: 0.6, y: 0.5 }} style={StyleSheet.absoluteFill} />
            </Img>
            <View style={styles.text}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.sub}>{item.sub}</Text>
              <View style={styles.cta}>
                <Text style={styles.ctaTxt}>{item.cta}</Text>
                <Icon name="arrow-right" size={14} color="#1D1424" />
              </View>
            </View>
          </Tap>
        )}
      />
      <View style={styles.dots}>
        {items.map((b, k) => <View key={b.id} style={[styles.dot, k === i && styles.dotOn]} />)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { height: 168, borderRadius: 20, overflow: 'hidden' },
  img: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '58%', backgroundColor: 'transparent' },
  text: { padding: 18, width: '62%', flex: 1, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 22, fontWeight: '900', lineHeight: 26, letterSpacing: -0.4 },
  sub: { color: 'rgba(255,255,255,0.88)', fontSize: 12, fontWeight: '600', marginTop: 6 },
  cta: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, marginTop: 12, gap: 4 },
  ctaTxt: { color: '#1D1424', fontWeight: '800', fontSize: 12 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#DCCFD9', marginHorizontal: 3 },
  dotOn: { width: 18, backgroundColor: '#6B6275' },
});
