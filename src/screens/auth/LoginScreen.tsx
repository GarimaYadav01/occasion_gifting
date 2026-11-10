import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import LinearGradient from '../../components/Gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { Img } from '../../components/Img';
import { Tap } from '../../components/Tap';
import { img } from '../../data/images';
import { useNav, useStatusBar } from '../../utils/hooks';
import { palettes } from '../../theme';

const c = palettes.gifts;

export const LoginScreen = () => {
  const nav = useNav();
  const insets = useSafeAreaInsets();
  useStatusBar('light-content');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const valid = /^[6-9]\d{9}$/.test(phone);

  const submit = () => {
    if (!valid) { setError('Enter a valid 10-digit mobile number'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); nav.navigate('Otp', { phone }); }, 900);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" bounces={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ height: 340 }}>
          <View style={styles.collage}>
            {(['pinkDripCake', 'tulips', 'balloons', 'aisle', 'kraftGift', 'djConfetti'] as const).map((k, i) => (
              <Img key={k} uri={img(k, 300)} style={[styles.tile, { transform: [{ rotate: `${i % 2 ? 4 : -4}deg` }] }]} />
            ))}
          </View>
          <LinearGradient colors={['rgba(74,14,94,0.75)', 'rgba(106,27,132,0.92)', c.bg]} locations={[0, 0.7, 1]} style={[StyleSheet.absoluteFill, { paddingTop: insets.top + 40, alignItems: 'center' }]}>
            <Logo size={64} />
          </LinearGradient>
        </View>
        <View style={styles.body}>
          <Text style={styles.h}>Gifts & celebrations,{'\n'}delivered in minutes</Text>
          <Text style={styles.p}>Log in or sign up with your mobile number</Text>
          <View style={[styles.input, { borderColor: error ? c.danger : c.line }]}>
            <Text style={styles.cc}>🇮🇳 +91</Text>
            <View style={styles.sep} />
            <TextInput
              value={phone}
              onChangeText={t => { setPhone(t.replace(/\D/g, '').slice(0, 10)); setError(''); }}
              keyboardType="number-pad"
              placeholder="Enter mobile number"
              placeholderTextColor={c.muted}
              style={styles.field}
              maxLength={10}
            />
            {valid && <Icon name="check-circle" size={20} color={c.success} />}
          </View>
          {error ? <Text style={styles.err}>{error}</Text> : null}
          <Button title="Continue" onPress={submit} loading={loading} disabled={phone.length < 10} style={{ marginTop: 18 }} />
          <View style={styles.or}><View style={styles.line} /><Text style={{ color: c.muted, marginHorizontal: 10, fontWeight: '600' }}>or continue with</Text><View style={styles.line} /></View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {[['google', 'Google'], ['apple', 'Apple'], ['email-outline', 'Email']].map(([icon, label]) => (
              <Tap key={label} onPress={() => nav.navigate('Otp', { phone: phone || '9876543210' })} style={styles.social}>
                <Icon name={icon} size={20} color={c.text} />
                <Text style={{ fontWeight: '700', marginLeft: 6, color: c.text }}>{label}</Text>
              </Tap>
            ))}
          </View>
          <Text style={styles.terms}>By continuing, you agree to our <Text style={{ color: c.ink, fontWeight: '700' }} onPress={() => nav.navigate('Info', { page: 'terms' })}>Terms of Service</Text> & <Text style={{ color: c.ink, fontWeight: '700' }} onPress={() => nav.navigate('Info', { page: 'privacy' })}>Privacy Policy</Text></Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  collage: { flexDirection: "row", flexWrap: "wrap", padding: 6, position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  tile: { width: '31%', height: 150, margin: '1%', borderRadius: 16 },
  body: { padding: 24, paddingTop: 6 },
  h: { fontSize: 26, fontWeight: '800', color: c.text, letterSpacing: -0.5, lineHeight: 32 },
  p: { fontSize: 14, color: c.sub, marginTop: 8, marginBottom: 22, fontWeight: '500' },
  input: { flexDirection: 'row', alignItems: 'center', height: 56, borderRadius: 14, borderWidth: 1.5, backgroundColor: '#fff', paddingHorizontal: 14 },
  cc: { fontSize: 16, fontWeight: '700', color: c.text },
  sep: { width: 1, height: 26, backgroundColor: c.line, marginHorizontal: 12 },
  field: { flex: 1, fontSize: 17, fontWeight: '700', color: c.text, letterSpacing: 1, paddingVertical: 0 },
  err: { color: c.danger, fontSize: 12, marginTop: 6, fontWeight: '600' },
  or: { flexDirection: 'row', alignItems: 'center', marginVertical: 22 },
  line: { flex: 1, height: 1, backgroundColor: c.line },
  social: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 48, borderRadius: 12, borderWidth: 1, borderColor: c.line, backgroundColor: '#fff' },
  terms: { fontSize: 12, color: c.sub, textAlign: 'center', marginTop: 24, lineHeight: 18 },
});
