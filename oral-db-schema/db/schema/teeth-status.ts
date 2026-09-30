import { pgTable, uuid, smallint, varchar, unique, index, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { patientRecords } from './patient-records';

/**
 * TEETH_STATUS  (DentitionSection.jsx: teeth[toothNum] = { crown, root })
 * PK: id
 * FK: record_id -> patient_records.id (ON DELETE CASCADE)
 * UNIQUE: (record_id, tooth_num)   -> up to 32 rows per record (FDI numbering)
 */
export const teethStatus = pgTable('teeth_status', {
  id: uuid('id').defaultRandom().primaryKey(),
  recordId: uuid('record_id').notNull().references(() => patientRecords.id, { onDelete: 'cascade' }),
  toothNum: smallint('tooth_num').notNull(),        // 11-18, 21-28, 31-38, 41-48
  crownCode: varchar('crown_code', { length: 2 }),  // '0'-'9','T'
  rootCode: varchar('root_code', { length: 2 }),    // '0','1','2','3','7','8','9'
}, (t) => [
  unique('teeth_status_record_tooth_uq').on(t.recordId, t.toothNum),
  index('teeth_status_record_idx').on(t.recordId),
  check('chk_teeth_tooth_num', sql`${t.toothNum} BETWEEN 11 AND 18 OR ${t.toothNum} BETWEEN 21 AND 28 OR ${t.toothNum} BETWEEN 31 AND 38 OR ${t.toothNum} BETWEEN 41 AND 48`),
  check('chk_crown_code', sql`${t.crownCode} IS NULL OR ${t.crownCode} IN ('0','1','2','3','4','5','6','7','8','9','T')`),
  check('chk_root_code', sql`${t.rootCode} IS NULL OR ${t.rootCode} IN ('0','1','2','3','7','8','9')`),
]);
