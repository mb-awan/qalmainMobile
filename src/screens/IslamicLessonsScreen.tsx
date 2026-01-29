import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme} from '../theme/colors';

const IslamicLessonsScreen = ({navigation}: any) => {
  const lessons = [
    {
      id: 1,
      title: 'Namaz',
      icon: '🕌',
      description: 'Learn how to perform Salah (Prayer)',
      color: theme.colors.primary,
    },
    {
      id: 2,
      title: 'Wuzu',
      icon: '💧',
      description: 'Step-by-step guide to Wudu (Ablution)',
      color: theme.colors.secondary,
    },
    {
      id: 3,
      title: 'Duas',
      icon: '🤲',
      description: 'Important Islamic supplications',
      color: theme.colors.primary,
    },
    {
      id: 4,
      title: 'Islamic Manners',
      icon: '👦',
      description: 'Good manners and etiquette in Islam',
      color: theme.colors.secondary,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📘 Learn Islam</Text>
        <Text style={styles.headerSubtitle}>
          Educational content for children
        </Text>
      </View>

      <View style={styles.lessonsSection}>
        {lessons.map(lesson => (
          <TouchableOpacity
            key={lesson.id}
            style={[styles.lessonCard, {borderLeftColor: lesson.color}]}
            onPress={() => {
              // Navigate to lesson detail screen
              navigation.navigate('LessonDetail', {lessonId: lesson.id});
            }}>
            <View style={styles.lessonIconContainer}>
              <Text style={styles.lessonIcon}>{lesson.icon}</Text>
            </View>
            <View style={styles.lessonContent}>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.lessonDescription}>{lesson.description}</Text>
            </View>
            <Icon
              name="chevron-right"
              size={24}
              color={theme.colors.textSecondary}
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
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: theme.fonts.heading,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.white,
    opacity: 0.9,
  },
  lessonsSection: {
    padding: theme.spacing.md,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lessonIconContainer: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  lessonIcon: {
    fontSize: 32,
  },
  lessonContent: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  lessonDescription: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
  },
});

export default IslamicLessonsScreen;


