import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tap } from './Tap';
import { Icon } from './Icon';
import { useTheme } from '../utils/hooks';
import { monthName } from '../utils/format';

interface Props {
  value?: string;
  onChange: (iso: string) => void;
  busyDays?: number[]; // highlighted as "limited availability" for demo
}

export const Calendar = ({ value, onChange, busyDays = [] }: Props) => {
  const { c } = useTheme();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [cursor, setCursor] = useState(() => {
    const d = value ? new Date(value) : today;
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) { cells.push(null); }
  const sel = value ? new Date(value) : null;
  const canPrev = new Date(year, month, 1) > new Date(today.getFullYear(), today.getMonth(), 1);

  return (
    <View>
      <View style={styles.head}>
        <Tap disabled={!canPrev} onPress={() => setCursor(new Date(year, month - 1, 1))} style={[styles.nav, { borderColor: c.line }]}>
          <Icon name="chevron-left" size={22} />
        </Tap>
        <Text style={{ fontSize: 17, fontWeight: '800', color: c.text }}>{monthName(month)} {year}</Text>
        <Tap onPress={() => setCursor(new Date(year, month + 1, 1))} style={[styles.nav, { borderColor: c.line }]}>
          <Icon name="chevron-right" size={22} />
        </Tap>
      </View>
      <View style={styles.week}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <Text key={i} style={[styles.wd, { color: i === 0 || i === 6 ? c.accent : c.muted }]}>{d}</Text>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((d, i) => {
          if (!d) { return <View key={i} style={styles.cell} />; }
          const date = new Date(year, month, d);
          const past = date < today;
          const isSel = sel && sel.getFullYear() === year && sel.getMonth() === month && sel.getDate() === d;
          const busy = busyDays.includes(d) && !past;
          const isToday = date.getTime() === today.getTime();
          return (
            <View key={i} style={styles.cell}>
              <Tap
                disabled={past}
                onPress={() => { date.setHours(12); onChange(date.toISOString()); }}
                style={[styles.day, isSel && { backgroundColor: c.primary }, !isSel && isToday && { borderWidth: 1.5, borderColor: c.ink }]}>
                <Text style={{ fontSize: 15, fontWeight: isSel ? '800' : '600', color: isSel ? c.onPrimary : past ? '#CFC6CE' : c.text }}>{d}</Text>
                {busy && !isSel ? <View style={[styles.busy, { backgroundColor: c.warn }]} /> : null}
              </Tap>
            </View>
          );
        })}
      </View>
      <View style={[styles.legend]}>
        <View style={[styles.busy, { backgroundColor: c.warn, position: 'relative', bottom: 0 }]} />
        <Text style={{ fontSize: 11, color: c.sub, marginLeft: 6 }}>Few vendors left — book early</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  nav: { width: 38, height: 38, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  week: { flexDirection: 'row' },
  wd: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '800', marginBottom: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, aspectRatio: 1, padding: 3 },
  day: { flex: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  busy: { width: 5, height: 5, borderRadius: 3, position: 'absolute', bottom: 5 },
  legend: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
});
