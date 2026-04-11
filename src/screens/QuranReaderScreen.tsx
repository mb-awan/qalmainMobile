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
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';
import Tts from 'react-native-tts';
import { theme } from '../theme/colors';
import {
  fetchSurah,
  fetchJuz,
  fetchGlobalAyahNumber,
  SurahContent,
  TranslationLang,
} from '../services/quranApi';
import { bookmarkAPI } from '../services/api';

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
  translationText: string;
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
// Larger, readable Arabic with clear diacritics (tashkeel)
const FONT_SIZES = { sm: 36, md: 44, lg: 56 } as const;
const ARABIC_LINE_HEIGHT_MULTIPLIER = 1.85;

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
  const [translationLang, setTranslationLang] = useState<TranslationLang>('en');
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<Set<number>>(new Set());
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  // Audio state
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBuffering, setAudioBuffering] = useState(false);

  // Playback refs
  const listRef = useRef<FlatList>(null);
  /** When using server bookmarks: global ayah number → Mongo bookmark id */
  const serverBookmarkIdsRef = useRef<Map<number, string>>(new Map());
  const soundRef = useRef<Sound | null>(null);
  const ayahsRef = useRef<DisplayAyah[]>([]);
  // Allows recursive auto-advance without stale closures
  const playFnRef = useRef<((key: string) => void) | null>(null);

  // Lookahead prefetch refs (one ayah buffered ahead)
  const nextSoundRef = useRef<Sound | null>(null);
  const nextKeyRef = useRef<string | null>(null);
  const nextReadyRef = useRef<boolean>(false);
  // Incremented whenever a prefetch is cancelled — callbacks compare against this
  const prefetchIdRef = useRef<number>(0);

  // Keep ayahsRef fresh on every render
  ayahsRef.current = ayahs;
  const showTranslationRef = useRef(showTranslation);
  const translationLangRef = useRef(translationLang);
  showTranslationRef.current = showTranslation;
  translationLangRef.current = translationLang;

  // ─── Lifecycle ────────────────────────────────────────────────────────────────

  useEffect(() => {
    loadBookmarks();
    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surahNumber, juzNumber, translationLang]);

  useEffect(() => {
    Tts.setDefaultRate(0.48);
    Tts.getInitStatus().catch(() => {});
  }, []);

  // Stop audio when navigating away
  useEffect(() => {
    const unsub = navigation.addListener('beforeRemove', releaseAll);
    return unsub;
  }, [navigation]);

  // Cleanup on unmount
  useEffect(() => () => releaseAll(), []);

  // Auto-scroll to the currently playing ayah so it stays in view
  useEffect(() => {
    if (!playingKey || !listRef.current) return;
    const index = ayahs.findIndex(a => a.key === playingKey);
    if (index >= 0) {
      const t = setTimeout(() => {
        try {
          listRef.current?.scrollToIndex({
            index,
            viewPosition: 0.25,
            animated: true,
          });
        } catch {
          // Fallback: scrollToOffset if index not yet laid out
          listRef.current?.scrollToOffset({
            offset: Math.max(0, index * 120),
            animated: true,
          });
        }
      }, 100);
      return () => clearTimeout(t);
    }
  }, [playingKey, ayahs]);

  // ─── Sound helpers ────────────────────────────────────────────────────────────

  /** Release everything — playing sound + any pending prefetch, and stop TTS. */
  const releaseAll = () => {
    try { Tts.stop(); } catch {}
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.release();
      soundRef.current = null;
    }
    prefetchIdRef.current += 1;
    nextKeyRef.current = null;
    nextReadyRef.current = false;
    if (nextSoundRef.current) {
      try { nextSoundRef.current.release(); } catch {}
      nextSoundRef.current = null;
    }
  };

  const stopAudio = useCallback(() => {
    releaseAll();
    setPlayingKey(null);
    setIsPlaying(false);
    setAudioBuffering(false);
  }, []);

  // ─── Lookahead prefetch ───────────────────────────────────────────────────────

  /**
   * Start buffering the ayah at `key` in the background so it is ready
   * to play instantly when the current ayah finishes.
   */
  function prefetchKey(key: string) {
    const item = ayahsRef.current.find(a => a.key === key);
    if (!item || item.isSurahHeader || !item.globalNumber) return;
    if (nextKeyRef.current === key) return; // already prefetching this one

    // Cancel any previous prefetch
    prefetchIdRef.current += 1;
    const myId = prefetchIdRef.current;
    nextKeyRef.current = key;
    nextReadyRef.current = false;
    if (nextSoundRef.current) {
      try { nextSoundRef.current.release(); } catch {}
      nextSoundRef.current = null;
    }

    const url = `${AUDIO_BASE}/${item.globalNumber}.mp3`;
    const sound = new Sound(url, '', (err: Error | null) => {
      // If a newer prefetch was started, discard this result without double-releasing
      if (prefetchIdRef.current !== myId) return;
      if (err) {
        nextSoundRef.current = null;
        nextKeyRef.current = null;
        nextReadyRef.current = false;
      } else {
        nextReadyRef.current = true;
      }
    });
    nextSoundRef.current = sound;
  }

  // ─── Playback ─────────────────────────────────────────────────────────────────

  function playFromKey(startKey: string) {
    const item = ayahsRef.current.find(a => a.key === startKey);
    if (!item || item.isSurahHeader || !item.globalNumber) {
      setPlayingKey(null);
      setIsPlaying(false);
      setAudioBuffering(false);
      return;
    }

    // Stop the currently-playing sound (leaves prefetch intact for reuse check below)
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.release();
      soundRef.current = null;
    }

    setPlayingKey(startKey);
    setIsPlaying(true);

    /** Returns the next playable ayah after startKey using a fresh ref read. */
    const findNext = (): DisplayAyah | null => {
      const all = ayahsRef.current;
      const idx = all.findIndex(a => a.key === startKey);
      return idx >= 0
        ? all.slice(idx + 1).find(a => !a.isSurahHeader && a.globalNumber > 0) ?? null
        : null;
    };

    /** Start playing a fully-loaded Sound instance. */
    const beginPlay = (sound: Sound) => {
      soundRef.current = sound;
      Sound.setCategory('Playback');
      setAudioBuffering(false);

      const next = findNext();
      if (next) prefetchKey(next.key);

      sound.play((success: boolean) => {
        soundRef.current = null;
        if (!success) {
          setPlayingKey(null);
          setIsPlaying(false);
          return;
        }
        const next2 = findNext();
        const showTrans = showTranslationRef.current;
        const transLang = translationLangRef.current;
        const textToSpeak = item.translationText?.trim();
        if (showTrans && textToSpeak && next2 && playFnRef.current) {
          const lang = transLang === 'ur' ? (Platform.OS === 'ios' ? 'ur-PK' : 'ur_PK') : 'en-US';
          Tts.setDefaultLanguage(lang).catch(() => {});
          const sub = Tts.addEventListener('finish', () => {
            sub.remove();
            playFnRef.current!(next2.key);
          });
          Tts.speak(textToSpeak);
        } else if (next2 && playFnRef.current) {
          playFnRef.current(next2.key);
        } else {
          setPlayingKey(null);
          setIsPlaying(false);
        }
      });
    };

    // ── Use prefetched sound if it's already buffered ──
    const prefetchReady =
      nextKeyRef.current === startKey &&
      nextSoundRef.current !== null &&
      nextReadyRef.current;

    if (prefetchReady) {
      const sound = nextSoundRef.current!;
      // Detach from prefetch slots
      prefetchIdRef.current += 1; // invalidate any stale callbacks
      nextSoundRef.current = null;
      nextKeyRef.current = null;
      nextReadyRef.current = false;
      beginPlay(sound); // instant — no buffering indicator
      return;
    }

    // ── Cancel any stale / in-flight prefetch for a different (or same) key ──
    prefetchIdRef.current += 1;
    nextKeyRef.current = null;
    nextReadyRef.current = false;
    if (nextSoundRef.current) {
      try { nextSoundRef.current.release(); } catch {}
      nextSoundRef.current = null;
    }

    // ── Load fresh ──
    setAudioBuffering(true);
    Sound.setCategory('Playback');
    const url = `${AUDIO_BASE}/${item.globalNumber}.mp3`;
    const sound = new Sound(url, '', (err: Error | null) => {
      if (err) {
        setPlayingKey(null);
        setIsPlaying(false);
        setAudioBuffering(false);
        return;
      }
      beginPlay(sound);
    });
  }

  // Keep ref pointing to latest closure so recursive auto-advance works
  playFnRef.current = playFromKey;

  const handleAyahPress = (item: DisplayAyah) => {
    if (item.isSurahHeader || !item.globalNumber) return;
    if (playingKey === item.key) {
      stopAudio();
    } else {
      playFromKey(item.key);
    }
  };

  // ─── Bookmarks ────────────────────────────────────────────────────────────────

  const toggleBookmark = useCallback(
    async (item: DisplayAyah, wasBookmarked: boolean) => {
      if (item.isSurahHeader || !item.globalNumber) return;
      const g = item.globalNumber;
      const surah = surahNumber ?? item.surahNumber;
      const ayahInSurah = item.numberInSurah;
      if (!surah || !ayahInSurah) return;

      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        try {
          if (wasBookmarked) {
            const sid = serverBookmarkIdsRef.current.get(g);
            if (sid) {
              await bookmarkAPI.remove(sid);
            }
            serverBookmarkIdsRef.current.delete(g);
          } else {
            const { data } = await bookmarkAPI.add({
              surah,
              ayah: ayahInSurah,
            });
            const id = data?.data?.bookmark?.id as string | undefined;
            if (id) {
              serverBookmarkIdsRef.current.set(g, id);
            }
          }
          setBookmarkedAyahs(prev => {
            const next = new Set(prev);
            if (wasBookmarked) {
              next.delete(g);
            } else {
              next.add(g);
            }
            return next;
          });
        } catch {
          /* keep UI unchanged */
        }
        return;
      }

      setBookmarkedAyahs(prev => {
        const next = new Set(prev);
        if (wasBookmarked) {
          next.delete(g);
        } else {
          next.add(g);
        }
        AsyncStorage.setItem(
          BOOKMARKS_KEY,
          JSON.stringify(Array.from(next)),
        ).catch(() => {});
        return next;
      });
    },
    [surahNumber],
  );

  // ─── Load content ─────────────────────────────────────────────────────────────

  const loadBookmarks = async () => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      try {
        const { data } = await bookmarkAPI.getAll();
        const list = data?.data?.bookmarks ?? [];
        const globalSet = new Set<number>();
        const idMap = new Map<number, string>();
        for (const b of list as {
          id: string;
          surah: number;
          ayah: number;
        }[]) {
          const gNum = await fetchGlobalAyahNumber(b.surah, b.ayah);
          globalSet.add(gNum);
          idMap.set(gNum, b.id);
        }
        serverBookmarkIdsRef.current = idMap;
        setBookmarkedAyahs(globalSet);
        return;
      } catch {
        serverBookmarkIdsRef.current = new Map();
      }
    } else {
      serverBookmarkIdsRef.current = new Map();
    }
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
        const { arabic, translation } = await fetchSurah(surahNumber, translationLang);
        setSurahMeta(arabic);
        const items: DisplayAyah[] = arabic.ayahs.map((a, i) => ({
          key: `ayah-${a.number}`,
          arabicText: a.text,
          translationText: translation.ayahs[i]?.text ?? '',
          numberInSurah: a.numberInSurah,
          globalNumber: a.number,
        }));
        setAyahs(items);
      } else if (juzNumber) {
        const { arabic, translation } = await fetchJuz(juzNumber, translationLang);
        const transMap = new Map<number, string>();
        translation.ayahs.forEach(a => transMap.set(a.number, a.text));

        const result: DisplayAyah[] = [];
        let lastSurahNum = -1;

        arabic.ayahs.forEach(a => {
          const currentSurah = a.surah?.number ?? 0;
          if (currentSurah !== lastSurahNum) {
            result.push({
              key: `header-${currentSurah}`,
              arabicText: '',
              translationText: '',
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
            translationText: transMap.get(a.number) ?? '',
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

  // ─── UI helpers ───────────────────────────────────────────────────────────────

  const cycleFontSize = () =>
    setFontSize(prev => (prev === 'sm' ? 'md' : prev === 'md' ? 'lg' : 'sm'));

  // ─── Render helpers ───────────────────────────────────────────────────────────

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

        {/* Row: [bookmark badge + play btn] | [arabic text RTL] */}
        <View style={styles.ayahRow}>

          {/* Left controls column */}
          <View style={styles.leftControls}>

            {/* Verse number / bookmark badge */}
            <TouchableOpacity
              style={[
                styles.verseNumBadge,
                isBookmarked && !isCurrentlyPlaying && styles.verseNumBadgeBookmarked,
                isCurrentlyPlaying && styles.verseNumBadgePlaying,
              ]}
              onPress={() => toggleBookmark(item, isBookmarked)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}>
              {isCurrentlyPlaying ? (
                <Icon name="volume-up" size={15} color={theme.colors.white} />
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

            {/* Play / buffering / stop button */}
            <TouchableOpacity
              style={[
                styles.playBtn,
                isCurrentlyPlaying && !isBufferingThis && styles.playBtnStop,
              ]}
              onPress={() => handleAyahPress(item)}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 8 }}>
              {isBufferingThis ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : isCurrentlyPlaying ? (
                <Icon name="stop" size={14} color={theme.colors.white} />
              ) : (
                <Icon name="play-arrow" size={14} color={theme.colors.primary} />
              )}
            </TouchableOpacity>

          </View>

          {/* Arabic text — large, clear diacritics (tashkeel), RTL */}
          <Text
            style={[
              styles.arabicText,
              {
                fontSize: FONT_SIZES[fontSize],
                lineHeight: FONT_SIZES[fontSize] * ARABIC_LINE_HEIGHT_MULTIPLIER,
              },
              isCurrentlyPlaying && styles.arabicTextPlaying,
            ]}>
            {item.arabicText}
          </Text>
        </View>

        {/* Translation (English or Urdu) */}
        {showTranslation && item.translationText ? (
          <Text
            style={[
              styles.translationText,
              translationLang === 'ur' && styles.translationTextRtl,
            ]}>
            {item.translationText}
          </Text>
        ) : null}

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

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

      {/* ── Header ── */}
      <View style={styles.header}>
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
          showsVerticalScrollIndicator={true}
          initialNumToRender={12}
          maxToRenderPerBatch={15}
          windowSize={10}
          onScrollToIndexFailed={info => {
            const wait = new Promise(resolve => setTimeout(resolve, 200));
            wait.then(() => {
              listRef.current?.scrollToOffset({
                offset: Math.min(info.averageItemLength * info.index, 999999),
                animated: true,
              });
            });
          }}
        />
      )}

      {/* ── Bottom toolbar ── */}
      {!loading && !error && (
        <View style={styles.toolbar}>
          {/* Translation toggle + language (English / Urdu) */}
          <View style={styles.toolbarTranslationGroup}>
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
            {showTranslation && (
              <View style={styles.translationLangRow}>
                <TouchableOpacity
                  style={[
                    styles.translationLangChip,
                    translationLang === 'en' && styles.translationLangChipActive,
                  ]}
                  onPress={() => setTranslationLang('en')}>
                  <Text
                    style={[
                      styles.translationLangChipText,
                      translationLang === 'en' && styles.translationLangChipTextActive,
                    ]}>
                    English
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.translationLangChip,
                    translationLang === 'ur' && styles.translationLangChipActive,
                  ]}
                  onPress={() => setTranslationLang('ur')}>
                  <Text
                    style={[
                      styles.translationLangChipText,
                      translationLang === 'ur' && styles.translationLangChipTextActive,
                    ]}>
                    Urdu
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

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

  // Ayah row: [left controls] | [arabic text RTL]
  ayahRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  // Left controls: verse badge + play button side by side
  leftControls: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    marginLeft: theme.spacing.sm,
    flexShrink: 0,
  },

  // Verse number badge (taps to toggle bookmark)
  verseNumBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: theme.colors.accentGold + '80',
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
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

  // Play / stop button
  playBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: theme.colors.primary + '55',
    backgroundColor: theme.colors.primary + '12',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtnStop: {
    backgroundColor: '#C0392B',
    borderColor: '#C0392B',
  },

  // Arabic text — Amiri for clear diacritics (tashkeel), RTL
  arabicText: {
    flex: 1,
    fontFamily: theme.fonts.quran,
    color: '#0D1512',
    textAlign: 'right',
    lineHeight: 80,
    writingDirection: 'rtl',
    paddingLeft: theme.spacing.sm,
    letterSpacing: 0.5,
  },
  arabicTextPlaying: {
    color: theme.colors.primary,
  },

  // Translation
  translationText: {
    fontSize: 15,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    lineHeight: 24,
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary + '50',
    marginLeft: theme.spacing.sm,
  },
  translationTextRtl: {
    writingDirection: 'rtl',
    textAlign: 'right',
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderRightColor: theme.colors.primary + '50',
    marginLeft: 0,
    marginRight: theme.spacing.sm,
  },
  toolbarTranslationGroup: {
    alignItems: 'center',
    gap: 4,
  },
  translationLangRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  translationLangChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.borderSubtle,
  },
  translationLangChipActive: {
    backgroundColor: theme.colors.primary,
  },
  translationLangChipText: {
    fontSize: 11,
    fontFamily: theme.fonts.button,
    color: theme.colors.textSecondary,
  },
  translationLangChipTextActive: {
    color: theme.colors.white,
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


