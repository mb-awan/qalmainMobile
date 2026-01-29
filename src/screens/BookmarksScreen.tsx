import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {theme} from '../theme/colors';

const BookmarksScreen = ({navigation}: any) => {
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      const bookmarkedAyahs = await AsyncStorage.getItem('bookmarkedAyahs');
      if (bookmarkedAyahs) {
        const ayahIds = JSON.parse(bookmarkedAyahs);
        // In production, fetch full ayah details from API
        const bookmarkList = ayahIds.map((id: number) => ({
          id,
          para: Math.ceil(id / 20),
          ayah: id,
          text: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ',
        }));
        setBookmarks(bookmarkList);
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  };

  const removeBookmark = async (ayahId: number) => {
    try {
      const bookmarkedAyahs = await AsyncStorage.getItem('bookmarkedAyahs');
      if (bookmarkedAyahs) {
        const ayahIds = JSON.parse(bookmarkedAyahs).filter(
          (id: number) => id !== ayahId,
        );
        await AsyncStorage.setItem('bookmarkedAyahs', JSON.stringify(ayahIds));
        loadBookmarks();
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const renderBookmarkItem = ({item}: {item: any}) => (
    <View style={styles.bookmarkCard}>
      <View style={styles.bookmarkContent}>
        <Text style={styles.paraText}>Para {item.para} – Ayah {item.ayah}</Text>
        <Text style={styles.ayahText}>{item.text}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Quran', {ayahId: item.id})}>
          <Icon name="arrow-forward" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => removeBookmark(item.id)}>
          <Icon name="delete" size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="bookmark" size={32} color={theme.colors.secondary} />
        <Text style={styles.headerTitle}>Your Bookmarks</Text>
      </View>

      {bookmarks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="bookmark-border" size={64} color={theme.colors.textSecondary} />
          <Text style={styles.emptyText}>No bookmarks yet</Text>
          <Text style={styles.emptySubtext}>
            Bookmark ayahs while reading to see them here
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          renderItem={renderBookmarkItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.highlight,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.sm,
  },
  listContainer: {
    padding: theme.spacing.md,
  },
  bookmarkCard: {
    flexDirection: 'row',
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
  bookmarkContent: {
    flex: 1,
  },
  paraText: {
    fontSize: 16,
    fontFamily: theme.fonts.heading,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  ayahText: {
    fontSize: 20,
    fontFamily: theme.fonts.quran,
    color: theme.colors.textPrimary,
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyText: {
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
});

export default BookmarksScreen;


