import axios from 'axios';

const BASE_URL = 'https://api.alquran.cloud/v1';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface AyahData {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  sajda: boolean | object;
  surah?: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
  };
}

export interface SurahContent extends SurahMeta {
  ayahs: AyahData[];
}

export interface JuzContent {
  number: number;
  ayahs: AyahData[];
}

export const fetchAllSurahs = async (): Promise<SurahMeta[]> => {
  const res = await client.get('/surah');
  return res.data.data as SurahMeta[];
};

export const fetchSurah = async (
  surahNumber: number,
): Promise<{ arabic: SurahContent; english: SurahContent }> => {
  const res = await client.get(
    `/surah/${surahNumber}/editions/quran-uthmani,en.sahih`,
  );
  const [arabic, english] = res.data.data;
  return { arabic, english };
};

export const fetchJuz = async (
  juzNumber: number,
): Promise<{ arabic: JuzContent; english: JuzContent }> => {
  const [arabicRes, englishRes] = await Promise.all([
    client.get(`/juz/${juzNumber}/quran-uthmani`),
    client.get(`/juz/${juzNumber}/en.sahih`),
  ]);
  return {
    arabic: arabicRes.data.data as JuzContent,
    english: englishRes.data.data as JuzContent,
  };
};
