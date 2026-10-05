import { pgTable, uuid, smallint, varchar, unique, index, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { patientRecords } from './patient-records';

/**
 * PERIO_SEXTANT  (currentRecord.cpi[] / loa[])
 * PK: id
 * FK: record_id -> patient_records.id (ON DELETE CASCADE)
 * UNIQUE: (record_id, sextant)  -> 6 rows per record
 */
export const perioSextant = pgTable('perio_sextant', {
  id: uuid('id').defaultRandom().primaryKey(),
  recordId: uuid('record_id').notNull().references(() => patientRecords.id, { onDelete: 'cascade' }),
  sextant: smallint('sextant').notNull(),  // 0-5
  cpi: varchar('cpi', { length: 2 }),      // '0'-'4','9','X'
  loa: varchar('loa', { length: 2 }),      // '0'-'4','9','X'
}, (t) => [
  unique('perio_sextant_record_sextant_uq').on(t.recordId, t.sextant),
  index('perio_sextant_record_idx').on(t.recordId),
  check('chk_sextant', sql`${t.sextant} BETWEEN 0 AND 5`),
  check('chk_cpi', sql`${t.cpi} IS NULL OR ${t.cpi} IN ('0','1','2','3','4','9','X')`),
  check('chk_loa', sql`${t.loa} IS NULL OR ${t.loa} IN ('0','1','2','3','4','9','X')`),
]);
