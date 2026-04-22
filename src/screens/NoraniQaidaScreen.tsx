import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Tts from 'react-native-tts';
import { theme } from '../theme/colors';

interface QaidaItem {
  id: string;
  arabic: string;
  name: string;
  speak: string;
}

interface QaidaSection {
  id: string;
  title: string;
  subtitle: string;
  items: QaidaItem[];
}

const QAIDA_SECTIONS: QaidaSection[] = [
  {
    id: 'alphabet',
    title: 'Arabic Alphabet',
    subtitle: 'Tap each letter to hear its pronunciation',
    items: [
      { id: 'alif',  arabic: 'ا', name: 'Alif',  speak: 'أَلِف' },
      { id: 'ba',    arabic: 'ب', name: 'Ba',    speak: 'بَاء' },
      { id: 'ta',    arabic: 'ت', name: 'Ta',    speak: 'تَاء' },
      { id: 'tha',   arabic: 'ث', name: 'Tha',   speak: 'ثَاء' },
      { id: 'jeem',  arabic: 'ج', name: 'Jeem',  speak: 'جِيم' },
      { id: 'ha',    arabic: 'ح', name: 'Ha',    speak: 'حَاء' },
      { id: 'kha',   arabic: 'خ', name: 'Kha',   speak: 'خَاء' },
      { id: 'dal',   arabic: 'د', name: 'Dal',   speak: 'دَال' },
      { id: 'dhal',  arabic: 'ذ', name: 'Dhal',  speak: 'ذَال' },
      { id: 'ra',    arabic: 'ر', name: 'Ra',    speak: 'رَاء' },
      { id: 'zain',  arabic: 'ز', name: 'Zain',  speak: 'زَاي' },
      { id: 'seen',  arabic: 'س', name: 'Seen',  speak: 'سِين' },
      { id: 'sheen', arabic: 'ش', name: 'Sheen', speak: 'شِين' },
      { id: 'sad',   arabic: 'ص', name: 'Sad',   speak: 'صَاد' },
      { id: 'dad',   arabic: 'ض', name: 'Dad',   speak: 'ضَاد' },
      { id: 'tah',   arabic: 'ط', name: 'Tah',   speak: 'طَاء' },
      { id: 'zah',   arabic: 'ظ', name: 'Zah',   speak: 'ظَاء' },
      { id: 'ain',   arabic: 'ع', name: 'Ain',   speak: 'عَين' },
      { id: 'ghain', arabic: 'غ', name: 'Ghain', speak: 'غَين' },
      { id: 'fa',    arabic: 'ف', name: 'Fa',    speak: 'فَاء' },
      { id: 'qaf',   arabic: 'ق', name: 'Qaf',   speak: 'قَاف' },
      { id: 'kaf',   arabic: 'ك', name: 'Kaf',   speak: 'كَاف' },
      { id: 'lam',   arabic: 'ل', name: 'Lam',   speak: 'لَام' },
      { id: 'meem',  arabic: 'م', name: 'Meem',  speak: 'مِيم' },
      { id: 'noon',  arabic: 'ن', name: 'Noon',  speak: 'نُون' },
      { id: 'waw',   arabic: 'و', name: 'Waw',   speak: 'وَاو' },
      { id: 'ha2',   arabic: 'ه', name: 'Ha',    speak: 'هَاء' },
      { id: 'ya',    arabic: 'ي', name: 'Ya',    speak: 'يَاء' },
    ],
  },
  {
    id: 'harakat',
    title: 'Harakat — Vowel Marks',
    subtitle: 'Basic short vowel sounds',
    items: [
      { id: 'fatha',  arabic: 'بَ', name: 'Fatha',  speak: 'بَ' },
      { id: 'kasra',  arabic: 'بِ', name: 'Kasra',  speak: 'بِ' },
      { id: 'damma',  arabic: 'بُ', name: 'Damma',  speak: 'بُ' },
      { id: 'sukoon', arabic: 'بْ', name: 'Sukoon', speak: 'بْ' },
      { id: 'shadda', arabic: 'بّ', name: 'Shadda', speak: 'بّ' },
    ],
  },
  {
    id: 'tanween',
    title: 'Tanween — Double Vowels',
    subtitle: 'Nasal vowel endings',
    items: [
      { id: 'tanween-fath', arabic: 'بً', name: 'Tanween Fath', speak: 'بً' },
      { id: 'tanween-kasr', arabic: 'بٍ', name: 'Tanween Kasr', speak: 'بٍ' },
      { id: 'tanween-dam',  arabic: 'بٌ', name: 'Tanween Dam',  speak: 'بٌ' },
    ],
  },
  {
    id: 'madd',
    title: 'Madd — Elongation',
    subtitle: 'Extended vowel sounds',
    items: [
      { id: 'alif-madd', arabic: 'آ', name: 'Alif Madd', speak: 'آ' },
      { id: 'waw-madd',  arabic: 'وٓ', name: 'Waw Madd',  speak: 'وٓ' },
      { id: 'ya-madd',   arabic: 'يٓ', name: 'Ya Madd',   speak: 'يٓ' },
    ],
  },
  {
    id: 'joined',
    title: 'Joined Letters',
    subtitle: 'Practice connecting letters',
    items: [
      { id: 'ba-lam',  arabic: 'بَلْ', name: 'Bal',  speak: 'بَلْ' },
      { id: 'lam-lah', arabic: 'لَهُ', name: 'Lahu', speak: 'لَهُ' },
      { id: 'ma-lam',  arabic: 'مَلْ', name: 'Mal',  speak: 'مَلْ' },
      { id: 'ka-la',   arabic: 'كَلَّا', name: 'Kalla', speak: 'كَلَّا' },
      { id: 'bal-la',  arabic: 'بَلَى', name: 'Bala', speak: 'بَلَى' },
      { id: 'fa-la',   arabic: 'فَلَا', name: 'Fala', speak: 'فَلَا' },
    ],
  },
  {
    id: 'words',
    title: 'Practice Words',
    subtitle: 'Common Quranic words',
    items: [
      { id: 'bismillah',   arabic: 'بِسْمِ', name: 'Bismi',     speak: 'بِسْمِ' },
      { id: 'allah',       arabic: 'اللَّهِ', name: 'Allah',     speak: 'اللَّهِ' },
      { id: 'rahman',      arabic: 'الرَّحْمَٰن', name: 'Rahman', speak: 'الرَّحْمَٰن' },
      { id: 'rahim',       arabic: 'الرَّحِيم', name: 'Rahim',   speak: 'الرَّحِيم' },
      { id: 'alhamdu',     arabic: 'الْحَمْد', name: 'Alhamdu', speak: 'الْحَمْد' },
      { id: 'rabbil',      arabic: 'رَبِّ',    name: 'Rabbi',    speak: 'رَبِّ' },
      { id: 'alameen',     arabic: 'الْعَالَمِين', name: 'Alameen', speak: 'الْعَالَمِين' },
      { id: 'qul',         arabic: 'قُلْ',    name: 'Qul',      speak: 'قُلْ' },
    ],
  },
];

const NoraniQaidaScreen = ({ navigation }: any) => {
  const [activeLetterId, setActiveLetterId] = useState<string | null>(null);

  useEffect(() => {
    Tts.setDefaultRate(0.4);
    Tts.setDefaultLanguage('ar-SA').catch(() => {});
    Tts.getInitStatus().catch(() => {});

    const finishSub = Tts.addEventListener('finish', () => {
      setActiveLetterId(null);
    });
    const cancelSub = Tts.addEventListener('cancel', () => {
      setActiveLetterId(null);
    });

    return () => {
      finishSub.remove();
      cancelSub.remove();
      try { Tts.stop(); } catch {}
    };
  }, []);

  const handleLetterPress = (item: QaidaItem) => {
    try { Tts.stop(); } catch {}
    setActiveLetterId(item.id);
    Tts.speak(item.speak);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.white} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Norani Qaida</Text>
          <Text style={styles.headerArabic}>نورانی قاعدہ</Text>
        </View>
        <View style={styles.headerBtn} />
      </View>

      {/* Hint banner */}
      <View style={styles.hintBanner}>
        <Icon name="touch-app" size={16} color={theme.colors.primary} />
        <Text style={styles.hintText}>Tap any letter or word to hear its pronunciation</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {QAIDA_SECTIONS.map(section => (
          <View key={section.id} style={styles.sectionBlock}>
            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>
            </View>

            {/* Grid */}
            <View style={styles.grid}>
              {section.items.map(item => {
                const isActive = activeLetterId === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.letterCard, isActive && styles.letterCardActive]}
                    onPress={() => handleLetterPress(item)}
                    activeOpacity={0.7}>
                    <Text style={[styles.letterArabic, isActive && styles.letterArabicActive]}>
                      {item.arabic}
                    </Text>
                    <Text style={[styles.letterName, isActive && styles.letterNameActive]}>
                      {item.name}
                    </Text>
                    {isActive && (
                      <View style={styles.soundIndicator}>
                        <Icon name="volume-up" size={10} color={theme.colors.white} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
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
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: theme.fonts.heading,
    color: theme.colors.primary,
  },
  headerArabic: {
    fontSize: 13,
    fontFamily: theme.fonts.quran,
    color: theme.colors.textSecondary,
    marginTop: 1,
  },
  hintBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.highlight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.primary + '20',
  },
  hintText: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.primary,
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  sectionBlock: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  letterCard: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: theme.colors.white,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.borderSubtle,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  letterCardActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  letterArabic: {
    fontSize: 30,
    fontFamily: theme.fonts.quran,
    color: theme.colors.primary,
    lineHeight: 44,
  },
  letterArabicActive: {
    color: theme.colors.white,
  },
  letterName: {
    fontSize: 9,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  letterNameActive: {
    color: 'rgba(255,255,255,0.8)',
  },
  soundIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.accentGold,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NoraniQaidaScreen;
