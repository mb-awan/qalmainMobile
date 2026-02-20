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
import Sound from 'react-native-sound';
import { theme } from '../theme/colors';
import {
  fetchSurah,
  fetchJuz,
  SurahContent,
} from '../services/quranApi';

// AlQuran.cloud CDN — same ecosystem as api.alquran.cloud, completely free
// Format: https://cdn.islamic.network/quran/audio/128/{reciter}/{globalAyahNumber}.mp3
const AUDIO_BASE = 'https://cdn.islamic.network/quran/audio/128/ar.alafasy';

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
const FONT_SIZES = { sm: 32, md: 40, lg: 50 } as const;

const QuranReaderScreen = ({ navigation, route }: QuranReaderScreenProps) => {
  const surahNumber: number | undefined = route?.params?.surahNumber;
  const juzNumber: number | undefined = route?.params?.juzNumber;
  const screenTitle: string = route?.params?.title ?? 'Quran';

  // Content state
  const [ayahs, setAyahs] = useState<DisplayAyah[]>([]);
  const [surahMeta, setSurahMeta] = useState<Partial<SurahContent> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reader UI state
  const [showTranslation, setShowTranslation] = useState(true);
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<Set<number>>(new Set());
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  // Audio state
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBuffering, setAudioBuffering] = useState(false);

  // Refs
  const listRef = useRef<FlatList>(null);
  const soundRef = useRef<Sound | null>(null);
  const ayahsRef = useRef<DisplayAyah[]>([]);
  // playFnRef lets the play function call itself recursively without stale closures
  const playFnRef = useRef<((key: string) => void) | null>(null);

  // Keep ayahsRef fresh on every render
  ayahsRef.current = ayahs;

  // ─── Load content ────────────────────────────────────────────────────────────

  useEffect(() => {
    loadBookmarks();
    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surahNumber, juzNumber]);

  // Stop audio when navigating away
  useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', () => {
      releaseSound();
    });
    return unsub;
  }, [navigation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => releaseSound();
  }, []);

  const releaseSound = () => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.release();
      soundRef.current = null;
    }
  };

  const loadBookmarks = async () => {
    try {
      const stored = await AsyncStorage.getItem(BOOKMARKS_KEY);
      if (stored) {
        setBookmarkedAyahs(new Set(JSON.parse(stored)));
      }
    } catch {}
  };

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);
      stopAudio();

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

        const result: DisplayAyah[] = [];
        let lastSurahNum = -1;

        arabic.ayahs.forEach(a => {
          const currentSurah = a.surah?.number ?? 0;
          if (currentSurah !== lastSurahNum) {
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

  // ─── Audio ───────────────────────────────────────────────────────────────────

  const stopAudio = useCallback(() => {
    releaseSound();
    setPlayingKey(null);
    setIsPlaying(false);
    setAudioBuffering(false);
  }, []);

  // Core play function — exposed via ref so recursive calls always use fresh closure
  function playFromKey(startKey: string) {
    const all = ayahsRef.current;
    const item = all.find(a => a.key === startKey);

    if (!item || item.isSurahHeader || !item.globalNumber) {
      setPlayingKey(null);
      setIsPlaying(false);
      setAudioBuffering(false);
      return;
    }

    // Release previous before starting next
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.release();
      soundRef.current = null;
    }

    const url = `${AUDIO_BASE}/${item.globalNumber}.mp3`;

    setPlayingKey(startKey);
    setIsPlaying(true);
    setAudioBuffering(true);

    Sound.setCategory('Playback');

    // eslint-disable-next-line @typescript-eslint/no-shadow
    const sound = new Sound(url, '', (error: Error | null) => {
      setAudioBuffering(false);

      if (error) {
        setPlayingKey(null);
        setIsPlaying(false);
        return;
      }

      soundRef.current = sound;

      sound.play((success: boolean) => {
        soundRef.current = null;

        if (success) {
          // Auto-advance to the next real ayah
          const idx = all.findIndex(a => a.key === startKey);
          const next = all
            .slice(idx + 1)
            .find(a => !a.isSurahHeader && a.globalNumber > 0);

          if (next && playFnRef.current) {
            playFnRef.current(next.key);
          } else {
            setPlayingKey(null);
            setIsPlaying(false);
          }
        } else {
          setPlayingKey(null);
          setIsPlaying(false);
        }
      });
    });
  }

  // Keep the ref pointing to the latest closure on every render
  playFnRef.current = playFromKey;

  const handleAyahPress = (item: DisplayAyah) => {
    if (item.isSurahHeader || !item.globalNumber) return;
    // If this ayah is already playing, stop
    if (playingKey === item.key) {
      stopAudio();
    } else {
      playFromKey(item.key);
    }
  };

  // ─── Bookmarks ───────────────────────────────────────────────────────────────

  const toggleBookmark = useCallback(async (globalNumber: number) => {
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
  }, []);

  // ─── UI helpers ──────────────────────────────────────────────────────────────

  const cycleFontSize = () =>
    setFontSize(prev => (prev === 'sm' ? 'md' : prev === 'md' ? 'lg' : 'sm'));

  // ─── Render helpers ──────────────────────────────────────────────────────────

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
    if (item.isSurahHeader) return renderSurahHeader(item);

    const isBookmarked = bookmarkedAyahs.has(item.globalNumber);
    const isCurrentlyPlaying = playingKey === item.key;
    const isBufferingThis = isCurrentlyPlaying && audioBuffering;

    return (
      <TouchableOpacity
        style={[
          styles.ayahCard,
          isCurrentlyPlaying && styles.ayahCardPlaying,
        ]}
        onPress={() => handleAyahPress(item)}
        activeOpacity={0.75}>

        {/* Arabic row: verse badge on left, arabic text on right (RTL) */}
        <View style={styles.ayahRow}>
          {/* Verse number / bookmark / playing indicator */}
          <TouchableOpacity
            style={[
              styles.verseNumBadge,
              isBookmarked && !isCurrentlyPlaying && styles.verseNumBadgeBookmarked,
              isCurrentlyPlaying && styles.verseNumBadgePlaying,
            ]}
            onPress={() => toggleBookmark(item.globalNumber)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            {isBufferingThis ? (
              <ActivityIndicator size="small" color={theme.colors.white} />
            ) : isCurrentlyPlaying ? (
              <Icon name="volume-up" size={16} color={theme.colors.white} />
            ) : (
              <Text
                style={[
                  styles.verseNumText,
                  isBookmarked && styles.verseNumTextBookmarked,
                ]}>
                {item.numberInSurah}
              </Text>
            )}
          </TouchableOpacity>

          <Text
            style={[
              styles.arabicText,
              { fontSize: FONT_SIZES[fontSize] },
              isCurrentlyPlaying && styles.arabicTextPlaying,
            ]}>
            {item.arabicText}
          </Text>
        </View>

        {/* Translation */}
        {showTranslation && item.englishText ? (
          <Text style={styles.translationText}>{item.englishText}</Text>
        ) : null}

        {/* Play hint when not playing */}
        {!isCurrentlyPlaying && (
          <View style={styles.tapHint}>
            <Icon name="play-circle-outline" size={13} color={theme.colors.textSecondary + '60'} />
            <Text style={styles.tapHintText}>Tap to recite</Text>
          </View>
        )}

        <View style={styles.ayahDivider} />
      </TouchableOpacity>
    );
  };

  const renderListHeader = () => {
    if (!surahMeta || juzNumber) return null;
    const showBismillah = surahMeta.number !== 9;
    return (
      <View style={styles.surahBanner}>
        <Text style={styles.surahBannerArabic}>{surahMeta.name}</Text>
        <Text style={styles.surahBannerMeta}>
          {surahMeta.englishNameTranslation} · {surahMeta.numberOfAyahs} Verses ·{' '}
          {surahMeta.revelationType}
        </Text>
        {showBismillah && (
          <Text style={styles.bismillahBanner}>
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </Text>
        )}
      </View>
    );
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

      {/* ── Header ── */}
      <View style={styles.header}>
        {/* Back button — arrow-back is the correct MaterialIcons name */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBtn}>
          <Icon name="arrow-back" size={24} color={theme.colors.accentGold} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>
            {juzNumber
              ? screenTitle.startsWith('Para')
                ? `PARA ${juzNumber}`
                : `JUZ ${juzNumber}`
              : `SURAH ${surahNumber}`}
          </Text>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {screenTitle}
          </Text>
        </View>

        {/* Font size toggle */}
        <TouchableOpacity style={styles.headerBtn} onPress={cycleFontSize}>
          <Icon name="format-size" size={22} color={theme.colors.accentGold} />
        </TouchableOpacity>
      </View>

      {/* ── Content ── */}
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
          ListHeaderComponent={renderListHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={15}
          windowSize={10}
        />
      )}

      {/* ── Bottom toolbar ── */}
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
            <Text style={[styles.toolbarLabel, showTranslation && styles.toolbarLabelActive]}>
              Translation
            </Text>
          </TouchableOpacity>

          {/* AI Qari mic (centre) */}
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

          {/* Stop tilawat / Scroll-to-top */}
          {isPlaying ? (
            <TouchableOpacity
              style={[styles.toolbarBtn, styles.toolbarBtnStop]}
              onPress={stopAudio}>
              <Icon name="stop-circle" size={22} color={theme.colors.white} />
              <Text style={[styles.toolbarLabel, styles.toolbarLabelActive]}>
                Stop
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.toolbarBtn}
              onPress={() =>
                listRef.current?.scrollToOffset({ offset: 0, animated: true })
              }>
              <Icon
                name="vertical-align-top"
                size={22}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.toolbarLabel}>Top</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFEF7',
  },

  // Header
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

  // Surah banner (surah mode only)
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

  // Surah header cards (juz/para mode)
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
  surahHeaderInfo: { flex: 1 },
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

  // List
  listContent: {
    paddingBottom: 110,
  },

  // Ayah card
  ayahCard: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    backgroundColor: '#FFFEF7',
  },
  ayahCardPlaying: {
    backgroundColor: theme.colors.primary + '0D', // ~5% green tint
  },
  ayahRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },

  // Verse number badge
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
  verseNumBadgePlaying: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
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

  // Arabic text
  arabicText: {
    flex: 1,
    fontFamily: theme.fonts.quran,
    color: '#101917',
    textAlign: 'right',
    lineHeight: 72,
    writingDirection: 'rtl',
  },
  arabicTextPlaying: {
    color: theme.colors.primary,
  },

  // Translation
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

  // Tap hint
  tapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
    marginLeft: theme.spacing.sm,
  },
  tapHintText: {
    fontSize: 10,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary + '60',
  },

  // Divider
  ayahDivider: {
    height: 1,
    backgroundColor: theme.colors.borderSubtle,
    marginTop: theme.spacing.md,
    marginHorizontal: theme.spacing.sm,
  },

  // Bottom toolbar
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
  toolbarBtnStop: {
    backgroundColor: '#C0392B',
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

  // AI Qari mic button
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

  // States
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
