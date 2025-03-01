export const Routes = {
  LOGIN: '/',
  DASHBOARD: '/dashboard',
  READLING_LIST: '/reading-list',
  BOOK: '/book',
  USER: '/user',
  USER_SHORT: '/@',
} as const;

export const getRoute = (
  prefix: keyof typeof Routes,
  extra?: string | number
) => (!extra ? Routes[prefix] : `${Routes[prefix]}/${extra}`);
