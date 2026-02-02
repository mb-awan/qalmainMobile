import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingScreenProps {
    navigation: any;
}

const OnboardingScreen = ({ navigation }: OnboardingScreenProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const onboardingData = [
        {
            icon: 'star',
            title: 'Welcome to Digital Qari',
            description: 'Learn the Quran with focus, clarity, and guidance.',
        },
        {
            icon: 'mic',
            title: 'AI-Assisted Recitation',
            description: 'Get gentle feedback to improve pronunciation and focus.',
        },
        {
            icon: 'menu-book',
            title: 'Read. Reflect. Progress.',
            description:
                'Track your journey with calm and consistency. Build a lifelong habit of spiritual growth.',
            showStars: true,
        },
    ];

    const handleNext = async () => {
        if (currentIndex < onboardingData.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            await AsyncStorage.setItem('hasLaunched', 'true');
            navigation.replace('SignIn');
        }
    };

    const handleSkip = async () => {
        await AsyncStorage.setItem('hasLaunched', 'true');
        navigation.replace('SignIn');
    };

    const currentData = onboardingData[currentIndex];

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    {currentIndex === 2 ? (
                        <View style={styles.bookIconContainer}>
                            <View style={styles.bookIconCircle}>
                                <Icon name="menu-book" size={96} color={theme.colors.primary} />
                            </View>
                            {currentData.showStars && (
                                <View style={styles.starsContainer}>
                                    <Icon name="star" size={16} color={theme.colors.accentGold} />
                                    <Icon name="star" size={16} color={theme.colors.accentGold} />
                                    <Icon name="star" size={16} color={theme.colors.accentGold} />
                                </View>
                            )}
                        </View>
                    ) : (
                        <View style={styles.iconCircle}>
                            <Icon name={currentData.icon} size={80} color={theme.colors.primary} />
                        </View>
                    )}
                </View>

                <Text style={styles.title}>{currentData.title}</Text>
                <Text style={styles.description}>{currentData.description}</Text>
            </View>

            <View style={styles.footer}>
                <View style={styles.pagination}>
                    {onboardingData.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.paginationDot,
                                index === currentIndex && styles.paginationDotActive,
                            ]}
                        />
                    ))}
                </View>

                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>
                        {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
                    </Text>
                    {currentIndex < onboardingData.length - 1 && (
                        <Icon name="arrow-forward" size={20} color={theme.colors.white} />
                    )}
                </TouchableOpacity>

                {currentIndex === onboardingData.length - 1 && (
                    <TouchableOpacity
                        style={styles.signInLink}
                        onPress={async () => {
                            await AsyncStorage.setItem('hasLaunched', 'true');
                            navigation.replace('SignIn');
                        }}>
                        <Text style={styles.signInText}>
                            Already have an account? <Text style={styles.signInLinkText}>Sign In</Text>
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    skipButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 1,
    },
    skipText: {
        fontSize: 16,
        fontFamily: theme.fonts.body,
        color: theme.colors.textSecondary,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xl,
    },
    iconContainer: {
        marginBottom: theme.spacing.xl,
    },
    iconCircle: {
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: theme.colors.primary + '10',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookIconContainer: {
        alignItems: 'center',
    },
    bookIconCircle: {
        width: 176,
        height: 176,
        borderRadius: 48,
        backgroundColor: theme.colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: theme.colors.primary + '05',
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 4,
        marginTop: 4,
    },
    title: {
        fontSize: 32,
        fontFamily: theme.fonts.heading,
        color: theme.colors.textPrimary,
        textAlign: 'center',
        marginBottom: theme.spacing.md,
        fontWeight: 'bold',
        lineHeight: 40,
    },
    description: {
        fontSize: 18,
        fontFamily: theme.fonts.body,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 28,
        maxWidth: SCREEN_WIDTH - 64,
    },
    footer: {
        paddingBottom: theme.spacing.xl,
        paddingHorizontal: theme.spacing.xl,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
        gap: 8,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.primary + '20',
    },
    paginationDotActive: {
        width: 24,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.colors.primary,
    },
    nextButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xl,
        borderRadius: theme.borderRadius.round,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    nextButtonText: {
        color: theme.colors.white,
        fontSize: 18,
        fontFamily: theme.fonts.button,
        fontWeight: '600',
        marginRight: theme.spacing.xs,
    },
    signInLink: {
        marginTop: theme.spacing.md,
        alignItems: 'center',
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
});

export default OnboardingScreen;
