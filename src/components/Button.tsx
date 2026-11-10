import React from 'react';
import { ActivityIndicator, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Tap } from './Tap';
import { Icon } from './Icon';
import { useTheme } from '../utils/hooks';
import { radius } from '../theme';

interface Props {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline' | 'soft' | 'ghost' | 'dark' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconRight?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  sub?: string;
}

export const Button = ({ title, onPress, variant = 'primary', size = 'lg', icon, iconRight, loading, disabled, style, sub }: Props) => {
  const { c } = useTheme();
  const map = {
    primary: { bg: c.primary, fg: c.onPrimary, bd: c.primary },
    outline: { bg: c.white, fg: c.ink, bd: c.ink },
    soft: { bg: c.tint, fg: c.ink, bd: c.tint },
    ghost: { bg: 'transparent', fg: c.ink, bd: 'transparent' },
    dark: { bg: c.text, fg: c.white, bd: c.text },
    danger: { bg: c.dangerSoft, fg: c.danger, bd: c.dangerSoft },
  }[variant];
  const h = size === 'lg' ? 52 : size === 'md' ? 44 : 34;
  const fs = size === 'lg' ? 16 : size === 'md' ? 14 : 13;
  return (
    <Tap onPress={onPress} disabled={disabled || loading} style={[styles.btn, { height: sub ? h + 6 : h, backgroundColor: map.bg, borderColor: map.bd, paddingHorizontal: size === 'sm' ? 12 : 18 }, style]}>
      {loading ? (
        <ActivityIndicator color={map.fg} />
      ) : (
        <View style={styles.row}>
          {icon ? <Icon name={icon} size={fs + 3} color={map.fg} style={{ marginRight: 8 }} /> : null}
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: map.fg, fontSize: fs, fontWeight: '800' }}>{title}</Text>
            {sub ? <Text style={{ color: map.fg, fontSize: 11, fontWeight: '600', opacity: 0.85 }}>{sub}</Text> : null}
          </View>
          {iconRight ? <Icon name={iconRight} size={fs + 3} color={map.fg} style={{ marginLeft: 6 }} /> : null}
        </View>
      )}
    </Tap>
  );
};

const styles = StyleSheet.create({
  btn: { borderRadius: radius.md, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
});
