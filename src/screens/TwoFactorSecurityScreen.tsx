import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../theme/colors';
import { userAPI } from '../services/api';
import { validateOtp } from '../utils/validation';
import { ModalMessage } from '../components/ModalMessage';

interface Props {
  navigation: { goBack: () => void };
}

const TwoFactorSecurityScreen = ({ }: Props) => {
  const [enabled, setEnabled] = useState(false);
  const [emailVerified, setEmailVerified] = useState(true);
  const [loading, setLoading] = useState(true);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<'idle' | 'awaitOtp'>('idle');
  const [modal, setModal] = useState<{
    visible: boolean;
    variant: 'info' | 'success' | 'error';
    title: string;
    message: string;
  }>({
    visible: false,
    variant: 'info',
    title: '',
    message: '',
  });

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await userAPI.getProfile();
      const u = data?.data?.user;
      if (u) {
        setEnabled(u.twoFactorEnabled === true);
        setEmailVerified(u.emailVerified !== false);
      }
    } catch {
      /* 401 global */
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  const sendEnableOtp = async () => {
    if (!emailVerified) {
      setModal({
        visible: true,
        variant: 'info',
        title: 'Verify email first',
        message: 'Complete email verification before turning on two-step verification.',
      });
      return;
    }
    setBusy(true);
    try {
      const { data } = await userAPI.requestTwoFactorEnableOtp();
      if (data?.success) {
        setMode('awaitOtp');
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
      setBusy(false);
    }
  };

  const confirmEnable = async () => {
    const err = validateOtp(otp);
    if (err) {
      setModal({ visible: true, variant: 'error', title: 'Code', message: err });
      return;
    }
    setBusy(true);
    try {
      const { data } = await userAPI.enableTwoFactor({
        otp: otp.replace(/\s/g, ''),
      });
      if (data?.success) {
        setEnabled(true);
        setMode('idle');
        setOtp('');
        setModal({
          visible: true,
          variant: 'success',
          title: 'Enabled',
          message: 'Two-step verification is on.',
        });
      } else {
        setModal({
          visible: true,
          variant: 'error',
          title: 'Could not enable',
          message: data?.error?.message || 'Could not enable.',
        });
      }
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message ||
        (e as Error)?.message ||
        'Could not enable.';
      setModal({
        visible: true,
        variant: 'error',
        title: 'Could not enable',
        message: msg,
      });
    } finally {
      setBusy(false);
    }
  };

  const disable = async () => {
    if (!password.trim()) {
      setModal({
        visible: true,
        variant: 'error',
        title: 'Password required',
        message: 'Enter your password to turn this off.',
      });
      return;
    }
    setBusy(true);
    try {
      const { data } = await userAPI.disableTwoFactor({ password });
      if (data?.success) {
        setEnabled(false);
        setPassword('');
        setModal({
          visible: true,
          variant: 'success',
          title: 'Disabled',
          message: 'Two-step verification is off.',
        });
      } else {
        setModal({
          visible: true,
          variant: 'error',
          title: 'Could not disable',
          message: data?.error?.message || 'Could not disable.',
        });
      }
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message ||
        (e as Error)?.message ||
        'Could not disable.';
      setModal({
        visible: true,
        variant: 'error',
        title: 'Could not disable',
        message: msg,
      });
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.banner}>
          <Icon name="info-outline" size={22} color={theme.colors.primary} />
          <Text style={styles.bannerText}>
            When on, we email you a code each time you sign in on a new session.
          </Text>
        </View>

        {enabled ? (
          <>
            <Text style={styles.label}>PASSWORD TO TURN OFF</Text>
            <View style={styles.pwRow}>
              <TextInput
                style={styles.pwInput}
                placeholder="Your account password"
                placeholderTextColor={theme.colors.textMuted + '66'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPw}
              />
              <TouchableOpacity onPress={() => setShowPw(!showPw)} style={styles.eye}>
                <Icon
                  name={showPw ? 'visibility' : 'visibility-off'}
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.dangerBtn, busy && styles.disabled]}
              onPress={disable}
              disabled={busy}>
              {busy ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <Text style={styles.dangerText}>Turn off two-step verification</Text>
              )}
            </TouchableOpacity>
          </>
        ) : mode === 'idle' ? (
          <TouchableOpacity
            style={[styles.primary, busy && styles.disabled]}
            onPress={sendEnableOtp}
            disabled={busy}>
            {busy ? (
              <ActivityIndicator color={theme.colors.white} />
            ) : (
              <Text style={styles.primaryText}>Send code to enable</Text>
            )}
          </TouchableOpacity>
        ) : (
          <>
            <Text style={styles.label}>EMAIL CODE</Text>
            <TextInput
              style={styles.otp}
              placeholder="000000"
              placeholderTextColor={theme.colors.textMuted + '66'}
              value={otp}
              onChangeText={t => setOtp(t.replace(/[^\d\s]/g, ''))}
              keyboardType="number-pad"
              maxLength={8}
            />
            <TouchableOpacity
              style={[styles.primary, busy && styles.disabled]}
              onPress={confirmEnable}
              disabled={busy}>
              {busy ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <Text style={styles.primaryText}>Confirm and enable</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.link} onPress={() => setMode('idle')}>
              <Text style={styles.linkText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
      <ModalMessage
        visible={modal.visible}
        variant={modal.variant}
        title={modal.title}
        message={modal.message}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
  },
  scroll: {
    padding: theme.spacing.lg,
  },
  banner: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.highlight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.xl,
    alignItems: 'flex-start',
  },
  bannerText: {
    flex: 1,
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
    lineHeight: 20,
  },
  label: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  pwRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
    marginBottom: theme.spacing.lg,
    height: 52,
  },
  pwInput: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
  },
  eye: { padding: theme.spacing.md },
  otp: {
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 22,
    letterSpacing: 6,
    textAlign: 'center',
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.white,
    marginBottom: theme.spacing.lg,
    height: 56,
  },
  primary: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md + 2,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
  },
  primaryText: {
    color: theme.colors.white,
    fontSize: 16,
    fontFamily: theme.fonts.button,
    fontWeight: '600',
  },
  dangerBtn: {
    backgroundColor: theme.colors.error,
    paddingVertical: theme.spacing.md + 2,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
  },
  dangerText: {
    color: theme.colors.white,
    fontSize: 16,
    fontFamily: theme.fonts.button,
    fontWeight: '600',
  },
  disabled: { opacity: 0.7 },
  link: { alignItems: 'center', marginTop: theme.spacing.lg },
  linkText: {
    fontSize: 15,
    fontFamily: theme.fonts.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});

export default TwoFactorSecurityScreen;
