import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme} from '../theme/colors';

interface IslamicEvent {
  date: string;
  hijriDate: string;
  name: string;
  icon: string;
  isToday?: boolean;
}

const CalendarScreen = () => {
  const [selectedDate] = useState(new Date());
  const [hijriDate, setHijriDate] = useState('');
  const [gregorianDate, setGregorianDate] = useState('');

  useEffect(() => {
    updateDates();
  }, []);

  const updateDates = () => {
    const today = new Date();
    const gregorian = today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setGregorianDate(gregorian);

    // Simplified Hijri date calculation
    // In production, use a proper library like moment-hijri or hijri-date
    const hijriMonths = [
      'Muharram',
      'Safar',
      "Rabi' al-Awwal",
      "Rabi' al-Thani",
      'Jumada al-Ula',
      'Jumada al-Thani',
      'Rajab',
      "Sha'ban",
      'Ramadan',
      'Shawwal',
      "Dhu al-Qi'dah",
      "Dhu al-Hijjah",
    ];
    // Mock calculation - replace with actual Hijri conversion
    const hijriDay = 15;
    const hijriMonth = hijriMonths[2];
    const hijriYear = 1445;
    setHijriDate(`${hijriDay} ${hijriMonth} ${hijriYear} AH`);
  };

  const islamicEvents: IslamicEvent[] = [
    {
      date: '2024-01-01',
      hijriDate: '1 Muharram',
      name: 'Islamic New Year',
      icon: '🌙',
    },
    {
      date: '2024-01-10',
      hijriDate: '10 Muharram',
      name: 'Ashura',
      icon: '🕯️',
    },
    {
      date: '2024-02-12',
      hijriDate: "12 Rabi' al-Awwal",
      name: 'Eid Milad un Nabi',
      icon: '✨',
    },
    {
      date: '2024-03-27',
      hijriDate: '27 Rajab',
      name: "Isra and Mi'raj",
      icon: '🕌',
    },
    {
      date: '2024-04-01',
      hijriDate: '1 Ramadan',
      name: 'Ramadan Begins',
      icon: '🌙',
      isToday: true,
    },
    {
      date: '2024-04-27',
      hijriDate: '27 Ramadan',
      name: 'Laylat al-Qadr',
      icon: '⭐',
    },
    {
      date: '2024-05-01',
      hijriDate: '1 Shawwal',
      name: 'Eid al-Fitr',
      icon: '🎉',
    },
    {
      date: '2024-06-10',
      hijriDate: "10 Dhu al-Hijjah",
      name: 'Eid al-Adha',
      icon: '🐑',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Islamic Calendar</Text>
        <Text style={styles.hijriDate}>{hijriDate}</Text>
        <Text style={styles.gregorianDate}>{gregorianDate}</Text>
      </View>

      <View style={styles.eventsSection}>
        <Text style={styles.sectionTitle}>Upcoming Islamic Events</Text>
        {islamicEvents.map((event, index) => (
          <View
            key={index}
            style={[
              styles.eventCard,
              event.isToday && styles.eventCardToday,
            ]}>
            <View style={styles.eventIconContainer}>
              <Text style={styles.eventIcon}>{event.icon}</Text>
            </View>
            <View style={styles.eventInfo}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventName}>{event.name}</Text>
                {event.isToday && (
                  <View style={styles.todayBadge}>
                    <Text style={styles.todayBadgeText}>TODAY</Text>
                  </View>
                )}
              </View>
              <Text style={styles.eventDate}>{event.hijriDate}</Text>
            </View>
            <Icon name="chevron-right" size={24} color={theme.colors.textSecondary} />
          </View>
        ))}
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
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: theme.fonts.heading,
    color: theme.colors.white,
    marginBottom: theme.spacing.sm,
  },
  hijriDate: {
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    color: theme.colors.accentGold,
    marginBottom: theme.spacing.xs,
  },
  gregorianDate: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.white,
    opacity: 0.9,
  },
  eventsSection: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    fontWeight: 'bold',
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventCardToday: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '05',
  },
  eventIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  eventIcon: {
    fontSize: 32,
  },
  eventInfo: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  eventName: {
    fontSize: 18,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  todayBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  todayBadgeText: {
    fontSize: 10,
    fontFamily: theme.fonts.button,
    color: theme.colors.white,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  eventDate: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
});

export default CalendarScreen;
