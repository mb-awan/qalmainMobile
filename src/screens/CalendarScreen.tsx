import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import moment from 'moment-hijri';
import { theme } from '../theme/colors';

const CalendarScreen = () => {
  const [selectedDate] = useState(new Date());
  const hijriDate = moment(selectedDate);

  const islamicEvents = [
    { date: '1 Muharram', name: 'Islamic New Year', icon: '🌙' },
    { date: '10 Muharram', name: 'Ashura', icon: '🕯️' },
    { date: '12 Rabi al-Awwal', name: 'Eid Milad un Nabi', icon: '✨' },
    { date: '27 Rajab', name: 'Isra and Mi\'raj', icon: '🕌' },
    { date: '1 Ramadan', name: 'Ramadan Begins', icon: '🌙' },
    { date: '27 Ramadan', name: 'Laylat al-Qadr', icon: '⭐' },
    { date: '1 Shawwal', name: 'Eid al-Fitr', icon: '🎉' },
    { date: '10 Dhu al-Hijjah', name: 'Eid al-Adha', icon: '🐑' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📅 Islamic Calendar</Text>
        <Text style={styles.headerSubtitle}>
          {hijriDate.iDate()} {hijriDate.format('iMMMM')} {hijriDate.iYear()} AH
        </Text>
        <Text style={styles.gregorianDate}>
          {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      <View style={styles.eventsSection}>
        <Text style={styles.sectionTitle}>Upcoming Islamic Events</Text>
        {islamicEvents.map((event, index) => (
          <View key={index} style={styles.eventCard}>
            <Text style={styles.eventIcon}>{event.icon}</Text>
            <View style={styles.eventInfo}>
              <Text style={styles.eventName}>{event.name}</Text>
              <Text style={styles.eventDate}>{event.date}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  headerSubtitle: {
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    color: theme.colors.secondary,
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
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventIcon: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 18,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  eventDate: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
});

export default CalendarScreen;


