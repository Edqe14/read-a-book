import { getAllReadLists } from '@/services/read-list';
import { auth } from '@/utils/auth';
import { ReadingListContent } from './content';
import {
  ReadListCategoryValue,
  ReadListSortCategories,
  ReadListStatusValue,
} from '@/types/read-lists';
import { RatingNumbers } from '@/types/books';
import { sql, SQL } from 'drizzle-orm';
import { ReadListFilter } from './_validator';

type ReadingListProps = {
  searchParams: Promise<{
    status?: ReadListStatusValue;
    rating?: `${RatingNumbers}`;
    sortBy?: ReadListCategoryValue;
  }>;
};

export default async function ReadingList({ searchParams }: ReadingListProps) {
  const param = ReadListFilter.safeParse(await searchParams);
  const { rating, status, sortBy } = param.data!;

  const session = (await auth())!;
  const readLists = await getAllReadLists(session.user.id, {
    filter: (readLists, ops) => {
      const filters: SQL[] = [];

      if (status) {
        filters.push(ops.eq(readLists.status, status));
      }

      if (rating) {
        filters.push(ops.eq(readLists.rating, parseInt(rating)));
      }

      return filters;
    },
    sortOrder: 'desc',
    sortKey: () => {
      switch (sortBy) {
        case ReadListSortCategories.RATING: {
          return 'rating';
        }

        case ReadListSortCategories.STATUS: {
          return 'status';
        }

        default: {
          return 'updatedAt';
        }
      }
    },
  });

  return <ReadingListContent readLists={readLists} />;
}
