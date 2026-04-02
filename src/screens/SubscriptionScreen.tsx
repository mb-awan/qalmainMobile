import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme} from '../theme/colors';

interface SubscriptionScreenProps {
  navigation: any;
}

const SubscriptionScreen = ({navigation}: SubscriptionScreenProps) => {
  const plans = [
    {
      id: 'free',
      title: 'FREE',
      price: '$0',
      period: '/month',
      features: ['Basic lessons', 'Limited recitations', 'Community access'],
      isCurrent: true,
      badge: null,
    },
    {
      id: 'basic',
      title: 'BASIC',
      price: '$9.99',
      period: '/month',
      features: ['Ad-free experience', 'AI pronunciation feedback', 'Offline mode'],
      isCurrent: false,
      badge: 'MOST POPULAR',
    },
    {
      id: 'pro',
      title: 'PRO',
      price: '$19.99',
      period: '/month',
      features: ['1-on-1 sessions', 'Advanced Tajweed analytics', 'Family sharing'],
      isCurrent: false,
      badge: null,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.mainTitle}>Choose Your Learning Plan</Text>
        <Text style={styles.subtitle}>
          Learn the Quran with focus, clarity, and consistency
        </Text>

          {plans.map(plan => (
            <View
              key={plan.id}
              style={[
                styles.planCard,
                plan.badge && styles.planCardHighlighted,
              ]}>
              {plan.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{plan.badge}</Text>
                </View>
              )}
              {plan.badge && <View style={styles.badgeSpacer} />}

            <Text style={styles.planTitle}>{plan.title}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{plan.price}</Text>
              <Text style={styles.period}>{plan.period}</Text>
            </View>

            <View style={styles.featuresList}>
              {plan.features.map((feature, idx) => (
                <View key={idx} style={styles.featureRow}>
                  <Icon name="check-circle" size={20} color={theme.colors.success} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.planButton,
                plan.isCurrent && styles.currentPlanButton,
              ]}>
              <Text
                style={[
                  styles.planButtonText,
                  plan.isCurrent && styles.currentPlanButtonText,
                ]}>
                {plan.isCurrent ? 'Current Plan' : `Get ${plan.title}`}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity>
          <Text style={styles.footerLink}>Restore Purchase</Text>
        </TouchableOpacity>
        <Text style={styles.footerSeparator}> • </Text>
        <TouchableOpacity>
          <Text style={styles.footerLink}>Terms of Service</Text>
        </TouchableOpacity>
        <Text style={styles.footerSeparator}> • </Text>
        <TouchableOpacity>
          <Text style={styles.footerLink}>Privacy Policy</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 24,
  },
  badgeSpacer: {
    height: 8,
  },
  content: {
    padding: theme.spacing.xl,
  },
  mainTitle: {
    fontSize: 28,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  planCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  planCardHighlighted: {
    borderWidth: 2,
    borderColor: theme.colors.accentGold,
    shadowColor: theme.colors.accentGold,
    shadowOpacity: 0.3,
    transform: [{scale: 1.02}],
  },
  badge: {
    position: 'absolute',
    top: -12,
    left: '50%',
    marginLeft: -60,
    backgroundColor: theme.colors.accentGold,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeText: {
    color: theme.colors.white,
    fontSize: 11,
    fontFamily: theme.fonts.button,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  planTitle: {
    fontSize: 12,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.lg,
  },
  price: {
    fontSize: 32,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  period: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  featuresList: {
    marginBottom: theme.spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  featureText: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.sm,
  },
  planButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  currentPlanButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  planButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontFamily: theme.fonts.button,
    fontWeight: '600',
  },
  currentPlanButtonText: {
    color: theme.colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    flexWrap: 'wrap',
  },
  footerLink: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  footerSeparator: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});

export default SubscriptionScreen;
