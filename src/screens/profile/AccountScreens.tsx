import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { AppHeader } from '../../components/AppHeader';
import { Card, Chip, Field, InfoBanner } from '../../components/Bits';
import { Img } from '../../components/Img';
import { Tap } from '../../components/Tap';
import { Icon } from '../../components/Icon';
import { Button } from '../../components/Button';
import { BottomBar } from '../../components/BottomBar';
import { Sheet } from '../../components/Sheet';
import { EmptyState } from '../../components/States';
import { useToast } from '../../components/Toast';
import { paymentOptions } from '../../data/user';
import { useAppDispatch, useAppSelector } from '../../store';
import { setLocation, updateUser } from '../../store/slices/app';
import { deleteAddress, saveAddress, selectAddress } from '../../store/slices/profile';
import { useNav, useTheme } from '../../utils/hooks';
import { RootStackParamList } from '../../navigation/types';

/* Edit profile */
export const EditProfileScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const u = useAppSelector(s => s.app.user);
  const [f, setF] = useState(u);
  const [err, setErr] = useState<Record<string, string>>({});
  const save = () => {
    const e: Record<string, string> = {};
    if (f.name.trim().length < 2) { e.name = 'Name is required'; }
    if (!/^\S+@\S+\.\S+$/.test(f.email)) { e.email = 'Enter a valid email'; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(f.dob)) { e.dob = 'Use format YYYY-MM-DD'; }
    setErr(e);
    if (Object.keys(e).length) { return; }
    dispatch(updateUser(f));
    toast.show('Profile updated', 'account-check');
    nav.goBack();
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppHeader title="Edit profile" />
      <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Img uri={f.avatar} style={{ width: 100, height: 100, borderRadius: 50 }} />
          <Tap onPress={() => toast.show('Photo picker coming soon', 'camera')} style={[styles.cam, { backgroundColor: c.primary }]}><Icon name="camera" size={16} color={c.onPrimary} /></Tap>
        </View>
        <Field label="Full name" icon="account-outline" value={f.name} onChangeText={x => setF({ ...f, name: x })} error={err.name} />
        <Field label="Mobile number" icon="phone-outline" value={`+91 ${f.phone}`} editable={false} />
        <Field label="Email" icon="email-outline" value={f.email} onChangeText={x => setF({ ...f, email: x })} autoCapitalize="none" keyboardType="email-address" error={err.email} />
        <Field label="Date of birth" icon="cake-variant-outline" value={f.dob} onChangeText={x => setF({ ...f, dob: x })} placeholder="YYYY-MM-DD" error={err.dob} />
        <Text style={styles.label}>Gender</Text>
        <View style={{ flexDirection: 'row' }}>{['Female', 'Male', 'Other'].map(g => <Chip key={g} label={g} on={f.gender === g} onPress={() => setF({ ...f, gender: g })} />)}</View>
      </ScrollView>
      <BottomBar><Button title="Save changes" onPress={save} /></BottomBar>
    </KeyboardAvoidingView>
  );
};

/* Saved addresses */
export const AddressesScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const list = useAppSelector(s => s.profile.addresses);
  const sel = useAppSelector(s => s.profile.selectedAddress);
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <AppHeader title="Saved addresses" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Tap onPress={() => nav.navigate('AddressForm')} style={[styles.add, { borderColor: c.ink, backgroundColor: c.white }]}>
          <Icon name="plus" size={20} color={c.ink} /><Text style={{ color: c.ink, fontWeight: '900', marginLeft: 6 }}>Add new address</Text>
        </Tap>
        {list.length === 0 && <EmptyState icon="map-marker-off-outline" title="No saved addresses" body="Add an address for faster checkout." />}
        {list.map(a => (
          <Card key={a.id} style={{ marginTop: 12 }} onPress={() => { dispatch(selectAddress(a.id)); dispatch(setLocation({ label: a.label, line: `${a.line}, ${a.area}` })); toast.show(`Delivering to ${a.label}`, 'map-marker-check'); }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.icon, { backgroundColor: c.tint }]}><Icon name={a.label === 'Home' ? 'home-outline' : a.label === 'Work' ? 'briefcase-outline' : 'map-marker-outline'} size={20} color={c.ink} /></View>
              <Text style={{ fontWeight: '900', color: c.text, marginLeft: 10, flex: 1, fontSize: 15 }}>{a.label}</Text>
              {sel === a.id && <View style={[styles.def, { backgroundColor: c.successSoft }]}><Text style={{ color: c.success, fontWeight: '900', fontSize: 10 }}>SELECTED</Text></View>}
            </View>
            <Text style={{ fontWeight: '700', color: c.text, marginTop: 10 }}>{a.name} · {a.phone}</Text>
            <Text style={{ color: c.sub, marginTop: 2 }}>{a.line}, {a.area}, {a.city} – {a.pin}</Text>
            <View style={{ flexDirection: 'row', gap: 18, marginTop: 12 }}>
              <Tap onPress={() => nav.navigate('AddressForm', { id: a.id })}><Text style={{ color: c.ink, fontWeight: '800' }}>Edit</Text></Tap>
              <Tap onPress={() => { dispatch(deleteAddress(a.id)); toast.show('Address deleted', 'trash-can-outline'); }}><Text style={{ color: c.danger, fontWeight: '800' }}>Delete</Text></Tap>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

/* Add / edit address */
export const AddressFormScreen = () => {
  const { c } = useTheme();
  const nav = useNav();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const route = useRoute<RouteProp<RootStackParamList, 'AddressForm'>>();
  const existing = useAppSelector(s => s.profile.addresses.find(a => a.id === route.params?.id));
  const user = useAppSelector(s => s.app.user);
  const [f, setF] = useState(existing || { id: 'a' + Date.now(), label: 'Home' as const, name: user.name, phone: user.phone, line: '', area: '', city: 'Bengaluru', pin: '' });
  const [err, setErr] = useState<Record<string, string>>({});
  const save = () => {
    const e: Record<string, string> = {};
    if (!f.name.trim()) { e.name = 'Required'; }
    if (f.phone.replace(/\D/g, '').length < 10) { e.phone = 'Enter a valid number'; }
    if (f.line.trim().length < 4) { e.line = 'Enter house / flat & building'; }
    if (!f.area.trim()) { e.area = 'Required'; }
    if (!/^\d{6}$/.test(f.pin)) { e.pin = '6-digit PIN'; }
    setErr(e);
    if (Object.keys(e).length) { return; }
    dispatch(saveAddress(f));
    dispatch(setLocation({ label: f.label, line: `${f.line}, ${f.area}` }));
    toast.show('Address saved', 'map-marker-check');
    nav.goBack();
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppHeader title={existing ? 'Edit address' : 'Add new address'} />
      <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <Tap onPress={() => { setF({ ...f, area: 'Koramangala 4th Block', pin: '560034' }); toast.show('Location detected', 'crosshairs-gps'); }} style={[styles.gps, { backgroundColor: c.tint }]}>
          <Icon name="crosshairs-gps" size={20} color={c.ink} /><Text style={{ color: c.ink, fontWeight: '800', marginLeft: 8 }}>Use my current location</Text>
        </Tap>
        <Text style={styles.label}>Save as</Text>
        <View style={{ flexDirection: 'row', marginBottom: 14 }}>
          {(['Home', 'Work', 'Other'] as const).map(l => <Chip key={l} label={l} icon={l === 'Home' ? 'home-outline' : l === 'Work' ? 'briefcase-outline' : 'map-marker-outline'} on={f.label === l} onPress={() => setF({ ...f, label: l })} />)}
        </View>
        <Field label="Receiver's name" value={f.name} onChangeText={x => setF({ ...f, name: x })} error={err.name} />
        <Field label="Receiver's phone" value={f.phone} onChangeText={x => setF({ ...f, phone: x })} keyboardType="phone-pad" error={err.phone} />
        <Field label="Flat / house no., building" value={f.line} onChangeText={x => setF({ ...f, line: x })} error={err.line} />
        <Field label="Area / locality" value={f.area} onChangeText={x => setF({ ...f, area: x })} error={err.area} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Field label="City" value={f.city} onChangeText={x => setF({ ...f, city: x })} style={{ flex: 1 }} />
          <Field label="PIN code" value={f.pin} onChangeText={x => setF({ ...f, pin: x.replace(/\D/g, '').slice(0, 6) })} keyboardType="number-pad" error={err.pin} style={{ flex: 1 }} />
        </View>
      </ScrollView>
      <BottomBar><Button title="Save address" onPress={save} /></BottomBar>
    </KeyboardAvoidingView>
  );
};

/* Payment methods */
export const PaymentMethodsScreen = () => {
  const { c } = useTheme();
  const toast = useToast();
  const [def, setDef] = useState('upi');
  const [add, setAdd] = useState(false);
  const [card, setCard] = useState({ num: '', exp: '', cvv: '', name: '' });
  const saved = paymentOptions.filter(p => ['upi', 'card', 'wallet'].includes(p.id));
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <AppHeader title="Payment methods" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <View style={[styles.wallet, { backgroundColor: c.primary }]}>
            <View>
              <Text style={{ color: c.onPrimary, opacity: 0.8, fontWeight: '700', fontSize: 12 }}>OCCASION WALLET</Text>
              <Text style={{ color: c.onPrimary, fontWeight: '900', fontSize: 28 }}>₹350</Text>
            </View>
            <Button title="Add money" size="sm" variant="outline" onPress={() => toast.show('Add money flow coming soon', 'wallet-plus')} />
          </View>
        </Card>
        <Text style={styles.group}>SAVED METHODS</Text>
        {saved.map(p => (
          <Card key={p.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }} onPress={() => setDef(p.id)}>
            <View style={[styles.icon, { backgroundColor: c.tint }]}><Icon name={p.icon} size={20} color={c.ink} /></View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ fontWeight: '800', color: c.text }}>{p.name}</Text>
              <Text style={{ color: c.sub, fontSize: 12 }}>{p.detail}</Text>
            </View>
            {def === p.id ? <View style={[styles.def, { backgroundColor: c.successSoft }]}><Text style={{ color: c.success, fontWeight: '900', fontSize: 10 }}>DEFAULT</Text></View> : <Text style={{ color: c.ink, fontWeight: '700', fontSize: 12 }}>Set default</Text>}
          </Card>
        ))}
        <Tap onPress={() => setAdd(true)} style={[styles.add, { borderColor: c.ink, backgroundColor: c.white, marginTop: 6 }]}>
          <Icon name="credit-card-plus-outline" size={20} color={c.ink} /><Text style={{ color: c.ink, fontWeight: '900', marginLeft: 6 }}>Add credit / debit card</Text>
        </Tap>
        <View style={{ marginTop: 16 }}><InfoBanner icon="shield-lock-outline" tone="success" text="Cards are tokenised as per RBI guidelines. We never store your CVV." /></View>
      </ScrollView>
      <Sheet visible={add} onClose={() => setAdd(false)} title="Add new card">
        <Field label="Card number" icon="credit-card-outline" placeholder="1234 5678 9012 3456" keyboardType="number-pad" value={card.num} onChangeText={x => setCard({ ...card, num: x.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim() })} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Field label="Expiry" placeholder="MM/YY" value={card.exp} onChangeText={x => setCard({ ...card, exp: x.slice(0, 5) })} style={{ flex: 1 }} />
          <Field label="CVV" placeholder="•••" secureTextEntry keyboardType="number-pad" value={card.cvv} onChangeText={x => setCard({ ...card, cvv: x.slice(0, 4) })} style={{ flex: 1 }} />
        </View>
        <Field label="Name on card" value={card.name} onChangeText={x => setCard({ ...card, name: x })} />
        <Button title="Save card" disabled={card.num.length < 19 || card.exp.length < 5 || card.cvv.length < 3} onPress={() => { setAdd(false); toast.show('Card saved securely', 'credit-card-check'); }} />
      </Sheet>
    </View>
  );
};

const styles = StyleSheet.create({
  cam: { position: 'absolute', bottom: 0, right: '36%', width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  label: { fontSize: 13, fontWeight: '700', color: '#6B6275', marginBottom: 8 },
  add: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 14, borderWidth: 1.3, borderStyle: 'dashed' },
  icon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  def: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  gps: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, marginBottom: 16 },
  wallet: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 18 },
  group: { fontSize: 12, fontWeight: '900', color: '#A39BAD', letterSpacing: 1, marginTop: 22, marginBottom: 8 },
});
