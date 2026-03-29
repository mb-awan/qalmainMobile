import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../theme/colors';
import { userAPI } from '../services/api';

interface Props {
  navigation: {
    navigate: (name: string) => void;
    goBack: () => void;
  };
}

const AccountSecurityScreen = ({ navigation }: Props) => {
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [email, setEmail] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await userAPI.getProfile();
      const u = data?.data?.user;
      if (u) {
        setEmailVerified(u.emailVerified !== false);
        setTwoFactorEnabled(u.twoFactorEnabled === true);
        setEmail(u.email || '');
      }
    } catch {
      /* 401 handled globally */
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>EMAIL</Text>
        <View style={styles.card}>
          {loading ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : (
            <>
              <Text style={styles.emailText}>{email}</Text>
              <View style={styles.row}>
                <Icon
                  name={emailVerified ? 'verified' : 'warning'}
                  size={20}
                  color={emailVerified ? theme.colors.success : theme.colors.warning}
                />
                <Text style={styles.statusText}>
                  {emailVerified
                    ? 'Verified'
                    : 'Not verified. Use Verify email if you need to complete setup.'}
                </Text>
              </View>
              {!emailVerified && (
                <TouchableOpacity
                  style={styles.linkBtn}
                  onPress={() => navigation.navigate('VerifyEmail')}>
                  <Text style={styles.linkBtnText}>Verify email</Text>
                  <Icon name="chevron-right" size={20} color={theme.colors.primary} />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => navigation.navigate('ChangePassword')}>
          <View style={styles.menuLeft}>
            <Icon name="lock-reset" size={22} color={theme.colors.primary} />
            <Text style={styles.menuLabel}>Update password</Text>
          </View>
          <Icon name="chevron-right" size={20} color={theme.colors.iosDivider} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.menuRow, styles.lastRow]}
          onPress={() => navigation.navigate('TwoFactorSecurity')}>
          <View style={styles.menuLeft}>
            <Icon name="security" size={22} color={theme.colors.primary} />
            <View>
              <Text style={styles.menuLabel}>Two-step verification</Text>
              <Text style={styles.menuSub}>
                {twoFactorEnabled ? 'On' : 'Off'}
              </Text>
            </View>
          </View>
          <Icon name="chevron-right" size={20} color={theme.colors.iosDivider} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  section: {
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.primary,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  emailText: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
    fontWeight: '500',
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  statusText: {
    flex: 1,
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.iosDivider,
  },
  linkBtnText: {
    fontSize: 15,
    fontFamily: theme.fonts.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.iosDivider,
  },
  lastRow: {
    borderBottomWidth: 0,
    borderRadius: theme.borderRadius.md,
    marginTop: 2,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  menuSub: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});

export default AccountSecurityScreen;
