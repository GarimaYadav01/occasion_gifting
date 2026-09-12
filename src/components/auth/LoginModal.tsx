import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  closeLoginModal,
  setPhone,
  sendOtp,
  resetOtp,
  setLoading,
  loginSuccess,
} from '../../store/slices/authSlice';
import { runPendingAuthAction, clearPendingAuthAction } from '../../services/authGate';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { BrandLogo } from '../layout/BrandLogo';
import { Icon } from '../ui/Icon';
import { colors, radius, spacing, typography } from '../../theme';

export const LoginModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { cancelAuth } = useRequireAuth();
  const { loginModalVisible, loginModalMessage, phone, otpSent, isLoading } =
    useAppSelector(state => state.auth);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleClose = () => {
    setOtp('');
    setError('');
    cancelAuth();
    dispatch(closeLoginModal());
  };

  const handleSendOtp = () => {
    if (phone.length < 10) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    dispatch(setLoading(true));
    setTimeout(() => dispatch(sendOtp()), 800);
  };

  const handleVerifyOtp = () => {
    if (otp.length < 4) {
      setError('Enter the 4-digit OTP');
      return;
    }
    setError('');
    dispatch(setLoading(true));
    setTimeout(() => {
      dispatch(
        loginSuccess({
          id: 'u1',
          name: 'Priya Sharma',
          phone,
          email: 'priya@example.com',
          avatarEmoji: '👩',
        }),
      );
      setOtp('');
      runPendingAuthAction();
    }, 800);
  };

  return (
    <Modal
      visible={loginModalVisible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboard}>
          <Pressable style={styles.sheet} onPress={e => e.stopPropagation()}>
            <View style={styles.handle} />
            <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
              <Icon name="close" size={22} color={colors.textMuted} />
            </TouchableOpacity>

            <BrandLogo variant="full" size="lg" style={styles.logo} />
            <Text style={styles.title}>{loginModalMessage}</Text>
            <Text style={styles.subtitle}>
              {otpSent
                ? `OTP sent to +91 ${phone}`
                : 'Enter your mobile number to continue'}
            </Text>

            {!otpSent ? (
              <Input
                label="Mobile Number"
                placeholder="10-digit mobile number"
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={text => {
                  dispatch(setPhone(text.replace(/\D/g, '')));
                  setError('');
                }}
                error={error}
                containerStyle={styles.input}
              />
            ) : (
              <Input
                label="OTP"
                placeholder="Enter 4-digit OTP"
                keyboardType="number-pad"
                maxLength={4}
                value={otp}
                onChangeText={text => {
                  setOtp(text.replace(/\D/g, ''));
                  setError('');
                }}
                error={error}
                containerStyle={styles.input}
              />
            )}

            <Button
              title={otpSent ? 'Verify & Continue' : 'Get OTP'}
              onPress={otpSent ? handleVerifyOtp : handleSendOtp}
              loading={isLoading}
              fullWidth
            />

            {otpSent ? (
              <Button
                title="Change Number"
                onPress={() => {
                  setOtp('');
                  setError('');
                  dispatch(resetOtp());
                }}
                variant="ghost"
                fullWidth
                style={styles.changeBtn}
              />
            ) : null}

            <Text style={styles.terms}>
              By continuing, you agree to our Terms & Privacy Policy
            </Text>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  keyboard: {
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.huge,
    paddingTop: spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  closeBtn: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.xl,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 18,
    color: colors.textMuted,
  },
  logo: {
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  title: {
    ...typography.h2,
    textAlign: 'center',
    color: colors.navy,
  },
  subtitle: {
    ...typography.bodySmall,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  input: {
    marginBottom: spacing.lg,
  },
  changeBtn: {
    marginTop: spacing.md,
  },
  terms: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.lg,
    textTransform: 'none',
    letterSpacing: 0,
    lineHeight: 18,
    color: colors.textMuted,
  },
});
