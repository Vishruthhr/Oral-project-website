import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

/**
 * USERS  (LoginPage.jsx / DentalContext login() & signup())
 * PK: id
 * Supabase Auth owns credentials. This table stores the public examiner profile;
 * its id is provisioned from auth.users by the migration trigger.
 */
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
