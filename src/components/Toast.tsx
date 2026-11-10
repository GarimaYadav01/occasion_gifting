import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from './Icon';

const Ctx = createContext<{ show: (msg: string, icon?: string) => void }>({ show: () => {} });
export const useToast = () => useContext(Ctx);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets();
  const [msg, setMsg] = useState<{ text: string; icon: string } | null>(null);
  const a = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = useCallback((text: string, icon = 'check-circle') => {
    setMsg({ text, icon });
    if (timer.current) { clearTimeout(timer.current); }
    Animated.spring(a, { toValue: 1, useNativeDriver: true, bounciness: 8 }).start();
    timer.current = setTimeout(() => Animated.timing(a, { toValue: 0, duration: 200, useNativeDriver: true }).start(), 1800);
  }, [a]);
  return (
    <Ctx.Provider value={{ show }}>
      {children}
      {msg && (
        <Animated.View pointerEvents="none" style={[styles.toast, { top: insets.top + 8, opacity: a, transform: [{ translateY: a.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) }] }]}>
          <View style={styles.inner}>
            <Icon name={msg.icon} size={18} color="#7CF0B0" />
            <Text style={styles.txt}>{msg.text}</Text>
          </View>
        </Animated.View>
      )}
    </Ctx.Provider>
  );
};

const styles = StyleSheet.create({
  toast: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 999, elevation: 30 },
  inner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1D1424', paddingHorizontal: 16, paddingVertical: 11, borderRadius: 14 },
  txt: { color: '#fff', marginLeft: 8, fontWeight: '700', fontSize: 13.5 },
});
