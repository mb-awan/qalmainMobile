import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../theme/colors';
import { fetchAllSurahs, SurahMeta } from '../services/quranApi';

type ActiveTab = 'surah' | 'para' | 'juz';

interface ParaItem {
  id: number;
  arabicName: string;
  name: string;
  surahRange: string;
}

const PARA_LIST: ParaItem[] = [
  { id: 1,  arabicName: 'الم',                  name: 'Alif Lam Meem',        surahRange: 'Al-Fatiha 1:1 – Al-Baqarah 2:141' },
  { id: 2,  arabicName: 'سَيَقُولُ',            name: 'Sayaqool',             surahRange: 'Al-Baqarah 2:142 – 2:252' },
  { id: 3,  arabicName: 'تِلۡكَ الرُّسُلُ',    name: 'Tilkar Rusul',         surahRange: 'Al-Baqarah 2:253 – Aal-Imran 3:91' },
  { id: 4,  arabicName: 'لَن تَنَالُوا',        name: "Lan Tana Loo",         surahRange: "Aal-Imran 3:92 – An-Nisa' 4:23" },
  { id: 5,  arabicName: 'وَالْمُحْصَنَاتُ',    name: 'Wal Mohsanat',         surahRange: "An-Nisa' 4:24 – 4:147" },
  { id: 6,  arabicName: 'لَا يُحِبُّ اللَّه',  name: 'La Yuhibbullah',       surahRange: "An-Nisa' 4:148 – Al-Ma'idah 5:81" },
  { id: 7,  arabicName: 'وَإِذَا سَمِعُوا',    name: 'Wa Iza Samiu',         surahRange: "Al-Ma'idah 5:82 – Al-An'am 6:110" },
  { id: 8,  arabicName: 'وَلَوۡ أَنَّنَا',     name: 'Wa Lau Annana',        surahRange: "Al-An'am 6:111 – Al-A'raf 7:87" },
  { id: 9,  arabicName: 'قَالَ الْمَلَأُ',     name: "Qal Al Mala'o",        surahRange: "Al-A'raf 7:88 – Al-Anfal 8:40" },
  { id: 10, arabicName: 'وَاعْلَمُوا',          name: 'Wa Alamu',             surahRange: 'Al-Anfal 8:41 – At-Tawbah 9:93' },
  { id: 11, arabicName: 'يَعْتَذِرُونَ',        name: 'Yatazeroon',           surahRange: 'At-Tawbah 9:94 – Hud 11:5' },
  { id: 12, arabicName: 'وَمَا مِن دَابَّة',   name: 'Wa Ma Min Dabbah',     surahRange: 'Hud 11:6 – Yusuf 12:52' },
  { id: 13, arabicName: 'وَمَا أُبَرِّئُ',     name: 'Wa Ma Ubarioo',        surahRange: 'Yusuf 12:53 – Ibrahim 14:52' },
  { id: 14, arabicName: 'رُبَمَا',              name: 'Rubama',               surahRange: 'Al-Hijr 15:1 – An-Nahl 16:128' },
  { id: 15, arabicName: 'سُبۡحَٰنَ الَّذِي',  name: 'Subhan Allazi',        surahRange: "Al-Isra' 17:1 – Al-Kahf 18:74" },
  { id: 16, arabicName: 'قَالَ أَلَمۡ',        name: 'Qal Alam',             surahRange: 'Al-Kahf 18:75 – Ta-Ha 20:135' },
  { id: 17, arabicName: 'اقْتَرَبَ',            name: 'Aqtarabo',             surahRange: "Al-Anbiya' 21:1 – Al-Hajj 22:78" },
  { id: 18, arabicName: 'قَدۡ أَفۡلَحَ',       name: 'Qad Aflaha',           surahRange: "Al-Mu'minoon 23:1 – Al-Furqan 25:20" },
  { id: 19, arabicName: 'وَقَالَ الَّذِينَ',   name: 'Wa Qalallazina',       surahRange: 'Al-Furqan 25:21 – An-Naml 27:55' },
  { id: 20, arabicName: 'أَمَّنۡ خَلَقَ',      name: 'Aman Khalaqa',         surahRange: "An-Naml 27:56 – Al-'Ankaboot 29:45" },
  { id: 21, arabicName: 'اتْلُ مَا أُوحِيَ',  name: 'Utlu Ma Oohi',         surahRange: "Al-'Ankaboot 29:46 – Al-Ahzab 33:30" },
  { id: 22, arabicName: 'وَمَن يَقْنُتۡ',      name: 'Wa Man Yaqnut',        surahRange: 'Al-Ahzab 33:31 – Ya-Sin 36:27' },
  { id: 23, arabicName: 'وَمَالِيَ',            name: 'Wa Mali',              surahRange: 'Ya-Sin 36:28 – Az-Zumar 39:31' },
  { id: 24, arabicName: 'فَمَنۡ أَظۡلَمُ',    name: "Fa Man Azlam",         surahRange: 'Az-Zumar 39:32 – Fussilat 41:46' },
  { id: 25, arabicName: 'إِلَيۡهِ يُرَدُّ',   name: 'Elahe Yuruddo',        surahRange: 'Fussilat 41:47 – Al-Jathiyah 45:37' },
  { id: 26, arabicName: 'حٰمٓ',                name: 'Ha Meem',              surahRange: 'Al-Ahqaf 46:1 – Adh-Dhariyat 51:30' },
  { id: 27, arabicName: 'قَالَ فَمَا خَطۡبُكُم', name: 'Qala Fama Khatbukum', surahRange: 'Adh-Dhariyat 51:31 – Al-Hadid 57:29' },
  { id: 28, arabicName: 'قَدۡ سَمِعَ اللَّهُ', name: 'Qad Sami Allah',      surahRange: 'Al-Mujadila 58:1 – At-Tahrim 66:12' },
  { id: 29, arabicName: 'تَبَارَكَ الَّذِي',   name: 'Tabarakallazi',        surahRange: 'Al-Mulk 67:1 – Al-Mursalat 77:50' },
  { id: 30, arabicName: 'عَمَّ',               name: 'Amma',                 surahRange: "An-Naba' 78:1 – An-Nas 114:6" },
];

// Placeholder: last incomplete exercise
const LAST_EXERCISE = {
  title: 'Surah Al-Baqarah',
  subtitle: 'Paused at Ayah 45',
  params: { surahNumber: 2, title: 'Al-Baqarah', contentType: 'surah' },
};

// Mock monthly usage — plan integration will replace this
const TOTAL_HOURS = 10;
const USED_HOURS = 1.5;
const REMAINING_HOURS = TOTAL_HOURS - USED_HOURS;

const AIQariDashboardScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('surah');
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAllSurahs()
      .then(data => setSurahs(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const progressPercent = (REMAINING_HOURS / TOTAL_HOURS) * 100;

  const filteredSurahs = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return surahs;
    return surahs.filter(
      s =>
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        s.name.includes(searchQuery),
    );
  }, [surahs, searchQuery]);

  const filteredParas = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return PARA_LIST;
    return PARA_LIST.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.arabicName.includes(searchQuery) ||
        String(p.id).includes(q),
    );
  }, [searchQuery]);

  const handleSurahSelect = (surah: SurahMeta) => {
    navigation.navigate('AIQariSession', {
      surahNumber: surah.number,
      title: surah.englishName,
      contentType: 'surah',
    });
  };

  const handleParaSelect = (para: ParaItem, isJuz: boolean) => {
    navigation.navigate('AIQariSession', {
      juzNumber: para.id,
      title: isJuz ? `Juz ${para.id} — ${para.name}` : `Para ${para.id} — ${para.name}`,
      contentType: isJuz ? 'juz' : 'para',
    });
  };

  const renderSurahList = () => {
    if (loading) {
      return (
        <View style={styles.loadingRow}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading Surahs…</Text>
        </View>
      );
    }
    return filteredSurahs.map(item => (
      <TouchableOpacity
        key={item.number}
        style={styles.listItem}
        activeOpacity={0.7}
        onPress={() => handleSurahSelect(item)}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{item.number}</Text>
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{item.englishName}</Text>
          <Text style={styles.itemSubtitle}>
            {item.englishNameTranslation} · {item.numberOfAyahs} Ayahs
          </Text>
        </View>
        <View style={styles.listItemRight}>
          <Text style={styles.arabicName}>{item.name}</Text>
          <Icon name="chevron-right" size={16} color={theme.colors.primary} />
        </View>
      </TouchableOpacity>
    ));
  };

  const renderParaList = () =>
    filteredParas.map(item => (
      <TouchableOpacity
        key={item.id}
        style={styles.listItem}
        activeOpacity={0.7}
        onPress={() => handleParaSelect(item, activeTab === 'juz')}>
        <View style={[styles.numberBadge, styles.numberBadgeGold]}>
          <Text style={styles.numberTextGold}>{item.id}</Text>
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>
            {activeTab === 'juz' ? 'Juz' : 'Para'} {item.id} — {item.name}
          </Text>
          <Text style={styles.itemSubtitle}>{item.surahRange}</Text>
        </View>
        <View style={styles.listItemRight}>
          <Text style={styles.arabicName}>{item.arabicName}</Text>
          <Icon name="chevron-right" size={16} color={theme.colors.primary} />
        </View>
      </TouchableOpacity>
    ));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Qari Mode</Text>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}>
          <Icon name="close" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Time Remaining Card */}
        <View style={styles.timeCard}>
          <View style={styles.timeCardTop}>
            <View style={styles.timeTextGroup}>
              <Text style={styles.timeLabel}>MONTHLY PRACTICE TIME</Text>
              <View style={styles.timeValueRow}>
                <Text style={styles.timeValue}>{REMAINING_HOURS}</Text>
                <Text style={styles.timeUnit}> hrs</Text>
              </View>
              <Text style={styles.timeOfLabel}>remaining of {TOTAL_HOURS} hrs this month</Text>
            </View>
            <View style={styles.timeIconCircle}>
              <Icon name="schedule" size={30} color={theme.colors.white} />
            </View>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` as any }]} />
          </View>
          <Text style={styles.progressHint}>{USED_HOURS} hrs used this month</Text>
        </View>

        {/* Norani Qaida */}
        <TouchableOpacity
          style={styles.noraniCard}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('NoraniQaida')}>
          <View style={styles.noraniCardLeft}>
            <View style={styles.noraniIconBox}>
              <Icon name="auto-stories" size={24} color={theme.colors.white} />
            </View>
            <View>
              <Text style={styles.noraniTitle}>Norani Qaida</Text>
              <Text style={styles.noraniSubtitle}>Arabic alphabet & pronunciation basics</Text>
            </View>
          </View>
          <Icon name="chevron-right" size={22} color={theme.colors.white} />
        </TouchableOpacity>

        {/* Previous Exercise */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>CONTINUE EXERCISE</Text>
          <TouchableOpacity
            style={styles.exerciseCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AIQariSession', LAST_EXERCISE.params)}>
            <View style={styles.exerciseIconBox}>
              <Icon name="history" size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseTitle}>{LAST_EXERCISE.title}</Text>
              <Text style={styles.exerciseSubtitle}>{LAST_EXERCISE.subtitle}</Text>
            </View>
            <View style={styles.resumeBadge}>
              <Text style={styles.resumeBadgeText}>Resume</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Content Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>SELECT CONTENT FOR AI QARI</Text>

          {/* Tabs */}
          <View style={styles.tabsRow}>
            {(['surah', 'para', 'juz'] as ActiveTab[]).map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => {
                  setActiveTab(tab);
                  setSearchQuery('');
                }}>
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Icon name="search" size={18} color={theme.colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder={`Search ${activeTab}…`}
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Icon name="close" size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>

          {/* List */}
          <View style={styles.listContainer}>
            {activeTab === 'surah' ? renderSurahList() : renderParaList()}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 4,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSubtle,
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: theme.fonts.heading,
    color: theme.colors.primary,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
  },

  // Time Card
  timeCard: {
    margin: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    padding: theme.spacing.lg,
  },
  timeCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  timeTextGroup: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 10,
    fontFamily: theme.fonts.body,
    color: theme.colors.accentGold,
    letterSpacing: 1.2,
    fontWeight: '600',
    marginBottom: 6,
  },
  timeValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  timeValue: {
    fontSize: 44,
    fontFamily: theme.fonts.heading,
    color: theme.colors.white,
    lineHeight: 48,
  },
  timeUnit: {
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    color: theme.colors.white,
    marginBottom: 6,
    opacity: 0.85,
  },
  timeOfLabel: {
    fontSize: 13,
    fontFamily: theme.fonts.body,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
  },
  timeIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.accentGold,
    borderRadius: 3,
  },
  progressHint: {
    fontSize: 11,
    fontFamily: theme.fonts.body,
    color: 'rgba(255,255,255,0.6)',
  },

  // Norani Qaida Card
  noraniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.accentGold,
    borderRadius: 16,
    padding: theme.spacing.md,
  },
  noraniCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  noraniIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noraniTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.heading,
    color: theme.colors.white,
    marginBottom: 2,
  },
  noraniSubtitle: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: 'rgba(255,255,255,0.85)',
  },

  // Section
  section: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    letterSpacing: 1.2,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },

  // Exercise Card
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 14,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  exerciseIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 15,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  exerciseSubtitle: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  resumeBadge: {
    backgroundColor: theme.colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary + '40',
  },
  resumeBadgeText: {
    fontSize: 12,
    fontFamily: theme.fonts.button,
    color: theme.colors.primary,
  },

  // Tabs
  tabsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontFamily: theme.fonts.button,
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    color: theme.colors.white,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
    padding: 0,
  },

  // List
  listContainer: {
    gap: theme.spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  numberBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    flexShrink: 0,
  },
  numberBadgeGold: {
    backgroundColor: '#FBF4DC',
  },
  numberText: {
    fontSize: 13,
    fontFamily: theme.fonts.heading,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  numberTextGold: {
    fontSize: 13,
    fontFamily: theme.fonts.heading,
    color: theme.colors.accentGold,
    fontWeight: '700',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  arabicName: {
    fontSize: 18,
    fontFamily: theme.fonts.quran,
    color: theme.colors.primary,
  },

  // Loading
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
});

export default AIQariDashboardScreen;
