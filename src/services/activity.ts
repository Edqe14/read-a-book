import { db } from '@/db';
import { books, userActivity, userProfiles, users } from '@/db/schema';
import { UserActivity } from '@/types/activity';
import { and, desc, eq, sql } from 'drizzle-orm';

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

export const getUserRecentActivities = async (userId: string | bigint) => {
  const userProfileQuery = db
    .select({
      id: users.id,
      nick: users.nick,
      name: users.name,
      createdAt: users.createdAt,
      lastLogin: users.lastLogin,
      picture: userProfiles.picture,
    })
    .from(users)
    .leftJoin(userProfiles, eq(userProfiles.userId, users.id))
    .as('user');

  const data = await db
    .select()
    .from(userActivity)
    .where(eq(userActivity.userId, BigInt(userId)))
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
      userProfileQuery,
      and(
        eq(userActivity.activityType, UserActivity.USER.toString()),
        eq(
          userActivity.detailId,
          sql<string>`cast(${userProfileQuery.id} as varchar)`
        )
      )
    )
    .execute();

  return data;
};

export type RecentActivity = Awaited<
  ReturnType<typeof getUserRecentActivities>
>[0];
