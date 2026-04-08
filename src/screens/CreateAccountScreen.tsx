import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../theme/colors';
import { userAPI, setAuthToken } from '../services/api';
import { validateEmail, validatePassword, validateName } from '../utils/validation';
import { FormField } from '../components/FormField';
import { ModalMessage } from '../components/ModalMessage';
import { AuthBrandHeader } from '../components/AuthBrandHeader';
import { AuthSocialSection } from '../components/AuthSocialSection';
import { LegalDocumentModal } from '../components/LegalDocumentModal';

interface CreateAccountScreenProps {
    navigation: any;
}

const CreateAccountScreen = ({ navigation }: CreateAccountScreenProps) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState<{
        fullName: boolean;
        email: boolean;
        password: boolean;
        confirmPassword: boolean;
    }>({
        fullName: false,
        email: false,
        password: false,
        confirmPassword: false,
    });
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);
    const [modal, setModal] = useState<{
        visible: boolean;
        title: string;
        message: string;
        variant?: 'info' | 'success' | 'error';
    }>({
        visible: false,
        title: '',
        message: '',
        variant: 'info',
    });

    const errors = useMemo(() => {
        const nErr = validateName(fullName);
        const eErr = validateEmail(email);
        const pErr = validatePassword(password);
        const cErr = !confirmPassword
            ? 'Please confirm your password.'
            : password !== confirmPassword
                ? 'Passwords do not match.'
                : null;
        return { fullName: nErr, email: eErr, password: pErr, confirmPassword: cErr };
    }, [confirmPassword, email, fullName, password]);

    const canSubmit = useMemo(() => {
        return (
            !loading &&
            !errors.fullName &&
            !errors.email &&
            !errors.password &&
            !errors.confirmPassword
        );
    }, [errors, loading]);

    const showSocialUnavailable = (provider: 'Google' | 'Apple') => {
        setModal({
            visible: true,
            title: `${provider} sign in`,
            message: `${provider} login is not available at the moment. Please use email and password.`,
            variant: 'info',
        });
    };

    const handleCreateAccount = async () => {
        setTouched({
            fullName: true,
            email: true,
            password: true,
            confirmPassword: true,
        });
        setSubmitError(null);
        if (
            errors.fullName ||
            errors.email ||
            errors.password ||
            errors.confirmPassword
        ) {
            return;
        }
        setLoading(true);
        try {
            const { data } = await userAPI.register({
                email: email.trim(),
                password,
                name: fullName.trim() || undefined,
            });
            if (data?.success && data?.data?.token) {
                await setAuthToken(data.data.token);
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'VerifyEmail' }],
                });
            } else {
                setSubmitError(data?.error?.message || 'Registration failed.');
            }
        } catch (err: any) {
            const msg = err.response?.data?.error?.message || err.message || 'Registration failed.';
            setSubmitError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled">
                <AuthBrandHeader subtitle="Create your account to begin learning" />

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <FormField
                            label="FULL NAME"
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Full name"
                            autoCapitalize="words"
                            autoComplete="name"
                            textContentType="name"
                            touched={touched.fullName}
                            error={errors.fullName}
                            onBlur={() => setTouched(s => ({ ...s, fullName: true }))}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <FormField
                            label="EMAIL ADDRESS"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="name@example.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            textContentType="emailAddress"
                            touched={touched.email}
                            error={errors.email}
                            onBlur={() => setTouched(s => ({ ...s, email: true }))}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <FormField
                            label="PASSWORD"
                            value={password}
                            onChangeText={setPassword}
                            placeholder="8+ chars, upper, lower, number"
                            secureTextEntry={!showPassword}
                            autoComplete="password-new"
                            textContentType="newPassword"
                            touched={touched.password}
                            error={errors.password}
                            onBlur={() => setTouched(s => ({ ...s, password: true }))}
                            rightIcon={{
                                kind: 'button',
                                icon: showPassword ? 'visibility' : 'visibility-off',
                                accessibilityLabel: showPassword ? 'Hide password' : 'Show password',
                                onPress: () => setShowPassword(v => !v),
                            }}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <FormField
                            label="CONFIRM PASSWORD"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Repeat password"
                            secureTextEntry={!showConfirmPassword}
                            autoComplete="password-new"
                            textContentType="newPassword"
                            touched={touched.confirmPassword}
                            error={errors.confirmPassword}
                            onBlur={() => setTouched(s => ({ ...s, confirmPassword: true }))}
                            rightIcon={{
                                kind: 'button',
                                icon: showConfirmPassword ? 'visibility' : 'visibility-off',
                                accessibilityLabel: showConfirmPassword
                                    ? 'Hide confirm password'
                                    : 'Show confirm password',
                                onPress: () => setShowConfirmPassword(v => !v),
                            }}
                        />
                    </View>

                    {submitError ? (
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() =>
                                setModal({
                                    visible: true,
                                    title: 'Could not create account',
                                    message: submitError,
                                    variant: 'error',
                                })
                            }
                            style={styles.inlineError}>
                            <Icon name="error-outline" size={18} color={theme.colors.error} />
                            <Text style={styles.inlineErrorText} numberOfLines={2}>
                                {submitError}
                            </Text>
                            <Text style={styles.inlineErrorCta}>Details</Text>
                        </TouchableOpacity>
                    ) : null}

                    <TouchableOpacity
                        style={[styles.createButton, (!canSubmit || loading) && styles.createButtonDisabled]}
                        onPress={handleCreateAccount}
                        disabled={!canSubmit || loading}>
                        {loading ? (
                            <ActivityIndicator color={theme.colors.white} />
                        ) : (
                            <Text style={styles.createButtonText}>Create Account</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.signInLink}
                        onPress={() => navigation.navigate('SignIn')}>
                        <Text style={styles.signInText}>
                            Already have an account? <Text style={styles.signInLinkText}>Sign in</Text>
                        </Text>
                    </TouchableOpacity>

                    <AuthSocialSection
                        onGooglePress={() => showSocialUnavailable('Google')}
                        onApplePress={() => showSocialUnavailable('Apple')}
                    />
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>By creating an account, you agree to our </Text>
                    <View style={styles.footerLinksRow}>
                        <TouchableOpacity onPress={() => setLegalModalType('terms')}>
                            <Text style={styles.footerLink}>Terms</Text>
                        </TouchableOpacity>
                        <Text style={styles.footerText}> and </Text>
                        <TouchableOpacity onPress={() => setLegalModalType('privacy')}>
                            <Text style={styles.footerLink}>Privacy Policy</Text>
                        </TouchableOpacity>
                        <Text style={styles.footerText}>.</Text>
                    </View>
                </View>
            </ScrollView>
            <ModalMessage
                visible={modal.visible}
                variant={modal.variant}
                title={modal.title}
                message={modal.message}
                onDismiss={() => setModal(s => ({ ...s, visible: false }))}
            />
            <LegalDocumentModal
                visible={!!legalModalType}
                type={legalModalType || 'privacy'}
                onClose={() => setLegalModalType(null)}
            />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.backgroundLight,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: theme.spacing.xl,
    },
    form: {
        paddingHorizontal: theme.spacing.xl,
    },
    inputGroup: {
        marginBottom: theme.spacing.lg,
    },
    inlineError: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        marginTop: -theme.spacing.sm,
        marginBottom: theme.spacing.sm,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.error + '33',
        backgroundColor: theme.colors.error + '0D',
    },
    inlineErrorText: {
        flex: 1,
        fontSize: 13,
        fontFamily: theme.fonts.body,
        color: theme.colors.textPrimary,
        lineHeight: 18,
    },
    inlineErrorCta: {
        fontSize: 12,
        fontFamily: theme.fonts.body,
        color: theme.colors.primary,
        fontWeight: '700',
    },
    createButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.md + 2,
        borderRadius: theme.borderRadius.round,
        alignItems: 'center',
        marginTop: theme.spacing.md,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    createButtonText: {
        color: theme.colors.white,
        fontSize: 16,
        fontFamily: theme.fonts.button,
        fontWeight: '600',
    },
    createButtonDisabled: {
        opacity: 0.55,
    },
    signInLink: {
        alignItems: 'center',
        marginTop: theme.spacing.md,
    },
    signInText: {
        fontSize: 14,
        fontFamily: theme.fonts.body,
        color: theme.colors.textSecondary,
    },
    signInLinkText: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
    footer: {
        paddingHorizontal: theme.spacing.xl,
        marginTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 11,
        fontFamily: theme.fonts.body,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 18,
    },
    footerLink: {
        textDecorationLine: 'underline',
        color: theme.colors.textPrimary,
    },
    footerLinksRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default CreateAccountScreen;
