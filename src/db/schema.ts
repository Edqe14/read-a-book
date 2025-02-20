import {
  bigint,
  pgTable,
  varchar,
  timestamp,
  char,
  serial,
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
  id: varchar({ length: 255 }).primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  authors: varchar({ length: 255 }).array(),
  publisher: varchar({ length: 255 }),
  publishedDate: varchar({ length: 255 }),
  description: varchar({ length: 2000 }),
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
    .references(() => users.id),
  bookId: varchar({ length: 255 })
    .notNull()
    .references(() => books.id),
  status: char({ length: 1 }).notNull(),
  startedAt: timestamp({ withTimezone: true }),
  finishedAt: timestamp({ withTimezone: true }),
  createdAt: timestamp({ withTimezone: true }).defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
});
