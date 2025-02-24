import { ReadListStatus } from './read-lists';

export const UserActivity = {
  BOOK: Object.assign('B', {
    ADDED_TO_LIST: ReadListStatus.PENDING,
    READING: ReadListStatus.READING,
    ON_HOLD: ReadListStatus.ON_HOLD,
    DROPPED: ReadListStatus.DROPPED,
    FINISHED: ReadListStatus.FINISHED,
  }),
  USER: Object.assign('U', {
    FOLLOWED: 'F',
  }),
} as const;
