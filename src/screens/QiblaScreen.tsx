import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import CompassHeading from 'react-native-compass-heading';
import Geolocation from 'react-native-geolocation-service';
import { theme } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COMPASS_SIZE = SCREEN_WIDTH * 0.7;

// Mecca coordinates
const MECCA_LAT = 21.4225;
const MECCA_LNG = 39.8262;

const QiblaScreen = () => {
  const [heading, setHeading] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    CompassHeading.start(0, ({ heading: h }: { heading: number }) => {
      setHeading(h);
    });

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        const direction = calculateQiblaDirection(latitude, longitude);
        setQiblaDirection(direction);
      },
      error => {
        console.error('Error getting location:', error);
      },
    );

    return () => {
      CompassHeading.stop();
    };
  }, []);

  const calculateQiblaDirection = (lat: number, lng: number): number => {
    const lat1 = (lat * Math.PI) / 180;
    const lat2 = (MECCA_LAT * Math.PI) / 180;
    const deltaLng = ((MECCA_LNG - lng) * Math.PI) / 180;

    const y = Math.sin(deltaLng) * Math.cos(lat2);
    const x =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);

    let bearing = Math.atan2(y, x);
    bearing = (bearing * 180) / Math.PI;
    bearing = (bearing + 360) % 360;

    return bearing;
  };

  const getRotation = () => {
    return qiblaDirection - heading;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🧭 Qibla Direction</Text>
        {location && (
          <Text style={styles.headerSubtitle}>
            {qiblaDirection.toFixed(1)}° from North
          </Text>
        )}
      </View>

      <View style={styles.compassContainer}>
        <View style={styles.compass}>
          {/* Compass background */}
          <View style={styles.compassCircle}>
            {/* Qibla arrow */}
            <View
              style={[
                styles.qiblaArrow,
                {
                  transform: [{ rotate: `${getRotation()}deg` }],
                },
              ]}>
              <View style={styles.arrowHead} />
              <View style={styles.arrowLine} />
            </View>

            {/* Compass markers */}
            {[0, 90, 180, 270].map((angle, index) => (
              <View
                key={index}
                style={[
                  styles.compassMarker,
                  {
                    transform: [{ rotate: `${angle}deg` }],
                  },
                ]}>
                <Text style={styles.markerText}>
                  {angle === 0 ? 'N' : angle === 90 ? 'E' : angle === 180 ? 'S' : 'W'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Current Direction</Text>
          <Text style={styles.infoValue}>
            {location
              ? `${qiblaDirection.toFixed(1)}°`
              : 'Getting location...'}
          </Text>
        </View>
      </View>
    </View>
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
  compassContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  compass: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    marginBottom: theme.spacing.xl,
  },
  compassCircle: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    borderWidth: 4,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  qiblaArrow: {
    position: 'absolute',
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowHead: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 40,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: theme.colors.secondary,
    marginBottom: COMPASS_SIZE / 2 - 40,
  },
  arrowLine: {
    width: 4,
    height: COMPASS_SIZE / 2 - 20,
    backgroundColor: theme.colors.secondary,
    position: 'absolute',
    top: COMPASS_SIZE / 2,
  },
  compassMarker: {
    position: 'absolute',
    top: -20,
    left: COMPASS_SIZE / 2 - 10,
  },
  markerText: {
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  infoValue: {
    fontSize: 32,
    fontFamily: theme.fonts.heading,
    color: theme.colors.primary,
  },
});

export default QiblaScreen;


