import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { AppHeader } from '../../components/AppHeader';
import { Button } from '../../components/Button';
import { Icon } from '../../components/Icon';
import { useAppDispatch } from '../../store';
import { login } from '../../store/slices/app';
import { useNav } from '../../utils/hooks';
import { RootStackParamList } from '../../navigation/types';
import { palettes } from '../../theme';

const c = palettes.gifts;

export const OtpScreen = () => {
  const nav = useNav();
  const dispatch = useAppDispatch();
  const { phone } = useRoute<RouteProp<RootStackParamList, 'Otp'>>().params;
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const input = useRef<TextInput>(null);

  useEffect(() => {
    const t = setInterval(() => setTimer(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const verify = (v = code) => {
    if (v.length < 4) { return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (v === '0000') { setError('Incorrect OTP. Please try again.'); setCode(''); return; }
      dispatch(login(phone));
      nav.reset({ index: 0, routes: [{ name: 'ProfileSetup' }] });
    }, 900);
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <AppHeader title="OTP Verification" />
      <View style={{ padding: 24 }}>
        <View style={styles.icon}><Icon name="message-lock-outline" size={30} color={c.ink} /></View>
        <Text style={styles.h}>Enter the 4-digit code</Text>
        <Text style={styles.p}>Sent via SMS to <Text style={{ fontWeight: '800', color: c.text }}>+91 {phone.slice(0, 5)} {phone.slice(5)}</Text>  <Text style={{ color: c.ink, fontWeight: '800' }} onPress={() => nav.goBack()}>Edit</Text></Text>
        <View style={styles.boxes} onTouchEnd={() => input.current?.focus()}>
          {[0, 1, 2, 3].map(i => (
            <View key={i} style={[styles.box, { borderColor: error ? c.danger : code.length === i ? c.ink : code[i] ? c.ink : c.line, backgroundColor: code[i] ? c.tint : '#fff' }]}>
              <Text style={styles.digit}>{code[i] || ''}</Text>
            </View>
          ))}
        </View>
        <TextInput
          ref={input}
          value={code}
          autoFocus
          onChangeText={t => { const v = t.replace(/\D/g, '').slice(0, 4); setCode(v); setError(''); if (v.length === 4) { verify(v); } }}
          keyboardType="number-pad"
          style={styles.hidden}
          textContentType="oneTimeCode"
        />
        {error ? <Text style={styles.err}>{error}</Text> : <Text style={styles.hint}>Tip: any code works · "0000" shows the error state</Text>}
        <Button title="Verify & continue" onPress={() => verify()} loading={loading} disabled={code.length < 4} style={{ marginTop: 26 }} />
        <Text style={styles.resend}>
          {timer > 0 ? <>Resend OTP in <Text style={{ fontWeight: '800', color: c.text }}>00:{String(timer).padStart(2, '0')}</Text></> : <Text style={{ color: c.ink, fontWeight: '800' }} onPress={() => setTimer(30)}>Resend OTP</Text>}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: { width: 64, height: 64, borderRadius: 20, backgroundColor: c.tint, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  h: { fontSize: 24, fontWeight: '800', color: c.text },
  p: { fontSize: 14, color: c.sub, marginTop: 8, lineHeight: 20 },
  boxes: { flexDirection: 'row', gap: 14, marginTop: 30 },
  box: { flex: 1, height: 64, borderRadius: 16, borderWidth: 1.6, alignItems: 'center', justifyContent: 'center' },
  digit: { fontSize: 26, fontWeight: '800', color: c.text },
  hidden: { position: 'absolute', opacity: 0, height: 1, width: 1 },
  err: { color: c.danger, fontWeight: '700', marginTop: 12 },
  hint: { color: c.muted, fontSize: 12, marginTop: 12 },
  resend: { textAlign: 'center', marginTop: 20, color: c.sub, fontSize: 14 },
});
