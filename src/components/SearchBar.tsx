import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import { Tap } from './Tap';
import { Icon } from './Icon';
import { useTheme } from '../utils/hooks';
import { radius, shadow } from '../theme';

interface Props {
  onPress?: () => void;
  value?: string;
  onChangeText?: (t: string) => void;
  autoFocus?: boolean;
  style?: ViewStyle;
  hints?: string[];
}

/** Blinkit-style search: rotating hint words when used as a launcher, real input otherwise. */
export const SearchBar = ({ onPress, value, onChangeText, autoFocus, style, hints }: Props) => {
  const { c, isEvents } = useTheme();
  const words = hints || (isEvents ? ['"decorators"', '"photographers"', '"DJ"', '"banquet halls"', '"caterers"'] : ['"cakes"', '"roses"', '"chocolates"', '"hampers"', '"balloons"']);
  const [i, setI] = useState(0);
  const y = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!onPress) { return; }
    const t = setInterval(() => {
      Animated.timing(y, { toValue: -18, duration: 220, useNativeDriver: true }).start(() => {
        setI(p => (p + 1) % words.length);
        y.setValue(18);
        Animated.timing(y, { toValue: 0, duration: 220, useNativeDriver: true }).start();
      });
    }, 2400);
    return () => clearInterval(t);
  }, [onPress, words.length, y]);

  const inner = (
    <View style={[styles.bar, { backgroundColor: c.white, borderColor: c.line }, shadow(1), style]}>
      <Icon name="magnify" size={22} color={c.sub} />
      {onPress ? (
        <View style={styles.hintRow}>
          <Text style={[styles.hint, { color: c.sub }]}>Search </Text>
          <View style={{ height: 20, overflow: 'hidden' }}>
            <Animated.Text style={[styles.hint, { color: c.sub, transform: [{ translateY: y }] }]}>{words[i]}</Animated.Text>
          </View>
        </View>
      ) : (
        <TextInput
          value={value}
          onChangeText={onChangeText}
          autoFocus={autoFocus}
          placeholder={isEvents ? 'Search events, vendors or services' : 'Search gifts, cakes, flowers or events'}
          placeholderTextColor={c.muted}
          style={[styles.input, { color: c.text }]}
          returnKeyType="search"
        />
      )}
      {value ? (
        <Tap onPress={() => onChangeText?.('')}><Icon name="close-circle" size={18} color={c.muted} /></Tap>
      ) : (
        <View style={[styles.mic, { borderLeftColor: c.line }]}><Icon name="microphone-outline" size={20} color={c.ink} /></View>
      )}
    </View>
  );
  return onPress ? <Tap scale={0.98} onPress={onPress}>{inner}</Tap> : inner;
};

const styles = StyleSheet.create({
  bar: { height: 48, borderRadius: radius.md, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderWidth: 1 },
  hintRow: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  hint: { fontSize: 15, fontWeight: '500', height: 20, lineHeight: 20 },
  input: { flex: 1, fontSize: 15, marginLeft: 8, paddingVertical: 0, fontWeight: '500' },
  mic: { borderLeftWidth: 1, paddingLeft: 10, marginLeft: 6 },
});
