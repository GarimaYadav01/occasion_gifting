import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from './Icon';
import { useTheme } from '../utils/hooks';

interface Props {
  steps: readonly string[];
  current: number;
  cancelled?: boolean;
  notes?: string[];
}

export const Timeline = ({ steps, current, cancelled, notes = [] }: Props) => {
  const { c } = useTheme();
  const list = cancelled ? [...steps.slice(0, current + 1), 'Cancelled'] : steps;
  return (
    <View>
      {list.map((s, i) => {
        const isCancel = cancelled && i === list.length - 1;
        const done = isCancel || i <= current;
        const active = !cancelled && i === current;
        const color = isCancel ? c.danger : done ? c.success : c.line;
        return (
          <View key={s} style={styles.row}>
            <View style={{ alignItems: 'center', width: 28 }}>
              <View style={[styles.dot, { backgroundColor: done ? color : c.white, borderColor: color }, active && { transform: [{ scale: 1.15 }] }]}>
                {done ? <Icon name={isCancel ? 'close' : 'check'} size={13} color="#fff" /> : null}
              </View>
              {i < list.length - 1 && <View style={[styles.line, { backgroundColor: i < current ? c.success : c.line }]} />}
            </View>
            <View style={{ flex: 1, paddingBottom: 18, marginLeft: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: done ? '800' : '600', color: isCancel ? c.danger : done ? c.text : c.muted }}>{s}</Text>
              {done && notes[i] ? <Text style={{ fontSize: 12, color: c.sub, marginTop: 2 }}>{notes[i]}</Text> : null}
              {active ? <Text style={{ fontSize: 11, color: c.success, fontWeight: '800', marginTop: 3 }}>● CURRENT STATUS</Text> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  dot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  line: { width: 2, flex: 1, marginVertical: 2 },
});
