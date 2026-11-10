import React, { useMemo, useRef } from 'react';
import { Animated, PanResponder, StyleSheet, Text, View } from 'react-native';
import { Icon } from './Icon';
import { Tap } from './Tap';

const W = 900;
const H = 760;

export interface MapMarker { id: string; x: number; y: number; label: string; price?: string }

interface Props {
  height: number;
  width: number;
  markers?: MapMarker[];
  selected?: string;
  onSelectMarker?: (id: string) => void;
  onMove?: (center: { x: number; y: number }) => void;
  recenterKey?: number;
}

const roads = [
  { x: 0, y: 180, w: W, h: 14 }, { x: 0, y: 400, w: W, h: 20 }, { x: 0, y: 610, w: W, h: 12 },
  { x: 150, y: 0, w: 12, h: H }, { x: 420, y: 0, w: 22, h: H }, { x: 680, y: 0, w: 12, h: H },
  { x: 0, y: 300, w: 420, h: 8 }, { x: 442, y: 520, w: 460, h: 8 }, { x: 260, y: 400, w: 8, h: 360 },
];
const parks = [
  { x: 470, y: 210, w: 190, h: 170, r: 30 }, { x: 30, y: 440, w: 210, h: 150, r: 24 }, { x: 720, y: 30, w: 160, h: 130, r: 40 },
];
const blocks = Array.from({ length: 26 }, (_, i) => ({ x: (i * 137) % 860 + 10, y: (i * 211) % 720 + 10, w: 40 + (i % 4) * 14, h: 30 + (i % 3) * 12 }));
const labels = [
  { x: 40, y: 150, t: 'KORAMANGALA' }, { x: 480, y: 160, t: 'INDIRANAGAR' }, { x: 60, y: 620, t: 'HSR LAYOUT' },
  { x: 720, y: 470, t: 'WHITEFIELD' }, { x: 520, y: 690, t: 'BELLANDUR' }, { x: 200, y: 360, t: 'MG Road' },
];

/** Lightweight, dependency-free interactive map UI: drag to pan, tap markers. */
export const FakeMap = ({ height, width, markers = [], selected, onSelectMarker, onMove, recenterKey }: Props) => {
  const start = useMemo(() => ({ x: -(W / 2 - width / 2), y: -(H / 2 - height / 2) }), [width, height]);
  const pos = useRef(new Animated.ValueXY(start)).current;
  const last = useRef(start);
  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

  React.useEffect(() => {
    if (recenterKey === undefined) { return; }
    last.current = start;
    Animated.spring(pos, { toValue: start, useNativeDriver: false }).start();
    onMove?.({ x: W / 2, y: H / 2 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recenterKey]);

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) + Math.abs(g.dy) > 4,
      onPanResponderMove: (_, g) => {
        pos.setValue({ x: clamp(last.current.x + g.dx, width - W, 0), y: clamp(last.current.y + g.dy, height - H, 0) });
      },
      onPanResponderRelease: (_, g) => {
        last.current = { x: clamp(last.current.x + g.dx, width - W, 0), y: clamp(last.current.y + g.dy, height - H, 0) };
        onMove?.({ x: width / 2 - last.current.x, y: height / 2 - last.current.y });
      },
    }),
  ).current;

  return (
    <View style={{ width, height, overflow: 'hidden', backgroundColor: '#EEF0E8' }} {...pan.panHandlers}>
      <Animated.View style={{ width: W, height: H, transform: pos.getTranslateTransform() }}>
        {blocks.map((b, i) => <View key={'b' + i} style={[styles.block, { left: b.x, top: b.y, width: b.w, height: b.h }]} />)}
        {parks.map((p, i) => <View key={'p' + i} style={[styles.park, { left: p.x, top: p.y, width: p.w, height: p.h, borderRadius: p.r }]} />)}
        <View style={[styles.lake, { left: 300, top: 470, width: 110, height: 80 }]} />
        {roads.map((r, i) => <View key={'r' + i} style={[styles.road, { left: r.x, top: r.y, width: r.w, height: r.h }]} />)}
        {labels.map(l => <Text key={l.t} style={[styles.label, { left: l.x, top: l.y }]}>{l.t}</Text>)}
        {markers.map(m => {
          const on = m.id === selected;
          return (
            <Tap key={m.id} onPress={() => onSelectMarker?.(m.id)} style={[styles.marker, { left: m.x - 50, top: m.y - 40 }]}>
              <View style={[styles.bubble, on && { backgroundColor: '#1D1424' }]}>
                <Icon name="domain" size={12} color={on ? '#FFD27A' : '#5B2BB5'} />
                <Text style={[styles.bubbleTxt, on && { color: '#fff' }]} numberOfLines={1}>{m.price || m.label}</Text>
              </View>
              <View style={[styles.tail, on && { borderTopColor: '#1D1424' }]} />
            </Tap>
          );
        })}
      </Animated.View>
    </View>
  );
};

export const MAP_SIZE = { W, H };

const styles = StyleSheet.create({
  block: { position: 'absolute', backgroundColor: '#E2E4DC', borderRadius: 4 },
  park: { position: 'absolute', backgroundColor: '#CDE8C4' },
  lake: { position: 'absolute', backgroundColor: '#BFDDF2', borderRadius: 40 },
  road: { position: 'absolute', backgroundColor: '#FFFFFF', borderRadius: 4 },
  label: { position: 'absolute', fontSize: 10, fontWeight: '800', color: '#8C8F86', letterSpacing: 1.2 },
  marker: { position: 'absolute', width: 100, alignItems: 'center' },
  bubble: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 4 },
  bubbleTxt: { fontSize: 11, fontWeight: '800', color: '#1D1424', marginLeft: 4 },
  tail: { width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 7, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#fff' },
});
