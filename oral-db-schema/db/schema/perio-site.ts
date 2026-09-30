import { pgTable, uuid, varchar, boolean, smallint, unique, index, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { perioTooth } from './perio-tooth';

/**
 * PERIO_SITE  (getBlankPerio(): bop / plaque / gm / pd per site)
 * PK: id
 * FK: perio_tooth_id -> perio_tooth.id (ON DELETE CASCADE)
 * UNIQUE: (perio_tooth_id, site)  -> 6 rows per tooth
 * Sites: db,b,mb,dp,p,mp (upper) | db,b,mb,dl,l,ml (lower)
 */
export const perioSite = pgTable('perio_site', {
  id: uuid('id').defaultRandom().primaryKey(),
  perioToothId: uuid('perio_tooth_id').notNull().references(() => perioTooth.id, { onDelete: 'cascade' }),
  site: varchar('site', { length: 3 }).notNull(),
  bop: boolean('bop').default(false).notNull(),        // bleeding on probing
  plaque: boolean('plaque').default(false).notNull(),
  gm: smallint('gm').default(0).notNull(),             // gingival margin (mm)
  pd: smallint('pd').default(2).notNull(),             // pocket depth (mm)
}, (t) => [
  unique('perio_site_tooth_site_uq').on(t.perioToothId, t.site),
  index('perio_site_tooth_idx').on(t.perioToothId),
  check('chk_site', sql`${t.site} IN ('db','b','mb','dp','p','mp','dl','l','ml')`),
]);
