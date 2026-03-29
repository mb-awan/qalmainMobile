import React, { useState } from 'react';
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
import { userAPI } from '../services/api';
import { validatePassword, validateOtp } from '../utils/validation';

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

  const sendOtp = async () => {
    const c = validatePassword(newPassword);
    if (c) {
      Alert.alert('New password', c);
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'New password and confirmation do not match.');
      return;
    }
    if (!currentPassword) {
      Alert.alert('Required', 'Enter your current password.');
      return;
    }
    setOtpLoading(true);
    try {
      const { data } = await userAPI.requestPasswordChangeOtp();
      if (data?.success) {
        setStep('otp');
        Alert.alert('Code sent', 'Check your email. In dev, see server logs.');
      } else {
        Alert.alert('Error', data?.error?.message || 'Could not send code.');
      }
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message ||
        (e as Error)?.message ||
        'Could not send code.';
      Alert.alert('Error', msg);
    } finally {
      setOtpLoading(false);
    }
  };

  const submit = async () => {
    const o = validateOtp(otp);
    if (o) {
      Alert.alert('Code', o);
      return;
    }
    setLoading(true);
    try {
      const { data } = await userAPI.updatePassword({
        currentPassword,
        newPassword,
        otp: otp.replace(/\s/g, ''),
      });
      if (data?.success) {
        Alert.alert('Done', 'Your password was updated.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', data?.error?.message || 'Update failed.');
      }
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message ||
        (e as Error)?.message ||
        'Update failed.';
      Alert.alert('Error', msg);
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
            <Text style={styles.label}>CURRENT PASSWORD</Text>
            <View style={styles.pwRow}>
              <TextInput
                style={styles.pwInput}
                placeholder="Current password"
                placeholderTextColor={theme.colors.textMuted + '66'}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrent}
              />
              <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)} style={styles.eye}>
                <Icon
                  name={showCurrent ? 'visibility' : 'visibility-off'}
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>NEW PASSWORD</Text>
            <View style={styles.pwRow}>
              <TextInput
                style={styles.pwInput}
                placeholder="8+ chars, upper, lower, number"
                placeholderTextColor={theme.colors.textMuted + '66'}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNew}
              />
              <TouchableOpacity onPress={() => setShowNew(!showNew)} style={styles.eye}>
                <Icon
                  name={showNew ? 'visibility' : 'visibility-off'}
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>CONFIRM NEW PASSWORD</Text>
            <TextInput
              style={styles.input}
              placeholder="Repeat new password"
              placeholderTextColor={theme.colors.textMuted + '66'}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showNew}
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
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.white,
    marginBottom: theme.spacing.md,
    height: 52,
  },
  pwRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.white,
    marginBottom: theme.spacing.md,
    height: 52,
  },
  pwInput: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
  },
  eye: {
    padding: theme.spacing.md,
  },
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
