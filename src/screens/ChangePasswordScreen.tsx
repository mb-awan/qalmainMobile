import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../theme/colors';
import { userAPI } from '../services/api';
import { validatePassword, validateOtp } from '../utils/validation';
import { FormField } from '../components/FormField';
import { ModalMessage } from '../components/ModalMessage';

interface Props {
  navigation: { goBack: () => void };
}

type Step = 'passwords' | 'otp';

const ChangePasswordScreen = ({ navigation }: Props) => {
  const [step, setStep] = useState<Step>('passwords');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [touched, setTouched] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
    otp: false,
  });
  const [modal, setModal] = useState<{
    visible: boolean;
    variant: 'info' | 'success' | 'error';
    title: string;
    message: string;
    primaryText?: string;
  }>({
    visible: false,
    variant: 'info',
    title: '',
    message: '',
    primaryText: 'OK',
  });

  const errors = useMemo(() => {
    const currErr = !currentPassword ? 'Enter your current password.' : null;
    const newErr = validatePassword(newPassword);
    const confErr = !confirmPassword
      ? 'Please confirm your new password.'
      : newPassword !== confirmPassword
        ? 'New password and confirmation do not match.'
        : null;
    const otpErr = validateOtp(otp);
    return { currentPassword: currErr, newPassword: newErr, confirmPassword: confErr, otp: otpErr };
  }, [confirmPassword, currentPassword, newPassword, otp]);

  const sendOtp = async () => {
    setTouched(s => ({ ...s, currentPassword: true, newPassword: true, confirmPassword: true }));
    if (errors.currentPassword || errors.newPassword || errors.confirmPassword) return;
    setOtpLoading(true);
    try {
      const { data } = await userAPI.requestPasswordChangeOtp();
      if (data?.success) {
        setStep('otp');
        setModal({
          visible: true,
          variant: 'success',
          title: 'Code sent',
          message: 'Check your email. In development, the code is also printed in server logs.',
        });
      } else {
        setModal({
          visible: true,
          variant: 'error',
          title: 'Could not send code',
          message: data?.error?.message || 'Could not send code.',
        });
      }
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message ||
        (e as Error)?.message ||
        'Could not send code.';
      setModal({
        visible: true,
        variant: 'error',
        title: 'Could not send code',
        message: msg,
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const submit = async () => {
    setTouched(s => ({ ...s, otp: true }));
    if (errors.otp) return;
    setLoading(true);
    try {
      const { data } = await userAPI.updatePassword({
        currentPassword,
        newPassword,
        otp: otp.replace(/\s/g, ''),
      });
      if (data?.success) {
        setModal({
          visible: true,
          variant: 'success',
          title: 'Done',
          message: 'Your password was updated.',
          primaryText: 'OK',
        });
      } else {
        setModal({
          visible: true,
          variant: 'error',
          title: 'Update failed',
          message: data?.error?.message || 'Update failed.',
        });
      }
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message ||
        (e as Error)?.message ||
        'Update failed.';
      setModal({
        visible: true,
        variant: 'error',
        title: 'Update failed',
        message: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.hint}>
          {step === 'passwords'
            ? 'We will email you a one-time code to confirm this change.'
            : 'Enter the code from your email, then confirm.'}
        </Text>

        {step === 'passwords' && (
          <>
            <FormField
              label="CURRENT PASSWORD"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Current password"
              secureTextEntry={!showCurrent}
              autoComplete="password"
              textContentType="password"
              touched={touched.currentPassword}
              error={errors.currentPassword}
              onBlur={() => setTouched(s => ({ ...s, currentPassword: true }))}
              rightIcon={{
                kind: 'button',
                icon: showCurrent ? 'visibility' : 'visibility-off',
                accessibilityLabel: showCurrent ? 'Hide password' : 'Show password',
                onPress: () => setShowCurrent(v => !v),
              }}
            />

            <FormField
              label="NEW PASSWORD"
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="8+ chars, upper, lower, number"
              secureTextEntry={!showNew}
              autoComplete="password-new"
              textContentType="newPassword"
              touched={touched.newPassword}
              error={errors.newPassword}
              onBlur={() => setTouched(s => ({ ...s, newPassword: true }))}
              rightIcon={{
                kind: 'button',
                icon: showNew ? 'visibility' : 'visibility-off',
                accessibilityLabel: showNew ? 'Hide password' : 'Show password',
                onPress: () => setShowNew(v => !v),
              }}
            />

            <FormField
              label="CONFIRM NEW PASSWORD"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Repeat new password"
              secureTextEntry={!showNew}
              autoComplete="password-new"
              textContentType="newPassword"
              touched={touched.confirmPassword}
              error={errors.confirmPassword}
              onBlur={() => setTouched(s => ({ ...s, confirmPassword: true }))}
            />

            <TouchableOpacity
              style={[styles.primary, otpLoading && styles.disabled]}
              onPress={sendOtp}
              disabled={otpLoading}>
              {otpLoading ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <Text style={styles.primaryText}>Send verification code</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {step === 'otp' && (
          <>
            <FormField
              label="EMAIL CODE"
              value={otp}
              onChangeText={t => setOtp(t.replace(/[^\d\s]/g, ''))}
              placeholder="000000"
              keyboardType="number-pad"
              inputMode="numeric"
              autoComplete="one-time-code"
              touched={touched.otp}
              error={errors.otp}
              onBlur={() => setTouched(s => ({ ...s, otp: true }))}
              maxLength={8}
            />

            <TouchableOpacity
              style={[styles.primary, loading && styles.disabled]}
              onPress={submit}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <Text style={styles.primaryText}>Update password</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondary}
              onPress={() => setStep('passwords')}>
              <Text style={styles.secondaryText}>Back</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
      <ModalMessage
        visible={modal.visible}
        variant={modal.variant}
        title={modal.title}
        message={modal.message}
        primaryText={modal.primaryText ?? 'OK'}
        onPrimary={modal.variant === 'success' && modal.title === 'Done' ? () => navigation.goBack() : undefined}
        onDismiss={() => setModal(s => ({ ...s, visible: false }))}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  scroll: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  hint: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    lineHeight: 21,
    marginBottom: theme.spacing.lg,
  },
  primary: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md + 2,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  primaryText: {
    color: theme.colors.white,
    fontSize: 16,
    fontFamily: theme.fonts.button,
    fontWeight: '600',
  },
  disabled: { opacity: 0.7 },
  secondary: {
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  secondaryText: {
    fontSize: 15,
    fontFamily: theme.fonts.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

export default ChangePasswordScreen;
