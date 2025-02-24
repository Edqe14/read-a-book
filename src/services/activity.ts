import { db } from '@/db';
import { userActivity } from '@/db/schema';
import { and } from 'drizzle-orm';

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
