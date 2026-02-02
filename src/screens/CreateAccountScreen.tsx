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

    const handleCreateAccount = () => {
        // TODO: Implement create account logic
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
                        <View style={styles.logo}>
                            <Icon name="nights-stay" size={40} color={theme.colors.primary} />
                        </View>
                    </View>
                    <Text style={styles.appTitle}>Digital Qari</Text>
                    <Text style={styles.tagline}>Create your account to begin learning</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>FULL NAME</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            placeholderTextColor={theme.colors.textMuted + '66'}
                            value={fullName}
                            onChangeText={setFullName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>EMAIL ADDRESS</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            placeholderTextColor={theme.colors.textMuted + '66'}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>PASSWORD</Text>
                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Password"
                                placeholderTextColor={theme.colors.textMuted + '66'}
                                value={password}
                                onChangeText={setPassword}
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

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>CONFIRM PASSWORD</Text>
                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Confirm Password"
                                placeholderTextColor={theme.colors.textMuted + '66'}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.eyeIcon}>
                                <Icon
                                    name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                                    size={20}
                                    color={theme.colors.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.createButton} onPress={handleCreateAccount}>
                        <Text style={styles.createButtonText}>Create Account</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.signInLink}
                        onPress={() => navigation.navigate('SignIn')}>
                        <Text style={styles.signInText}>
                            Already have an account? <Text style={styles.signInLinkText}>Sign in</Text>
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <View style={styles.socialButtonsRow}>
                        <TouchableOpacity style={styles.socialButtonSquare}>
                            <Icon name="g-translate" size={24} color={theme.colors.textPrimary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButtonSquare}>
                            <Icon name="apple" size={24} color={theme.colors.textPrimary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        By creating an account, you agree to our{' '}
                        <Text style={styles.footerLink}>Terms</Text> and{' '}
                        <Text style={styles.footerLink}>Privacy Policy.</Text>
                    </Text>
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
    logo: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: theme.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
    },
    appTitle: {
        fontSize: 30,
        fontFamily: theme.fonts.heading,
        color: theme.colors.primary,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    tagline: {
        fontSize: 14,
        fontFamily: theme.fonts.body,
        color: theme.colors.primary,
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
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.xs,
        fontWeight: '600',
        letterSpacing: 0.5,
        marginLeft: 4,
    },
    input: {
        backgroundColor: 'transparent',
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        fontSize: 16,
        fontFamily: theme.fonts.body,
        color: theme.colors.textPrimary,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        height: 56,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
        height: 56,
    },
    passwordInput: {
        flex: 1,
        padding: theme.spacing.md,
        fontSize: 16,
        fontFamily: theme.fonts.body,
        color: theme.colors.textPrimary,
    },
    eyeIcon: {
        padding: theme.spacing.md,
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
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: theme.spacing.xl,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.borderSubtle,
    },
    dividerText: {
        marginHorizontal: theme.spacing.md,
        fontSize: 10,
        fontFamily: theme.fonts.body,
        color: theme.colors.textSecondary,
        fontWeight: '700',
        letterSpacing: 2,
    },
    socialButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: theme.spacing.md,
    },
    socialButtonSquare: {
        flex: 1,
        aspectRatio: 1,
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.borderSubtle,
    },
    footer: {
        paddingHorizontal: theme.spacing.xl,
        marginTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,
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
});

export default CreateAccountScreen;
