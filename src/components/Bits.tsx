import React, { useEffect, useRef } from 'react';
import { Animated, StyleProp, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { Tap } from './Tap';
import { Icon } from './Icon';
import { useTheme } from '../utils/hooks';
import { font, radius } from '../theme';
import { inr } from '../utils/format';

export const SectionTitle = ({ title, sub, action, onAction, style }: { title: string; sub?: string; action?: string; onAction?: () => void; style?: StyleProp<ViewStyle> }) => {
  const { c } = useTheme();
  return (
    <View style={[styles.section, style]}>
      <View style={{ flex: 1 }}>
        <Text style={[font.h2, { color: c.text }]}>{title}</Text>
        {sub ? <Text style={[font.small, { color: c.sub, marginTop: 2 }]}>{sub}</Text> : null}
      </View>
      {action ? (
        <Tap onPress={onAction} style={styles.row}>
          <Text style={{ color: c.ink, fontWeight: '800', fontSize: 13 }}>{action}</Text>
          <Icon name="chevron-right" size={18} color={c.ink} />
        </Tap>
      ) : null}
    </View>
  );
};

export const Rating = ({ value, count, small }: { value: number; count?: number; small?: boolean }) => (
  <View style={styles.row}>
    <View style={[styles.rating, small && { paddingHorizontal: 4, paddingVertical: 1 }]}>
      <Text style={styles.ratingTxt}>{value.toFixed(1)}</Text>
      <Icon name="star" size={small ? 9 : 11} color="#fff" />
    </View>
    {count !== undefined ? <Text style={styles.count}>({count >= 1000 ? (count / 1000).toFixed(1) + 'k' : count})</Text> : null}
  </View>
);

export const Price = ({ price, mrp, size = 14 }: { price: number; mrp?: number; size?: number }) => {
  const { c } = useTheme();
  return (
    <View style={[styles.row, { flexWrap: 'wrap' }]}>
      <Text style={{ fontSize: size, fontWeight: '800', color: c.text }}>{inr(price)}</Text>
      {mrp && mrp > price ? <Text style={{ fontSize: size - 3, color: c.muted, textDecorationLine: 'line-through', marginLeft: 5 }}>{inr(mrp)}</Text> : null}
    </View>
  );
};

export const Chip = ({ label, on, onPress, icon, style }: { label: string; on?: boolean; onPress?: () => void; icon?: string; style?: StyleProp<ViewStyle> }) => {
  const { c } = useTheme();
  return (
    <Tap onPress={onPress} style={[styles.chip, { backgroundColor: on ? c.tint : c.white, borderColor: on ? c.ink : c.line }, style]}>
      {icon ? <Icon name={icon} size={15} color={on ? c.ink : c.sub} style={{ marginRight: 5 }} /> : null}
      <Text style={{ fontSize: 13, fontWeight: on ? '800' : '600', color: on ? c.ink : c.text }}>{label}</Text>
    </Tap>
  );
};

export const Tag = ({ label, color, bg }: { label: string; color?: string; bg?: string }) => {
  const { c } = useTheme();
  return (
    <View style={[styles.tag, { backgroundColor: bg || c.accentSoft }]}>
      <Text style={[font.tiny, { color: color || c.accent }]}>{label.toUpperCase()}</Text>
    </View>
  );
};

export const Card = ({ children, style, onPress }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void }) => {
  const { c } = useTheme();
  const s = [styles.card, { backgroundColor: c.card, borderColor: c.line }, style];
  return onPress ? <Tap scale={0.98} onPress={onPress} style={s}>{children}</Tap> : <View style={s}>{children}</View>;
};

export const Divider = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const { c } = useTheme();
  return <View style={[{ height: StyleSheet.hairlineWidth, backgroundColor: c.line, marginVertical: 12 }, style]} />;
};

export const PriceRow = ({ label, value, bold, green, sub }: { label: string; value: string; bold?: boolean; green?: boolean; sub?: string }) => {
  const { c } = useTheme();
  return (
    <View style={[styles.row, { justifyContent: 'space-between', marginVertical: 5 }]}>
      <View>
        <Text style={{ color: bold ? c.text : c.sub, fontSize: bold ? 16 : 14, fontWeight: bold ? '800' : '500' }}>{label}</Text>
        {sub ? <Text style={{ color: c.muted, fontSize: 11 }}>{sub}</Text> : null}
      </View>
      <Text style={{ color: green ? c.success : c.text, fontSize: bold ? 17 : 14, fontWeight: bold ? '800' : '600' }}>{value}</Text>
    </View>
  );
};

export const ListRow = ({ icon, title, sub, onPress, right, danger, tint }: { icon: string; title: string; sub?: string; onPress?: () => void; right?: React.ReactNode; danger?: boolean; tint?: string }) => {
  const { c } = useTheme();
  return (
    <Tap scale={0.99} onPress={onPress} style={styles.listRow}>
      <View style={[styles.listIcon, { backgroundColor: danger ? c.dangerSoft : tint || c.tint }]}>
        <Icon name={icon} size={20} color={danger ? c.danger : c.ink} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: danger ? c.danger : c.text }}>{title}</Text>
        {sub ? <Text style={{ fontSize: 12, color: c.sub, marginTop: 2 }}>{sub}</Text> : null}
      </View>
      {right ?? <Icon name="chevron-right" size={22} color={c.muted} />}
    </Tap>
  );
};

export const Field = ({ label, icon, error, style, ...rest }: TextInputProps & { label?: string; icon?: string; error?: string }) => {
  const { c } = useTheme();
  return (
    <View style={[{ marginBottom: 14 }, style as ViewStyle]}>
      {label ? <Text style={{ fontSize: 13, fontWeight: '700', color: c.sub, marginBottom: 6 }}>{label}</Text> : null}
      <View style={[styles.field, { borderColor: error ? c.danger : c.line, backgroundColor: c.white }]}>
        {icon ? <Icon name={icon} size={19} color={c.muted} style={{ marginRight: 8 }} /> : null}
        <TextInput placeholderTextColor={c.muted} {...rest} style={[{ flex: 1, fontSize: 15, color: c.text, paddingVertical: 0, fontWeight: '500' }, rest.multiline && { minHeight: 70, textAlignVertical: 'top', paddingTop: 10 }]} />
      </View>
      {error ? <Text style={{ color: c.danger, fontSize: 12, marginTop: 4, fontWeight: '600' }}>{error}</Text> : null}
    </View>
  );
};

export const QtyStepper = ({ qty, onChange, small }: { qty: number; onChange: (d: number) => void; small?: boolean }) => {
  const { c } = useTheme();
  const h = small ? 30 : 38;
  return (
    <View style={[styles.row, { backgroundColor: c.primary, borderRadius: 9, height: h }]}>
      <Tap onPress={() => onChange(-1)} style={{ width: h, height: h, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="minus" size={16} color={c.onPrimary} />
      </Tap>
      <Text style={{ color: c.onPrimary, fontWeight: '800', fontSize: small ? 13 : 15, minWidth: 18, textAlign: 'center' }}>{qty}</Text>
      <Tap onPress={() => onChange(1)} style={{ width: h, height: h, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="plus" size={16} color={c.onPrimary} />
      </Tap>
    </View>
  );
};

export const Skeleton = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const o = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(o, { toValue: 1, duration: 650, useNativeDriver: true }),
      Animated.timing(o, { toValue: 0.4, duration: 650, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [o]);
  return <Animated.View style={[{ backgroundColor: '#EDE3EA', borderRadius: 10, opacity: o }, style]} />;
};

export const InfoBanner = ({ icon, text, tone = 'info' }: { icon: string; text: string; tone?: 'info' | 'success' | 'warn' | 'danger' }) => {
  const { c } = useTheme();
  const m = { info: [c.infoSoft, c.info], success: [c.successSoft, c.success], warn: [c.warnSoft, c.warn], danger: [c.dangerSoft, c.danger] }[tone];
  return (
    <View style={[styles.row, { backgroundColor: m[0], padding: 10, borderRadius: radius.md }]}>
      <Icon name={icon} size={18} color={m[1]} />
      <Text style={{ flex: 1, marginLeft: 8, color: m[1], fontSize: 12.5, fontWeight: '700' }}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  section: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 16, marginTop: 24, marginBottom: 12 },
  rating: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0C8A4B', borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2, gap: 2 },
  ratingTxt: { color: '#fff', fontSize: 11, fontWeight: '800' },
  count: { fontSize: 11, color: '#6B6275', marginLeft: 4, fontWeight: '600' },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 34, borderRadius: 10, borderWidth: 1, marginRight: 8 },
  tag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5, alignSelf: 'flex-start' },
  card: { borderRadius: radius.lg, borderWidth: 1, padding: 14 },
  listRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  listIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  field: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.2, borderRadius: radius.md, paddingHorizontal: 12, minHeight: 50 },
});
