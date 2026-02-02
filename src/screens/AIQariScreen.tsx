import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme} from '../theme/colors';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const CAMERA_HEIGHT = SCREEN_HEIGHT * 0.3;

interface AIQariScreenProps {
  navigation: any;
}

const AIQariScreen = ({navigation}: AIQariScreenProps) => {
  const [isActive, setIsActive] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isReciting, setIsReciting] = useState(false);
  const [aiMessage, setAiMessage] = useState('Beta, thora sa dhyan yahan rakhein ✨');
  const [showMessage, setShowMessage] = useState(true);
  const [isFocused, setIsFocused] = useState(true);
  const device = useCameraDevice('front');
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    if (isActive && !isPaused) {
      // Simulate focus detection
      const interval = setInterval(() => {
        setIsFocused(Math.random() > 0.3); // 70% chance of being focused
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isActive, isPaused]);

  const handleClose = () => {
    navigation.goBack();
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleRecite = () => {
    setIsReciting(!isReciting);
  };

  const handleMeaning = () => {
    // Navigate to meaning/translation
  };

  if (!device) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="camera-alt" size={64} color={theme.colors.textSecondary} />
          <Text style={styles.errorText}>Camera not available</Text>
          <Text style={styles.errorSubtext}>
            Please grant camera permissions to use AI Qari mode
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.headerButton}>
          <Icon name="close" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Qari Mode</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="settings" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Camera Section */}
      <View style={styles.cameraSection}>
        <View style={styles.cameraContainer}>
          {isActive && !isPaused ? (
            <Camera
              ref={cameraRef}
              style={styles.camera}
              device={device}
              isActive={true}
            />
          ) : (
            <View style={styles.cameraPlaceholder}>
              <Icon name="camera-alt" size={64} color={theme.colors.textSecondary} />
            </View>
          )}
          
          {/* Focus Status Indicator */}
          <View style={styles.focusIndicator}>
            <View
              style={[
                styles.focusDot,
                {backgroundColor: isFocused ? '#4CAF50' : theme.colors.warning},
              ]}
            />
            <Text style={styles.focusText}>FOCUSED</Text>
          </View>

          {/* Listening Indicator */}
          <View style={styles.listeningIndicator}>
            <Icon name="mic" size={16} color={theme.colors.white} />
            <Text style={styles.listeningText}>Listening...</Text>
          </View>
        </View>
      </View>

      {/* Quran Text Section */}
      <View style={styles.quranSection}>
        <View style={styles.quranHeader}>
          <Text style={styles.surahTitle}>SURAH AL-FATIHA</Text>
          <View style={styles.titleUnderline} />
        </View>

        <ScrollView
          style={styles.quranScroll}
          contentContainerStyle={styles.quranContent}>
          <Text style={styles.bismillah}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </Text>

          <View style={styles.ayahContainer}>
            <Text style={styles.ayahText}>
              الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
            </Text>
            <View style={styles.ayahNumber}>
              <Text style={styles.ayahNumberText}>١</Text>
            </View>
          </View>

          <View style={[styles.ayahContainer, styles.ayahHighlighted]}>
            <Text style={[styles.ayahText, styles.ayahTextHighlighted]}>
              الرَّحْمَٰنِ الرَّحِيمِ
            </Text>
            <View style={styles.ayahNumber}>
              <Text style={styles.ayahNumberText}>٢</Text>
            </View>
          </View>

          <View style={styles.ayahContainer}>
            <Text style={styles.ayahText}>
              مَالِكِ يَوْمِ الدِّينِ
            </Text>
            <View style={styles.ayahNumber}>
              <Text style={styles.ayahNumberText}>٣</Text>
            </View>
          </View>

          <View style={styles.ayahContainer}>
            <Text style={styles.ayahText}>
              إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ
            </Text>
            <View style={styles.ayahNumber}>
              <Text style={styles.ayahNumberText}>٤</Text>
            </View>
          </View>
        </ScrollView>

        {/* AI Message Popup */}
        {showMessage && (
          <View style={styles.messagePopup}>
            <View style={styles.messageRobot}>
              <View style={styles.robotIcon}>
                <Icon name="smart-toy" size={32} color={theme.colors.accentOrange} />
              </View>
            </View>
            <View style={styles.messageContent}>
              <View style={styles.messageHeader}>
                <Text style={styles.messageTitle}>DIGITAL QARI</Text>
                <TouchableOpacity onPress={() => setShowMessage(false)}>
                  <Icon name="close" size={16} color={theme.colors.accentOrange} />
                </TouchableOpacity>
              </View>
              <Text style={styles.messageText}>{aiMessage}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Bottom Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handlePause}>
          <View style={styles.controlIcon}>
            <Icon name="pause" size={24} color={theme.colors.primary} />
          </View>
          <Text style={styles.controlLabel}>PAUSE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleRecite}>
          <View style={[styles.controlIcon, styles.reciteButton]}>
            <Icon
              name={isReciting ? 'pause' : 'play-arrow'}
              size={32}
              color={theme.colors.white}
            />
          </View>
          <Text style={[styles.controlLabel, styles.reciteLabel]}>RECITE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleMeaning}>
          <View style={styles.controlIcon}>
            <Icon name="translate" size={24} color={theme.colors.primary} />
          </View>
          <Text style={styles.controlLabel}>MEANING</Text>
        </TouchableOpacity>
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
    padding: theme.spacing.md,
    paddingTop: theme.spacing.lg,
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
    fontWeight: 'bold',
  },
  cameraSection: {
    height: CAMERA_HEIGHT,
    padding: theme.spacing.md,
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: theme.colors.primary + '20',
    backgroundColor: '#000',
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  focusIndicator: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
  },
  focusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  focusText: {
    color: theme.colors.white,
    fontSize: 12,
    fontFamily: theme.fonts.button,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  listeningIndicator: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + 'CC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  listeningText: {
    color: theme.colors.white,
    fontSize: 12,
    fontFamily: theme.fonts.body,
    fontWeight: '500',
  },
  quranSection: {
    flex: 1,
    backgroundColor: '#FDFAF1',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: theme.spacing.xl,
    position: 'relative',
  },
  quranHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  surahTitle: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.primary,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginBottom: 4,
  },
  titleUnderline: {
    width: 64,
    height: 4,
    backgroundColor: theme.colors.accentGold,
    borderRadius: 2,
    opacity: 0.5,
  },
  quranScroll: {
    flex: 1,
  },
  quranContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 120,
  },
  bismillah: {
    fontSize: 36,
    fontFamily: theme.fonts.quran,
    color: theme.colors.primary + 'CC',
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 64,
  },
  ayahContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  ayahHighlighted: {
    backgroundColor: theme.colors.accentGold + '15',
    borderRadius: 12,
    paddingHorizontal: theme.spacing.md,
  },
  ayahText: {
    flex: 1,
    fontSize: 36,
    fontFamily: theme.fonts.quran,
    color: '#2C3E50',
    textAlign: 'right',
    lineHeight: 72,
  },
  ayahTextHighlighted: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    textDecorationColor: theme.colors.accentGold,
  },
  ayahNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.accentGold + '66',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
    backgroundColor: theme.colors.white,
  },
  ayahNumberText: {
    fontSize: 18,
    fontFamily: theme.fonts.quran,
    color: theme.colors.accentGold,
    fontWeight: 'bold',
  },
  messagePopup: {
    position: 'absolute',
    bottom: 100,
    left: theme.spacing.md,
    right: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
  },
  messageRobot: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: theme.colors.accentOrange,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  robotIcon: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContent: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.accentOrange + '33',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageTitle: {
    fontSize: 11,
    fontFamily: theme.fonts.button,
    color: theme.colors.accentOrange,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  messageText: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
    fontWeight: '500',
    lineHeight: 24,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.white + 'CC',
    borderTopWidth: 1,
    borderTopColor: theme.colors.primary + '10',
  },
  controlButton: {
    alignItems: 'center',
    gap: 4,
  },
  controlIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reciteButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  controlLabel: {
    fontSize: 10,
    fontFamily: theme.fonts.button,
    color: theme.colors.primary + '99',
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 4,
  },
  reciteLabel: {
    color: theme.colors.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  errorSubtext: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default AIQariScreen;
