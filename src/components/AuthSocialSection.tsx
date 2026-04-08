import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../theme/colors';

type AuthSocialSectionProps = {
  onGooglePress: () => void;
  onApplePress: () => void;
};

export function AuthSocialSection({
  onGooglePress,
  onApplePress,
}: AuthSocialSectionProps): React.JSX.Element {
  return (
    <>
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity style={styles.socialButton} onPress={onGooglePress}>
        <Icon name="g-translate" size={20} color={theme.colors.textPrimary} />
        <Text style={styles.socialButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.socialButton, styles.appleButton]} onPress={onApplePress}>
        <Icon name="apple" size={20} color={theme.colors.white} />
        <Text style={[styles.socialButtonText, styles.appleButtonText]}>Continue with Apple</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.borderSubtle,
  },
  dividerText: {
    marginHorizontal: theme.spacing.md,
    fontSize: 11,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 3.2,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.round,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  socialButtonText: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  appleButton: {
    backgroundColor: theme.colors.black,
    borderColor: theme.colors.black,
  },
  appleButtonText: {
    color: theme.colors.white,
  },
});

