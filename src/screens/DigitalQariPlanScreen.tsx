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

type BillingCycle = 'monthly' | 'yearly';

const DigitalQariPlanScreen = ({ navigation }: any) => {
  const [billing, setBilling] = useState<BillingCycle>('monthly');

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
        {/* Title */}
        <Text style={styles.sectionLabel}>THE SCHOLAR'S PATH</Text>
        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.subtitle}>
          Elevate your recitation with AI-powered precision and traditional scholarly standards.
        </Text>

        {/* Advanced Tajweed Correction Card */}
        <View style={styles.featuredCard}>
          <View style={styles.featuredCardHeader}>
            <View style={styles.featuredIconCircle}>
              <Icon name="menu-book" size={20} color={theme.colors.white} />
            </View>
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedBadgeText}>RECOMMENDED</Text>
            </View>
          </View>
          <Text style={styles.featuredTitle}>Advanced Tajweed Correction</Text>
          <Text style={styles.featuredDesc}>
            Real-time phonetic analysis of Makhraj & Sifaat with database-error mapping.
          </Text>
          <View style={styles.scholarVerifiedRow}>
            <Icon name="verified" size={16} color={theme.colors.primary} />
            <Text style={styles.scholarVerifiedText}>SCHOLARLY VERIFIED</Text>
          </View>
        </View>

        {/* Voice Analysis + Basic AI Feedback Row */}
        <View style={styles.subCardsRow}>
          <View style={styles.subCard}>
            <Icon name="graphic-eq" size={20} color={theme.colors.primary} style={styles.subCardIcon} />
            <Text style={styles.subCardTitle}>Voice Analysis</Text>
            <Text style={styles.subCardDesc}>Tone & Pace tracking for recitation audits</Text>
          </View>
          <View style={styles.subCard}>
            <Icon name="auto-awesome" size={20} color={theme.colors.primary} style={styles.subCardIcon} />
            <Text style={styles.subCardTitle}>Basic AI Feedback</Text>
            <Text style={styles.subCardDesc}>Word-by-word matching</Text>
          </View>
        </View>

        {/* Billing Toggle */}
        <View style={styles.billingToggle}>
          <TouchableOpacity
            style={[styles.billingOption, billing === 'monthly' && styles.billingOptionActive]}
            onPress={() => setBilling('monthly')}
            activeOpacity={0.8}>
            <Text style={[styles.billingOptionText, billing === 'monthly' && styles.billingOptionTextActive]}>
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.billingOption, billing === 'yearly' && styles.billingOptionActive]}
            onPress={() => setBilling('yearly')}
            activeOpacity={0.8}>
            <Text style={[styles.billingOptionText, billing === 'yearly' && styles.billingOptionTextActive]}>
              Yearly (-20%)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Price */}
        <View style={styles.priceSection}>
          <Text style={styles.priceAmount}>
            {billing === 'monthly' ? '$12.99' : '$10.39'}
            <Text style={styles.priceUnit}> / month</Text>
          </Text>
          <Text style={styles.priceNote}>ALL PREMIUM FEATURES INCLUDED</Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('QuranTutor')}>
          <Text style={styles.continueBtnText}>Continue</Text>
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
  sectionLabel: {
    fontSize: 11,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
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
    lineHeight: 22,
    marginBottom: theme.spacing.lg,
  },
  featuredCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: theme.spacing.md,
    borderWidth: 1.5,
    borderColor: theme.colors.primary + '40',
    marginBottom: theme.spacing.sm,
  },
  featuredCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  featuredIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendedBadge: {
    backgroundColor: theme.colors.accentGold + '20',
    borderWidth: 1,
    borderColor: theme.colors.accentGold + '50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  recommendedBadgeText: {
    fontSize: 10,
    fontFamily: theme.fonts.body,
    color: theme.colors.accentGold,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  featuredTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  featuredDesc: {
    fontSize: 13,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  scholarVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scholarVerifiedText: {
    fontSize: 11,
    fontFamily: theme.fonts.body,
    color: theme.colors.primary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subCardsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  subCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  subCardIcon: {
    marginBottom: theme.spacing.sm,
  },
  subCardTitle: {
    fontSize: 13,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  subCardDesc: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  billingToggle: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: 30,
    padding: 4,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    marginBottom: theme.spacing.md,
  },
  billingOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 26,
    alignItems: 'center',
  },
  billingOptionActive: {
    backgroundColor: theme.colors.primary,
  },
  billingOptionText: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  billingOptionTextActive: {
    color: theme.colors.white,
  },
  priceSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  priceAmount: {
    fontSize: 36,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
  },
  priceUnit: {
    fontSize: 18,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  priceNote: {
    fontSize: 11,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    marginTop: 4,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 30,
    paddingVertical: 16,
    gap: 8,
  },
  continueBtnText: {
    fontSize: 16,
    fontFamily: theme.fonts.button,
    color: theme.colors.white,
  },
});

export default DigitalQariPlanScreen;
