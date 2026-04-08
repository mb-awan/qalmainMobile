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
import { validateEmail } from '../utils/validation';
import { FormField } from '../components/FormField';
import { ModalMessage } from '../components/ModalMessage';
import { AuthBrandHeader } from '../components/AuthBrandHeader';
import { AuthSocialSection } from '../components/AuthSocialSection';
import { LegalDocumentModal } from '../components/LegalDocumentModal';

interface SignInScreenProps {
    navigation: any;
}

const SignInScreen = ({ navigation }: SignInScreenProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
        email: false,
        password: false,
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
        const eErr = validateEmail(email);
        const pErr = !password ? 'Password is required.' : null;
        return { email: eErr, password: pErr };
    }, [email, password]);

    const canSubmit = useMemo(() => {
        return !loading && !errors.email && !errors.password;
    }, [errors.email, errors.password, loading]);

    const showSocialUnavailable = (provider: 'Google' | 'Apple') => {
        setModal({
            visible: true,
            title: `${provider} sign in`,
            message: `${provider} login is not available at the moment. Please use email and password.`,
            variant: 'info',
        });
    };

    const handleSignIn = async () => {
        setTouched({ email: true, password: true });
        setSubmitError(null);
        if (errors.email || errors.password) return;
        setLoading(true);
        try {
            const { data } = await userAPI.login({ email: email.trim(), password });
            if (!data?.success || !data?.data) {
                setSubmitError(data?.error?.message || 'Sign in failed.');
                return;
            }
            const payload = data.data as {
                requiresTwoFactor?: boolean;
                twoFactorToken?: string;
                token?: string;
                user?: { emailVerified?: boolean; email?: string };
            };
            if (payload.requiresTwoFactor && payload.twoFactorToken) {
                navigation.navigate('TwoFactorLogin', {
                    twoFactorToken: payload.twoFactorToken,
                    emailHint: payload.user?.email,
                });
                return;
            }
            if (payload.token) {
                await setAuthToken(payload.token);
                if (payload.user && payload.user.emailVerified === false) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'VerifyEmail' }],
                    });
                } else {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'MainTabs' }],
                    });
                }
            } else {
                setSubmitError('Sign in failed.');
            }
        } catch (err: any) {
            const msg = err.response?.data?.error?.message || err.message || 'Sign in failed.';
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
                <AuthBrandHeader subtitle="Learn the Quran with focus and guidance" />

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <FormField
                            label="EMAIL"
                            value={email}
                            onChangeText={t => setEmail(t)}
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
                        <View style={styles.passwordLabelRow}>
                            <Text style={styles.label}>PASSWORD</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                                <Text style={styles.forgotText}>Forgot?</Text>
                            </TouchableOpacity>
                        </View>
                        <FormField
                            label=""
                            value={password}
                            onChangeText={t => setPassword(t)}
                            placeholder="••••••••"
                            secureTextEntry={!showPassword}
                            autoComplete="password"
                            textContentType="password"
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

                    {submitError ? (
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() =>
                                setModal({
                                    visible: true,
                                    title: 'Sign in failed',
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
                        style={[
                            styles.signInButton,
                            (!canSubmit || loading) && styles.buttonDisabled,
                        ]}
                        onPress={handleSignIn}
                        disabled={!canSubmit || loading}>
                        {loading ? (
                            <ActivityIndicator color={theme.colors.white} />
                        ) : (
                            <Text style={styles.signInButtonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.createAccountLink}
                        onPress={() => navigation.navigate('CreateAccount')}>
                        <Text style={styles.createAccountText}>
                            New here? <Text style={styles.createAccountLinkText}>Create an account</Text>
                        </Text>
                    </TouchableOpacity>

                    <AuthSocialSection
                        onGooglePress={() => showSocialUnavailable('Google')}
                        onApplePress={() => showSocialUnavailable('Apple')}
                    />
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity onPress={() => setLegalModalType('privacy')}>
                        <Text style={styles.footerLink}>Privacy Policy</Text>
                    </TouchableOpacity>
                    <Text style={styles.footerSeparator}> • </Text>
                    <TouchableOpacity onPress={() => setLegalModalType('terms')}>
                        <Text style={styles.footerLink}>Terms of Use</Text>
                    </TouchableOpacity>
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
    label: {
        fontSize: 12,
        fontFamily: theme.fonts.body,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
        fontWeight: '600',
        letterSpacing: 0.5,
        marginLeft: 4,
    },
    passwordLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: theme.spacing.xs,
    },
    forgotText: {
        fontSize: 12,
        fontFamily: theme.fonts.body,
        color: theme.colors.primary,
        fontWeight: '500',
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
    signInButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.md + 2,
        borderRadius: theme.borderRadius.round,
        alignItems: 'center',
        marginTop: theme.spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    signInButtonText: {
        color: theme.colors.white,
        fontSize: 16,
        fontFamily: theme.fonts.button,
        fontWeight: '600',
    },
    buttonDisabled: {
        opacity: 0.55,
    },
    createAccountLink: {
        alignItems: 'center',
        marginTop: theme.spacing.md,
    },
    createAccountText: {
        fontSize: 14,
        fontFamily: theme.fonts.body,
        color: theme.colors.textMuted,
    },
    createAccountLinkText: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: theme.spacing.xl,
        paddingHorizontal: theme.spacing.xl,
    },
    footerLink: {
        fontSize: 12,
        fontFamily: theme.fonts.body,
        color: theme.colors.textSecondary + '99',
    },
    footerSeparator: {
        fontSize: 12,
        color: theme.colors.textSecondary + '99',
    },
});

export default SignInScreen;
