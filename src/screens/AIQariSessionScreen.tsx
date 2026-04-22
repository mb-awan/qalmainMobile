import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../theme/colors';

// Mock monthly time remaining — plan integration will replace this
const TOTAL_SECONDS_AVAILABLE = 8.5 * 3600; // 8.5 hours in seconds

interface FeedbackItem {
  id: string;
  heard: string;
  correct: string;
  status: 'correct' | 'incorrect' | 'partial';
}

// Placeholder feedback entries shown in the UI
const PLACEHOLDER_FEEDBACK: FeedbackItem[] = [
  { id: '1', heard: 'بِسْمِ', correct: 'بِسْمِ', status: 'correct' },
  { id: '2', heard: 'الرحمن', correct: 'الرَّحْمَٰن', status: 'incorrect' },
  { id: '3', heard: 'الرَّحِيم', correct: 'الرَّحِيم', status: 'correct' },
];

const AIQariSessionScreen = ({ navigation, route }: any) => {
  const surahNumber: number | undefined = route?.params?.surahNumber;
  const juzNumber: number | undefined = route?.params?.juzNumber;
  const title: string = route?.params?.title ?? 'Quran';
  const contentType: string = route?.params?.contentType ?? 'surah';
  const fromReader: boolean = route?.params?.fromReader ?? false;

  const [isActive, setIsActive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);

  // Pulsing animation for the mic ring
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.4)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    return () => {
      stopSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startPulse = () => {
    pulseRef.current = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.4,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    pulseRef.current.start();
  };

  const stopPulse = () => {
    if (pulseRef.current) {
      pulseRef.current.stop();
    }
    pulseAnim.setValue(1);
    pulseOpacity.setValue(0.4);
  };

  const startSession = () => {
    setIsActive(true);
    setFeedbackItems([]);
    startPulse();

    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    // Simulate feedback appearing after a few seconds (UI demo)
    setTimeout(() => {
      setFeedbackItems(PLACEHOLDER_FEEDBACK);
    }, 4000);
  };

  const stopSession = () => {
    setIsActive(false);
    stopPulse();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleToggle = () => {
    if (isActive) {
      stopSession();
    } else {
      startSession();
    }
  };

  const formatTime = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    if (h > 0) {
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const remainingSeconds = Math.max(0, TOTAL_SECONDS_AVAILABLE - elapsedSeconds);
  const remainingHours = (remainingSeconds / 3600).toFixed(1);

  const contentLabel = () => {
    if (contentType === 'surah') return `SURAH ${surahNumber}`;
    if (contentType === 'para') return `PARA ${juzNumber}`;
    return `JUZ ${juzNumber}`;
  };

  const contentIcon = () => {
    if (contentType === 'surah') return 'menu-book';
    return 'layers';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={22} color={theme.colors.accentGold} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>AI QARI MODE</Text>
          <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
        </View>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Content Info Card */}
        <View style={styles.contentCard}>
          <View style={styles.contentCardLeft}>
            <View style={styles.contentIconBox}>
              <Icon name={contentIcon()} size={22} color={theme.colors.primary} />
            </View>
            <View>
              <Text style={styles.contentLabel}>{contentLabel()}</Text>
              <Text style={styles.contentTitle}>{title}</Text>
            </View>
          </View>
          {fromReader && (
            <View style={styles.fromReaderBadge}>
              <Icon name="import-export" size={12} color={theme.colors.primary} />
              <Text style={styles.fromReaderText}>From Reader</Text>
            </View>
          )}
        </View>

        {/* Time Remaining */}
        <View style={styles.timeRow}>
          <View style={styles.timeChip}>
            <Icon name="schedule" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.timeChipText}>{remainingHours} hrs remaining</Text>
          </View>
          {isActive && (
            <View style={styles.sessionTimeChip}>
              <View style={styles.liveIndicator} />
              <Text style={styles.sessionTimeText}>{formatTime(elapsedSeconds)}</Text>
            </View>
          )}
        </View>

        {/* Microphone Area */}
        <View style={styles.micArea}>

          {/* Status Text */}
          <Text style={styles.statusText}>
            {isActive ? 'Listening… Recite clearly' : 'Tap the mic to begin AI Qari session'}
          </Text>

          {/* Pulsing mic button */}
          <View style={styles.micWrapper}>
            {/* Outer pulse ring */}
            <Animated.View
              style={[
                styles.micPulseRing,
                {
                  transform: [{ scale: pulseAnim }],
                  opacity: pulseOpacity,
                },
              ]}
            />
            {/* Inner circle / button */}
            <TouchableOpacity
              style={[styles.micButton, isActive && styles.micButtonActive]}
              onPress={handleToggle}
              activeOpacity={0.85}>
              <Icon
                name={isActive ? 'stop' : 'mic'}
                size={38}
                color={theme.colors.white}
              />
            </TouchableOpacity>
          </View>

          {/* Waveform visual (decorative bars) */}
          {isActive && (
            <View style={styles.waveformRow}>
              {[3, 7, 5, 10, 6, 12, 8, 4, 9, 6, 11, 7, 5, 8, 4].map((h, i) => (
                <View
                  key={i}
                  style={[
                    styles.waveBar,
                    {
                      height: h * 3,
                      opacity: 0.5 + (i % 3) * 0.2,
                    },
                  ]}
                />
              ))}
            </View>
          )}

          <Text style={styles.micHint}>
            {isActive ? 'Tap to stop the session' : 'The AI will listen and correct your pronunciation'}
          </Text>
        </View>

        {/* Pronunciation Feedback */}
        {feedbackItems.length > 0 && (
          <View style={styles.feedbackSection}>
            <Text style={styles.feedbackSectionTitle}>PRONUNCIATION FEEDBACK</Text>
            {feedbackItems.map(item => (
              <View key={item.id} style={styles.feedbackItem}>
                <View style={styles.feedbackLeft}>
                  <Text style={styles.feedbackLabel}>You said</Text>
                  <Text style={styles.feedbackArabic}>{item.heard}</Text>
                </View>
                <View
                  style={[
                    styles.feedbackStatus,
                    item.status === 'correct' ? styles.feedbackStatusCorrect :
                    item.status === 'incorrect' ? styles.feedbackStatusIncorrect :
                    styles.feedbackStatusPartial,
                  ]}>
                  <Icon
                    name={item.status === 'correct' ? 'check' : item.status === 'incorrect' ? 'close' : 'remove'}
                    size={14}
                    color={theme.colors.white}
                  />
                </View>
                <View style={styles.feedbackRight}>
                  <Text style={styles.feedbackLabel}>Correct</Text>
                  <Text style={[
                    styles.feedbackArabic,
                    item.status === 'correct' ? styles.feedbackArabicCorrect : styles.feedbackArabicError,
                  ]}>
                    {item.correct}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Placeholder when not active and no feedback */}
        {!isActive && feedbackItems.length === 0 && (
          <View style={styles.placeholderSection}>
            <View style={styles.placeholderCard}>
              <Icon name="record-voice-over" size={32} color={theme.colors.textSecondary} style={{ marginBottom: 8 }} />
              <Text style={styles.placeholderTitle}>AI Pronunciation Check</Text>
              <Text style={styles.placeholderSubtitle}>
                Start a session and recite. The AI will detect mistakes and show the correct pronunciation here.
              </Text>
            </View>
          </View>
        )}
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
    fontSize: 17,
    fontFamily: theme.fonts.heading,
    color: theme.colors.accentGold,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },

  // Content Card
  contentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  contentCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  contentIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: theme.colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentLabel: {
    fontSize: 10,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    letterSpacing: 1.2,
    fontWeight: '700',
    marginBottom: 2,
  },
  contentTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
  },
  fromReaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.highlight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  fromReaderText: {
    fontSize: 11,
    fontFamily: theme.fonts.body,
    color: theme.colors.primary,
  },

  // Time row
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  timeChipText: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  sessionTimeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  liveIndicator: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },
  sessionTimeText: {
    fontSize: 12,
    fontFamily: theme.fonts.heading,
    color: theme.colors.white,
    letterSpacing: 0.5,
  },

  // Mic Area
  micArea: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.white,
    borderRadius: 24,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  statusText: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  micWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  micPulseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primary,
  },
  micButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: theme.colors.white,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  micButtonActive: {
    backgroundColor: '#C0392B',
    shadowColor: '#C0392B',
    borderColor: theme.colors.white,
  },
  waveformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: theme.spacing.md,
    height: 40,
  },
  waveBar: {
    width: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
  },
  micHint: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
  },

  // Feedback Section
  feedbackSection: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    marginBottom: theme.spacing.md,
  },
  feedbackSectionTitle: {
    fontSize: 10,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    letterSpacing: 1.2,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
  },
  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSubtle,
    gap: theme.spacing.sm,
  },
  feedbackLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  feedbackRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  feedbackLabel: {
    fontSize: 10,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  feedbackArabic: {
    fontSize: 22,
    fontFamily: theme.fonts.quran,
    color: theme.colors.textPrimary,
    lineHeight: 34,
  },
  feedbackArabicCorrect: {
    color: theme.colors.success,
  },
  feedbackArabicError: {
    color: '#C0392B',
  },
  feedbackStatus: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackStatusCorrect: {
    backgroundColor: theme.colors.success,
  },
  feedbackStatusIncorrect: {
    backgroundColor: '#C0392B',
  },
  feedbackStatusPartial: {
    backgroundColor: theme.colors.accentGold,
  },

  // Placeholder
  placeholderSection: {
    marginBottom: theme.spacing.md,
  },
  placeholderCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: theme.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    borderStyle: 'dashed',
  },
  placeholderTitle: {
    fontSize: 15,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  placeholderSubtitle: {
    fontSize: 13,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default AIQariSessionScreen;
