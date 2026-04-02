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
import { validateEmail } from '../utils/validation';
import { userAPI } from '../services/api';
import { FormField } from '../components/FormField';
import { ModalMessage } from '../components/ModalMessage';

interface Props {
  navigation: { goBack: () => void; navigate: (name: string, params?: any) => void };
}

export default function ForgotPasswordScreen({ navigation }: Props): React.JSX.Element {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const emailError = useMemo(() => validateEmail(email), [email]);
  const canSubmit = useMemo(() => !loading && !emailError, [emailError, loading]);

  const submit = async () => {
    setTouched(true);
    setSubmitError(null);
    if (emailError) return;
    setLoading(true);
    try {
      const { data } = await userAPI.requestPasswordResetOtp({ email: email.trim() });
      if (data?.success) {
        setModalVisible(true);
      } else {
        setSubmitError(data?.error?.message || 'Could not send code.');
      }
    } catch (e: any) {
      const msg = e.response?.data?.error?.message || e.message || 'Could not send code.';
      setSubmitError(msg);
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
            <Icon name="lock-reset" size={40} color={theme.colors.primary} />
          </View>
          <Text style={styles.title}>Forgot password?</Text>
          <Text style={styles.subtitle}>
            Enter your email and we’ll send a 6-digit code to reset your password.
          </Text>
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
            touched={touched}
            error={emailError}
            onBlur={() => setTouched(true)}
            returnKeyType="send"
            onSubmitEditing={submit}
          />

          {submitError ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setModalVisible(true)}
              style={styles.inlineError}>
              <Icon name="error-outline" size={18} color={theme.colors.error} />
              <Text style={styles.inlineErrorText} numberOfLines={2}>
                {submitError}
              </Text>
              <Text style={styles.inlineErrorCta}>Details</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={[styles.primaryBtn, (!canSubmit || loading) && styles.disabled]}
            onPress={submit}
            disabled={!canSubmit || loading}>
            {loading ? (
              <ActivityIndicator color={theme.colors.white} />
            ) : (
              <Text style={styles.primaryBtnText}>Send code</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ModalMessage
        visible={modalVisible}
        variant={submitError ? 'error' : 'success'}
        title={submitError ? 'Could not send code' : 'Check your email'}
        message={
          submitError
            ? submitError
            : 'If an account exists for this email, we sent a 6-digit code. Enter it to reset your password.'
        }
        primaryText={submitError ? 'OK' : 'Enter code'}
        onPrimary={() => {
          if (!submitError) {
            navigation.navigate('ResetPassword', { email: email.trim() });
          }
        }}
        secondaryText={submitError ? undefined : 'Change email'}
        onSecondary={() => {
          setSubmitError(null);
        }}
        onDismiss={() => {
          setModalVisible(false);
          setSubmitError(null);
        }}
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
  inlineError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: -theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.error + '33',
    backgroundColor: theme.colors.error + '0D',
  },
  inlineErrorText: {
    flex: 1,
    fontSize: 13,
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
    lineHeight: 18,
  },
  inlineErrorCta: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.primary,
    fontWeight: '700',
  },
});

