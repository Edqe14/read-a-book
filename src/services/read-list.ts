'use server';

import { db } from '@/db';
import { readLists } from '@/db/schema';
import { ReadListStatus } from '@/types/read-lists';

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

export type ReadList = NonNullable<Awaited<ReturnType<typeof getBookReadList>>>;
