import React, { useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../theme/colors';

type RightIcon =
  | { kind: 'none' }
  | {
      kind: 'button';
      icon: string;
      accessibilityLabel: string;
      onPress: () => void;
    };

export type FormFieldProps = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
  secureTextEntry?: boolean;
  textContentType?: TextInputProps['textContentType'];
  error?: string | null;
  touched?: boolean;
  containerStyle?: ViewStyle;
  rightIcon?: RightIcon;
  maxLength?: number;
  inputMode?: TextInputProps['inputMode'];
  onBlur?: () => void;
  onFocus?: () => void;
  returnKeyType?: TextInputProps['returnKeyType'];
  onSubmitEditing?: TextInputProps['onSubmitEditing'];
};

export function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  autoCapitalize,
  autoComplete,
  secureTextEntry,
  textContentType,
  error,
  touched,
  containerStyle,
  rightIcon = { kind: 'none' },
  maxLength,
  inputMode,
  onBlur,
  onFocus,
  returnKeyType,
  onSubmitEditing,
}: FormFieldProps): React.JSX.Element {
  const showError = Boolean(touched && error);
  const borderColor = useMemo(() => {
    if (showError) return theme.colors.error;
    return theme.colors.borderSubtle;
  }, [showError]);

  return (
    <View style={containerStyle}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputWrap, { borderColor }]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textMuted + '66'}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          secureTextEntry={secureTextEntry}
          textContentType={textContentType}
          maxLength={maxLength}
          inputMode={inputMode}
          onBlur={onBlur}
          onFocus={onFocus}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />
        {rightIcon.kind === 'button' ? (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={rightIcon.accessibilityLabel}
            onPress={rightIcon.onPress}
            style={styles.iconBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon name={rightIcon.icon} size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>
      {showError ? <Text style={styles.errorText}>{error}</Text> : <View style={styles.errorSpacer} />}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    height: 54,
    paddingHorizontal: theme.spacing.md,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
    paddingVertical: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  iconBtn: {
    marginLeft: theme.spacing.sm,
    padding: 6,
    borderRadius: 999,
  },
  errorText: {
    marginTop: 6,
    marginLeft: 4,
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.error,
    lineHeight: 16,
  },
  errorSpacer: {
    height: 22,
  },
});

