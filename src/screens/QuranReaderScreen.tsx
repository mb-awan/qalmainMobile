import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme} from '../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

interface QuranReaderScreenProps {
  navigation: any;
  route?: any;
}

const QuranReaderScreen = ({navigation, route}: QuranReaderScreenProps) => {
  const [currentAyah, setCurrentAyah] = useState(1);
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const bookmarks = await AsyncStorage.getItem('bookmarkedAyahs');
      if (bookmarks) {
        setBookmarkedAyahs(JSON.parse(bookmarks));
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const toggleBookmark = async (ayahNumber: number) => {
    try {
      let updated = [...bookmarkedAyahs];
      if (updated.includes(ayahNumber)) {
        updated = updated.filter(id => id !== ayahNumber);
      } else {
        updated.push(ayahNumber);
      }
      setBookmarkedAyahs(updated);
      await AsyncStorage.setItem('bookmarkedAyahs', JSON.stringify(updated));
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  // Mock Surah Al-Fatiha data
  const ayahs = [
    {
      number: 1,
      arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      translation: 'All praise is due to Allah, Lord of the worlds.',
      isHighlighted: true,
    },
    {
      number: 2,
      arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
      translation: '',
      isHighlighted: false,
    },
    {
      number: 3,
      arabic: 'مَالِكِ يَوْمِ الدِّينِ',
      translation: '',
      isHighlighted: false,
    },
    {
      number: 4,
      arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
      translation: '',
      isHighlighted: false,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}>
          <Icon name="arrow-back-ios-new" size={24} color={theme.colors.accentGold} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerPara}>Para 1</Text>
          <Text style={styles.headerTitle}>Surah Al-Fatiha</Text>
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="settings" size={24} color={theme.colors.accentGold} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        {/* Bismillah */}
        <Text style={styles.bismillah}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </Text>

        {/* Ayahs */}
        {ayahs.map((ayah, index) => (
          <View
            key={ayah.number}
            style={[
              styles.ayahWrapper,
              ayah.isHighlighted && styles.ayahHighlighted,
            ]}>
            <View style={styles.ayahContainer}>
              <Text style={styles.ayahText}>{ayah.arabic}</Text>
              <View style={styles.ayahNumberBadge}>
                <Text style={styles.ayahNumberText}>
                  {ayah.number.toLocaleString('ar-EG')}
                </Text>
              </View>
            </View>
            {ayah.translation && (
              <Text style={styles.translation}>{ayah.translation}</Text>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.controlButton}>
          <Icon name="edit-note" size={28} color={theme.colors.accentGold} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.micButton}
          onPress={() => navigation.navigate('AIQari')}>
          <View style={styles.micButtonInner}>
            <Icon name="mic" size={32} color={theme.colors.white} />
          </View>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>AI</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setIsPaused(!isPaused)}>
          <Icon
            name={isPaused ? 'play-circle' : 'pause-circle'}
            size={32}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>
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
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    borderBottomWidth: 4,
    borderBottomColor: '#145344',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerPara: {
    fontSize: 10,
    fontFamily: theme.fonts.button,
    color: theme.colors.accentGold + 'CC',
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    color: theme.colors.accentGold,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.xl,
    paddingBottom: 100,
  },
  bismillah: {
    fontSize: 36,
    fontFamily: theme.fonts.quran,
    color: theme.colors.primary + 'E6',
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 64,
  },
  ayahWrapper: {
    marginBottom: theme.spacing.lg,
  },
  ayahHighlighted: {
    backgroundColor: theme.colors.accentGold + '26',
    borderRadius: 12,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.sm,
  },
  ayahContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing.sm,
  },
  ayahText: {
    flex: 1,
    fontSize: 40,
    fontFamily: theme.fonts.quran,
    color: '#101917',
    textAlign: 'right',
    lineHeight: 72,
  },
  ayahNumberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.accentGold + '66',
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  ayahNumberText: {
    fontSize: 18,
    fontFamily: theme.fonts.quran,
    color: theme.colors.accentGold,
    fontWeight: 'bold',
  },
  translation: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.primary + '99',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.xl,
  },
  controlButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    width: 64,
    height: 64,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: theme.colors.white,
    shadowColor: theme.colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  aiBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: theme.colors.accentGold,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: theme.colors.white,
  },
  aiBadgeText: {
    fontSize: 8,
    fontFamily: theme.fonts.button,
    color: theme.colors.primary,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});

export default QuranReaderScreen;
