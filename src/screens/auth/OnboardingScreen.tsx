import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import LinearGradient from '../../components/Gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Img } from '../../components/Img';
import { Icon } from '../../components/Icon';
import { Tap } from '../../components/Tap';
import { Button } from '../../components/Button';
import { onboardingSlides } from '../../data/user';
import { useAppDispatch } from '../../store';
import { finishOnboarding } from '../../store/slices/app';
import { useNav, useStatusBar } from '../../utils/hooks';
import { font } from '../../theme';

const { width, height } = Dimensions.get('window');

export const OnboardingScreen = () => {
  const nav = useNav();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  useStatusBar('light-content');
  const [index, setIndex] = useState(0);
  const ref = useRef<FlatList>(null);
  const done = () => { dispatch(finishOnboarding()); nav.replace('Login'); };
  const next = () => (index < 2 ? ref.current?.scrollToIndex({ index: index + 1 }) : done());

  return (
    <View style={{ flex: 1, backgroundColor: '#1D0A26' }}>
      <FlatList
        ref={ref}
        data={onboardingSlides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <View style={{ width, height }}>
            <Img uri={item.image} style={{ width, height: height * 0.62 }}>
              <LinearGradient colors={['rgba(29,10,38,0.2)', 'rgba(29,10,38,0)', '#1D0A26']} locations={[0, 0.4, 1]} style={StyleSheet.absoluteFill} />
            </Img>
            <View style={styles.textWrap}>
              <View style={styles.iconBadge}><Icon name={item.icon} size={22} color="#4A0E5E" /></View>
              <Text style={[font.display, styles.title]}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
            </View>
          </View>
        )}
      />
      <Tap onPress={done} style={[styles.skip, { top: insets.top + 10 }]}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Skip</Text>
      </Tap>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.dots}>
          {onboardingSlides.map((s, i) => <View key={s.id} style={[styles.dot, i === index && styles.dotOn]} />)}
        </View>
        <Button title={index === 2 ? 'Get started' : 'Next'} iconRight="arrow-right" onPress={next} style={{ backgroundColor: '#E3A72F', borderColor: '#E3A72F', width: 170 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textWrap: { position: 'absolute', top: height * 0.5, left: 24, right: 24 },
  iconBadge: { width: 46, height: 46, borderRadius: 14, backgroundColor: '#FFD983', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { color: '#fff', fontSize: 32, lineHeight: 38 },
  body: { color: 'rgba(255,255,255,0.75)', fontSize: 15, lineHeight: 22, marginTop: 12, fontWeight: '500' },
  skip: { position: 'absolute', right: 16, backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  footer: { position: 'absolute', bottom: 0, left: 24, right: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dots: { flexDirection: 'row' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)', marginRight: 6 },
  dotOn: { width: 26, backgroundColor: '#FFD983' },
});
