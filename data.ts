import type { ItemIds } from './types';

export const routes = {
  home: '/',
  // item: '/artikel/**',
  article: '/artikel/**',
  video: '/video/**',
  liveblog: '/liveblog/**',
  livestream: '/livestream/**',
} as const;

export const nieuws = [
  'Voorpagina',
  'Laatste nieuws',
  "Video's",
  'Binnenland',
  'Buitenland',
  'Regionaal nieuws',
  'Politiek',
  'Economie',
  'Koningshuis',
  'Tech',
  'Cultuur & media',
  'Opmerkelijk',
] as const;

export const sport = [
  'Voorpagina',
  'Laatste nieuws',
  "Video's",
  'Voetbal',
  'Formule 1',
  'Wielrennen',
  'Schaatsen',
  'Tennis',
  'Atletiek',
  'Hockey',
] as const;

const environment = process.env.NEXT_PUBLIC_CORE_API_URL.includes('test') ? 'test' : 'prod';

/**
 * Item IDs for the different environments (not every environment has the same items).
 */
const itemIds: ItemIds = {
  article: {
    test: 0,
    prod: 0,
  },
  video: {
    test: 2265024,
    prod: 2550856,
  },
  livestream: {
    test: 2265182,
    prod: 0,
  },
  liveblog: {
    test: 0,
    prod: 2547645,
  },
};

export const getItemId = (type: keyof ItemIds) => itemIds[type][environment];
