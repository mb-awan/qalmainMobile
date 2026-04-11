import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {theme} from '../theme/colors';
import {azanAPI} from '../services/api';

interface PrayerTime {
  name: string;
  time: string;
  icon: string;
  isNext?: boolean;
}

type CalculationMethod = 'hanafi' | 'shafi';

const formatTime12 = (raw: string): string => {
  const clean = raw.trim().split(/\s+/)[0];
  const [hStr, mPart] = clean.split(':');
  let h = parseInt(hStr, 10);
  const m = (mPart || '00').slice(0, 2).padStart(2, '0');
  if (Number.isNaN(h)) {
    return raw;
  }
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) {
    h = 12;
  }
  return `${h}:${m} ${ampm}`;
};

const AzanScreen = () => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [azanEnabled, setAzanEnabled] = useState(true);
  const [silentMode, setSilentMode] = useState(false);
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(
    null,
  );
  const [calculationMethod, setCalculationMethod] =
    useState<CalculationMethod>('hanafi');
  const [timesLoading, setTimesLoading] = useState(false);

  useEffect(() => {
    void loadSettings();
    void requestLocationPermission();
  }, []);

  useEffect(() => {
    if (!location) {
      return;
    }
    let cancelled = false;
    void (async () => {
      setTimesLoading(true);
      try {
        const {data} = await azanAPI.getPrayerTimes(
          location.lat,
          location.lng,
          undefined,
          calculationMethod,
        );
        if (cancelled) {
          return;
        }
        const t = data?.data?.times as
          | {
              fajr: string;
              dhuhr: string;
              asr: string;
              maghrib: string;
              isha: string;
            }
          | undefined;
        if (!t) {
          throw new Error('no times');
        }
        const list: PrayerTime[] = [
          {name: 'Fajr', time: formatTime12(t.fajr), icon: '🌅'},
          {name: 'Dhuhr', time: formatTime12(t.dhuhr), icon: '☀️'},
          {
            name: 'Asr',
            time: formatTime12(t.asr),
            icon: '🌤️',
            isNext: true,
          },
          {name: 'Maghrib', time: formatTime12(t.maghrib), icon: '🌆'},
          {name: 'Isha', time: formatTime12(t.isha), icon: '🌙'},
        ];
        setPrayerTimes(list);
      } catch {
        if (!cancelled) {
          setPrayerTimes(calculatePrayerTimes(calculationMethod));
        }
      } finally {
        if (!cancelled) {
          setTimesLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [location, calculationMethod]);

  const loadSettings = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        try {
          const {data} = await azanAPI.getSettings();
          const s = data?.data as
            | {
                enabled?: boolean;
                silentMode?: boolean;
                madhhab?: string;
              }
            | undefined;
          if (s) {
            setAzanEnabled(s.enabled !== false);
            setSilentMode(s.silentMode === true);
            if (s.madhhab === 'hanafi' || s.madhhab === 'shafi') {
              setCalculationMethod(s.madhhab);
              await AsyncStorage.setItem('prayerCalculationMethod', s.madhhab);
            }
            await AsyncStorage.setItem(
              'azanEnabled',
              String(s.enabled !== false),
            );
            await AsyncStorage.setItem(
              'azanSilentMode',
              String(s.silentMode === true),
            );
            return;
          }
        } catch {
          /* use local */
        }
      }

      const method = await AsyncStorage.getItem('prayerCalculationMethod');
      if (method === 'hanafi' || method === 'shafi') {
        setCalculationMethod(method);
      }
      const enabled = await AsyncStorage.getItem('azanEnabled');
      if (enabled !== null) {
        setAzanEnabled(enabled === 'true');
      }
      const silent = await AsyncStorage.getItem('azanSilentMode');
      if (silent !== null) {
        setSilentMode(silent === 'true');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveCalculationMethod = async (method: CalculationMethod) => {
    try {
      await AsyncStorage.setItem('prayerCalculationMethod', method);
      setCalculationMethod(method);
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        await azanAPI.updateSettings({madhhab: method});
      }
    } catch (error) {
      console.error('Error saving calculation method:', error);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
      const result = await request(permission);
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
            setLocation({lat: 21.4225, lng: 39.8262});
          },
        );
      } else {
        setLocation({lat: 21.4225, lng: 39.8262});
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLocation({lat: 21.4225, lng: 39.8262});
    }
  };

  const calculatePrayerTimes = (method: CalculationMethod): PrayerTime[] => {
    const times: PrayerTime[] = [
      {name: 'Fajr', time: '05:30 AM', icon: '🌅'},
      {name: 'Dhuhr', time: '12:15 PM', icon: '☀️'},
      {
        name: 'Asr',
        time: method === 'hanafi' ? '03:45 PM' : '03:30 PM',
        icon: '🌤️',
        isNext: true,
      },
      {name: 'Maghrib', time: '06:20 PM', icon: '🌆'},
      {name: 'Isha', time: '07:45 PM', icon: '🌙'},
    ];
    return times;
  };

  const onAzanEnabledChange = async (v: boolean) => {
    setAzanEnabled(v);
    try {
      await AsyncStorage.setItem('azanEnabled', String(v));
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        await azanAPI.updateSettings({enabled: v});
      }
    } catch (error) {
      console.error('Error saving azan enabled:', error);
    }
  };

  const onSilentModeChange = async (v: boolean) => {
    setSilentMode(v);
    try {
      await AsyncStorage.setItem('azanSilentMode', String(v));
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        await azanAPI.updateSettings({silentMode: v});
      }
    } catch (error) {
      console.error('Error saving silent mode:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Prayer Times</Text>
        {location && (
          <Text style={styles.headerSubtitle}>
            Location: {location.lat.toFixed(2)}, {location.lng.toFixed(2)}
          </Text>
        )}
      </View>

      <View style={styles.methodSection}>
        <Text style={styles.sectionTitle}>Calculation Method</Text>
        <View style={styles.methodButtons}>
          <TouchableOpacity
            style={[
              styles.methodButton,
              calculationMethod === 'hanafi' && styles.methodButtonActive,
            ]}
            onPress={() => saveCalculationMethod('hanafi')}>
            <Text
              style={[
                styles.methodButtonText,
                calculationMethod === 'hanafi' && styles.methodButtonTextActive,
              ]}>
              Hanafi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.methodButton,
              calculationMethod === 'shafi' && styles.methodButtonActive,
            ]}
            onPress={() => saveCalculationMethod('shafi')}>
            <Text
              style={[
                styles.methodButtonText,
                calculationMethod === 'shafi' && styles.methodButtonTextActive,
              ]}>
              Shafi
            </Text>
          </TouchableOpacity>
        </View>
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
            onValueChange={onAzanEnabledChange}
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
            onValueChange={onSilentModeChange}
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
        {timesLoading ? (
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={{marginVertical: theme.spacing.lg}}
          />
        ) : (
          prayerTimes.map((prayer, index) => (
            <View
              key={index}
              style={[
                styles.prayerCard,
                prayer.isNext && styles.prayerCardNext,
              ]}>
              <Text style={styles.prayerIcon}>{prayer.icon}</Text>
              <View style={styles.prayerInfo}>
                <View style={styles.prayerHeader}>
                  <Text style={styles.prayerName}>{prayer.name}</Text>
                  {prayer.isNext && (
                    <View style={styles.nextBadge}>
                      <Text style={styles.nextBadgeText}>NEXT</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.prayerTime}>{prayer.time}</Text>
              </View>
              {azanEnabled && (
                <View style={styles.statusBadge}>
                  <Icon
                    name="notifications-active"
                    size={20}
                    color={theme.colors.success}
                  />
                </View>
              )}
            </View>
          ))
        )}
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
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.white,
    opacity: 0.9,
  },
  methodSection: {
    backgroundColor: theme.colors.white,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    fontWeight: 'bold',
  },
  methodButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  methodButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.borderSubtle,
    alignItems: 'center',
  },
  methodButtonActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  methodButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  methodButtonTextActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  settingsSection: {
    backgroundColor: theme.colors.white,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSubtle,
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
  prayerCard: {
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
  prayerCardNext: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '05',
  },
  prayerIcon: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  prayerInfo: {
    flex: 1,
  },
  prayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  prayerName: {
    fontSize: 18,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  nextBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  nextBadgeText: {
    fontSize: 10,
    fontFamily: theme.fonts.button,
    color: theme.colors.white,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  prayerTime: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  statusBadge: {
    padding: theme.spacing.xs,
  },
});

export default AzanScreen;
