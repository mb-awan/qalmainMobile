import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../theme/colors';

interface SignInScreenProps {
    navigation: any;
}

const SignInScreen = ({ navigation }: SignInScreenProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const handleSignIn = () => {
        // TODO: Implement sign in logic
        navigation.replace('MainTabs');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Icon name="nights-stay" size={48} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.appTitle}>Digital Qari</Text>
                    <Text style={styles.tagline}>Learn the Quran with focus and guidance</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>EMAIL</Text>
                        <TextInput
                            style={[
                                styles.input,
                                emailFocused && styles.inputFocused,
                            ]}
                            placeholder="name@example.com"
                            placeholderTextColor={theme.colors.textMuted + '66'}
                            value={email}
                            onChangeText={setEmail}
                            onFocus={() => setEmailFocused(true)}
                            onBlur={() => setEmailFocused(false)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.passwordLabelRow}>
                            <Text style={styles.label}>PASSWORD</Text>
                            <TouchableOpacity>
                                <Text style={styles.forgotText}>Forgot?</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                style={[
                                    styles.passwordInput,
                                    passwordFocused && styles.inputFocused,
                                ]}
                                placeholder="••••••••"
                                placeholderTextColor={theme.colors.textMuted + '66'}
                                value={password}
                                onChangeText={setPassword}
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => setPasswordFocused(false)}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}>
                                <Icon
                                    name={showPassword ? 'visibility' : 'visibility-off'}
                                    size={20}
                                    color={theme.colors.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
                        <Text style={styles.signInButtonText}>Sign In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.createAccountLink}
                        onPress={() => navigation.navigate('CreateAccount')}>
                        <Text style={styles.createAccountText}>
                            New here? <Text style={styles.createAccountLinkText}>Create an account</Text>
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <TouchableOpacity style={styles.socialButton}>
                        <Icon name="g-translate" size={20} color={theme.colors.textPrimary} />
                        <Text style={styles.socialButtonText}>Continue with Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.socialButton, styles.appleButton]}>
                        <Icon name="apple" size={20} color={theme.colors.white} />
                        <Text style={[styles.socialButtonText, styles.appleButtonText]}>
                            Continue with Apple
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity>
                        <Text style={styles.footerLink}>Privacy Policy</Text>
                    </TouchableOpacity>
                    <Text style={styles.footerSeparator}> • </Text>
                    <TouchableOpacity>
                        <Text style={styles.footerLink}>Terms of Use</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
    header: {
        alignItems: 'center',
        paddingTop: theme.spacing.xxl * 1.25,
        paddingBottom: theme.spacing.xl,
    },
    logoContainer: {
        marginBottom: theme.spacing.md,
    },
    appTitle: {
        fontSize: 30,
        fontFamily: theme.fonts.heading,
        color: theme.colors.textPrimary,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    tagline: {
        fontSize: 15,
        fontFamily: theme.fonts.body,
        color: theme.colors.textMuted,
        textAlign: 'center',
        maxWidth: 240,
        lineHeight: 22,
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
    input: {
        backgroundColor: 'transparent',
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        fontSize: 15,
        fontFamily: theme.fonts.body,
        color: theme.colors.textPrimary,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        height: 48,
    },
    inputFocused: {
        borderColor: theme.colors.primary,
        borderWidth: 1,
    },
    passwordLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: theme.spacing.xs,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        height: 48,
    },
    passwordInput: {
        flex: 1,
        padding: theme.spacing.md,
        fontSize: 15,
        fontFamily: theme.fonts.body,
        color: theme.colors.textPrimary,
    },
    eyeIcon: {
        padding: theme.spacing.md,
    },
    forgotText: {
        fontSize: 12,
        fontFamily: theme.fonts.body,
        color: theme.colors.primary,
        fontWeight: '500',
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
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: theme.spacing.lg,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.borderSubtle,
    },
    dividerText: {
        marginHorizontal: theme.spacing.md,
        fontSize: 11,
        fontFamily: theme.fonts.body,
        color: theme.colors.textSecondary,
        fontWeight: '700',
        letterSpacing: 3.2,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.white,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.round,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        marginBottom: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    socialButtonText: {
        fontSize: 14,
        fontFamily: theme.fonts.body,
        color: theme.colors.textPrimary,
        fontWeight: '500',
    },
    appleButton: {
        backgroundColor: theme.colors.black,
        borderColor: theme.colors.black,
    },
    appleButtonText: {
        color: theme.colors.white,
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
