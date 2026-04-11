import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../theme/colors';

const DigitalQariIntroScreen = ({ navigation }: any) => {
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
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroImagePlaceholder}>
            <Icon name="computer" size={56} color={theme.colors.white + '80'} />
            <Icon name="local-florist" size={32} color={theme.colors.white + '60'} style={styles.plantIcon} />
          </View>
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Al Qari Mode</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>
          Practice Quran recitation with AI guidance. Our advanced neural engine analyzes your Tajweed in real-time.
        </Text>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>AVG SCORE</Text>
            <Text style={styles.statValue}>92%</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>AI PRECISION</Text>
            <Text style={[styles.statValue, styles.statValueGreen]}>High</Text>
          </View>
        </View>

        {/* Last Session */}
        <View style={styles.lastSessionSection}>
          <Text style={styles.lastSessionLabel}>LAST SESSION</Text>
          <View style={styles.lastSessionCard}>
            <View style={styles.lastSessionIcon}>
              <Icon name="menu-book" size={18} color={theme.colors.white} />
            </View>
            <View style={styles.lastSessionInfo}>
              <Text style={styles.lastSessionName}>Surah Al-Baqarah</Text>
              <Text style={styles.lastSessionSub}>Quran</Text>
            </View>
            <View style={styles.lastSessionScore}>
              <Text style={styles.lastSessionScoreText}>85%</Text>
            </View>
          </View>
        </View>

        {/* Start Setup Button */}
        <TouchableOpacity
          style={styles.startBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('DigitalQariFocus')}>
          <Text style={styles.startBtnText}>Start Setup</Text>
          <Icon name="chevron-right" size={20} color={theme.colors.white} />
        </TouchableOpacity>

        {/* Bottom Tab Bar (static/decorative) */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.bottomBarItem}>
            <Icon name="history" size={22} color={theme.colors.textSecondary} />
            <Text style={styles.bottomBarLabel}>HISTORY</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomBarCenter}>
            <Icon name="mic" size={26} color={theme.colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomBarItem}>
            <Icon name="grid-view" size={22} color={theme.colors.textSecondary} />
            <Text style={styles.bottomBarLabel}>SESSIONS</Text>
          </TouchableOpacity>
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
  heroCard: {
    marginTop: theme.spacing.md,
    borderRadius: 20,
    overflow: 'hidden',
    height: 180,
    backgroundColor: theme.colors.primary,
  },
  heroImagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: theme.spacing.xl,
    opacity: 0.5,
  },
  plantIcon: {
    marginLeft: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: theme.fonts.heading,
    color: theme.colors.white,
  },
  description: {
    marginTop: theme.spacing.md,
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    marginTop: theme.spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  statCard: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.borderSubtle,
    marginVertical: theme.spacing.sm,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
  },
  statValueGreen: {
    color: theme.colors.primary,
  },
  lastSessionSection: {
    marginTop: theme.spacing.md,
  },
  lastSessionLabel: {
    fontSize: 11,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },
  lastSessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 14,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  lastSessionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  lastSessionInfo: {
    flex: 1,
  },
  lastSessionName: {
    fontSize: 14,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
  },
  lastSessionSub: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  lastSessionScore: {
    backgroundColor: theme.colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  lastSessionScoreText: {
    fontSize: 14,
    fontFamily: theme.fonts.heading,
    color: theme.colors.primary,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 30,
    paddingVertical: 16,
    marginTop: theme.spacing.lg,
    gap: 6,
  },
  startBtnText: {
    fontSize: 16,
    fontFamily: theme.fonts.button,
    color: theme.colors.white,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
  },
  bottomBarItem: {
    alignItems: 'center',
    gap: 4,
  },
  bottomBarLabel: {
    fontSize: 10,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  bottomBarCenter: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DigitalQariIntroScreen;
