import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../theme/colors';
import { userAPI } from '../services/api';

const HomeScreen = ({ navigation }: any) => {
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string; timeRemaining: string } | null>(null);
  const [userName, setUserName] = useState('Learner');

  useEffect(() => {
    loadNextPrayer();
    const interval = setInterval(() => {
      loadNextPrayer();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const loadUserProfile = useCallback(async () => {
    try {
      const { data } = await userAPI.getProfile();
      const u = data?.data?.user;
      if (u?.name) {
        setUserName(String(u.name));
      }
    } catch {
      setUserName('Learner');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUserProfile().catch(() => {});
    }, [loadUserProfile]),
  );

  const loadNextPrayer = async () => {
    try {
      // In production, calculate based on current time and prayer times
      // For now, using mock data
      const mockNextPrayer = {
        name: 'ASR',
        time: '03:45 PM',
        timeRemaining: '02:15',
      };
      setNextPrayer(mockNextPrayer);
    } catch (error) {
      console.error('Error loading next prayer:', error);
    }
  };

  const learningHubItems = [
    {
      id: 1,
      title: 'Read Quran',
      subtitle: 'Sipara & Surah',
      icon: 'menu-book',
      color: theme.colors.primary,
      screen: 'QuranIndex',
    },
    {
      id: 2,
      title: 'AI Recitation',
      subtitle: 'Voice Correction',
      icon: 'mic',
      color: theme.colors.accentGold,
      screen: 'AIQari',
    },
  ];

  const dailyTools = [
    { id: 1, title: 'Qibla', icon: 'explore', screen: 'Qibla' },
    { id: 2, title: 'Azan', icon: 'volume-up', screen: 'Azan' },
    { id: 3, title: 'Calendar', icon: 'calendar-today', screen: 'Calendar' },
  ];

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container}>
        {/* Header with Greeting */}
        <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Assalamu Alaikum</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}>
            <View style={styles.profileAvatar}>
              <Icon name="person" size={24} color={theme.colors.primary} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="notifications-none" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

        {/* Next Prayer Widget */}
        <View style={styles.prayerWidget}>
        <View style={styles.prayerWidgetContent}>
          <View style={styles.prayerWidgetLeft}>
            <Text style={styles.prayerLabel}>
              NEXT PRAYER: {nextPrayer?.name || 'ASR'}
            </Text>
            <Text style={styles.prayerTime}>
              {nextPrayer?.timeRemaining || '02:15'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.prayerIconContainer}
            onPress={() => navigation.navigate('Azan')}>
            <Icon name="schedule" size={32} color={theme.colors.accentGold} />
          </TouchableOpacity>
        </View>
      </View>

        {/* Learning Hub */}
        <View style={styles.section}>
        <Text style={styles.sectionTitle}>Learning Hub</Text>
        <View style={styles.learningHubGrid}>
          {learningHubItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.learningHubCard}
              onPress={() => navigation.navigate(item.screen)}>
              <View style={[styles.learningHubIcon, { backgroundColor: item.color + '10' }]}>
                <Icon name={item.icon} size={30} color={item.color} />
              </View>
              <Text style={styles.learningHubTitle}>{item.title}</Text>
              <Text style={styles.learningHubSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

        {/* Daily Tools */}
        <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Tools</Text>
        <View style={styles.dailyToolsRow}>
          {dailyTools.map(tool => (
            <TouchableOpacity
              key={tool.id}
              style={styles.dailyToolCard}
              onPress={() => navigation.navigate(tool.screen)}>
              <View style={styles.dailyToolIcon}>
                <Icon name={tool.icon} size={28} color={theme.colors.textPrimary} />
              </View>
              <Text style={styles.dailyToolText}>{tool.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

        {/* Last Read */}
        <View style={styles.section}>
        <TouchableOpacity
          style={styles.lastReadCard}
          onPress={() => navigation.navigate('Quran')}>
          <View style={styles.lastReadIcon}>
            <Icon name="history" size={24} color={theme.colors.textPrimary} />
          </View>
          <View style={styles.lastReadContent}>
            <Text style={styles.lastReadLabel}>LAST READ</Text>
            <Text style={styles.lastReadText}>Surah Al-Waqi'ah, Ayah 12</Text>
          </View>
          <Icon name="arrow-forward-ios" size={18} color={theme.colors.primary} />
        </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.tutorFab}
        onPress={() => navigation.navigate('DigitalQariIntro')}
        activeOpacity={0.9}>
        <Icon name="school" size={20} color={theme.colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xl,
    backgroundColor: theme.colors.white,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  userName: {
    fontSize: 30,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    alignItems: 'center',
  },
  profileButton: {
    marginRight: 0,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationButton: {
    padding: theme.spacing.xs,
  },
  prayerWidget: {
    margin: theme.spacing.md,
    borderRadius: 24,
    overflow: 'hidden',
  },
  prayerWidgetContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.xl,
    borderRadius: 24,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  prayerWidgetLeft: {
    flex: 1,
  },
  prayerLabel: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.accentGold,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
    letterSpacing: 1,
    opacity: 0.9,
  },
  prayerTime: {
    fontSize: 36,
    fontFamily: theme.fonts.heading,
    color: theme.colors.accentGold,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  prayerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  section: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
  },
  learningHubGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  learningHubCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md + 4,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  learningHubIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  learningHubTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  learningHubSubtitle: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  dailyToolsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  dailyToolCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  dailyToolIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.white + '80',
  },
  dailyToolText: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  lastReadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  lastReadIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  lastReadContent: {
    flex: 1,
  },
  lastReadLabel: {
    fontSize: 10,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  lastReadText: {
    fontSize: 14,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  tutorFab: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.xl,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
});

export default HomeScreen;
