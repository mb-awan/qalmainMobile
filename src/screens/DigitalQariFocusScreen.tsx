import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../theme/colors';

type FocusOption = 'surah' | 'ayah' | 'juz';

const DigitalQariFocusScreen = ({ navigation }: any) => {
  const [selectedFocus, setSelectedFocus] = useState<FocusOption>('surah');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Digital Qari</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate('MainTabs')}>
          <Icon name="close" size={20} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.sectionLabel}>SELECT STUDY CONTENT</Text>
        <Text style={styles.title}>Choose your focus</Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Surah, Juz, or Ayah..."
            placeholderTextColor={theme.colors.textSecondary}
            editable={false}
          />
          <Icon name="tune" size={20} color={theme.colors.textSecondary} />
        </View>

        {/* Focus Options */}
        <TouchableOpacity
          style={[styles.optionCard, selectedFocus === 'surah' && styles.optionCardActive]}
          onPress={() => setSelectedFocus('surah')}
          activeOpacity={0.8}>
          <View style={styles.optionLeft}>
            <Icon
              name="menu-book"
              size={22}
              color={selectedFocus === 'surah' ? theme.colors.white : theme.colors.textSecondary}
            />
            <View style={styles.optionText}>
              <Text style={[styles.optionType, selectedFocus === 'surah' && styles.optionTypeActive]}>
                FULL CHAPTER
              </Text>
              <Text style={[styles.optionTitle, selectedFocus === 'surah' && styles.optionTitleActive]}>
                Surah
              </Text>
            </View>
          </View>
          {selectedFocus === 'surah' && (
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>ACTIVE</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.optionRow}>
          <TouchableOpacity
            style={[styles.optionCardSmall, selectedFocus === 'ayah' && styles.optionCardActive]}
            onPress={() => setSelectedFocus('ayah')}
            activeOpacity={0.8}>
            <Icon
              name="format-list-numbered"
              size={20}
              color={selectedFocus === 'ayah' ? theme.colors.white : theme.colors.textSecondary}
            />
            <Text style={[styles.optionTypeSmall, selectedFocus === 'ayah' && styles.optionTypeActive]}>
              SPECIFIC VERSE
            </Text>
            <Text style={[styles.optionTitleSmall, selectedFocus === 'ayah' && styles.optionTitleActive]}>
              Ayah
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionCardSmall, selectedFocus === 'juz' && styles.optionCardActive]}
            onPress={() => setSelectedFocus('juz')}
            activeOpacity={0.8}>
            <Icon
              name="layers"
              size={20}
              color={selectedFocus === 'juz' ? theme.colors.white : theme.colors.textSecondary}
            />
            <Text style={[styles.optionTypeSmall, selectedFocus === 'juz' && styles.optionTypeActive]}>
              DIVISION
            </Text>
            <Text style={[styles.optionTitleSmall, selectedFocus === 'juz' && styles.optionTitleActive]}>
              Juz / Para
            </Text>
          </TouchableOpacity>
        </View>

        {/* Preview Selection */}
        <View style={styles.previewSection}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewLabel}>PREVIEW SELECTION</Text>
            <TouchableOpacity>
              <Text style={styles.previewChange}>Change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.previewCard}>
            <View style={styles.previewTitleRow}>
              <View style={styles.previewNumberCircle}>
                <Text style={styles.previewNumber}>1</Text>
              </View>
              <View style={styles.previewInfo}>
                <Text style={styles.previewSurahName}>Al-Fatihah</Text>
                <Text style={styles.previewSurahSub}>The Opening • 7 Verses</Text>
              </View>
            </View>

            <Text style={styles.previewArabic}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </Text>
            <Text style={styles.previewTranslation}>
              In the name of Allah, the Entirely Merciful, the Especially Merciful.
            </Text>

            <View style={styles.previewTags}>
              <View style={styles.previewTag}>
                <Text style={styles.previewTagText}>Meccan</Text>
              </View>
              <View style={styles.previewTag}>
                <Text style={styles.previewTagText}>Juz 1</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={styles.nextBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('DigitalQariSession')}>
          <Text style={styles.nextBtnText}>Next</Text>
          <Icon name="chevron-right" size={20} color={theme.colors.white} />
        </TouchableOpacity>

        {/* Bottom Tab Bar (static/decorative) */}
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.bottomBarItem}>
            <Icon name="history" size={22} color={theme.colors.textSecondary} />
            <Text style={styles.bottomBarLabel}>HISTORY</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomBarCenter}>
            <Icon name="mic" size={26} color={theme.colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomBarItem}>
            <Icon name="grid-view" size={22} color={theme.colors.textSecondary} />
            <Text style={styles.bottomBarLabel}>STOP</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    backgroundColor: theme.colors.white,
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
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    fontWeight: '700',
    marginTop: theme.spacing.lg,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
    padding: 0,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: theme.spacing.md,
    borderWidth: 1.5,
    borderColor: theme.colors.borderSubtle,
    marginBottom: theme.spacing.sm,
  },
  optionCardActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  optionText: {},
  optionType: {
    fontSize: 10,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  optionTypeActive: {
    color: theme.colors.white + 'CC',
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
  },
  optionTitleActive: {
    color: theme.colors.white,
  },
  activeBadge: {
    backgroundColor: theme.colors.white + '25',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeBadgeText: {
    fontSize: 10,
    fontFamily: theme.fonts.body,
    color: theme.colors.white,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  optionRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  optionCardSmall: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: theme.spacing.md,
    borderWidth: 1.5,
    borderColor: theme.colors.borderSubtle,
    gap: 4,
  },
  optionTypeSmall: {
    fontSize: 10,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    letterSpacing: 0.8,
    fontWeight: '600',
    marginTop: 4,
  },
  optionTitleSmall: {
    fontSize: 15,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
  },
  previewSection: {
    marginBottom: theme.spacing.md,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  previewLabel: {
    fontSize: 11,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    letterSpacing: 1,
    fontWeight: '700',
  },
  previewChange: {
    fontSize: 13,
    fontFamily: theme.fonts.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  previewCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  previewTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  previewNumberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewNumber: {
    fontSize: 14,
    fontFamily: theme.fonts.heading,
    color: theme.colors.primary,
  },
  previewInfo: {},
  previewSurahName: {
    fontSize: 14,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
  },
  previewSurahSub: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  previewArabic: {
    fontSize: 22,
    fontFamily: theme.fonts.quran,
    color: theme.colors.textPrimary,
    textAlign: 'right',
    lineHeight: 44,
    marginBottom: theme.spacing.xs,
  },
  previewTranslation: {
    fontSize: 13,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  previewTags: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  previewTag: {
    backgroundColor: theme.colors.backgroundLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  previewTagText: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 30,
    paddingVertical: 16,
    gap: 6,
    marginBottom: theme.spacing.md,
  },
  nextBtnText: {
    fontSize: 16,
    fontFamily: theme.fonts.button,
    color: theme.colors.white,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
  },
  bottomBarItem: {
    alignItems: 'center',
    gap: 4,
  },
  bottomBarLabel: {
    fontSize: 10,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  bottomBarCenter: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DigitalQariFocusScreen;
