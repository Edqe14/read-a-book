import { db } from '@/db';
import { books, userActivity, users } from '@/db/schema';
import { UserActivity } from '@/types/activity';
import { auth } from '@/utils/auth';
import { and, desc, eq } from 'drizzle-orm';
import { AuthError } from 'next-auth';

export const getLatestActivityByType = async ({
  userId,
  activityType,
  activitySubType,
  detailId,
}: Pick<
  typeof userActivity.$inferSelect,
  'userId' | 'activityType' | 'activitySubType' | 'detailId'
>) => {
  return await db.query.userActivity.findFirst({
    where: (activity, { eq }) => {
      const filters = [
        eq(activity.userId, userId),
        eq(activity.activityType, activityType),
      ];

      if (activitySubType) {
        filters.push(eq(activity.activitySubType, activitySubType));
      }

      if (detailId) {
        filters.push(eq(activity.detailId, detailId));
      }

      return and(...filters);
    },
    orderBy: (activity, ops) => ops.desc(activity.createdAt),
  });
};

export const createActivity = async (
  data: typeof userActivity.$inferInsert
) => {
  const latest = await getLatestActivityByType({
    ...data,
    activitySubType: data.activitySubType ?? null,
    detailId: data.detailId ?? null,
  });

  // Check if latest value is already the same
  if (
    latest &&
    latest.userId === data.userId &&
    latest.activityType === data.activityType &&
    latest.activitySubType === data.activitySubType &&
    latest.detailId === data.detailId
  ) {
    return false;
  }

  return db.insert(userActivity).values(data).returning().execute();
};

export const getUserRecentActivities = async () => {
  const session = await auth();
  if (!session) throw new AuthError();

  const data = await db
    .select()
    .from(userActivity)
    .where(eq(userActivity.userId, BigInt(session.user.id)))
    .orderBy(desc(userActivity.createdAt))
    .limit(10)
    .leftJoin(
      books,
      and(
        eq(userActivity.activityType, UserActivity.BOOK.toString()),
        eq(userActivity.detailId, books.id)
      )
    )
    .leftJoin(
      users,
      and(
        eq(userActivity.activityType, UserActivity.USER.toString()),
        eq(userActivity.detailId, users.id)
      )
    );
};
