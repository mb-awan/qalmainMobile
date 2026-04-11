import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../theme/colors';

type DurationOption = 5 | 10 | 'custom';

const DigitalQariSessionScreen = ({ navigation }: any) => {
  const [duration, setDuration] = useState<DurationOption>(10);
  const [repetitionMode, setRepetitionMode] = useState(true);
  const [listeningRecitation, setListeningRecitation] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Digital Qari</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate('MainTabs')}>
          <Icon name="close" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Icon + Title */}
        <View style={styles.topSection}>
          <View style={styles.timerIconCircle}>
            <Icon name="timer" size={36} color={theme.colors.accentGold} />
          </View>
          <Text style={styles.title}>Setup Session</Text>
          <Text style={styles.subtitle}>
            Tailor your recitation and listening experience for optimal focus.
          </Text>
        </View>

        {/* Session Duration */}
        <Text style={styles.sectionLabel}>SESSION DURATION</Text>
        <View style={styles.durationRow}>
          {([5, 10, 'custom'] as DurationOption[]).map(opt => (
            <TouchableOpacity
              key={String(opt)}
              style={[styles.durationBtn, duration === opt && styles.durationBtnActive]}
              onPress={() => setDuration(opt)}
              activeOpacity={0.8}>
              <Text style={[styles.durationBtnValue, duration === opt && styles.durationBtnValueActive]}>
                {opt === 'custom' ? (
                  <Icon name="tune" size={18} color={duration === opt ? theme.colors.white : theme.colors.textSecondary} />
                ) : opt}
              </Text>
              {opt !== 'custom' && (
                <Text style={[styles.durationBtnUnit, duration === opt && styles.durationBtnUnitActive]}>
                  MIN
                </Text>
              )}
              {opt === 'custom' && (
                <Text style={[styles.durationBtnUnit, duration === opt && styles.durationBtnUnitActive]}>
                  CUSTOM
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Advanced Scholar Settings */}
        <Text style={[styles.sectionLabel, { marginTop: theme.spacing.lg }]}>ADVANCED SCHOLAR SETTINGS</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingIconCircle}>
              <Icon name="repeat" size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Repetition Mode</Text>
              <Text style={styles.settingDesc}>Repeat each Verse twice</Text>
            </View>
            <Switch
              value={repetitionMode}
              onValueChange={setRepetitionMode}
              trackColor={{ false: theme.colors.borderSubtle, true: theme.colors.primary }}
              thumbColor={theme.colors.white}
            />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <View style={styles.settingIconCircle}>
              <Icon name="headset" size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Listening + Recitation</Text>
              <Text style={styles.settingDesc}>Guided feedback loop</Text>
            </View>
            <Switch
              value={listeningRecitation}
              onValueChange={setListeningRecitation}
              trackColor={{ false: theme.colors.borderSubtle, true: theme.colors.primary }}
              thumbColor={theme.colors.white}
            />
          </View>
        </View>

        {/* Expert Tip */}
        <View style={styles.tipCard}>
          <Icon name="lightbulb" size={16} color={theme.colors.accentGold} style={styles.tipIcon} />
          <View style={styles.tipContent}>
            <Text style={styles.tipLabel}>EXPERT TIP</Text>
            <Text style={styles.tipText}>
              "Consistent 10-minute sessions are proven to increase memorization retention by 40%."
            </Text>
            <Text style={styles.tipStep}>STEP 2/3 — SESSION DETAILS</Text>
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={styles.nextBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('DigitalQariStudyPath')}>
          <Text style={styles.nextBtnText}>Next</Text>
          <Icon name="arrow-forward" size={20} color={theme.colors.white} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.white,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: theme.fonts.heading,
    color: theme.colors.primary,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  topSection: {
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  timerIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.accentGold + '18',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 26,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },
  durationRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  durationBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: 14,
    backgroundColor: theme.colors.white,
    borderWidth: 1.5,
    borderColor: theme.colors.borderSubtle,
    minHeight: 64,
  },
  durationBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  durationBtnValue: {
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
  },
  durationBtnValueActive: {
    color: theme.colors.white,
  },
  durationBtnUnit: {
    fontSize: 10,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  durationBtnUnitActive: {
    color: theme.colors.white + 'CC',
  },
  settingsCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  settingIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.primary + '12',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
  },
  settingDesc: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  settingDivider: {
    height: 1,
    backgroundColor: theme.colors.borderSubtle,
    marginHorizontal: theme.spacing.md,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.accentGold + '18',
    borderRadius: 14,
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.accentGold + '40',
    gap: theme.spacing.sm,
  },
  tipIcon: {
    marginTop: 2,
  },
  tipContent: {
    flex: 1,
  },
  tipLabel: {
    fontSize: 10,
    fontFamily: theme.fonts.body,
    color: theme.colors.accentGold,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
    lineHeight: 20,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  tipStep: {
    fontSize: 10,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 30,
    paddingVertical: 16,
    gap: 8,
  },
  nextBtnText: {
    fontSize: 16,
    fontFamily: theme.fonts.button,
    color: theme.colors.white,
  },
});

export default DigitalQariSessionScreen;
