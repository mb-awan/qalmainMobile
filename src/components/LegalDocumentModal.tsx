import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { theme } from '../theme/colors';

type LegalDocumentType = 'privacy' | 'terms';

type LegalDocumentModalProps = {
  visible: boolean;
  type: LegalDocumentType;
  onClose: () => void;
};

const contentByType: Record<LegalDocumentType, { title: string; body: string }> = {
  privacy: {
    title: 'Privacy Policy',
    body:
      'We value your privacy. We collect only the information needed to provide account access, app features, and support. ' +
      'This may include your name, email address, authentication details, and app usage data. We do not sell your personal information.\n\n' +
      'Location, camera, and microphone permissions are requested only when you use features that require them, such as prayer-time accuracy or AI-assisted recitation tools. ' +
      'You can manage permissions in your device settings at any time.\n\n' +
      'We use industry-standard security practices to protect your data. By using this app, you agree to this policy.',
  },
  terms: {
    title: 'Terms of Use',
    body:
      'By using this app, you agree to use it responsibly and in accordance with applicable laws. ' +
      'Your account credentials are your responsibility, and you should keep them secure.\n\n' +
      'The app content and features are provided to support learning and practice. We may update, improve, or discontinue features at any time. ' +
      'Misuse of the app or attempts to disrupt service may result in account restrictions.\n\n' +
      'By continuing to use the app, you agree to these terms and future updates.',
  },
};

export function LegalDocumentModal({
  visible,
  type,
  onClose,
}: LegalDocumentModalProps): React.JSX.Element {
  const content = contentByType[type];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.center}>
        <View style={styles.card}>
          <Text style={styles.title}>{content.title}</Text>
          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollAreaContent}>
            <Text style={styles.body}>{content.body}</Text>
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00000066',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    maxHeight: '75%',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  title: {
    fontSize: 18,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  scrollArea: {
    flexGrow: 0,
  },
  scrollAreaContent: {
    paddingBottom: theme.spacing.md,
  },
  body: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
  closeButton: {
    marginTop: theme.spacing.sm,
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.round,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  closeButtonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontFamily: theme.fonts.button,
    fontWeight: '600',
  },
});

