import { pgTable, uuid, smallint, boolean, text, unique, index, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { patientRecords } from './patient-records';

/**
 * PERIO_TOOTH  (PeriodontalSection.jsx / getBlankPerio(): per-tooth fields)
 * PK: id
 * FK: record_id -> patient_records.id (ON DELETE CASCADE)
 * UNIQUE: (record_id, tooth_num)
 */
export const perioTooth = pgTable('perio_tooth', {
  id: uuid('id').defaultRandom().primaryKey(),
  recordId: uuid('record_id').notNull().references(() => patientRecords.id, { onDelete: 'cascade' }),
  toothNum: smallint('tooth_num').notNull(),
  present: boolean('present').default(true).notNull(),
  implant: boolean('implant').default(false).notNull(),
  mobility: smallint('mobility').default(0).notNull(),
  furcationB: smallint('furcation_b').default(0).notNull(),
  furcationDp: smallint('furcation_dp').default(0).notNull(),
  furcationMp: smallint('furcation_mp').default(0).notNull(),
  furcationL: smallint('furcation_l').default(0).notNull(),
  note: text('note'),
}, (t) => [
  unique('perio_tooth_record_tooth_uq').on(t.recordId, t.toothNum),
  index('perio_tooth_record_idx').on(t.recordId),
  check('chk_perio_tooth_num', sql`${t.toothNum} BETWEEN 11 AND 18 OR ${t.toothNum} BETWEEN 21 AND 28 OR ${t.toothNum} BETWEEN 31 AND 38 OR ${t.toothNum} BETWEEN 41 AND 48`),
  check('chk_mobility', sql`${t.mobility} BETWEEN 0 AND 3`),
  check('chk_furcation', sql`${t.furcationB} BETWEEN 0 AND 3 AND ${t.furcationDp} BETWEEN 0 AND 3 AND ${t.furcationMp} BETWEEN 0 AND 3 AND ${t.furcationL} BETWEEN 0 AND 3`),
]);
