import React, { useMemo, useState, useEffect } from 'react';
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
import { theme } from '../theme/colors';
import { userAPI, setAuthToken } from '../services/api';
import { validateOtp } from '../utils/validation';
import { ModalMessage } from '../components/ModalMessage';

interface Props {
  navigation: {
    replace: (name: string) => void;
    reset: (config: { index: number; routes: { name: string }[] }) => void;
    goBack: () => void;
  };
  route: {
    params: { twoFactorToken: string; emailHint?: string };
  };
}

const TwoFactorLoginScreen = ({ navigation, route }: Props) => {
  const { twoFactorToken, emailHint } = route.params;
  const [otp, setOtp] = useState('');
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
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

  const otpError = useMemo(() => validateOtp(otp), [otp]);

  useEffect(() => {
    if (!twoFactorToken) {
      setModal({
        visible: true,
        variant: 'error',
        title: 'Session error',
        message: 'Please sign in again.',
      });
    }
  }, [twoFactorToken, navigation]);

  const submit = async () => {
    setTouched(true);
    setSubmitError(null);
    if (otpError) return;
    setLoading(true);
    try {
      const { data } = await userAPI.verify2faLogin({
        twoFactorToken,
        otp: otp.replace(/\s/g, ''),
      });
      if (data?.success && data?.data?.token) {
        await setAuthToken(data.data.token);
        const user = data.data.user;
        if (user && user.emailVerified === false) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'VerifyEmail' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          });
        }
      } else {
        setSubmitError(data?.error?.message || 'Verification failed.');
      }
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message ||
        (e as Error)?.message ||
        'Verification failed.';
      setSubmitError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back-ios" size={18} color={theme.colors.textPrimary} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Icon name="security" size={40} color={theme.colors.primary} />
          </View>
          <Text style={styles.title}>Two-step verification</Text>
          <Text style={styles.subtitle}>
            {emailHint
              ? `We sent a code to ${emailHint}.`
              : 'Enter the code we emailed you.'}{' '}
            Dev: check server logs for the OTP.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>CODE</Text>
          <TextInput
            style={[styles.input, focused && styles.inputFocused]}
            placeholder="000000"
            placeholderTextColor={theme.colors.textMuted + '66'}
            value={otp}
            onChangeText={t => setOtp(t.replace(/[^\d\s]/g, ''))}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              setTouched(true);
            }}
            keyboardType="number-pad"
            maxLength={8}
            autoComplete="one-time-code"
            includeFontPadding={false}
            textAlignVertical="center"
          />
          {touched && otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}
          {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}

          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.btnDisabled]}
            onPress={submit}
            disabled={loading || Boolean(otpError)}>
            {loading ? (
              <ActivityIndicator color={theme.colors.white} />
            ) : (
              <Text style={styles.primaryBtnText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ModalMessage
        visible={modal.visible}
        variant={modal.variant}
        title={modal.title}
        message={modal.message}
        primaryText="OK"
        onPrimary={() => navigation.replace('SignIn')}
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
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
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
    letterSpacing: 6,
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    height: 56,
    textAlign: 'center',
  },
  inputFocused: {
    borderColor: theme.colors.primary,
  },
  errorText: {
    marginTop: 8,
    marginLeft: 4,
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.error,
    lineHeight: 16,
  },
  primaryBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md + 2,
    borderRadius: theme.borderRadius.round,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  btnDisabled: { opacity: 0.7 },
  primaryBtnText: {
    color: theme.colors.white,
    fontSize: 16,
    fontFamily: theme.fonts.button,
    fontWeight: '600',
  },
});

export default TwoFactorLoginScreen;
