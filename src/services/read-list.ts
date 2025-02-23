'use server';

import { db } from '@/db';
import { readLists } from '@/db/schema';
import { ListOptions } from '@/types/db';
import { ReadListStatus } from '@/types/read-lists';
import { eq } from 'drizzle-orm';

export const getAllReadLists = async (
  userId: string,
  options?: ListOptions<(typeof readLists)['_']['columns']>
) => {
  return db.query.readLists.findMany({
    where: (readLists, ops) => {
      const { eq, and, ilike } = ops;
      const conditions = [eq(readLists.userId, BigInt(userId))];

      if (options?.query) {
        conditions.push(ilike(readLists.bookId, `%${options.query}%`));
      }

      if (options?.filter) {
        conditions.push(...(options.filter(readLists, ops) ?? []));
      }

      return and(...conditions);
    },
    orderBy: (readLists, { asc, desc }) => {
      let sortKey =
        typeof options?.sortKey === 'function'
          ? options.sortKey()
          : options?.sortKey;
      let sortOrder = options?.sortOrder;

      if (options?.sortFn) {
        [sortKey, sortOrder] = options.sortFn();
      }

      if (!sortKey) return desc(readLists.updatedAt);

      const orderFn = sortOrder === 'desc' ? desc : asc;
      return orderFn(
        typeof sortKey === 'string' ? readLists[sortKey] : sortKey
      );
    },
    with: {
      book: {
        columns: {
          description: false,
        },
      },
    },
  });
};

export const getBookReadList = async (userId: string, bookId: string) => {
  return db.query.readLists.findFirst({
    where: (readLists, { eq, and }) =>
      and(eq(readLists.userId, BigInt(userId)), eq(readLists.bookId, bookId)),
  });
};

export const addToReadList = async (
  userId: string,
  bookId: string
): Promise<boolean> => {
  await db.insert(readLists).values({
    userId: BigInt(userId),
    bookId,
    status: ReadListStatus.PENDING,
  });

  return true;
};

export const updateReadList = async (
  readListId: number,
  data: Partial<ReadList>
) => {
  if (data.status === ReadListStatus.READING) {
    data.startedAt = new Date();
  }

  if (data.status === ReadListStatus.FINISHED) {
    data.finishedAt = new Date();
  }

  await db.update(readLists).set(data).where(eq(readLists.id, readListId));

  return true;
};

export type ReadList = NonNullable<Awaited<ReturnType<typeof getBookReadList>>>;
export type ReadLists = NonNullable<
  Awaited<ReturnType<typeof getAllReadLists>>
>;
