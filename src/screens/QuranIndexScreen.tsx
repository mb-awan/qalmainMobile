import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../theme/colors';

interface QuranIndexScreenProps {
    navigation: any;
}

interface Surah {
    id: number;
    name: string;
    nameArabic: string;
    meaning: string;
    ayahs: number;
    revelation: string;
}

interface Juz {
    id: number;
    range: string;
    arabic: string;
}

const QuranIndexScreen = ({ navigation }: QuranIndexScreenProps) => {
    const [activeTab, setActiveTab] = useState<'surah' | 'juz'>('surah');
    const [searchQuery, setSearchQuery] = useState('');

    // Mock data - In production, this would come from API
    const surahs: Surah[] = [
        {
            id: 1,
            name: 'Al-Fatihah',
            nameArabic: 'الفاتحة',
            meaning: 'The Opening',
            ayahs: 7,
            revelation: 'Meccan',
        },
        {
            id: 2,
            name: 'Al-Baqarah',
            nameArabic: 'البقرة',
            meaning: 'The Cow',
            ayahs: 286,
            revelation: 'Medinan',
        },
        {
            id: 3,
            name: "Ali 'Imran",
            nameArabic: 'آل عمران',
            meaning: 'Family of Imran',
            ayahs: 200,
            revelation: 'Medinan',
        },
        {
            id: 4,
            name: "An-Nisa'",
            nameArabic: 'النساء',
            meaning: 'The Women',
            ayahs: 176,
            revelation: 'Medinan',
        },
        {
            id: 5,
            name: "Al-Ma'idah",
            nameArabic: 'المائدة',
            meaning: 'The Table Spread',
            ayahs: 120,
            revelation: 'Medinan',
        },
        {
            id: 6,
            name: "Al-An'am",
            nameArabic: 'الأنعام',
            meaning: 'The Cattle',
            ayahs: 165,
            revelation: 'Meccan',
        },
        {
            id: 7,
            name: "Al-A'raf",
            nameArabic: 'الأعراف',
            meaning: 'The Heights',
            ayahs: 206,
            revelation: 'Meccan',
        },
    ];

    const juzs: Juz[] = [
        { id: 1, range: 'Al-Fatiha 1 - Al-Baqarah 141', arabic: 'الجزء ١' },
        { id: 2, range: 'Al-Baqarah 142 - Al-Baqarah 252', arabic: 'الجزء ٢' },
        { id: 3, range: 'Al-Baqarah 253 - Ali Imran 92', arabic: 'الجزء ٣' },
        { id: 4, range: 'Ali Imran 93 - An-Nisa 23', arabic: 'الجزء ٤' },
        { id: 5, range: 'An-Nisa 24 - An-Nisa 147', arabic: 'الجزء ٥' },
        { id: 6, range: 'An-Nisa 148 - Al-Maidah 81', arabic: 'الجزء ٦' },
        { id: 7, range: 'Al-Maidah 82 - Al-Anam 110', arabic: 'الجزء ٧' },
    ];

    const filteredSurahs = surahs.filter(surah =>
        surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.meaning.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const filteredJuzs = juzs.filter(juz =>
        juz.range.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const renderSurahItem = ({ item }: { item: Surah }) => (
        <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigation.navigate('Quran', { surahId: item.id })}>
            <View style={styles.numberBadge}>
                <Text style={styles.numberText}>{item.id}</Text>
            </View>
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemSubtitle}>
                    {item.meaning} • {item.ayahs} Ayahs • {item.revelation}
                </Text>
            </View>
            <Text style={styles.arabicText}>{item.nameArabic}</Text>
        </TouchableOpacity>
    );

    const renderJuzItem = ({ item }: { item: Juz }) => (
        <TouchableOpacity
            style={styles.listItem}
            onPress={() => navigation.navigate('Quran', { juzId: item.id })}>
            <View style={styles.numberBadge}>
                <Text style={styles.numberText}>{item.id}</Text>
            </View>
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>Juz {item.id}</Text>
                <Text style={styles.itemSubtitle}>{item.range}</Text>
            </View>
            <Text style={styles.arabicText}>{item.arabic}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Quran Index</Text>
                <TouchableOpacity>
                    <Icon name="more-vert" size={24} color={theme.colors.textPrimary} />
                </TouchableOpacity>
            </View>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'surah' && styles.tabActive]}
                    onPress={() => setActiveTab('surah')}>
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'surah' && styles.tabTextActive,
                        ]}>
                        Surah
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'juz' && styles.tabActive]}
                    onPress={() => setActiveTab('juz')}>
                    <Text
                        style={[styles.tabText, activeTab === 'juz' && styles.tabTextActive]}>
                        Juz
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Icon name="search" size={20} color={theme.colors.textSecondary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder={activeTab === 'surah' ? 'Search Surah' : 'Search Juz'}
                    placeholderTextColor={theme.colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {activeTab === 'surah' ? (
                <FlatList
                    data={filteredSurahs}
                    renderItem={renderSurahItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <FlatList
                    data={filteredJuzs}
                    renderItem={renderJuzItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.backgroundLight,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.md,
        backgroundColor: theme.colors.white,
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: theme.fonts.heading,
        color: theme.colors.textPrimary,
        fontWeight: 'bold',
    },
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    tab: {
        flex: 1,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.white,
        alignItems: 'center',
    },
    tabActive: {
        backgroundColor: theme.colors.primary,
    },
    tabText: {
        fontSize: 16,
        fontFamily: theme.fonts.body,
        color: theme.colors.textSecondary,
    },
    tabTextActive: {
        color: theme.colors.white,
        fontWeight: '600',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        marginHorizontal: theme.spacing.md,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        gap: theme.spacing.sm,
    },
    searchInput: {
        flex: 1,
        paddingVertical: theme.spacing.md,
        fontSize: 16,
        fontFamily: theme.fonts.body,
        color: theme.colors.textPrimary,
    },
    listContainer: {
        padding: theme.spacing.md,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.white,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
    },
    numberBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: theme.colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    numberText: {
        fontSize: 16,
        fontFamily: theme.fonts.heading,
        color: theme.colors.textPrimary,
        fontWeight: 'bold',
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 18,
        fontFamily: theme.fonts.heading,
        color: theme.colors.textPrimary,
        fontWeight: 'bold',
        marginBottom: theme.spacing.xs,
    },
    itemSubtitle: {
        fontSize: 14,
        fontFamily: theme.fonts.body,
        color: theme.colors.textSecondary,
    },
    arabicText: {
        fontSize: 20,
        fontFamily: theme.fonts.quran,
        color: theme.colors.primary,
        marginLeft: theme.spacing.sm,
    },
});

export default QuranIndexScreen;
