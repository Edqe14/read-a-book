export const ReadListStatus = {
  PENDING: 'P',
  READING: 'R',
  ON_HOLD: 'H',
  DROPPED: 'D',
  FINISHED: 'F',
} as const;

export const ReadListStatusValues = [
  ReadListStatus.PENDING,
  ReadListStatus.READING,
  ReadListStatus.ON_HOLD,
  ReadListStatus.DROPPED,
  ReadListStatus.FINISHED,
] as const;

export const ReadListLabels = {
  [ReadListStatus.PENDING]: {
    label: 'Want to Read',
    color: 'default',
  },
  [ReadListStatus.READING]: {
    label: 'Reading',
    color: 'primary',
  },
  [ReadListStatus.ON_HOLD]: {
    label: 'On Hold',
    color: 'warning',
  },
  [ReadListStatus.DROPPED]: {
    label: 'Dropped',
    color: 'danger',
  },
  [ReadListStatus.FINISHED]: {
    label: 'Finished',
    color: 'success',
  },
} as const;

export const ReadListSortCategories = {
  RECENT: 'R',
  STATUS: 'S',
  RATING: 'T',
  // TITLE: 'I',
} as const;

export const ReadListSortCategoryValues = [
  ReadListSortCategories.RECENT,
  ReadListSortCategories.STATUS,
  ReadListSortCategories.RATING,
  // ReadListSortCategories.TITLE,
] as const;

export const ReadListSortCategoryLabels = {
  [ReadListSortCategories.RECENT]: {
    label: 'Recently updated',
  },
  [ReadListSortCategories.STATUS]: {
    label: 'Status',
  },
  [ReadListSortCategories.RATING]: {
    label: 'Rating',
  },
  // [ReadListSortCategories.TITLE]: {
  //   label: 'Book Title',
  // },
};

export type ReadListStatusValue =
  (typeof ReadListStatus)[keyof typeof ReadListStatus];
export type ReadListCategoryValue =
  (typeof ReadListSortCategories)[keyof typeof ReadListSortCategories];
