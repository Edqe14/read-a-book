'use server';

import { db } from '@/db';
import { userActivity, userFollowing, userProfiles, users } from '@/db/schema';
import { UserActivity } from '@/types/activity';
import { auth } from '@/utils/auth';
import { and, count, eq } from 'drizzle-orm';
import { AuthError } from 'next-auth';
import { z } from 'zod';

export const getUser = async (id: string) => {
  return await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.id, BigInt(id)),
    with: {
      profile: true,
    },
  });
};

export const createUser = async (data: typeof users.$inferInsert) => {
  return (await db.insert(users).values(data).returning().execute())[0];
};

export const updateUser = async (
  id: string,
  data: Partial<Omit<typeof users.$inferInsert, 'id'>>
) => {
  return (
    await db
      .update(users)
      .set(data)
      .where(eq(users.id, BigInt(id)))
      .returning()
      .execute()
  )[0];
};

/**
 *
 * @param id
 * @param updateData
 * @param createData Will be merged with `updateData`.
 */
export const createOrUpdateUser = async (
  id: string,
  updateData: Partial<Omit<typeof users.$inferInsert, 'id'>>,
  createData: Omit<typeof users.$inferInsert, 'id'>
) => {
  const user = await getUser(id);

  if (!user) {
    return await createUser({
      id: BigInt(id),
      ...updateData,
      ...createData,
    });
  }

  return await updateUser(id, updateData);
};

export const getUserByName = async (name: string) => {
  return await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.name, name),
    with: {
      profile: true,
    },
  });
};

export const getFullUserByName = async (name: string) => {
  return await db.query.users.findFirst({
    where: (user, { eq }) => eq(user.name, name),
    with: {
      profile: true,
      readLists: {
        with: {
          book: {
            columns: {
              categories: false,
              description: false,
              pageCount: false,
              maturityRating: false,
              isbn13: false,
              isbn10: false,
              language: false,
              publisher: false,
              createdAt: false,
            },
          },
        },
        where(lists, { gte, and, isNotNull }) {
          return and(isNotNull(lists.rating), gte(lists.rating, 3));
        },
        orderBy(lists, { desc }) {
          return desc(lists.rating);
        },
        limit: 5,
        columns: {
          currentPage: false,
          status: false,
          createdAt: false,
          updatedAt: false,
          startedAt: false,
          finishedAt: false,
          feedback: false,
        },
      },
    },
  });
};

export type UserWithProfile = NonNullable<
  Awaited<ReturnType<typeof getUserByName>>
>;

// User profile
export const getUserProfile = async (id: string) => {
  return await db.query.userProfiles.findFirst({
    where: (profile, { eq }) => eq(profile.userId, BigInt(id)),
  });
};

export const createUserProfile = async (
  id: string,
  data: Omit<typeof userProfiles.$inferInsert, 'userId'>
) => {
  return (
    await db
      .insert(userProfiles)
      .values({
        userId: BigInt(id),
        ...data,
      })
      .returning()
      .execute()
  )[0];
};

const editProfileValidator = z.object({
  bio: z.string().max(255).nullable().optional(),
  website: z.string().max(64).nullable().optional(),
  location: z.string().max(32).nullable().optional(),
});

export const updateUserProfile = async (
  id: string,
  data: Partial<Omit<typeof userProfiles.$inferInsert, 'userId'>>
) => {
  await editProfileValidator.parseAsync(data);

  return (
    await db
      .update(userProfiles)
      .set(data)
      .where(eq(userProfiles.userId, BigInt(id)))
      .returning()
      .execute()
  )[0];
};

export const updateUserProfileByAuth = async (
  data: Partial<Omit<typeof userProfiles.$inferInsert, 'userId'>>
) => {
  const session = await auth();
  if (!session) throw new AuthError();

  return await updateUserProfile(session.user.id, data);
};

export const createOrUpdateUserProfile = async (
  id: string,
  updateData: Partial<Omit<typeof userProfiles.$inferInsert, 'userId'>>,
  createData: Omit<typeof userProfiles.$inferInsert, 'userId'>
) => {
  const profile = await getUserProfile(id);

  if (!profile) {
    return await createUserProfile(id, {
      ...updateData,
      ...createData,
    });
  }

  return await updateUserProfile(id, updateData);
};

export const followUser = async (targetUserId: string | bigint) => {
  const session = await auth();
  if (!session) throw new AuthError();

  await Promise.allSettled([
    db
      .insert(userFollowing)
      .values({
        followerId: BigInt(session.user.id),
        followingId: BigInt(targetUserId),
      })
      .execute(),
    db
      .insert(userActivity)
      .values({
        activityType: UserActivity.USER.toString(),
        activitySubType: UserActivity.USER.FOLLOWED,
        detailId: targetUserId.toString(),
        userId: BigInt(session.user.id),
      })
      .execute(),
  ]);
};

export const unfollowUser = async (targetUserId: string | bigint) => {
  const session = await auth();
  if (!session) throw new AuthError();

  await db
    .delete(userFollowing)
    .where(
      and(
        eq(userFollowing.followerId, BigInt(session.user.id)),
        eq(userFollowing.followingId, BigInt(targetUserId))
      )
    )
    .execute();
};

export const isFollowing = async (targetUserId: string | bigint) => {
  const session = await auth();
  if (!session) throw new AuthError();

  const result = await db
    .select({
      id: userFollowing.followerId,
    })
    .from(userFollowing)
    .where(
      and(
        eq(userFollowing.followerId, BigInt(session.user.id)),
        eq(userFollowing.followingId, BigInt(targetUserId))
      )
    )
    .execute();

  return result.length > 0;
};

export const getUserFollowInfo = async (targetUserId: string | bigint) => {
  const [isUserFollowing, followers, following] = await Promise.all([
    isFollowing(targetUserId),
    db
      .select({
        count: count(),
      })
      .from(userFollowing)
      .where(eq(userFollowing.followingId, BigInt(targetUserId)))
      .execute(),
    db
      .select({
        count: count(),
      })
      .from(userFollowing)
      .where(eq(userFollowing.followerId, BigInt(targetUserId)))
      .execute(),
  ]);

  return {
    isFollowing: isUserFollowing,
    followerCount: Number(followers[0]?.count || 0),
    followingCount: Number(following[0]?.count || 0),
  };
};

export const getFollowers = async (targetUserId: string | bigint) => {
  const q = db
    .select({
      id: users.id,
      nick: users.nick,
      name: users.name,
      picture: userProfiles.picture,
    })
    .from(users)
    .leftJoin(userProfiles, eq(userProfiles.userId, users.id))
    .as('user');

  return await db
    .select({
      id: q.id,
      nick: q.nick,
      name: q.name,
      picture: q.picture,
    })
    .from(userFollowing)
    .where(eq(userFollowing.followingId, BigInt(targetUserId)))
    .innerJoin(q, eq(userFollowing.followerId, q.id))
    .execute();
};

export const getFollowing = async (targetUserId: string | bigint) => {
  const q = db
    .select({
      id: users.id,
      nick: users.nick,
      name: users.name,
      picture: userProfiles.picture,
    })
    .from(users)
    .leftJoin(userProfiles, eq(userProfiles.userId, users.id))
    .as('user');

  return await db
    .select({
      id: q.id,
      nick: q.nick,
      name: q.name,
      picture: q.picture,
    })
    .from(userFollowing)
    .where(eq(userFollowing.followerId, BigInt(targetUserId)))
    .innerJoin(q, eq(userFollowing.followingId, q.id))
    .execute();
};

export type FollowUser = Awaited<ReturnType<typeof getFollowers>>[number];
