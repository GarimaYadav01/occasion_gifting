import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from './Gradient';
import { Tap } from './Tap';
import { Icon } from './Icon';
import { BottomBar } from './BottomBar';
import { Button } from './Button';
import { useNav, useStatusBar, useTheme } from '../utils/hooks';
import { font } from '../theme';

export const BOOKING_STEPS = 11;

interface Props {
  step: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  cta: string;
  ctaSub?: string;
  onNext: () => void;
  disabled?: boolean;
  loading?: boolean;
  scroll?: boolean;
  footerLeft?: React.ReactNode;
}

/** Shared chrome for every step in the event-booking wizard. */
export const BookingShell = ({ step, title, subtitle, children, cta, ctaSub, onNext, disabled, loading, scroll = true, footerLeft }: Props) => {
  const { c } = useTheme();
  const nav = useNav();
  const insets = useSafeAreaInsets();
  useStatusBar('light-content');
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <LinearGradient colors={c.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingTop: insets.top + 6, paddingHorizontal: 16, paddingBottom: 18 }}>
        <View style={styles.top}>
          <Tap onPress={() => nav.goBack()} style={styles.back}><Icon name="arrow-left" size={22} color="#fff" /></Tap>
          <Text style={styles.step}>STEP {step} OF {BOOKING_STEPS}</Text>
          <Tap onPress={() => nav.navigate('Main', { screen: 'Events' })} style={styles.back}><Icon name="close" size={22} color="#fff" /></Tap>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${(step / BOOKING_STEPS) * 100}%`, backgroundColor: c.primary }]} />
        </View>
        <Text style={[font.h1, { color: '#fff', marginTop: 14 }]}>{title}</Text>
        {subtitle ? <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4, fontWeight: '500' }}>{subtitle}</Text> : null}
      </LinearGradient>
      {scroll ? (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">{children}</ScrollView>
      ) : (
        <View style={{ flex: 1 }}>{children}</View>
      )}
      <BottomBar style={{ flexDirection: 'row', alignItems: 'center' }}>
        {footerLeft ? <View style={{ flex: 1, marginRight: 12 }}>{footerLeft}</View> : null}
        <Button title={cta} sub={ctaSub} iconRight="arrow-right" onPress={onNext} disabled={disabled} loading={loading} style={{ flex: footerLeft ? 1.2 : 1 }} />
      </BottomBar>
    </View>
  );
};

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  step: { color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  track: { height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.18)', marginTop: 14, overflow: 'hidden' },
  fill: { height: 5, borderRadius: 3 },
});
