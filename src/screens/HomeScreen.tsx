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

const HomeScreen = ({navigation}: any) => {
  const menuItems = [
    {
      id: 1,
      title: 'Read Quran',
      icon: 'menu-book',
      screen: 'Quran',
      color: theme.colors.primary,
    },
    {
      id: 2,
      title: 'Sipara / Para',
      icon: 'book',
      screen: 'ParaList',
      color: theme.colors.secondary,
    },
    {
      id: 3,
      title: 'AI Qari Mode',
      icon: 'mic',
      screen: 'AIQari',
      color: theme.colors.warning,
    },
    {
      id: 4,
      title: 'Islamic Lessons',
      icon: 'school',
      screen: 'IslamicLessons',
      color: theme.colors.primary,
    },
  ];

  const quickAccess = [
    {
      id: 1,
      title: 'Qibla',
      icon: 'explore',
      screen: 'Qibla',
      color: theme.colors.secondary,
    },
    {
      id: 2,
      title: 'Azan',
      icon: 'notifications',
      screen: 'Azan',
      color: theme.colors.primary,
    },
    {
      id: 3,
      title: 'Calendar',
      icon: 'calendar-today',
      screen: 'More',
      color: theme.colors.secondary,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>☪ Quran Majeed App</Text>
        <Text style={styles.headerSubtitle}>
          Digital Qari for Kids
        </Text>
      </View>

      <View style={styles.menuSection}>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[styles.menuCard, {borderLeftColor: item.color}]}
            onPress={() => navigation.navigate(item.screen)}>
            <View style={[styles.iconContainer, {backgroundColor: item.color}]}>
              <Icon name={item.icon} size={28} color={theme.colors.white} />
            </View>
            <Text style={styles.menuText}>{item.title}</Text>
            <Icon
              name="chevron-right"
              size={24}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.quickAccessSection}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.quickAccessGrid}>
          {quickAccess.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.quickAccessCard}
              onPress={() => navigation.navigate(item.screen)}>
              <View
                style={[
                  styles.quickIconContainer,
                  {backgroundColor: item.color},
                ]}>
                <Icon name={item.icon} size={32} color={theme.colors.white} />
              </View>
              <Text style={styles.quickAccessText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    fontSize: 28,
    fontFamily: theme.fonts.heading,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.white,
    opacity: 0.9,
  },
  menuSection: {
    padding: theme.spacing.md,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  menuText: {
    flex: 1,
    fontSize: 18,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
  },
  quickAccessSection: {
    padding: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  quickAccessCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    width: '30%',
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickIconContainer: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  quickAccessText: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
});

export default HomeScreen;


