import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import QuranReaderScreen from './src/screens/QuranReaderScreen';
import BookmarksScreen from './src/screens/BookmarksScreen';
import AzanScreen from './src/screens/AzanScreen';
import QiblaScreen from './src/screens/QiblaScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import AIQariScreen from './src/screens/AIQariScreen';
import IslamicLessonsScreen from './src/screens/IslamicLessonsScreen';
import ParaListScreen from './src/screens/ParaListScreen';

// Theme
import { theme } from './src/theme/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Icon renderer helper functions (defined outside component to avoid re-creation on each render)
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
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.white,
        headerTitleStyle: {
          fontFamily: theme.fonts.heading,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: createTabBarIcon('home'),
        }}
      />
      <Tab.Screen
        name="Quran"
        component={QuranReaderScreen}
        options={{
          tabBarIcon: createTabBarIcon('menu-book'),
        }}
      />
      <Tab.Screen
        name="Bookmarks"
        component={BookmarksScreen}
        options={{
          tabBarIcon: createTabBarIcon('bookmark'),
        }}
      />
      <Tab.Screen
        name="More"
        component={CalendarScreen}
        options={{
          tabBarIcon: createTabBarIcon('more-horiz'),
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
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTintColor: theme.colors.white,
            headerTitleStyle: {
              fontFamily: theme.fonts.heading,
            },
          }}>
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
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
            options={{ title: 'Qibla Direction' }}
          />
          <Stack.Screen
            name="AIQari"
            component={AIQariScreen}
            options={{ title: 'AI Qari Mode' }}
          />
          <Stack.Screen
            name="IslamicLessons"
            component={IslamicLessonsScreen}
            options={{ title: 'Islamic Lessons' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
