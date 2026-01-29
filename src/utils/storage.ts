import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  // Last read position
  async getLastReadPage(): Promise<number | null> {
    try {
      const page = await AsyncStorage.getItem('lastReadPage');
      return page ? parseInt(page, 10) : null;
    } catch (error) {
      console.error('Error getting last read page:', error);
      return null;
    }
  },

  async setLastReadPage(page: number): Promise<void> {
    try {
      await AsyncStorage.setItem('lastReadPage', page.toString());
    } catch (error) {
      console.error('Error setting last read page:', error);
    }
  },

  // Bookmarks
  async getBookmarks(): Promise<number[]> {
    try {
      const bookmarks = await AsyncStorage.getItem('bookmarkedAyahs');
      return bookmarks ? JSON.parse(bookmarks) : [];
    } catch (error) {
      console.error('Error getting bookmarks:', error);
      return [];
    }
  },

  async setBookmarks(ayahs: number[]): Promise<void> {
    try {
      await AsyncStorage.setItem('bookmarkedAyahs', JSON.stringify(ayahs));
    } catch (error) {
      console.error('Error setting bookmarks:', error);
    }
  },

  async addBookmark(ayahId: number): Promise<void> {
    const bookmarks = await this.getBookmarks();
    if (!bookmarks.includes(ayahId)) {
      bookmarks.push(ayahId);
      await this.setBookmarks(bookmarks);
    }
  },

  async removeBookmark(ayahId: number): Promise<void> {
    const bookmarks = await this.getBookmarks();
    const filtered = bookmarks.filter(id => id !== ayahId);
    await this.setBookmarks(filtered);
  },

  // Azan settings
  async getAzanSettings(): Promise<{
    enabled: boolean;
    silentMode: boolean;
  }> {
    try {
      const settings = await AsyncStorage.getItem('azanSettings');
      return settings
        ? JSON.parse(settings)
        : {enabled: true, silentMode: false};
    } catch (error) {
      console.error('Error getting azan settings:', error);
      return {enabled: true, silentMode: false};
    }
  },

  async setAzanSettings(settings: {
    enabled: boolean;
    silentMode: boolean;
  }): Promise<void> {
    try {
      await AsyncStorage.setItem('azanSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error setting azan settings:', error);
    }
  },
};


