import { bigint, pgTable, varchar, timestamp } from 'drizzle-orm/pg-core';

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
