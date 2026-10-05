import { relations } from 'drizzle-orm';
import { users } from './users';
import { patientRecords } from './patient-records';
import { teethStatus } from './teeth-status';
import { perioTooth } from './perio-tooth';
import { perioSite } from './perio-site';
import { perioSextant } from './perio-sextant';

export const usersRelations = relations(users, ({ many }) => ({
  examinedRecords: many(patientRecords),
}));

export const patientRecordsRelations = relations(patientRecords, ({ one, many }) => ({
  examiner: one(users, { fields: [patientRecords.examinerId], references: [users.id] }),
  teeth: many(teethStatus),
  perioTeeth: many(perioTooth),
  perioSextants: many(perioSextant),
}));

export const teethStatusRelations = relations(teethStatus, ({ one }) => ({
  record: one(patientRecords, { fields: [teethStatus.recordId], references: [patientRecords.id] }),
}));

export const perioToothRelations = relations(perioTooth, ({ one, many }) => ({
  record: one(patientRecords, { fields: [perioTooth.recordId], references: [patientRecords.id] }),
  sites: many(perioSite),
}));

export const perioSiteRelations = relations(perioSite, ({ one }) => ({
  tooth: one(perioTooth, { fields: [perioSite.perioToothId], references: [perioTooth.id] }),
}));

export const perioSextantRelations = relations(perioSextant, ({ one }) => ({
  record: one(patientRecords, { fields: [perioSextant.recordId], references: [patientRecords.id] }),
}));
