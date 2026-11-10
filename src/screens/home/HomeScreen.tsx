import React, { useState } from 'react';
import { Animated, RefreshControl, StyleSheet, Text, View } from 'react-native';
import LinearGradient from '../../components/Gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tap } from '../../components/Tap';
import { Icon } from '../../components/Icon';
import { Img } from '../../components/Img';
import { ModeSwitch } from '../../components/ModeSwitch';
import { SearchBar } from '../../components/SearchBar';
import { LocationSheet } from '../../components/LocationSheet';
import { useAppSelector } from '../../store';
import { useNav, useStatusBar, useTheme } from '../../utils/hooks';
import { GiftHome } from './GiftHome';
import { EventHome } from './EventHome';

export const HomeScreen = () => {
  const { c, isEvents } = useTheme();
  const nav = useNav();
  const insets = useSafeAreaInsets();
  useStatusBar('light-content');
  const user = useAppSelector(s => s.app.user);
  const location = useAppSelector(s => s.app.location);
  const unread = useAppSelector(s => s.profile.notifications.filter(n => !n.read).length);
  const [locOpen, setLocOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const refresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Animated.ScrollView
        stickyHeaderIndices={[1]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#fff" />}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Header */}
        <LinearGradient colors={c.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingTop: insets.top + 8, paddingHorizontal: 16, paddingBottom: 14 }}>
          {[...Array(8)].map((_, i) => (
            <View key={i} style={[styles.spark, { left: `${(i * 29 + 8) % 95}%`, top: `${(i * 41 + 12) % 80}%`, backgroundColor: isEvents ? '#FFD27A' : '#FFB3CF' }]} />
          ))}
          <View style={styles.topRow}>
            <Tap scale={0.98} onPress={() => setLocOpen(true)} style={{ flex: 1 }}>
              <Text style={styles.eta}>{isEvents ? 'Plan in minutes' : 'Delivery in 2 hours'}</Text>
              <View style={styles.locRow}>
                <Text style={styles.locLabel}>{location.label.toUpperCase()}</Text>
                <Text style={styles.loc} numberOfLines={1}> – {location.line}</Text>
                <Icon name="chevron-down" size={18} color="#fff" />
              </View>
            </Tap>
            <Tap onPress={() => nav.navigate('Notifications')} style={styles.round}>
              <Icon name="bell-outline" size={22} color="#fff" />
              {unread ? <View style={[styles.dot, { backgroundColor: c.accent }]}><Text style={styles.dotTxt}>{unread}</Text></View> : null}
            </Tap>
            <Tap onPress={() => nav.navigate('Main', { screen: 'Profile' })}>
              <Img uri={user.avatar} style={styles.avatar} />
            </Tap>
          </View>
          <Text style={styles.greet}>Hi {user.name.split(' ')[0]} 👋  <Text style={styles.greetBig}>Make Every Moment Special</Text></Text>
          <ModeSwitch />
        </LinearGradient>

        {/* Sticky search */}
        <View>
          <LinearGradient colors={[c.header[c.header.length - 1], c.header[c.header.length - 1]]} style={{ paddingHorizontal: 16, paddingBottom: 12, paddingTop: 2 }}>
            <SearchBar onPress={() => nav.navigate('Search')} />
          </LinearGradient>
          <View style={[styles.curve, { backgroundColor: c.bg }]} />
        </View>

        {isEvents ? <EventHome /> : <GiftHome />}
      </Animated.ScrollView>
      <LocationSheet visible={locOpen} onClose={() => setLocOpen(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  spark: { position: 'absolute', width: 5, height: 5, borderRadius: 3, opacity: 0.5 },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  eta: { color: '#fff', fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  locRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2, paddingRight: 10 },
  locLabel: { color: '#fff', fontWeight: '900', fontSize: 12 },
  loc: { color: 'rgba(255,255,255,0.88)', fontSize: 12, fontWeight: '600', flexShrink: 1 },
  round: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  dot: { position: 'absolute', top: 2, right: 2, minWidth: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#fff' },
  dotTxt: { color: '#fff', fontSize: 9, fontWeight: '900' },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: 'rgba(255,255,255,0.8)' },
  greet: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600', marginTop: 14, marginBottom: 12 },
  greetBig: { color: '#fff', fontWeight: '800' },
  curve: { height: 14, borderTopLeftRadius: 18, borderTopRightRadius: 18, marginTop: -14 },
});
