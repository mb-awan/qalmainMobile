import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../theme/colors';
import { userAPI, clearAuthToken } from '../services/api';
import { resetToSignIn } from '../navigation/navigationRef';

interface ProfileScreenProps {
    navigation: any;
}

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [emailVerified, setEmailVerified] = useState(true);
    const [profileLoading, setProfileLoading] = useState(true);

    const loadProfile = useCallback(async () => {
        setProfileLoading(true);
        try {
            const { data } = await userAPI.getProfile();
            const u = data?.data?.user;
            if (u) {
                setUserName(u.name || '');
                setUserEmail(u.email || '');
                setEmailVerified(u.emailVerified !== false);
            }
        } catch {
            /* 401 clears session */
        } finally {
            setProfileLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            void loadProfile();
        }, [loadProfile])
    );

    const handleLogout = () => {
        Alert.alert('Log out?', 'You will need to sign in again to use your account.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Log out',
                style: 'destructive',
                onPress: async () => {
                    await clearAuthToken();
                    resetToSignIn();
                },
            },
        ]);
    };

    const menuItems = [
        {
            id: 'edit',
            icon: 'person',
            label: 'Edit Profile',
            action: () =>
                Alert.alert(
                    'Edit profile',
                    'Name and email can be updated from account settings on the web admin soon. For security changes, use the settings icon.',
                ),
        },
        {
            id: 'security',
            icon: 'shield',
            label: 'Account security',
            subtitle: 'Password, email verification, 2-step',
            action: () => navigation.navigate('AccountSecurity'),
        },
        {
            id: 'subscription',
            icon: 'card-membership',
            label: 'Subscription Plan',
            subtitle: 'Free Plan',
            action: () => navigation.navigate('Subscription'),
        },
        {
            id: 'preferences',
            icon: 'tune',
            label: 'Reading Preferences',
            action: () => { },
        },
        {
            id: 'bookmarks',
            icon: 'bookmark',
            label: 'Bookmarks',
            action: () => navigation.navigate('Bookmarks'),
        },
        {
            id: 'help',
            icon: 'help',
            label: 'Help & Support',
            action: () => { },
        },
        {
            id: 'privacy',
            icon: 'verified-user',
            label: 'Privacy Policy',
            action: () => { },
        },
        {
            id: 'logout',
            icon: 'logout',
            label: 'Log Out',
            isDestructive: true,
            action: handleLogout,
        },
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back-ios" size={20} color={theme.colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('AccountSecurity')}
                    accessibilityLabel="Security settings">
                    <Icon name="settings" size={24} color={theme.colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        {/* In production, use Image component with actual profile picture */}
                        <Icon name="person" size={60} color={theme.colors.primary} />
                    </View>
                    {emailVerified && (
                        <View style={styles.verifiedBadge}>
                            <Icon name="verified" size={14} color={theme.colors.white} />
                        </View>
                    )}
                </View>
                {profileLoading ? (
                    <ActivityIndicator
                        style={{ marginVertical: theme.spacing.md }}
                        color={theme.colors.primary}
                    />
                ) : (
                    <>
                        <Text style={styles.userName}>
                            {userName || 'Learner'}
                        </Text>
                        <Text style={styles.userRole} numberOfLines={1}>
                            {userEmail || ' '}
                        </Text>
                    </>
                )}
            </View>

            <View style={styles.statsSection}>
                <View style={styles.statItem}>
                    <Icon name="auto-stories" size={24} color={theme.colors.accentGold} />
                    <Text style={styles.statLabel}>LAST READ</Text>
                    <Text style={styles.statValue}>Al-Baqarah</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Icon name="local-fire-department" size={24} color={theme.colors.accentGold} />
                    <Text style={styles.statLabel}>CONSISTENCY</Text>
                    <Text style={styles.statValue}>4 days streak</Text>
                </View>
            </View>

            <View style={styles.menuSection}>
                <Text style={styles.sectionTitle}>ACCOUNT SETTINGS</Text>
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={item.id}
                        style={[
                            styles.menuItem,
                            index === menuItems.length - 1 && styles.lastMenuItem,
                        ]}
                        onPress={item.action}>
                        <View style={styles.menuItemLeft}>
                            <Icon
                                name={item.icon}
                                size={20}
                                color={item.isDestructive ? theme.colors.error : theme.colors.primary}
                            />
                            <View style={styles.menuItemText}>
                                <Text
                                    style={[
                                        styles.menuItemLabel,
                                        item.isDestructive && styles.destructiveText,
                                    ]}>
                                    {item.label}
                                </Text>
                                {item.subtitle && (
                                    <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                                )}
                            </View>
                        </View>
                        <Icon
                            name="chevron-right"
                            size={18}
                            color={theme.colors.iosDivider}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.md,
        paddingBottom: theme.spacing.sm,
        backgroundColor: theme.colors.white,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: theme.fonts.heading,
        color: theme.colors.textPrimary,
        fontWeight: '600',
    },
    profileSection: {
        alignItems: 'center',
        paddingVertical: theme.spacing.xl,
        paddingHorizontal: theme.spacing.md,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: theme.spacing.md,
    },
    avatar: {
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: theme.colors.backgroundLight,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 4,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    userName: {
        fontSize: 24,
        fontFamily: theme.fonts.heading,
        color: theme.colors.textPrimary,
        fontWeight: '600',
        marginBottom: theme.spacing.xs,
    },
    userRole: {
        fontSize: 16,
        fontFamily: theme.fonts.body,
        color: theme.colors.primary,
        fontWeight: '500',
    },
    statsSection: {
        flexDirection: 'row',
        backgroundColor: theme.colors.white,
        marginHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.xl,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        gap: theme.spacing.xs + 2,
    },
    statDivider: {
        width: 1,
        height: 32,
        backgroundColor: theme.colors.iosDivider,
    },
    statLabel: {
        fontSize: 10,
        fontFamily: theme.fonts.body,
        color: theme.colors.textSecondary,
        fontWeight: '700',
        letterSpacing: 1.2,
        textAlign: 'center',
    },
    statValue: {
        fontSize: 14,
        fontFamily: theme.fonts.heading,
        color: theme.colors.textPrimary,
        fontWeight: '500',
    },
    menuSection: {
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
        fontSize: 12,
        fontFamily: theme.fonts.body,
        color: theme.colors.primary,
        fontWeight: '700',
        marginBottom: theme.spacing.md,
        letterSpacing: 2,
        paddingHorizontal: theme.spacing.sm,
        paddingTop: theme.spacing.md,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.iosDivider,
    },
    lastMenuItem: {
        borderBottomWidth: 0,
        marginTop: theme.spacing.sm,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: theme.spacing.md,
    },
    menuItemText: {
        flex: 1,
    },
    menuItemLabel: {
        fontSize: 14,
        fontFamily: theme.fonts.body,
        color: theme.colors.textPrimary,
        fontWeight: '500',
    },
    menuItemSubtitle: {
        fontSize: 12,
        fontFamily: theme.fonts.body,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
        fontWeight: '500',
    },
    destructiveText: {
        color: theme.colors.error,
    },
});

export default ProfileScreen;
