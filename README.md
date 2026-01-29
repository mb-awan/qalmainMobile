# Quran Majeed - Mobile App (React Native)

React Native mobile application for the AI-Based Digital Qari Quran App, migrated to React Native 0.83.1.

## Features

- Complete Quran reading with Uthmani script
- Para/Sipara navigation
- Bookmark system
- Azan with location-based prayer times
- Qibla direction compass
- Islamic calendar (Hijri)
- AI Qari mode for children
- Islamic teaching content

## Prerequisites

- Node.js (v20+)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- MongoDB (for backend)

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **For iOS (macOS only):**
```bash
cd ios && pod install && cd ..
```

## Running the App

### Android

```bash
npm run android
```

### iOS

```bash
npm run ios
```

## Environment Setup

Create a `.env` file in the qalmainMobile directory (optional):
```
API_BASE_URL=http://localhost:3000/api
```

## Project Structure

```
qalmainMobile/
├── src/
│   ├── screens/       # Screen components
│   ├── services/      # API services
│   ├── theme/         # Theme and colors
│   ├── types/         # TypeScript types
│   ├── utils/         # Utility functions
│   └── fonts/         # Custom fonts
├── android/           # Android native code
├── ios/               # iOS native code
└── App.tsx           # Main app component
```

## Dependencies

This app uses React Native 0.83.1 with React 19.2.0. Key dependencies include:

- React Navigation (Stack & Bottom Tabs)
- React Native Vector Icons
- React Native Vision Camera (for AI Qari mode)
- React Native Geolocation Service (for Qibla & Azan)
- AsyncStorage (for local storage)
- Axios (for API calls)

## Permissions

The app requires the following permissions:

### Android
- Internet
- Camera
- Location (Fine & Coarse)
- Microphone
- Notifications

### iOS
- Location (When In Use)
- Camera
- Microphone

## Notes

- Make sure the backend server is running before testing API calls
- Camera permissions are required for AI Qari mode
- Location permissions are required for Azan and Qibla features
- The app uses autolinking for native dependencies

## Troubleshooting

If you encounter issues:

1. **Clean build:**
   - Android: `cd android && ./gradlew clean && cd ..`
   - iOS: `cd ios && pod deintegrate && pod install && cd ..`

2. **Reset Metro cache:**
   ```bash
   npm start -- --reset-cache
   ```

3. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules && npm install
   ```

## Migration Notes

This app was migrated from React Native 0.72.6 to 0.83.1. All dependencies have been updated to compatible versions.
