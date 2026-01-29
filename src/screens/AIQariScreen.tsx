import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme} from '../theme/colors';

const AIQariScreen = ({navigation}: any) => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const device = useCameraDevice('front');
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    if (isActive && !isPaused) {
      // In production, this would continuously send frames to AI server
      const interval = setInterval(() => {
        analyzeFrame();
      }, 2000); // Analyze every 2 seconds

      return () => clearInterval(interval);
    }
  }, [isActive, isPaused]);

  const analyzeFrame = async () => {
    try {
      // In production, capture frame and send to AI server
      // For now, using mock responses
      const mockResponses = [
        'Beta thik se Quran dekho',
        'Parhna shuru karo',
        'Achha kar rahe ho',
        'Focus rakho',
      ];
      const randomMessage =
        mockResponses[Math.floor(Math.random() * mockResponses.length)];
      setAiMessage(randomMessage);
    } catch (error) {
      console.error('Error analyzing frame:', error);
    }
  };

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    setAiMessage('AI Qari mode started. Please look at the screen.');
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      setAiMessage('AI Qari mode resumed.');
    } else {
      setAiMessage('AI Qari mode paused.');
    }
  };

  const handleStop = () => {
    Alert.alert(
      'Stop AI Qari',
      'Are you sure you want to stop?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Stop',
          style: 'destructive',
          onPress: () => {
            setIsActive(false);
            setIsPaused(false);
            setAiMessage('');
            navigation.goBack();
          },
        },
      ],
    );
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
      {isActive ? (
        <>
          <View style={styles.cameraContainer}>
            <Camera
              ref={cameraRef}
              style={styles.camera}
              device={device}
              isActive={isActive && !isPaused}
            />
            <View style={styles.overlay}>
              <View style={styles.statusIndicator}>
                <View
                  style={[
                    styles.statusDot,
                    {backgroundColor: isPaused ? theme.colors.warning : theme.colors.success},
                  ]}
                />
                <Text style={styles.statusText}>
                  {isPaused ? 'Paused' : 'Camera Active'}
                </Text>
              </View>
            </View>
          </View>

          {aiMessage && (
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>{aiMessage}</Text>
            </View>
          )}

          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.controlButton, styles.pauseButton]}
              onPress={handlePause}>
              <Icon
                name={isPaused ? 'play-arrow' : 'pause'}
                size={24}
                color={theme.colors.white}
              />
              <Text style={styles.controlButtonText}>
                {isPaused ? 'Resume' : 'Pause'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.stopButton]}
              onPress={handleStop}>
              <Icon name="stop" size={24} color={theme.colors.white} />
              <Text style={styles.controlButtonText}>Exit</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.startContainer}>
          <Icon name="mic" size={80} color={theme.colors.primary} />
          <Text style={styles.startTitle}>AI Qari Mode</Text>
          <Text style={styles.startDescription}>
            This mode helps children focus while reading Quran by monitoring
            their attention and providing gentle guidance.
          </Text>
          <Text style={styles.startNote}>
            ⚠️ Camera access required. Parental consent recommended.
          </Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStart}>
            <Text style={styles.startButtonText}>Start AI Qari</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.md,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
  },
  statusText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.body,
    fontSize: 14,
  },
  messageContainer: {
    backgroundColor: theme.colors.warning,
    padding: theme.spacing.md,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  messageText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.body,
    fontSize: 16,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
  },
  controlButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.sm,
  },
  pauseButton: {
    backgroundColor: theme.colors.primary,
  },
  stopButton: {
    backgroundColor: theme.colors.error,
  },
  controlButtonText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.button,
    fontSize: 16,
    marginLeft: theme.spacing.xs,
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  startTitle: {
    fontSize: 28,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  startDescription: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    lineHeight: 24,
  },
  startNote: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.warning,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  startButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  startButtonText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.button,
    fontSize: 18,
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


