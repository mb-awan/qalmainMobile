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

export type TranslationLang = 'en' | 'ur';

const ENGLISH_EDITION = 'en.sahih';
const URDU_EDITION = 'ur.jalandhry';

export const fetchSurah = async (
  surahNumber: number,
  translationLang: TranslationLang = 'en',
): Promise<{ arabic: SurahContent; translation: SurahContent }> => {
  const edition = translationLang === 'ur' ? URDU_EDITION : ENGLISH_EDITION;
  const res = await client.get(
    `/surah/${surahNumber}/editions/quran-uthmani,${edition}`,
  );
  const [arabic, translation] = res.data.data;
  return { arabic, translation };
};

export const fetchJuz = async (
  juzNumber: number,
  translationLang: TranslationLang = 'en',
): Promise<{ arabic: JuzContent; translation: JuzContent }> => {
  const edition = translationLang === 'ur' ? URDU_EDITION : ENGLISH_EDITION;
  const [arabicRes, translationRes] = await Promise.all([
    client.get(`/juz/${juzNumber}/quran-uthmani`),
    client.get(`/juz/${juzNumber}/${edition}`),
  ]);
  return {
    arabic: arabicRes.data.data as JuzContent,
    translation: translationRes.data.data as JuzContent,
  };
};
