import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Modal, StyleSheet, Text, View } from 'react-native';
import { Icon } from './Icon';
import { Button } from './Button';

interface Props {
  state: 'idle' | 'processing' | 'failed';
  label?: string;
  onRetry: () => void;
  onChange: () => void;
}

/** Full-screen payment processing / failure state. */
export const ProcessingOverlay = ({ state, label = 'Processing payment', onRetry, onChange }: Props) => {
  const s = useRef(new Animated.Value(0.8)).current;
  useEffect(() => {
    if (state === 'failed') { s.setValue(0.6); Animated.spring(s, { toValue: 1, useNativeDriver: true, bounciness: 14 }).start(); }
  }, [state, s]);
  return (
    <Modal visible={state !== 'idle'} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.bg}>
        <View style={styles.card}>
          {state === 'processing' ? (
            <>
              <ActivityIndicator size="large" color="#6A1B84" />
              <Text style={styles.h}>{label}…</Text>
              <Text style={styles.p}>Please don't press back or close the app</Text>
            </>
          ) : (
            <>
              <Animated.View style={[styles.fail, { transform: [{ scale: s }] }]}><Icon name="close-thick" size={36} color="#fff" /></Animated.View>
              <Text style={styles.h}>Payment failed</Text>
              <Text style={styles.p}>Your bank declined the transaction. Any amount debited will be refunded within 3–5 days.</Text>
              <Button title="Retry payment" icon="refresh" onPress={onRetry} style={{ alignSelf: 'stretch', marginTop: 18 }} />
              <Button title="Choose another method" variant="ghost" onPress={onChange} style={{ alignSelf: 'stretch', marginTop: 6 }} />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: 'rgba(20,10,30,0.6)', alignItems: 'center', justifyContent: 'center', padding: 28 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 24, alignItems: 'center', alignSelf: 'stretch' },
  h: { fontSize: 19, fontWeight: '800', color: '#1D1424', marginTop: 16 },
  p: { fontSize: 13, color: '#6B6275', textAlign: 'center', marginTop: 6, lineHeight: 19 },
  fail: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#D93B4A', alignItems: 'center', justifyContent: 'center' },
});
