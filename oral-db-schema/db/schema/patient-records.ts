import {
  pgTable, uuid, varchar, text, smallint, boolean, timestamp, date, index, check,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users';
import { sexEnum } from './enums';

/**
 * PATIENT_RECORDS  (GeneralInfoSection.jsx + OtherFindingsSection.jsx)
 * PK: id
 * FK: examiner_id -> users.id (ON DELETE SET NULL)
 */
export const patientRecords = pgTable('patient_records', {
  id: uuid('id').defaultRandom().primaryKey(),

  // Section 01 - General Information
  participantId: varchar('participant_id', { length: 50 }).notNull(),
  patientName: varchar('patient_name', { length: 150 }).notNull(),
  examDate: date('exam_date').notNull(),
  examinerId: uuid('examiner_id').references(() => users.id, { onDelete: 'set null' }),
  examinerCode: varchar('examiner_code', { length: 50 }),
  village: varchar('village', { length: 150 }),
  phoneNumber: varchar('phone_number', { length: 10 }),
  sex: sexEnum('sex').notNull(),
  dob: date('dob'),
  education: smallint('education'), // years of education
  ethnicGroup: varchar('ethnic_group', { length: 50 }),
  ethnicGroupOther: varchar('ethnic_group_other', { length: 150 }),
  occupation: varchar('occupation', { length: 5 }), // WHO code '0'-'3'
  occupationOther: varchar('occupation_other', { length: 150 }),
  habits: text('habits'),

  // Section 04 - Other Findings
  fluorosis: varchar('fluorosis', { length: 2 }),   // '0'-'5','9'
  tdi: varchar('tdi', { length: 2 }),               // '0'-'6','9'
  omlPresent: boolean('oml_present').default(false).notNull(),
  omlSite: varchar('oml_site', { length: 2 }),
  omlCondition: varchar('oml_condition', { length: 2 }),
  omlOtherDetails: text('oml_other_details'),
  prosUpper: varchar('pros_upper', { length: 2 }),  // '0'-'4','9'
  prosLower: varchar('pros_lower', { length: 2 }),
  treatment: varchar('treatment', { length: 2 }),   // '0'-'9'
  notes: text('notes'),

  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
    .$onUpdate(() => new Date()),
}, (t) => [
  index('patient_records_examiner_idx').on(t.examinerId),
  index('patient_records_participant_idx').on(t.participantId),
  index('patient_records_exam_date_idx').on(t.examDate),
  check('chk_occupation', sql`${t.occupation} IS NULL OR ${t.occupation} IN ('0','1','2','3')`),
  check('chk_fluorosis', sql`${t.fluorosis} IS NULL OR ${t.fluorosis} IN ('0','1','2','3','4','5','9')`),
  check('chk_tdi', sql`${t.tdi} IS NULL OR ${t.tdi} IN ('0','1','2','3','4','5','6','9')`),
  check('chk_pros_upper', sql`${t.prosUpper} IS NULL OR ${t.prosUpper} IN ('0','1','2','3','4','9')`),
  check('chk_pros_lower', sql`${t.prosLower} IS NULL OR ${t.prosLower} IN ('0','1','2','3','4','9')`),
  check('chk_treatment', sql`${t.treatment} IS NULL OR ${t.treatment} IN ('0','1','2','3','4','5','6','7','8','9')`),
]);
