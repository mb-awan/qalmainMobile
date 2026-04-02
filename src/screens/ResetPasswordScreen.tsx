import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../theme/colors';
import { validateOtp, validatePassword, validateEmail } from '../utils/validation';
import { userAPI } from '../services/api';
import { FormField } from '../components/FormField';
import { ModalMessage } from '../components/ModalMessage';

interface Props {
  navigation: { goBack: () => void; reset: (cfg: any) => void };
  route: { params?: { email?: string } };
}

export default function ResetPasswordScreen({ navigation, route }: Props): React.JSX.Element {
  const initialEmail = route.params?.email ?? '';
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    otp: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<{ visible: boolean; variant: 'success' | 'error'; title: string; message: string }>(
    { visible: false, variant: 'success', title: '', message: '' }
  );

  const errors = useMemo(() => {
    const eErr = validateEmail(email);
    const oErr = validateOtp(otp);
    const pErr = validatePassword(newPassword);
    const cErr = !confirmPassword
      ? 'Please confirm your password.'
      : newPassword !== confirmPassword
        ? 'Passwords do not match.'
        : null;
    return { email: eErr, otp: oErr, newPassword: pErr, confirmPassword: cErr };
  }, [confirmPassword, email, newPassword, otp]);

  const canSubmit = useMemo(() => {
    return (
      !loading &&
      !errors.email &&
      !errors.otp &&
      !errors.newPassword &&
      !errors.confirmPassword
    );
  }, [errors, loading]);

  const submit = async () => {
    setTouched({ email: true, otp: true, newPassword: true, confirmPassword: true });
    if (errors.email || errors.otp || errors.newPassword || errors.confirmPassword) return;
    setLoading(true);
    try {
      const { data } = await userAPI.resetPasswordWithOtp({
        email: email.trim(),
        otp: otp.replace(/\s/g, ''),
        newPassword,
      });
      if (data?.success) {
        setModal({
          visible: true,
          variant: 'success',
          title: 'Password updated',
          message: 'You can now sign in with your new password.',
        });
      } else {
        const msg = data?.error?.message || 'Could not reset password.';
        setModal({
          visible: true,
          variant: 'error',
          title: 'Reset failed',
          message: msg,
        });
      }
    } catch (e: any) {
      const msg = e.response?.data?.error?.message || e.message || 'Could not reset password.';
      setModal({
        visible: true,
        variant: 'error',
        title: 'Reset failed',
        message: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-ios" size={18} color={theme.colors.textPrimary} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Icon name="vpn-key" size={38} color={theme.colors.primary} />
          </View>
          <Text style={styles.title}>Reset password</Text>
          <Text style={styles.subtitle}>Enter the 6-digit code and choose a new password.</Text>
        </View>

        <View style={styles.form}>
          <FormField
            label="EMAIL"
            value={email}
            onChangeText={setEmail}
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            touched={touched.email}
            error={errors.email}
            onBlur={() => setTouched(s => ({ ...s, email: true }))}
          />

          <View style={styles.row}>
            <View style={styles.flex1}>
              <FormField
                label="CODE"
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
            </View>
          </View>

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
            label="CONFIRM PASSWORD"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Repeat password"
            secureTextEntry={!showConfirm}
            autoComplete="password-new"
            textContentType="newPassword"
            touched={touched.confirmPassword}
            error={errors.confirmPassword}
            onBlur={() => setTouched(s => ({ ...s, confirmPassword: true }))}
            rightIcon={{
              kind: 'button',
              icon: showConfirm ? 'visibility' : 'visibility-off',
              accessibilityLabel: showConfirm ? 'Hide confirm password' : 'Show confirm password',
              onPress: () => setShowConfirm(v => !v),
            }}
          />

          <TouchableOpacity
            style={[styles.primaryBtn, (!canSubmit || loading) && styles.disabled]}
            onPress={submit}
            disabled={!canSubmit || loading}>
            {loading ? (
              <ActivityIndicator color={theme.colors.white} />
            ) : (
              <Text style={styles.primaryBtnText}>Reset password</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ModalMessage
        visible={modal.visible}
        variant={modal.variant}
        title={modal.title}
        message={modal.message}
        primaryText={modal.variant === 'success' ? 'Go to sign in' : 'OK'}
        onPrimary={() => {
          if (modal.variant === 'success') {
            navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
          }
        }}
        onDismiss={() => setModal(s => ({ ...s, visible: false }))}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: theme.spacing.lg,
    gap: 4,
  },
  backText: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
  },
  header: {
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: theme.fonts.body,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  form: {
    marginTop: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  flex1: { flex: 1 },
  primaryBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md + 2,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
    marginTop: theme.spacing.md,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryBtnText: {
    color: theme.colors.white,
    fontSize: 16,
    fontFamily: theme.fonts.button,
    fontWeight: '600',
  },
  disabled: { opacity: 0.55 },
});

