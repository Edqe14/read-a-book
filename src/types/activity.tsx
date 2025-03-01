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

export const UserActivityMessages = {
  [UserActivity.BOOK.toString()]: {
    [UserActivity.BOOK.ADDED_TO_LIST]: 'added to their list',
    [UserActivity.BOOK.READING]: 'started reading',
    [UserActivity.BOOK.ON_HOLD]: 'put on hold',
    [UserActivity.BOOK.DROPPED]: 'dropped',
    [UserActivity.BOOK.FINISHED]: 'finished',
  },
  [UserActivity.USER.toString()]: {
    [UserActivity.USER.FOLLOWED]: 'followed',
  },
} as const;
