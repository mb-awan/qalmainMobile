import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme} from '../theme/colors';

interface QuranTutorScreenProps {
  navigation: any;
}

const QuranTutorScreen = ({navigation}: QuranTutorScreenProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}>
          <Icon name="arrow-back" size={22} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Qari Mode</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="settings" size={22} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        {/* Decorative stars */}
        <Icon
          name="star"
          size={14}
          color={theme.colors.accentGold}
          style={styles.starTopLeft}
        />
        <Icon
          name="star"
          size={10}
          color={theme.colors.accentGold}
          style={styles.starTopRight}
        />
        <Icon
          name="star"
          size={12}
          color={theme.colors.accentGold}
          style={styles.starBottomLeft}
        />

        {/* Avatar container */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <View style={styles.avatarHijabTop} />
            <View style={styles.avatarFace}>
              <Icon name="person" size={56} color={theme.colors.primary} />
            </View>
            {/* Book icon at bottom of avatar */}
            <View style={styles.bookBadge}>
              <Icon name="menu-book" size={16} color={theme.colors.white} />
            </View>
          </View>
        </View>

        {/* Reciting indicator */}
        <View style={styles.recitingBadge}>
          <View style={styles.soundWave}>
            <View style={[styles.waveBar, styles.waveBar1]} />
            <View style={[styles.waveBar, styles.waveBar2]} />
            <View style={[styles.waveBar, styles.waveBar3]} />
            <View style={[styles.waveBar, styles.waveBar2]} />
            <View style={[styles.waveBar, styles.waveBar1]} />
          </View>
          <Text style={styles.recitingText}>Reciting...</Text>
        </View>
      </View>

      {/* Quran Section */}
      <View style={styles.quranSection}>
        <View style={styles.quranHeader}>
          <Text style={styles.surahTitle}>SURAH AL-FATIHAH</Text>
          <View style={styles.titleUnderline} />
        </View>

        <ScrollView
          style={styles.quranScroll}
          contentContainerStyle={styles.quranContent}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.bismillah}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </Text>

          <View style={[styles.ayahContainer, styles.ayahHighlighted]}>
            <Text style={[styles.ayahText, styles.ayahTextHighlighted]}>
              الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
            </Text>
            <View style={styles.ayahNumber}>
              <Text style={styles.ayahNumberText}>١</Text>
            </View>
          </View>

          <View style={styles.ayahContainer}>
            <Text style={styles.ayahText}>الرَّحْمَٰنِ الرَّحِيمِ</Text>
            <View style={styles.ayahNumber}>
              <Text style={styles.ayahNumberText}>٢</Text>
            </View>
          </View>

          <View style={styles.ayahContainer}>
            <Text style={styles.ayahText}>مَالِكِ يَوْمِ الدِّينِ</Text>
            <View style={styles.ayahNumber}>
              <Text style={styles.ayahNumberText}>٣</Text>
            </View>
          </View>
        </ScrollView>

        {/* AI Message & Controls */}
        <View style={styles.messageCard}>
          <Text style={styles.messageText}>
            Beta, thora sa dhyan yahan rakhen ✨
          </Text>
          <View style={styles.audioControls}>
            <TouchableOpacity style={styles.controlBtn}>
              <Icon
                name="skip-previous"
                size={28}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.playBtn}
              onPress={() => setIsPlaying(!isPlaying)}>
              <Icon
                name={isPlaying ? 'pause' : 'play-arrow'}
                size={32}
                color={theme.colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlBtn}>
              <Icon name="skip-next" size={28} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.heading,
    color: theme.colors.primary,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.backgroundLight,
    position: 'relative',
  },
  starTopLeft: {
    position: 'absolute',
    top: 24,
    left: '28%',
  },
  starTopRight: {
    position: 'absolute',
    top: 16,
    right: '26%',
  },
  starBottomLeft: {
    position: 'absolute',
    bottom: 48,
    left: '24%',
  },
  avatarWrapper: {
    marginBottom: theme.spacing.md,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.highlight,
    borderWidth: 3,
    borderColor: theme.colors.primary + '30',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  avatarHijabTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: theme.colors.primary + '20',
    borderRadius: 60,
  },
  avatarFace: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recitingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  soundWave: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 16,
  },
  waveBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
  },
  waveBar1: {
    height: 6,
  },
  waveBar2: {
    height: 12,
  },
  waveBar3: {
    height: 16,
  },
  recitingText: {
    fontSize: 13,
    fontFamily: theme.fonts.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  quranSection: {
    flex: 1,
    backgroundColor: '#FDFAF1',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingTop: theme.spacing.xl,
  },
  quranHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  surahTitle: {
    fontSize: 12,
    fontFamily: theme.fonts.button,
    color: theme.colors.primary,
    letterSpacing: 3,
    marginBottom: 6,
  },
  titleUnderline: {
    width: 64,
    height: 3,
    backgroundColor: theme.colors.accentGold,
    borderRadius: 2,
    opacity: 0.6,
  },
  quranScroll: {
    flex: 1,
  },
  quranContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 16,
  },
  bismillah: {
    fontSize: 32,
    fontFamily: theme.fonts.quran,
    color: theme.colors.primary + 'AA',
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: 58,
  },
  ayahContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  ayahHighlighted: {
    backgroundColor: theme.colors.accentGold + '18',
    borderRadius: 12,
    paddingHorizontal: theme.spacing.md,
  },
  ayahText: {
    flex: 1,
    fontSize: 32,
    fontFamily: theme.fonts.quran,
    color: '#2C3E50',
    textAlign: 'right',
    lineHeight: 64,
  },
  ayahTextHighlighted: {
    color: theme.colors.primary,
  },
  ayahNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: theme.colors.accentGold + '80',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
    backgroundColor: theme.colors.white,
  },
  ayahNumberText: {
    fontSize: 16,
    fontFamily: theme.fonts.quran,
    color: theme.colors.accentGold,
  },
  messageCard: {
    margin: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: theme.colors.primary + '15',
  },
  messageText: {
    fontSize: 15,
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    lineHeight: 22,
  },
  audioControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing.xl,
  },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default QuranTutorScreen;
