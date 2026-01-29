export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Ayah {
  number: number;
  text: string;
  translation?: string;
  surah: number;
  page: number;
}

export interface Surah {
  number: number;
  name: string;
  nameArabic: string;
  ayahs: Ayah[];
}

export interface Para {
  number: number;
  surahs: Surah[];
}

export interface Bookmark {
  id: string;
  surah: number;
  ayah: number;
  page?: number;
  createdAt: Date;
}

export interface PrayerTime {
  name: string;
  time: string;
  icon: string;
}

export interface PrayerTimes {
  date: string;
  location: {
    lat: number;
    lng: number;
  };
  times: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
}

export interface AzanSettings {
  enabled: boolean;
  silentMode: boolean;
  notifications: boolean;
}

export interface AISession {
  sessionId: string;
  userId: string;
  startTime: Date;
  status: 'active' | 'paused' | 'stopped';
}

export interface AIAnalysis {
  isLookingAtScreen: boolean;
  attentionLevel: number;
  detectedFace: boolean;
  message: string;
}


