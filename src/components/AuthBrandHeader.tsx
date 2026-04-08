import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme/colors';

type AuthBrandHeaderProps = {
  subtitle: string;
};

export function AuthBrandHeader({ subtitle }: AuthBrandHeaderProps): React.JSX.Element {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/qalmain-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.appTitle}>Digital Qari</Text>
      <Text style={styles.tagline}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  logoContainer: {
    marginBottom: theme.spacing.md,
  },
  logo: {
    width: 104,
    height: 104,
  },
  appTitle: {
    fontSize: 30,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  tagline: {
    fontSize: 15,
    fontFamily: theme.fonts.body,
    color: theme.colors.textMuted,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 22,
  },
});

