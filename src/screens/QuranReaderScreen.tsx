import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme} from '../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QuranReaderScreen = ({navigation}: any) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLandscape, setIsLandscape] = useState(false);
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<number[]>([]);

  useEffect(() => {
    const orientationHandler = (orientation: string) => {
      setIsLandscape(orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT');
    };

    Orientation.addOrientationListener(orientationHandler);

    loadLastReadPosition();
    loadBookmarks();

    return () => {
      Orientation.removeOrientationListener(orientationHandler);
    };
  }, []);

  const loadLastReadPosition = async () => {
    try {
      const lastPage = await AsyncStorage.getItem('lastReadPage');
      if (lastPage) {
        setCurrentPage(parseInt(lastPage, 10));
      }
    } catch (error) {
      console.error('Error loading last read position:', error);
    }
  };

  const saveLastReadPosition = async (page: number) => {
    try {
      await AsyncStorage.setItem('lastReadPage', page.toString());
    } catch (error) {
      console.error('Error saving last read position:', error);
    }
  };

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

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= 604) {
      // 604 pages in standard Quran
      setCurrentPage(newPage);
      saveLastReadPosition(newPage);
    }
  };

  // Mock Quran data - In production, this would come from API or local database
  const renderAyahs = () => {
    const ayahs = [];
    const ayahsPerPage = isLandscape ? 20 : 15;
    
    for (let i = 1; i <= ayahsPerPage; i++) {
      const ayahNumber = (currentPage - 1) * ayahsPerPage + i;
      const isBookmarked = bookmarkedAyahs.includes(ayahNumber);
      
      ayahs.push(
        <View
          key={ayahNumber}
          style={[
            styles.ayahContainer,
            isBookmarked && styles.bookmarkedAyah,
          ]}>
          <Text style={styles.ayahNumber}>{ayahNumber}</Text>
          <Text style={styles.ayahText}>
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </Text>
          <TouchableOpacity
            style={styles.bookmarkIcon}
            onPress={() => toggleBookmark(ayahNumber)}>
            <Icon
              name={isBookmarked ? 'bookmark' : 'bookmark-border'}
              size={20}
              color={isBookmarked ? theme.colors.secondary : theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      );
    }
    return ayahs;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Para 1 | Al-Fatiha | Page {currentPage}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}>
        {renderAyahs()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}>
          <Icon
            name="chevron-left"
            size={24}
            color={currentPage === 1 ? theme.colors.textSecondary : theme.colors.primary}
          />
        </TouchableOpacity>

        <View style={styles.pageInfo}>
          <Text style={styles.pageText}>{currentPage} / 604</Text>
        </View>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === 604}>
          <Icon
            name="chevron-right"
            size={24}
            color={currentPage === 604 ? theme.colors.textSecondary : theme.colors.primary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.aiButton}
          onPress={() => navigation.navigate('AIQari')}>
          <Icon name="mic" size={24} color={theme.colors.white} />
        </TouchableOpacity>
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
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontFamily: theme.fonts.heading,
    color: theme.colors.white,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  ayahContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
  },
  bookmarkedAyah: {
    backgroundColor: theme.colors.highlight,
  },
  ayahNumber: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.secondary,
    marginRight: theme.spacing.sm,
    minWidth: 30,
  },
  ayahText: {
    flex: 1,
    fontSize: 24,
    fontFamily: theme.fonts.quran,
    color: theme.colors.textPrimary,
    textAlign: 'right',
    lineHeight: 40,
  },
  bookmarkIcon: {
    marginLeft: theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.highlight,
  },
  navButton: {
    padding: theme.spacing.sm,
  },
  pageInfo: {
    flex: 1,
    alignItems: 'center',
  },
  pageText: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
  },
  aiButton: {
    backgroundColor: theme.colors.warning,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    marginLeft: theme.spacing.sm,
  },
});

export default QuranReaderScreen;


