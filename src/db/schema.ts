import {
  bigint,
  pgTable,
  varchar,
  timestamp,
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

export const categories = pgTable('categories', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull().unique(),
});

export const bookCategories = pgTable('book_categories', {
  bookId: varchar({ length: 255 }).references(() => books.id, {
    onDelete: 'cascade',
  }),
  categoryId: bigint({ mode: 'bigint' }).references(() => categories.id, {
    onDelete: 'cascade',
  }),
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
});
