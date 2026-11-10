import React, { useEffect, useRef } from 'react';
import { Animated, KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tap } from './Tap';
import { Icon } from './Icon';
import { font } from '../theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Sheet = ({ visible, onClose, title, children }: Props) => {
  const insets = useSafeAreaInsets();
  const y = useRef(new Animated.Value(600)).current;
  useEffect(() => {
    if (visible) { y.setValue(600); Animated.spring(y, { toValue: 0, useNativeDriver: true, bounciness: 4, speed: 14 }).start(); }
  }, [visible, y]);
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Animated.View style={[styles.sheet, { paddingBottom: insets.bottom + 16, transform: [{ translateY: y }] }]}>
          <View style={styles.grab} />
          {title ? (
            <View style={styles.head}>
              <Text style={[font.h2, { flex: 1, color: '#1D1424' }]}>{title}</Text>
              <Tap onPress={onClose} style={styles.close}><Icon name="close" size={20} /></Tap>
            </View>
          ) : null}
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(20,10,30,0.55)' },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#FBF7F2', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 16, maxHeight: '88%' },
  grab: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: '#DDD2DA', marginTop: 8, marginBottom: 8 },
  head: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 4 },
  close: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#EFE7EE', alignItems: 'center', justifyContent: 'center' },
});
