import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {theme} from '../theme/colors';

interface FeedbackScreenProps {
  navigation: any;
}

const FeedbackScreen = ({navigation}: FeedbackScreenProps) => {
  const [rating, setRating] = useState(4);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    // TODO: Implement feedback submission
    console.log('Feedback submitted:', {rating, feedback});
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Icon name="feedback" size={40} color={theme.colors.primary} />
          </View>
        </View>

        <Text style={styles.title}>Your Feedback Matters</Text>
        <Text style={styles.subtitle}>Help us improve your learning experience</Text>

        <View style={styles.ratingSection}>
          <Text style={styles.ratingLabel}>HOW WAS YOUR EXPERIENCE?</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star)}
                style={styles.starButton}>
                <Icon
                  name={star <= rating ? 'star' : 'star-border'}
                  size={40}
                  color={star <= rating ? theme.colors.gold : theme.colors.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.feedbackSection}>
          <Text style={styles.feedbackLabel}>Feedback</Text>
          <TextInput
            style={styles.feedbackInput}
            placeholder="Share your thoughts (optional)"
            placeholderTextColor={theme.colors.textSecondary}
            value={feedback}
            onChangeText={setFeedback}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.laterButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.laterButtonText}>Maybe later</Text>
        </TouchableOpacity>
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
    padding: theme.spacing.md,
  },
  content: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: theme.spacing.xl,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.lightTeal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fonts.heading,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  ratingSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  ratingLabel: {
    fontSize: 12,
    fontFamily: theme.fonts.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    fontWeight: '600',
    letterSpacing: 1,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  starButton: {
    padding: theme.spacing.xs,
  },
  feedbackSection: {
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  feedbackLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  feedbackInput: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    fontFamily: theme.fonts.body,
    color: theme.colors.textPrimary,
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
    opacity: 0.3,
    minHeight: 120,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    width: '100%',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  submitButtonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontFamily: theme.fonts.button,
    fontWeight: '600',
  },
  laterButton: {
    paddingVertical: theme.spacing.sm,
  },
  laterButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontFamily: theme.fonts.body,
  },
});

export default FeedbackScreen;
