import React, { useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { Tap } from './Tap';
import { Icon } from './Icon';
import { useAppDispatch } from '../store';
import { setMode } from '../store/slices/app';
import { useTheme } from '../utils/hooks';
import { Mode } from '../theme';

/** The Gifting ⇄ Events toggle that re-themes and re-routes the entire app. */
export const ModeSwitch = () => {
  const { mode, c } = useTheme();
  const dispatch = useAppDispatch();
  const [w, setW] = useState(0);
  const x = useRef(new Animated.Value(mode === 'gifts' ? 0 : 1)).current;
  useEffect(() => {
    Animated.spring(x, { toValue: mode === 'gifts' ? 0 : 1, useNativeDriver: true, bounciness: 8, speed: 14 }).start();
  }, [mode, x]);
  const half = (w - 8) / 2;
  const items: { id: Mode; label: string; icon: string; sub: string }[] = [
    { id: 'gifts', label: 'Gifting', icon: 'gift', sub: 'Delivery in 2 hrs' },
    { id: 'events', label: 'Events', icon: 'party-popper', sub: 'Book vendors' },
  ];
  return (
    <View style={styles.wrap} onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)}>
      {w > 0 && (
        <Animated.View style={[styles.thumb, { width: half, backgroundColor: c.white, transform: [{ translateX: x.interpolate({ inputRange: [0, 1], outputRange: [0, half] }) }] }]} />
      )}
      {items.map(it => {
        const on = it.id === mode;
        return (
          <Tap key={it.id} scale={0.97} style={styles.item} onPress={() => dispatch(setMode(it.id))}>
            <Icon name={it.icon} size={20} color={on ? (it.id === 'events' ? '#5B2BB5' : c.primary) : 'rgba(255,255,255,0.9)'} />
            <View style={{ marginLeft: 8 }}>
              <Text style={[styles.label, { color: on ? c.text : '#fff' }]}>{it.label}</Text>
              <Text style={[styles.sub, { color: on ? c.sub : 'rgba(255,255,255,0.75)' }]}>{it.sub}</Text>
            </View>
          </Tap>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 16, padding: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)' },
  thumb: { position: 'absolute', top: 4, left: 4, bottom: 4, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 4 },
  item: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8 },
  label: { fontSize: 15, fontWeight: '800' },
  sub: { fontSize: 10, fontWeight: '600', marginTop: 1 },
});
