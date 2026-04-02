import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../theme/colors';

export type ModalMessageVariant = 'info' | 'success' | 'error';

export type ModalMessageProps = {
  visible: boolean;
  variant?: ModalMessageVariant;
  title: string;
  message: string;
  primaryText?: string;
  onPrimary?: () => void;
  secondaryText?: string;
  onSecondary?: () => void;
  onDismiss: () => void;
};

function iconFor(variant: ModalMessageVariant): { name: string; color: string } {
  switch (variant) {
    case 'success':
      return { name: 'check-circle', color: theme.colors.success };
    case 'error':
      return { name: 'error', color: theme.colors.error };
    default:
      return { name: 'info', color: theme.colors.primary };
  }
}

export function ModalMessage({
  visible,
  variant = 'info',
  title,
  message,
  primaryText = 'OK',
  onPrimary,
  secondaryText,
  onSecondary,
  onDismiss,
}: ModalMessageProps): React.JSX.Element {
  const icon = iconFor(variant);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <Pressable style={styles.backdrop} onPress={onDismiss} />
      <View style={styles.center}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={[styles.iconWrap, { backgroundColor: icon.color + '1A' }]}>
              <Icon name={icon.name} size={22} color={icon.color} />
            </View>
            <Text style={styles.title}>{title}</Text>
          </View>

          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            {secondaryText ? (
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => {
                  onSecondary?.();
                  onDismiss();
                }}
                style={styles.secondaryBtn}>
                <Text style={styles.secondaryText}>{secondaryText}</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => {
                onPrimary?.();
                onDismiss();
              }}
              style={styles.primaryBtn}>
              <Text style={styles.primaryText}>{primaryText}</Text>
            </TouchableOpacity>
          </View>
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
    maxWidth: 420,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  message: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  secondaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.iosGrey,
  },
  secondaryText: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  primaryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.primary,
  },
  primaryText: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.white,
    fontWeight: '700',
  },
});

