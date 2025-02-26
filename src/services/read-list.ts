'use server';

import { db } from '@/db';
import { readLists } from '@/db/schema';
import { ListOptions, NotFoundError, UnauthorizedError } from '@/types/db';
import { ReadListStatus, ReadListStatusValues } from '@/types/read-lists';
import { eq } from 'drizzle-orm';
import { createActivity } from './activity';
import { isNil, omit } from 'lodash-es';
import { UserActivity } from '@/types/activity';
import { AuthError } from 'next-auth';
import { auth } from '@/utils/auth';
import { z } from 'zod';

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

export const addToReadList = async (bookId: string): Promise<boolean> => {
  const session = await auth();
  if (!session) throw new AuthError();

  await db.insert(readLists).values({
    userId: BigInt(session.user.id),
    bookId,
    status: ReadListStatus.PENDING,
  });

  return true;
};

const readListValidator = z.object({
  status: z.enum(ReadListStatusValues).optional(),
  currentPage: z.number().optional(),
  rating: z.number().min(1).max(5).optional(),
  feedback: z.string().max(255).optional(),
});

export const updateReadList = async (
  readListId: number,
  data: Partial<Omit<ReadList, 'userId'>>,
  userId?: string
) => {
  await readListValidator.parseAsync(data);

  const existing = await db.query.readLists.findFirst({
    where: (list, { eq }) => eq(list.id, readListId),
    columns: {
      id: true,
      userId: true,
      bookId: true,
    },
  });
  if (!existing) {
    throw new NotFoundError();
  }

  if (!isNil(userId) && existing.userId.toString() !== userId) {
    throw new UnauthorizedError();
  }

  const promises = [];

  if (data.status) {
    if (data.status === ReadListStatus.READING) {
      data.startedAt = new Date();
    }

    if (data.status === ReadListStatus.FINISHED) {
      data.finishedAt = new Date();
    }

    if (data.status !== ReadListStatus.PENDING) {
      promises.push(
        createActivity({
          userId: existing.userId,
          activityType: UserActivity.BOOK.toString(),
          activitySubType: data.status,
          detailId: existing.bookId,
        })
      );
    }
  }

  await Promise.all([
    db
      .update(readLists)
      .set(omit(data, 'userId', 'bookId'))
      .where(eq(readLists.id, readListId)),
    ...promises,
  ]);

  return true;
};

export const updateReadListByAuth = async (
  id: number,
  data: Partial<Omit<ReadList, 'id' | 'userId'>>
) => {
  const session = await auth();
  if (!session) throw new AuthError();

  return updateReadList(
    id,
    Object.assign(data, { userId: session.user.id }),
    session.user.id
  );
};

export type ReadList = NonNullable<Awaited<ReturnType<typeof getBookReadList>>>;
export type ReadLists = NonNullable<
  Awaited<ReturnType<typeof getAllReadLists>>
>;
