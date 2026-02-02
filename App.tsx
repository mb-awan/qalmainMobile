import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Auth & Onboarding Screens
import OnboardingScreen from './src/screens/OnboardingScreen';
import SignInScreen from './src/screens/SignInScreen';
import CreateAccountScreen from './src/screens/CreateAccountScreen';

// Main Screens
import HomeScreen from './src/screens/HomeScreen';
import QuranReaderScreen from './src/screens/QuranReaderScreen';
import BookmarksScreen from './src/screens/BookmarksScreen';
import AzanScreen from './src/screens/AzanScreen';
import QiblaScreen from './src/screens/QiblaScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import AIQariScreen from './src/screens/AIQariScreen';
import IslamicLessonsScreen from './src/screens/IslamicLessonsScreen';
import ParaListScreen from './src/screens/ParaListScreen';

// New Screens
import SubscriptionScreen from './src/screens/SubscriptionScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import QuranIndexScreen from './src/screens/QuranIndexScreen';
import FeedbackScreen from './src/screens/FeedbackScreen';

// Theme
import { theme } from './src/theme/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Icon renderer helper functions
const createTabBarIcon = (iconName: string, filled: boolean = false) => {
  return ({ color, size, focused }: { color: string; size: number; focused: boolean }) => (
    <Icon
      name={filled && focused ? iconName : iconName}
      size={size}
      color={color}
    />
  );
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.white + 'CC',
          borderTopWidth: 1,
          borderTopColor: theme.colors.borderSubtle,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontFamily: theme.fonts.body,
          fontSize: 10,
          fontWeight: '500',
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: createTabBarIcon('home'),
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="QuranIndex"
        component={QuranIndexScreen}
        options={{
          tabBarIcon: createTabBarIcon('menu-book', true),
          tabBarLabel: 'Quran',
        }}
      />
      <Tab.Screen
        name="AIQari"
        component={AIQariScreen}
        options={{
          tabBarIcon: createTabBarIcon('mic'),
          tabBarLabel: 'AI Qari',
        }}
      />
      <Tab.Screen
        name="Bookmarks"
        component={BookmarksScreen}
        options={{
          tabBarIcon: createTabBarIcon('bookmark'),
          tabBarLabel: 'Bookmarks',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: createTabBarIcon('person'),
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Onboarding"
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.white,
            },
            headerTintColor: theme.colors.textPrimary,
            headerTitleStyle: {
              fontFamily: theme.fonts.heading,
              color: theme.colors.textPrimary,
            },
            headerBackTitleVisible: false,
          }}>
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateAccount"
            component={CreateAccountScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Quran"
            component={QuranReaderScreen}
            options={{
              title: 'Quran Reader',
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: theme.colors.white,
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ParaList"
            component={ParaListScreen}
            options={{ title: 'Select Para' }}
          />
          <Stack.Screen
            name="Azan"
            component={AzanScreen}
            options={{ title: 'Prayer Times' }}
          />
          <Stack.Screen
            name="Qibla"
            component={QiblaScreen}
            options={{ title: 'Qibla Direction', headerShown: false }}
          />
          <Stack.Screen
            name="AIQari"
            component={AIQariScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="IslamicLessons"
            component={IslamicLessonsScreen}
            options={{ title: 'Islamic Lessons' }}
          />
          <Stack.Screen
            name="Calendar"
            component={CalendarScreen}
            options={{ title: 'Islamic Calendar' }}
          />
          <Stack.Screen
            name="Subscription"
            component={SubscriptionScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Feedback"
            component={FeedbackScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
