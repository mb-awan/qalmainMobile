import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../theme/colors';

type StudyPath = 'sabaq' | 'exercise';

const DigitalQariStudyPathScreen = ({ navigation }: any) => {
  const [selected, setSelected] = useState<StudyPath>('sabaq');

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
        {/* Step Label + Title */}
        <Text style={styles.stepLabel}>STEP 01</Text>
        <Text style={styles.title}>Choose Study Path</Text>
        <Text style={styles.subtitle}>Select the focus for today's session</Text>

        {/* Sabaq (Lesson) Card */}
        <TouchableOpacity
          style={[styles.pathCard, selected === 'sabaq' && styles.pathCardActive]}
          onPress={() => setSelected('sabaq')}
          activeOpacity={0.85}>
          <View style={styles.pathCardHeader}>
            <View style={[styles.pathIconCircle, selected === 'sabaq' && styles.pathIconCircleActive]}>
              <Icon name="menu-book" size={22} color={selected === 'sabaq' ? theme.colors.white : theme.colors.primary} />
            </View>
            {selected === 'sabaq' && (
              <View style={styles.selectedIndicator}>
                <Icon name="check-circle" size={20} color={theme.colors.primary} />
              </View>
            )}
          </View>
          <Text style={styles.pathTitle}>Select Sabaq (Lesson)</Text>
          <Text style={styles.pathDesc}>
            Focus on learning new verses and perfecting your initial recitation with guidance.
          </Text>
          <View style={styles.tagsRow}>
            <View style={[styles.tag, styles.tagPrimary]}>
              <Text style={styles.tagTextPrimary}>TRADITIONAL</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>15-30 MINS</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Exercise (Mashaq) Card */}
        <TouchableOpacity
          style={[styles.pathCard, selected === 'exercise' && styles.pathCardActive]}
          onPress={() => setSelected('exercise')}
          activeOpacity={0.85}>
          <View style={styles.pathCardHeader}>
            <View style={[styles.pathIconCircle, selected === 'exercise' && styles.pathIconCircleActive]}>
              <Icon name="fitness-center" size={22} color={selected === 'exercise' ? theme.colors.white : theme.colors.primary} />
            </View>
            {selected === 'exercise' && (
              <View style={styles.selectedIndicator}>
                <Icon name="check-circle" size={20} color={theme.colors.primary} />
              </View>
            )}
          </View>
          <Text style={styles.pathTitle}>Select Exercise (Mashaq)</Text>
          <Text style={styles.pathDesc}>
            Strengthen your memorization and fluency through repeated practice exercises.
          </Text>
          <View style={styles.tagsRow}>
            <View style={[styles.tag, styles.tagSecondary]}>
              <Text style={styles.tagTextSecondary}>FLUENCY</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>10-15 MINS</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Next Button */}
        <TouchableOpacity
          style={styles.nextBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('DigitalQariPlan')}>
          <Text style={styles.nextBtnText}>Next</Text>
          <Icon name="arrow-forward" size={20} color={theme.colors.white} />
        </TouchableOpacity>

        {/* Scholar Mode */}
        <Text style={styles.scholarModeText}>AUTHENTICATED VIA SCHOLAR MODE</Text>

        {/* Scholar's Tip */}
        <View style={styles.scholarTipCard}>
          <Text style={styles.scholarTipTitle}>Scholar's Tip</Text>
          <Text style={styles.scholarTipText}>
            "Consistency is the path to mastery in recitation."
          </Text>
        </View>
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
  stepLabel: {
    fontSize: 11,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    letterSpacing: 1.5,
    fontWeight: '700',
    marginTop: theme.spacing.lg,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  pathCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1.5,
    borderColor: theme.colors.borderSubtle,
  },
  pathCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.white,
  },
  pathCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  pathIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pathIconCircleActive: {
    backgroundColor: theme.colors.primary,
  },
  selectedIndicator: {},
  pathTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  pathDesc: {
    fontSize: 13,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: theme.colors.backgroundLight,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  tagPrimary: {
    backgroundColor: theme.colors.primary + '12',
    borderColor: theme.colors.primary + '30',
  },
  tagSecondary: {
    backgroundColor: theme.colors.accentGold + '15',
    borderColor: theme.colors.accentGold + '40',
  },
  tagText: {
    fontSize: 11,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  tagTextPrimary: {
    fontSize: 11,
    fontFamily: theme.fonts.body,
    color: theme.colors.primary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  tagTextSecondary: {
    fontSize: 11,
    fontFamily: theme.fonts.body,
    color: theme.colors.accentGold,
    fontWeight: '600',
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
    marginBottom: theme.spacing.md,
  },
  nextBtnText: {
    fontSize: 16,
    fontFamily: theme.fonts.button,
    color: theme.colors.white,
  },
  scholarModeText: {
    fontSize: 10,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 1,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  scholarTipCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  scholarTipTitle: {
    fontSize: 13,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  scholarTipText: {
    fontSize: 13,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});

export default DigitalQariStudyPathScreen;
