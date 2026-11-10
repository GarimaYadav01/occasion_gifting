import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '../../components/AppHeader';
import { Button } from '../../components/Button';
import { Chip, Field } from '../../components/Bits';
import { Img } from '../../components/Img';
import { Icon } from '../../components/Icon';
import { Tap } from '../../components/Tap';
import { BottomBar } from '../../components/BottomBar';
import { useAppDispatch, useAppSelector } from '../../store';
import { updateUser } from '../../store/slices/app';
import { useNav } from '../../utils/hooks';
import { palettes } from '../../theme';

const c = palettes.gifts;
const INTERESTS = ['Flowers', 'Cakes', 'Chocolates', 'Hampers', 'Birthday parties', 'Weddings', 'Corporate events', 'Surprises'];

export const ProfileSetupScreen = () => {
  const nav = useNav();
  const dispatch = useAppDispatch();
  const user = useAppSelector(s => s.app.user);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [interests, setInterests] = useState<string[]>(['Cakes', 'Birthday parties']);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const save = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) { e.name = 'Please enter your name'; }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) { e.email = 'Enter a valid email'; }
    setErrors(e);
    if (Object.keys(e).length) { return; }
    dispatch(updateUser({ name: name.trim(), email: email || user.email, gender: gender || user.gender }));
    nav.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppHeader title="Set up your profile" subtitle="Step 1 of 1 · takes 30 seconds" noBack right={<Tap onPress={() => nav.reset({ index: 0, routes: [{ name: 'Main' }] })} style={{ padding: 8 }}><Text style={{ color: c.ink, fontWeight: '800' }}>Skip</Text></Tap>} />
      <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Img uri={user.avatar} style={styles.avatar} />
          <View style={styles.cam}><Icon name="camera" size={16} color="#fff" /></View>
        </View>
        <Field label="Full name *" icon="account-outline" placeholder="e.g. Aarav Mehta" value={name} onChangeText={setName} error={errors.name} />
        <Field label="Email (optional)" icon="email-outline" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" error={errors.email} />
        <Text style={styles.label}>Gender</Text>
        <View style={{ flexDirection: 'row', marginBottom: 18 }}>
          {['Female', 'Male', 'Other'].map(g => <Chip key={g} label={g} on={gender === g} onPress={() => setGender(g)} />)}
        </View>
        <Text style={styles.label}>What do you love celebrating?</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {INTERESTS.map(i => (
            <Chip key={i} label={i} on={interests.includes(i)} icon={interests.includes(i) ? 'check' : undefined} style={{ marginRight: 0 }}
              onPress={() => setInterests(p => (p.includes(i) ? p.filter(x => x !== i) : [...p, i]))} />
          ))}
        </View>
      </ScrollView>
      <BottomBar><Button title="Save & start exploring" onPress={save} /></BottomBar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: '#fff' },
  cam: { position: 'absolute', bottom: 0, right: '36%', width: 32, height: 32, borderRadius: 16, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  label: { fontSize: 13, fontWeight: '700', color: c.sub, marginBottom: 8 },
});
