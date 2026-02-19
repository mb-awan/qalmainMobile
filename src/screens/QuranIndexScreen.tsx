import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../theme/colors';
import { fetchAllSurahs, SurahMeta } from '../services/quranApi';

interface QuranIndexScreenProps {
  navigation: any;
}

type ActiveTab = 'surah' | 'para' | 'juz';

interface ParaItem {
  id: number;
  arabicName: string;
  name: string;
  surahRange: string;
}

const PARA_LIST: ParaItem[] = [
  { id: 1,  arabicName: 'الم',              name: 'Alif Lam Meem',        surahRange: 'Al-Fatiha 1:1 – Al-Baqarah 2:141' },
  { id: 2,  arabicName: 'سَيَقُولُ',        name: 'Sayaqool',             surahRange: 'Al-Baqarah 2:142 – 2:252' },
  { id: 3,  arabicName: 'تِلۡكَ الرُّسُلُ', name: 'Tilkar Rusul',         surahRange: 'Al-Baqarah 2:253 – Aal-Imran 3:91' },
  { id: 4,  arabicName: 'لَن تَنَالُوا',    name: "Lan Tana Loo",         surahRange: "Aal-Imran 3:92 – An-Nisa' 4:23" },
  { id: 5,  arabicName: 'وَالْمُحْصَنَاتُ', name: 'Wal Mohsanat',         surahRange: "An-Nisa' 4:24 – 4:147" },
  { id: 6,  arabicName: 'لَا يُحِبُّ اللَّه', name: 'La Yuhibbullah',     surahRange: "An-Nisa' 4:148 – Al-Ma'idah 5:81" },
  { id: 7,  arabicName: 'وَإِذَا سَمِعُوا', name: 'Wa Iza Samiu',         surahRange: "Al-Ma'idah 5:82 – Al-An'am 6:110" },
  { id: 8,  arabicName: 'وَلَوۡ أَنَّنَا',  name: 'Wa Lau Annana',        surahRange: "Al-An'am 6:111 – Al-A'raf 7:87" },
  { id: 9,  arabicName: 'قَالَ الْمَلَأُ',  name: "Qal Al Mala'o",        surahRange: "Al-A'raf 7:88 – Al-Anfal 8:40" },
  { id: 10, arabicName: 'وَاعْلَمُوا',      name: 'Wa Alamu',             surahRange: 'Al-Anfal 8:41 – At-Tawbah 9:93' },
  { id: 11, arabicName: 'يَعْتَذِرُونَ',    name: 'Yatazeroon',           surahRange: 'At-Tawbah 9:94 – Hud 11:5' },
  { id: 12, arabicName: 'وَمَا مِن دَابَّة', name: 'Wa Ma Min Dabbah',    surahRange: 'Hud 11:6 – Yusuf 12:52' },
  { id: 13, arabicName: 'وَمَا أُبَرِّئُ',  name: 'Wa Ma Ubarioo',        surahRange: 'Yusuf 12:53 – Ibrahim 14:52' },
  { id: 14, arabicName: 'رُبَمَا',           name: 'Rubama',               surahRange: 'Al-Hijr 15:1 – An-Nahl 16:128' },
  { id: 15, arabicName: 'سُبۡحَٰنَ الَّذِي', name: 'Subhan Allazi',       surahRange: "Al-Isra' 17:1 – Al-Kahf 18:74" },
  { id: 16, arabicName: 'قَالَ أَلَمۡ',     name: 'Qal Alam',             surahRange: 'Al-Kahf 18:75 – Ta-Ha 20:135' },
  { id: 17, arabicName: 'اقْتَرَبَ',         name: 'Aqtarabo',             surahRange: "Al-Anbiya' 21:1 – Al-Hajj 22:78" },
  { id: 18, arabicName: 'قَدۡ أَفۡلَحَ',    name: 'Qad Aflaha',           surahRange: "Al-Mu'minoon 23:1 – Al-Furqan 25:20" },
  { id: 19, arabicName: 'وَقَالَ الَّذِينَ', name: 'Wa Qalallazina',      surahRange: 'Al-Furqan 25:21 – An-Naml 27:55' },
  { id: 20, arabicName: 'أَمَّنۡ خَلَقَ',   name: 'Aman Khalaqa',         surahRange: "An-Naml 27:56 – Al-'Ankaboot 29:45" },
  { id: 21, arabicName: 'اتْلُ مَا أُوحِيَ', name: 'Utlu Ma Oohi',       surahRange: "Al-'Ankaboot 29:46 – Al-Ahzab 33:30" },
  { id: 22, arabicName: 'وَمَن يَقْنُتۡ',   name: 'Wa Man Yaqnut',        surahRange: 'Al-Ahzab 33:31 – Ya-Sin 36:27' },
  { id: 23, arabicName: 'وَمَالِيَ',         name: 'Wa Mali',              surahRange: 'Ya-Sin 36:28 – Az-Zumar 39:31' },
  { id: 24, arabicName: 'فَمَنۡ أَظۡلَمُ',  name: "Fa Man Azlam",         surahRange: 'Az-Zumar 39:32 – Fussilat 41:46' },
  { id: 25, arabicName: 'إِلَيۡهِ يُرَدُّ', name: 'Elahe Yuruddo',        surahRange: 'Fussilat 41:47 – Al-Jathiyah 45:37' },
  { id: 26, arabicName: 'حٰمٓ',              name: 'Ha Meem',              surahRange: 'Al-Ahqaf 46:1 – Adh-Dhariyat 51:30' },
  { id: 27, arabicName: 'قَالَ فَمَا خَطۡبُكُم', name: 'Qala Fama Khatbukum', surahRange: 'Adh-Dhariyat 51:31 – Al-Hadid 57:29' },
  { id: 28, arabicName: 'قَدۡ سَمِعَ اللَّهُ', name: 'Qad Sami Allah',   surahRange: 'Al-Mujadila 58:1 – At-Tahrim 66:12' },
  { id: 29, arabicName: 'تَبَارَكَ الَّذِي', name: 'Tabarakallazi',        surahRange: 'Al-Mulk 67:1 – Al-Mursalat 77:50' },
  { id: 30, arabicName: 'عَمَّ',             name: 'Amma',                 surahRange: "An-Naba' 78:1 – An-Nas 114:6" },
];

const QuranIndexScreen = ({ navigation }: QuranIndexScreenProps) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('surah');
  const [searchQuery, setSearchQuery] = useState('');
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSurahs();
  }, []);

  const loadSurahs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllSurahs();
      setSurahs(data);
    } catch {
      setError('Failed to load Surahs. Check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

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
        p.surahRange.toLowerCase().includes(q) ||
        String(p.id).includes(q),
    );
  }, [searchQuery]);

  const renderSurahItem = ({ item }: { item: SurahMeta }) => (
    <TouchableOpacity
      style={styles.listItem}
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate('Quran', {
          surahNumber: item.number,
          title: item.englishName,
        })
      }>
      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{item.number}</Text>
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.englishName}</Text>
        <Text style={styles.itemSubtitle}>
          {item.englishNameTranslation} · {item.numberOfAyahs} Ayahs ·{' '}
          <Text
            style={[
              styles.revelationBadge,
              item.revelationType === 'Meccan'
                ? styles.meccan
                : styles.medinan,
            ]}>
            {item.revelationType}
          </Text>
        </Text>
      </View>
      <Text style={styles.arabicName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderParaItem = ({ item, isJuz }: { item: ParaItem; isJuz?: boolean }) => (
    <TouchableOpacity
      style={styles.listItem}
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate('Quran', {
          juzNumber: item.id,
          title: isJuz ? `Juz ${item.id}` : `Para ${item.id}`,
        })
      }>
      <View style={[styles.numberBadge, styles.numberBadgeGold]}>
        <Text style={styles.numberTextGold}>{item.id}</Text>
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>
          {isJuz ? 'Juz' : 'Para'} {item.id} — {item.name}
        </Text>
        <Text style={styles.itemSubtitle}>{item.surahRange}</Text>
      </View>
      <Text style={styles.arabicName}>{item.arabicName}</Text>
    </TouchableOpacity>
  );

  const getPlaceholder = () => {
    if (activeTab === 'surah') return 'Search Surah name or meaning…';
    if (activeTab === 'para') return 'Search Para name or range…';
    return 'Search Juz name or range…';
  };

  const renderContent = () => {
    if (activeTab === 'surah') {
      if (loading) {
        return (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading Surahs…</Text>
          </View>
        );
      }
      if (error) {
        return (
          <View style={styles.centered}>
            <Icon name="wifi-off" size={48} color={theme.colors.textSecondary} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={loadSurahs}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        );
      }
      return (
        <FlatList
          data={filteredSurahs}
          renderItem={renderSurahItem}
          keyExtractor={item => item.number.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      );
    }

    return (
      <FlatList
        data={filteredParas}
        renderItem={({ item }) =>
          renderParaItem({ item, isJuz: activeTab === 'juz' })
        }
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Quran Majeed</Text>
          <Text style={styles.headerSubtitle}>القرآن الكريم</Text>
        </View>
        <TouchableOpacity style={styles.headerIconBtn}>
          <Icon name="more-vert" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

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
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder={getPlaceholder()}
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close" size={18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Count row */}
      {!loading && !error && (
        <View style={styles.countRow}>
          <Text style={styles.countText}>
            {activeTab === 'surah'
              ? `${filteredSurahs.length} Surah${filteredSurahs.length !== 1 ? 's' : ''}`
              : `${filteredParas.length} ${activeTab === 'juz' ? 'Juz' : 'Para'}${filteredParas.length !== 1 ? 's' : ''}`}
          </Text>
        </View>
      )}

      {renderContent()}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSubtle,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: theme.fonts.quran,
    color: theme.colors.primary,
    marginTop: 2,
  },
  headerIconBtn: {
    padding: theme.spacing.xs,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.white,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontFamily: theme.fonts.button,
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    color: theme.colors.white,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    gap: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
    padding: 0,
  },
  countRow: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: 2,
  },
  countText: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  listContainer: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  numberBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
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
    fontSize: 14,
    fontFamily: theme.fonts.heading,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  numberTextGold: {
    fontSize: 14,
    fontFamily: theme.fonts.heading,
    color: theme.colors.accentGold,
    fontWeight: '700',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginBottom: 3,
  },
  itemSubtitle: {
    fontSize: 13,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  revelationBadge: {
    fontSize: 11,
    fontFamily: theme.fonts.body,
  },
  meccan: {
    color: theme.colors.primary,
  },
  medinan: {
    color: theme.colors.accentOrange,
  },
  arabicName: {
    fontSize: 20,
    fontFamily: theme.fonts.quran,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
    flexShrink: 0,
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

export default QuranIndexScreen;
