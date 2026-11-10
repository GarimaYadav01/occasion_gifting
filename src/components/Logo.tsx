import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from './Gradient';
import { Icon } from './Icon';
import { font } from '../theme';

export const Logo = ({ size = 72, light = true, withText = true }: { size?: number; light?: boolean; withText?: boolean }) => (
  <View style={{ alignItems: 'center' }}>
    <LinearGradient colors={['#FFD983', '#E3A72F']} style={[styles.mark, { width: size, height: size, borderRadius: size * 0.32 }]}>
      <Icon name="gift" size={size * 0.5} color="#4A0E5E" />
      <View style={[styles.spark, { right: size * 0.1, top: size * 0.08 }]}><Icon name="star-four-points" size={size * 0.18} color="#fff" /></View>
    </LinearGradient>
    {withText && (
      <>
        <Text style={[font.brand, { fontSize: size * 0.48, color: light ? '#fff' : '#4A0E5E', marginTop: 14 }]}>Occasion</Text>
        <Text style={{ color: light ? 'rgba(255,255,255,0.8)' : '#6B6275', fontSize: 12, fontWeight: '700', letterSpacing: 2.5, marginTop: 4 }}>GIFTS · EVENTS · MOMENTS</Text>
      </>
    )}
  </View>
);

const styles = StyleSheet.create({
  mark: { alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-6deg' }] },
  spark: { position: 'absolute' },
});
