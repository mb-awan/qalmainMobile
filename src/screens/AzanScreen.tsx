import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {theme} from '../theme/colors';

interface PrayerTime {
  name: string;
  time: string;
  icon: string;
}

const AzanScreen = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [azanEnabled, setAzanEnabled] = useState(true);
  const [silentMode, setSilentMode] = useState(false);
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (location) {
      fetchPrayerTimes();
    }
  }, [location]);

  const requestLocationPermission = async () => {
    try {
      const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (result === RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          position => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          error => {
            console.error('Error getting location:', error);
            // Use default location (Mecca) if permission denied
            setLocation({lat: 21.4225, lng: 39.8262});
          },
        );
      } else {
        // Use default location
        setLocation({lat: 21.4225, lng: 39.8262});
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLocation({lat: 21.4225, lng: 39.8262});
    }
  };

  const fetchPrayerTimes = async () => {
    // In production, this would call the backend API
    // For now, using mock data
    const mockPrayerTimes: PrayerTime[] = [
      {name: 'Fajr', time: '05:30 AM', icon: '🌅'},
      {name: 'Dhuhr', time: '12:15 PM', icon: '☀️'},
      {name: 'Asr', time: '03:45 PM', icon: '🌤️'},
      {name: 'Maghrib', time: '06:20 PM', icon: '🌆'},
      {name: 'Isha', time: '07:45 PM', icon: '🌙'},
    ];
    setPrayerTimes(mockPrayerTimes);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔔 Prayer Times</Text>
        <Text style={styles.headerSubtitle}>
          {location
            ? `Location: ${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}`
            : 'Getting location...'}
        </Text>
      </View>

      <View style={styles.settingsSection}>
        <View style={styles.settingRow}>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Enable Azan</Text>
            <Text style={styles.settingDescription}>
              Receive prayer time notifications
            </Text>
          </View>
          <Switch
            value={azanEnabled}
            onValueChange={setAzanEnabled}
            trackColor={{
              false: theme.colors.textSecondary,
              true: theme.colors.primary,
            }}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Silent Mode</Text>
            <Text style={styles.settingDescription}>
              Show notifications without sound
            </Text>
          </View>
          <Switch
            value={silentMode}
            onValueChange={setSilentMode}
            disabled={!azanEnabled}
            trackColor={{
              false: theme.colors.textSecondary,
              true: theme.colors.primary,
            }}
          />
        </View>
      </View>

      <View style={styles.prayerTimesSection}>
        <Text style={styles.sectionTitle}>Today's Prayer Times</Text>
        {prayerTimes.map((prayer, index) => (
          <View key={index} style={styles.prayerCard}>
            <Text style={styles.prayerIcon}>{prayer.icon}</Text>
            <View style={styles.prayerInfo}>
              <Text style={styles.prayerName}>{prayer.name}</Text>
              <Text style={styles.prayerTime}>{prayer.time}</Text>
            </View>
            {azanEnabled && (
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Active</Text>
              </View>
            )}
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
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.white,
    opacity: 0.9,
  },
  settingsSection: {
    backgroundColor: theme.colors.white,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.highlight,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  settingDescription: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  prayerTimesSection: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  prayerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  prayerIcon: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  prayerInfo: {
    flex: 1,
  },
  prayerName: {
    fontSize: 18,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  prayerTime: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  statusBadge: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.white,
  },
});

export default AzanScreen;


