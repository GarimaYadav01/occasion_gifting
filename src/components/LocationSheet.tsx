import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Sheet } from './Sheet';
import { Tap } from './Tap';
import { Icon } from './Icon';
import { useAppDispatch, useAppSelector } from '../store';
import { setLocation } from '../store/slices/app';
import { selectAddress } from '../store/slices/profile';
import { useNav, useTheme } from '../utils/hooks';
import { useToast } from './Toast';

export const LocationSheet = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const { c } = useTheme();
  const nav = useNav();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const addresses = useAppSelector(s => s.profile.addresses);
  const selected = useAppSelector(s => s.profile.selectedAddress);
  return (
    <Sheet visible={visible} onClose={onClose} title="Select delivery location">
      <Tap onPress={() => { dispatch(setLocation({ label: 'Current', line: 'Koramangala 4th Block, Bengaluru' })); toast.show('Using current location', 'crosshairs-gps'); onClose(); }}
        style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: c.white, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: c.line }}>
        <Icon name="crosshairs-gps" size={22} color={c.ink} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ fontWeight: '800', color: c.ink, fontSize: 15 }}>Use current location</Text>
          <Text style={{ color: c.sub, fontSize: 12 }}>Enable location for accurate delivery</Text>
        </View>
        <Icon name="chevron-right" size={22} color={c.muted} />
      </Tap>
      <Text style={{ fontSize: 12, fontWeight: '800', color: c.muted, letterSpacing: 1, marginTop: 18, marginBottom: 8 }}>SAVED ADDRESSES</Text>
      <ScrollView style={{ maxHeight: 320 }}>
        {addresses.map(a => {
          const on = a.id === selected;
          return (
            <Tap key={a.id} onPress={() => { dispatch(selectAddress(a.id)); dispatch(setLocation({ label: a.label, line: `${a.line}, ${a.area}` })); onClose(); }}
              style={{ flexDirection: 'row', backgroundColor: c.white, padding: 14, borderRadius: 14, borderWidth: on ? 1.6 : 1, borderColor: on ? c.ink : c.line, marginBottom: 10 }}>
              <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: c.tint, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={a.label === 'Home' ? 'home-outline' : a.label === 'Work' ? 'briefcase-outline' : 'map-marker-outline'} size={20} color={c.ink} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ fontWeight: '800', color: c.text, fontSize: 15 }}>{a.label}</Text>
                <Text style={{ color: c.sub, fontSize: 12, marginTop: 2 }} numberOfLines={2}>{a.line}, {a.area}, {a.city} {a.pin}</Text>
              </View>
              {on && <Icon name="check-circle" size={22} color={c.success} />}
            </Tap>
          );
        })}
      </ScrollView>
      <Tap onPress={() => { onClose(); nav.navigate('AddressForm'); }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14 }}>
        <Icon name="plus" size={20} color={c.ink} />
        <Text style={{ color: c.ink, fontWeight: '800', marginLeft: 6, fontSize: 15 }}>Add new address</Text>
      </Tap>
    </Sheet>
  );
};
