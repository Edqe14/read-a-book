import { relations } from 'drizzle-orm';
import {
  bigint,
  pgTable,
  varchar,
  timestamp,
  char,
  serial,
  text,
  integer,
  smallint,
  index,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: bigint({ mode: 'bigint' }).primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  nick: varchar({ length: 255 }),
  email: varchar({ length: 255 }).notNull().unique(),
  lastLogin: timestamp({
    withTimezone: true,
  }),
  createdAt: timestamp({
    withTimezone: true,
  }).defaultNow(),
});

export const books = pgTable('books', {
  id: varchar({ length: 24 }).primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  authors: varchar({ length: 255 }).array(),
  publisher: varchar({ length: 255 }),
  publishedDate: varchar({ length: 255 }),
  description: text(),
  isbn10: varchar({ length: 10 }),
  isbn13: varchar({ length: 13 }),
  pageCount: bigint({ mode: 'number' }),
  language: varchar({ length: 10 }),
  thumbnail: varchar({ length: 1000 }),
  createdAt: timestamp({
    withTimezone: true,
  }).defaultNow(),
  maturityRating: varchar({ length: 127 }),
  categories: varchar({ length: 255 }).array(),
});

export const readLists = pgTable('read_lists', {
  id: serial('id').primaryKey(),
  userId: bigint({ mode: 'bigint' })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  bookId: varchar({ length: 255 })
    .notNull()
    .references(() => books.id, { onDelete: 'cascade' }),
  status: char({ length: 1 }).notNull(),
  currentPage: integer().default(0),
  feedback: text(),
  rating: smallint(),
  startedAt: timestamp({ withTimezone: true }),
  finishedAt: timestamp({ withTimezone: true }),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const readListRelation = relations(readLists, ({ one }) => ({
  user: one(users, {
    fields: [readLists.userId],
    references: [users.id],
  }),
  book: one(books, {
    fields: [readLists.bookId],
    references: [books.id],
  }),
}));

export const userActivity = pgTable('user_activity', {
  id: serial('id').primaryKey(),
  userId: bigint({ mode: 'bigint' })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  activityType: char({ length: 1 }).notNull(),
  activitySubType: char({ length: 1 }),
  detailId: varchar({ length: 128 }),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
});

export const userActivityRelations = relations(userActivity, ({ one }) => ({
  user: one(users, {
    fields: [userActivity.userId],
    references: [users.id],
  }),
}));

export const userProfiles = pgTable('user_profiles', {
  userId: bigint({ mode: 'bigint' })
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  bio: text(),
  location: varchar({ length: 32 }),
  website: varchar({ length: 64 }),
  picture: varchar({ length: 1000 }),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const userFollowing = pgTable(
  'user_followings',
  {
    followerId: bigint({ mode: 'bigint' })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    followingId: bigint({ mode: 'bigint' })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp({ withTimezone: true }).defaultNow(),
  },
  (table) => [
    index('user_following_followingId').on(table.followingId),
    index('user_following_followerId').on(table.followerId),
  ]
);

export const userFollowingRelations = relations(userFollowing, ({ one }) => ({
  follower: one(users, {
    fields: [userFollowing.followerId],
    references: [users.id],
  }),
  following: one(users, {
    fields: [userFollowing.followingId],
    references: [users.id],
  }),
}));

export const userProfileRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

export const userRelations = relations(users, ({ many, one }) => ({
  readLists: many(readLists),
  activities: many(userActivity),
  profile: one(userProfiles),
  followers: many(userFollowing, { relationName: 'followingId' }),
  following: many(userFollowing, { relationName: 'followerId' }),
}));
