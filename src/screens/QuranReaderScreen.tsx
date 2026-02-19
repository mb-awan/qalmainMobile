import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme/colors';
import {
  fetchSurah,
  fetchJuz,
  SurahContent,
} from '../services/quranApi';

interface QuranReaderScreenProps {
  navigation: any;
  route?: any;
}

interface DisplayAyah {
  key: string;
  arabicText: string;
  englishText: string;
  numberInSurah: number;
  globalNumber: number;
  surahNumber?: number;
  surahName?: string;
  surahEnglishName?: string;
  isSurahHeader?: boolean;
  surahForHeader?: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
  };
}

const BOOKMARKS_KEY = 'bookmarkedAyahs';

const QuranReaderScreen = ({ navigation, route }: QuranReaderScreenProps) => {
  const surahNumber: number | undefined = route?.params?.surahNumber;
  const juzNumber: number | undefined = route?.params?.juzNumber;
  const screenTitle: string = route?.params?.title ?? 'Quran';

  const [ayahs, setAyahs] = useState<DisplayAyah[]>([]);
  const [surahMeta, setSurahMeta] = useState<Partial<SurahContent> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(true);
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<Set<number>>(new Set());
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const listRef = useRef<FlatList>(null);

  const FONT_SIZES = { sm: 32, md: 40, lg: 50 };

  useEffect(() => {
    loadBookmarks();
    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surahNumber, juzNumber]);

  const loadBookmarks = async () => {
    try {
      const stored = await AsyncStorage.getItem(BOOKMARKS_KEY);
      if (stored) {
        setBookmarkedAyahs(new Set(JSON.parse(stored)));
      }
    } catch {}
  };

  const toggleBookmark = useCallback(
    async (globalNumber: number) => {
      setBookmarkedAyahs(prev => {
        const next = new Set(prev);
        if (next.has(globalNumber)) {
          next.delete(globalNumber);
        } else {
          next.add(globalNumber);
        }
        AsyncStorage.setItem(
          BOOKMARKS_KEY,
          JSON.stringify(Array.from(next)),
        ).catch(() => {});
        return next;
      });
    },
    [],
  );

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);

      if (surahNumber) {
        const { arabic, english } = await fetchSurah(surahNumber);
        setSurahMeta(arabic);
        const items: DisplayAyah[] = arabic.ayahs.map((a, i) => ({
          key: `ayah-${a.number}`,
          arabicText: a.text,
          englishText: english.ayahs[i]?.text ?? '',
          numberInSurah: a.numberInSurah,
          globalNumber: a.number,
        }));
        setAyahs(items);
      } else if (juzNumber) {
        const { arabic, english } = await fetchJuz(juzNumber);
        const engMap = new Map<number, string>();
        english.ayahs.forEach(a => engMap.set(a.number, a.text));

        // Group by surah and insert surah-header rows
        const result: DisplayAyah[] = [];
        let lastSurahNum = -1;

        arabic.ayahs.forEach(a => {
          const currentSurah = a.surah?.number ?? 0;
          if (currentSurah !== lastSurahNum) {
            // Insert a surah header
            result.push({
              key: `header-${currentSurah}`,
              arabicText: '',
              englishText: '',
              numberInSurah: 0,
              globalNumber: 0,
              isSurahHeader: true,
              surahForHeader: a.surah as DisplayAyah['surahForHeader'],
            });
            lastSurahNum = currentSurah;
          }
          result.push({
            key: `ayah-${a.number}`,
            arabicText: a.text,
            englishText: engMap.get(a.number) ?? '',
            numberInSurah: a.numberInSurah,
            globalNumber: a.number,
            surahNumber: currentSurah,
            surahName: a.surah?.name,
            surahEnglishName: a.surah?.englishName,
          });
        });
        setAyahs(result);
        setSurahMeta(null);
      }
    } catch {
      setError('Failed to load Quran content.\nPlease check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const cycleFontSize = () => {
    setFontSize(prev => (prev === 'sm' ? 'md' : prev === 'md' ? 'lg' : 'sm'));
  };

  const renderSurahHeader = (item: DisplayAyah) => {
    const s = item.surahForHeader;
    if (!s) return null;
    const showBismillah = s.number !== 9 && s.number !== 1;
    return (
      <View style={styles.surahHeaderCard}>
        <View style={styles.surahHeaderTop}>
          <View style={styles.surahHeaderBadge}>
            <Text style={styles.surahHeaderBadgeText}>{s.number}</Text>
          </View>
          <View style={styles.surahHeaderInfo}>
            <Text style={styles.surahHeaderEnglish}>{s.englishName}</Text>
            <Text style={styles.surahHeaderMeta}>
              {s.englishNameTranslation} · {s.numberOfAyahs} Verses ·{' '}
              {s.revelationType}
            </Text>
          </View>
          <Text style={styles.surahHeaderArabic}>{s.name}</Text>
        </View>
        {showBismillah && (
          <Text style={styles.bismillah}>
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </Text>
        )}
      </View>
    );
  };

  const renderAyah = ({ item }: { item: DisplayAyah }) => {
    if (item.isSurahHeader) {
      return renderSurahHeader(item);
    }

    const isBookmarked = bookmarkedAyahs.has(item.globalNumber);

    return (
      <View style={styles.ayahCard}>
        {/* Arabic text + verse number */}
        <View style={styles.ayahRow}>
          <TouchableOpacity
            style={[styles.verseNumBadge, isBookmarked && styles.verseNumBadgeBookmarked]}
            onPress={() => toggleBookmark(item.globalNumber)}>
            <Text
              style={[
                styles.verseNumText,
                isBookmarked && styles.verseNumTextBookmarked,
              ]}>
              {item.numberInSurah}
            </Text>
          </TouchableOpacity>
          <Text
            style={[
              styles.arabicText,
              { fontSize: FONT_SIZES[fontSize] },
            ]}>
            {item.arabicText}
          </Text>
        </View>

        {/* Translation */}
        {showTranslation && item.englishText ? (
          <Text style={styles.translationText}>{item.englishText}</Text>
        ) : null}

        {/* Divider */}
        <View style={styles.ayahDivider} />
      </View>
    );
  };

  const renderHeader = () => {
    if (!surahMeta || juzNumber) return null;
    const showBismillah =
      surahMeta.number !== 9;
    return (
      <View style={styles.surahBanner}>
        <Text style={styles.surahBannerArabic}>{surahMeta.name}</Text>
        <Text style={styles.surahBannerMeta}>
          {surahMeta.englishNameTranslation} · {surahMeta.numberOfAyahs} Verses · {surahMeta.revelationType}
        </Text>
        {showBismillah && (
          <Text style={styles.bismillahBanner}>
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
      />

      {/* Top header bar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBtn}>
          <Icon name="arrow-back-ios-new" size={22} color={theme.colors.accentGold} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          {juzNumber ? (
            <Text style={styles.headerLabel}>
              {screenTitle.startsWith('Para') ? 'PARA' : 'JUZ'}{' '}
              {juzNumber}
            </Text>
          ) : (
            <Text style={styles.headerLabel}>SURAH {surahNumber}</Text>
          )}
          <Text style={styles.headerTitle} numberOfLines={1}>
            {screenTitle}
          </Text>
        </View>

        <View style={styles.headerActions}>
          {/* Font size cycle */}
          <TouchableOpacity style={styles.headerBtn} onPress={cycleFontSize}>
            <Icon name="format-size" size={22} color={theme.colors.accentGold} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading Arabic text…</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Icon name="wifi-off" size={52} color={theme.colors.textSecondary} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={loadContent}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={ayahs}
          renderItem={renderAyah}
          keyExtractor={item => item.key}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={15}
          windowSize={10}
        />
      )}

      {/* Bottom toolbar */}
      {!loading && !error && (
        <View style={styles.toolbar}>
          {/* Translation toggle */}
          <TouchableOpacity
            style={[styles.toolbarBtn, showTranslation && styles.toolbarBtnActive]}
            onPress={() => setShowTranslation(v => !v)}>
            <Icon
              name="translate"
              size={22}
              color={showTranslation ? theme.colors.white : theme.colors.textSecondary}
            />
            <Text
              style={[
                styles.toolbarLabel,
                showTranslation && styles.toolbarLabelActive,
              ]}>
              Translation
            </Text>
          </TouchableOpacity>

          {/* AI Qari */}
          <TouchableOpacity
            style={styles.micButton}
            onPress={() => navigation.navigate('AIQari')}>
            <View style={styles.micButtonInner}>
              <Icon name="mic" size={28} color={theme.colors.white} />
            </View>
            <View style={styles.aiBadge}>
              <Text style={styles.aiBadgeText}>AI</Text>
            </View>
          </TouchableOpacity>

          {/* Scroll to top */}
          <TouchableOpacity
            style={styles.toolbarBtn}
            onPress={() =>
              listRef.current?.scrollToOffset({ offset: 0, animated: true })
            }>
            <Icon name="vertical-align-top" size={22} color={theme.colors.textSecondary} />
            <Text style={styles.toolbarLabel}>Top</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFEF7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 3,
    borderBottomColor: '#145344',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  headerLabel: {
    fontSize: 10,
    fontFamily: theme.fonts.button,
    color: theme.colors.accentGold + 'CC',
    letterSpacing: 2,
    marginBottom: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.heading,
    color: theme.colors.accentGold,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 4,
  },
  surahBanner: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  surahBannerArabic: {
    fontSize: 30,
    fontFamily: theme.fonts.quran,
    color: theme.colors.accentGold,
    marginBottom: 6,
  },
  surahBannerMeta: {
    fontSize: 13,
    fontFamily: theme.fonts.body,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: theme.spacing.md,
  },
  bismillahBanner: {
    fontSize: 28,
    fontFamily: theme.fonts.quran,
    color: theme.colors.white,
    textAlign: 'center',
    lineHeight: 52,
    marginTop: theme.spacing.sm,
  },
  surahHeaderCard: {
    backgroundColor: theme.colors.highlight,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: 4,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  surahHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  surahHeaderBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  surahHeaderBadgeText: {
    fontSize: 13,
    fontFamily: theme.fonts.heading,
    color: theme.colors.white,
    fontWeight: '700',
  },
  surahHeaderInfo: {
    flex: 1,
  },
  surahHeaderEnglish: {
    fontSize: 15,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
  },
  surahHeaderMeta: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  surahHeaderArabic: {
    fontSize: 20,
    fontFamily: theme.fonts.quran,
    color: theme.colors.primary,
  },
  bismillah: {
    fontSize: 22,
    fontFamily: theme.fonts.quran,
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    lineHeight: 42,
  },
  listContent: {
    paddingBottom: 100,
  },
  ayahCard: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
  },
  ayahRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  verseNumBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: theme.colors.accentGold + '80',
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    marginLeft: theme.spacing.sm,
    flexShrink: 0,
  },
  verseNumBadgeBookmarked: {
    backgroundColor: theme.colors.accentGold,
    borderColor: theme.colors.accentGold,
  },
  verseNumText: {
    fontSize: 12,
    fontFamily: theme.fonts.heading,
    color: theme.colors.accentGold,
    fontWeight: '700',
  },
  verseNumTextBookmarked: {
    color: theme.colors.white,
  },
  arabicText: {
    flex: 1,
    fontFamily: theme.fonts.quran,
    color: '#101917',
    textAlign: 'right',
    lineHeight: 72,
    writingDirection: 'rtl',
  },
  translationText: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    lineHeight: 22,
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: theme.colors.primary + '40',
    marginLeft: theme.spacing.sm,
  },
  ayahDivider: {
    height: 1,
    backgroundColor: theme.colors.borderSubtle,
    marginTop: theme.spacing.md,
    marginHorizontal: theme.spacing.sm,
  },
  toolbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  toolbarBtn: {
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  toolbarBtnActive: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
  },
  toolbarLabel: {
    fontSize: 10,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  toolbarLabelActive: {
    color: theme.colors.white,
  },
  micButton: {
    width: 56,
    height: 56,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.white,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  aiBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.accentGold,
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  errorText: {
    marginTop: theme.spacing.md,
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryBtn: {
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
  },
  retryText: {
    fontSize: 14,
    fontFamily: theme.fonts.button,
    color: theme.colors.white,
  },
});

export default QuranReaderScreen;
