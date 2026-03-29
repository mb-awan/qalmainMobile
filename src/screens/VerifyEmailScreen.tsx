import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../theme/colors';
import { userAPI, clearAuthToken } from '../services/api';
import { validateOtp } from '../utils/validation';

const RESEND_SECONDS = 60;

interface Props {
  navigation: {
    replace: (name: string) => void;
    reset: (config: { index: number; routes: { name: string }[] }) => void;
  };
}

const VerifyEmailScreen = ({ navigation }: Props) => {
  const [otp, setOtp] = useState('');
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const tickCooldown = useCallback(() => {
    setCooldown(RESEND_SECONDS);
  }, []);

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => {
      setCooldown(c => (c <= 1 ? 0 : c - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleVerify = async () => {
    const err = validateOtp(otp);
    if (err) {
      Alert.alert('Check code', err);
      return;
    }
    setLoading(true);
    try {
      const { data } = await userAPI.verifyEmail({
        otp: otp.replace(/\s/g, ''),
      });
      if (data?.success) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      } else {
        Alert.alert('Error', data?.error?.message || 'Verification failed.');
      }
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message ||
        (e as Error)?.message ||
        'Verification failed.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resendLoading) return;
    setResendLoading(true);
    try {
      const { data } = await userAPI.resendEmailVerification();
      if (data?.success) {
        tickCooldown();
        Alert.alert('Sent', 'We sent a new code to your email.');
      } else {
        Alert.alert('Error', data?.error?.message || 'Could not resend.');
      }
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message ||
        (e as Error)?.message ||
        'Could not resend.';
      Alert.alert('Error', msg);
    } finally {
      setResendLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign out?', 'You can verify your email later.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await clearAuthToken();
          navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
          });
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Icon name="mark-email-read" size={44} color={theme.colors.primary} />
          </View>
          <Text style={styles.title}>Verify your email</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code we sent. In development, check the server
            console for the code.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>VERIFICATION CODE</Text>
          <TextInput
            style={[styles.input, focused && styles.inputFocused]}
            placeholder="000000"
            placeholderTextColor={theme.colors.textMuted + '66'}
            value={otp}
            onChangeText={t => setOtp(t.replace(/[^\d\s]/g, ''))}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            keyboardType="number-pad"
            maxLength={8}
            autoComplete="one-time-code"
          />

          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.btnDisabled]}
            onPress={handleVerify}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color={theme.colors.white} />
            ) : (
              <Text style={styles.primaryBtnText}>Verify and continue</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resendWrap}
            onPress={handleResend}
            disabled={cooldown > 0 || resendLoading}>
            {resendLoading ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : (
              <Text
                style={[
                  styles.resendText,
                  (cooldown > 0 || resendLoading) && styles.resendDisabled,
                ]}>
                {cooldown > 0
                  ? `Resend code in ${cooldown}s`
                  : 'Resend code'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOut} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Use a different account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  scroll: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingTop: theme.spacing.xxl * 1.2,
    paddingBottom: theme.spacing.xl,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 26,
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
  label: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  input: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 22,
    fontFamily: theme.fonts.body,
    letterSpacing: 6,
    color: theme.colors.textPrimary,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    height: 56,
    textAlign: 'center',
  },
  inputFocused: {
    borderColor: theme.colors.primary,
  },
  primaryBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md + 2,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  primaryBtnText: {
    color: theme.colors.white,
    fontSize: 16,
    fontFamily: theme.fonts.button,
    fontWeight: '600',
  },
  resendWrap: {
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    minHeight: 24,
    justifyContent: 'center',
  },
  resendText: {
    fontSize: 15,
    fontFamily: theme.fonts.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  resendDisabled: {
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  signOut: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  signOutText: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
});

export default VerifyEmailScreen;
