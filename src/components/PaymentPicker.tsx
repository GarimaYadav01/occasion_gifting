import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tap } from './Tap';
import { Icon } from './Icon';
import { paymentOptions } from '../data/user';
import { useTheme } from '../utils/hooks';

export const PaymentPicker = ({ value, onChange, hideCod }: { value: string; onChange: (id: string) => void; hideCod?: boolean }) => {
  const { c } = useTheme();
  const groups = ['UPI', 'Cards', 'More'];
  return (
    <View>
      {groups.map(g => (
        <View key={g} style={{ marginBottom: 14 }}>
          <Text style={styles.group}>{g === 'More' ? 'MORE WAYS TO PAY' : g.toUpperCase()}</Text>
          <View style={[styles.box, { backgroundColor: c.white, borderColor: c.line }]}>
            {paymentOptions.filter(p => p.group === g && !(hideCod && p.id === 'cod')).map((p, i, arr) => {
              const on = value === p.id;
              return (
                <Tap key={p.id} scale={0.99} onPress={() => onChange(p.id)} style={[styles.row, i < arr.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.line }]}>
                  <View style={[styles.icon, { backgroundColor: on ? c.tint : c.lineSoft }]}><Icon name={p.icon} size={20} color={on ? c.ink : c.sub} /></View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={{ fontWeight: '800', color: c.text, fontSize: 14 }}>{p.name}</Text>
                    <Text style={{ fontSize: 12, color: c.sub, marginTop: 1 }}>{p.detail}</Text>
                  </View>
                  <Icon name={on ? 'radiobox-marked' : 'radiobox-blank'} size={22} color={on ? c.ink : c.muted} />
                </Tap>
              );
            })}
          </View>
        </View>
      ))}
      <Text style={{ fontSize: 11, color: c.muted, textAlign: 'center' }}>🔒 100% secure payments · PCI-DSS compliant · "Net Banking" simulates a failed payment</Text>
    </View>
  );
};

export const paymentName = (id: string) => paymentOptions.find(p => p.id === id)?.name || 'UPI';

const styles = StyleSheet.create({
  group: { fontSize: 12, fontWeight: '800', color: '#A39BAD', letterSpacing: 1, marginBottom: 8 },
  box: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  icon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
