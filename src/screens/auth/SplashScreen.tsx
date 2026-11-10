import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import LinearGradient from '../../components/Gradient';
import { Logo } from '../../components/Logo';
import { useNav, useStatusBar } from '../../utils/hooks';
import { useAppSelector } from '../../store';

export const SplashScreen = () => {
  const nav = useNav();
  useStatusBar('light-content');
  const { onboarded, loggedIn } = useAppSelector(s => s.app);
  const scale = useRef(new Animated.Value(0.6)).current;
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 12 }),
      Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]).start();
    const t = setTimeout(() => nav.replace(loggedIn ? 'Main' : onboarded ? 'Login' : 'Onboarding'), 1900);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <LinearGradient colors={['#3A0A4C', '#6A1B84', '#B0408F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.wrap}>
      {[...Array(14)].map((_, i) => (
        <View key={i} style={[styles.confetti, { left: `${(i * 37) % 100}%`, top: `${(i * 53) % 90}%`, backgroundColor: ['#FFD983', '#FF8FB4', '#ffffff'][i % 3], transform: [{ rotate: `${i * 25}deg` }] }]} />
      ))}
      <Animated.View style={{ transform: [{ scale }], opacity: fade }}>
        <Logo size={88} />
      </Animated.View>
      <Animated.Text style={[styles.foot, { opacity: fade }]}>Make every moment special ✨</Animated.Text>
      <Text style={styles.ver}>v1.0</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  confetti: { position: 'absolute', width: 8, height: 14, borderRadius: 2, opacity: 0.35 },
  foot: { position: 'absolute', bottom: 70, color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '600' },
  ver: { position: 'absolute', bottom: 40, color: 'rgba(255,255,255,0.5)', fontSize: 11 },
});
