import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {theme} from '../theme/colors';

const ParaListScreen = ({navigation}: any) => {
  const paras = Array.from({length: 30}, (_, i) => ({
    id: i + 1,
    name: `Para ${i + 1}`,
    surah: getSurahName(i + 1),
  }));

  function getSurahName(para: number): string {
    // Simplified - in production, this would map to actual surah names
    const surahNames: {[key: number]: string} = {
      1: 'Al-Fatiha',
      2: 'Al-Baqarah',
      3: 'Ali Imran',
      // Add more mappings as needed
    };
    return surahNames[para] || `Surah ${para}`;
  }

  const renderParaItem = ({item}: {item: any}) => (
    <TouchableOpacity
      style={styles.paraCard}
      onPress={() => {
        navigation.navigate('Quran', {para: item.id});
      }}>
      <View style={styles.paraNumber}>
        <Text style={styles.paraNumberText}>{item.id}</Text>
      </View>
      <View style={styles.paraInfo}>
        <Text style={styles.paraName}>{item.name}</Text>
        <Text style={styles.paraSurah}>{item.surah}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Select Para / Sipara</Text>
      </View>

      <FlatList
        data={paras}
        renderItem={renderParaItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
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
  },
  listContainer: {
    padding: theme.spacing.md,
  },
  paraCard: {
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
  paraNumber: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  paraNumberText: {
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    color: theme.colors.white,
  },
  paraInfo: {
    flex: 1,
  },
  paraName: {
    fontSize: 18,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  paraSurah: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  chevron: {
    fontSize: 24,
    color: theme.colors.textSecondary,
  },
});

export default ParaListScreen;


