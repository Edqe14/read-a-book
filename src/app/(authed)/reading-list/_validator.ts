import { RatingParams } from '@/types/books';
import {
  ReadListSortCategories,
  ReadListSortCategoryValues,
  ReadListStatusValues,
} from '@/types/read-lists';
import { z } from 'zod';

export const ReadListFilter = z.object({
  status: z.enum(ReadListStatusValues).nullable().catch(null),
  rating: z.enum(RatingParams).nullable().catch(null),
  sortBy: z
    .enum(ReadListSortCategoryValues)
    .nullable()
    .catch(ReadListSortCategories.RECENT),
});
