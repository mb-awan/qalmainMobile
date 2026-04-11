import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {theme} from '../theme/colors';
import {bookmarkAPI} from '../services/api';
import {fetchAyahArabic, fetchAyahByGlobalNumber} from '../services/quranApi';

type BookmarkRow = {
  key: string;
  surah: number;
  ayah: number;
  text: string;
  /** Set when data came from API (Mongo id) */
  serverId?: string;
};

const LOCAL_KEY = 'bookmarkedAyahs';

const BookmarksScreen = ({navigation}: any) => {
  const [bookmarks, setBookmarks] = useState<BookmarkRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookmarks = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        try {
          const {data} = await bookmarkAPI.getAll();
          const raw = data?.data?.bookmarks ?? [];
          const rows: BookmarkRow[] = [];
          for (const b of raw as {
            id: string;
            surah: number;
            ayah: number;
          }[]) {
            const text = await fetchAyahArabic(b.surah, b.ayah).catch(
              () => '…',
            );
            rows.push({
              key: b.id,
              surah: b.surah,
              ayah: b.ayah,
              text,
              serverId: b.id,
            });
          }
          setBookmarks(rows);
          return;
        } catch {
          /* fall through to local */
        }
      }

      const bookmarkedAyahs = await AsyncStorage.getItem(LOCAL_KEY);
      if (!bookmarkedAyahs) {
        setBookmarks([]);
        return;
      }
      const ayahIds: number[] = JSON.parse(bookmarkedAyahs);
      const rows: BookmarkRow[] = [];
      for (const globalNum of ayahIds) {
        try {
          const {text, surah, numberInSurah} =
            await fetchAyahByGlobalNumber(globalNum);
          rows.push({
            key: `local-${globalNum}`,
            surah,
            ayah: numberInSurah,
            text,
          });
        } catch {
          rows.push({
            key: `local-${globalNum}`,
            surah: 1,
            ayah: globalNum,
            text: '…',
          });
        }
      }
      setBookmarks(rows);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadBookmarks();
    }, [loadBookmarks]),
  );

  const removeBookmark = async (item: BookmarkRow) => {
    try {
      if (item.serverId) {
        await bookmarkAPI.remove(item.serverId);
        await loadBookmarks();
        return;
      }
      const bookmarkedAyahs = await AsyncStorage.getItem(LOCAL_KEY);
      if (bookmarkedAyahs) {
        const globalIds: number[] = JSON.parse(bookmarkedAyahs);
        const keyNum = parseInt(item.key.replace('local-', ''), 10);
        const next = globalIds.filter(id => id !== keyNum);
        await AsyncStorage.setItem(LOCAL_KEY, JSON.stringify(next));
        await loadBookmarks();
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const renderBookmarkItem = ({item}: {item: BookmarkRow}) => (
    <View style={styles.bookmarkCard}>
      <View style={styles.bookmarkContent}>
        <Text style={styles.paraText}>
          Surah {item.surah} · Ayah {item.ayah}
        </Text>
        <Text style={styles.ayahText}>{item.text}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate('Quran', {
              surahNumber: item.surah,
              title: `Surah ${item.surah}`,
            })
          }>
          <Icon name="arrow-forward" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => removeBookmark(item)}>
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

      {loading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : bookmarks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon
            name="bookmark-border"
            size={64}
            color={theme.colors.textSecondary}
          />
          <Text style={styles.emptyText}>No bookmarks yet</Text>
          <Text style={styles.emptySubtext}>
            Bookmark ayahs while reading to see them here
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          renderItem={renderBookmarkItem}
          keyExtractor={item => item.key}
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
