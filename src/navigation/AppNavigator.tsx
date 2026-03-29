import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

import OnboardingScreen from '../screens/OnboardingScreen';
import SignInScreen from '../screens/SignInScreen';
import CreateAccountScreen from '../screens/CreateAccountScreen';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';
import TwoFactorLoginScreen from '../screens/TwoFactorLoginScreen';
import HomeScreen from '../screens/HomeScreen';
import QuranReaderScreen from '../screens/QuranReaderScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import AzanScreen from '../screens/AzanScreen';
import QiblaScreen from '../screens/QiblaScreen';
import CalendarScreen from '../screens/CalendarScreen';
import AIQariScreen from '../screens/AIQariScreen';
import IslamicLessonsScreen from '../screens/IslamicLessonsScreen';
import ParaListScreen from '../screens/ParaListScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import ProfileScreen from '../screens/ProfileScreen';
import QuranIndexScreen from '../screens/QuranIndexScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import AccountSecurityScreen from '../screens/AccountSecurityScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import TwoFactorSecurityScreen from '../screens/TwoFactorSecurityScreen';

import { theme } from '../theme/colors';
import { navigationRef } from './navigationRef';
import { setUnauthorizedHandler, userAPI } from '../services/api';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const createTabBarIcon = (iconName: string) => {
  return ({ color, size }: { color: string; size: number }) => (
    <Icon name={iconName} size={size} color={color} />
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
          tabBarIcon: createTabBarIcon('menu-book'),
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

type InitialRoute =
  | 'Onboarding'
  | 'SignIn'
  | 'MainTabs'
  | 'VerifyEmail';

export default function AppNavigator(): React.JSX.Element {
  const [ready, setReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<InitialRoute>('Onboarding');

  useEffect(() => {
    setUnauthorizedHandler(() => {
      if (navigationRef.isReady()) {
        navigationRef.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });
      }
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [token, hasLaunched] = await Promise.all([
          AsyncStorage.getItem('authToken'),
          AsyncStorage.getItem('hasLaunched'),
        ]);
        if (!token) {
          if (!cancelled) {
            setInitialRoute(hasLaunched === 'true' ? 'SignIn' : 'Onboarding');
            setReady(true);
          }
          return;
        }
        const { data } = await userAPI.getProfile();
        const user = data?.data?.user;
        if (!cancelled) {
          if (user && user.emailVerified === false) {
            setInitialRoute('VerifyEmail');
          } else {
            setInitialRoute('MainTabs');
          }
          setReady(true);
        }
      } catch {
        await AsyncStorage.removeItem('authToken');
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (!cancelled) {
          setInitialRoute(hasLaunched === 'true' ? 'SignIn' : 'Onboarding');
          setReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={initialRoute}
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
          name="VerifyEmail"
          component={VerifyEmailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TwoFactorLogin"
          component={TwoFactorLoginScreen}
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
        <Stack.Screen
          name="AccountSecurity"
          component={AccountSecurityScreen}
          options={{
            title: 'Security',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
          options={{
            title: 'Update password',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="TwoFactorSecurity"
          component={TwoFactorSecurityScreen}
          options={{
            title: 'Two-step verification',
            headerShown: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
  },
});
