import { db } from '@/db';
import { books, readLists } from '@/db/schema';
import { auth } from '@/utils/auth';
import { eq, desc } from 'drizzle-orm';
import { AuthError } from 'next-auth';

export const getUserRecentReadList = async () => {
  const session = await auth();
  if (!session) throw new AuthError();

  const result = await db
    .select({
      id: readLists.id,
      bookId: readLists.bookId,
      rating: readLists.rating,
      createdAt: readLists.createdAt,
      book: {
        id: books.id,
        title: books.title,
        thumbnail: books.thumbnail,
      },
    })
    .from(readLists)
    .innerJoin(books, eq(readLists.bookId, books.id))
    .where(eq(readLists.userId, BigInt(session.user.id)))
    .orderBy(desc(readLists.updatedAt))
    .limit(10)
    .execute();

  return result;
};
