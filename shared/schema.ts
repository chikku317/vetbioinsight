import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, date, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const vetReports = pgTable("vet_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientName: text("patient_name").notNull(),
  parentsName: text("parents_name"),
  species: text("species").notNull(),
  breed: text("breed"),
  age: decimal("age").notNull(),
  ageUnit: text("age_unit").notNull().default("years"),
  weight: decimal("weight").notNull(),
  weightUnit: text("weight_unit").notNull().default("kg"),
  medicalRecordNumber: text("medical_record_number"),
  collectionDate: date("collection_date").notNull(),
  reportDate: date("report_date").notNull(),
  attendingVeterinarian: text("attending_veterinarian").notNull(),
  
  // Test Results stored as JSON for flexibility
  testResults: jsonb("test_results").notNull(),
  
  // Clinical Notes - optional
  clinicalNotes: text("clinical_notes"),
  clinicalNotesEnabled: boolean("clinical_notes_enabled").default(false),
  
  // Report metadata
  createdAt: date("created_at").default(sql`CURRENT_DATE`),
});

export const testResultsSchema = z.object({
  // Hepatic Function Panel
  alt: z.number().optional(),
  alp: z.number().optional(),
  ggt: z.number().optional(),
  totalBilirubin: z.number().optional(),
  bilirubinUnit: z.enum(["mg/dl", "umol/l"]).default("mg/dl"),
  
  // Renal Function Panel
  bun: z.number().optional(),
  creatinine: z.number().optional(),
  
  // Pancreatic Function Panel
  amylase: z.number().optional(),
  lipase: z.number().optional(),
  
  // Glucose & Electrolytes Panel
  glucose: z.number().optional(),
  sodium: z.number().optional(),
  potassium: z.number().optional(),
  chloride: z.number().optional(),
  
  // Proteins & Other Panel
  totalProtein: z.number().optional(),
  albumin: z.number().optional(),
  globulin: z.number().optional(), // Auto-calculated
  cholesterol: z.number().optional(),
  phosphorus: z.number().optional(),
  calcium: z.number().optional(),
});

export const insertVetReportSchema = createInsertSchema(vetReports).omit({
  id: true,
  createdAt: true,
}).extend({
  testResults: testResultsSchema,
  breed: z.string().optional().nullable(),
  parentsName: z.string().optional().nullable(),
  medicalRecordNumber: z.string().optional().nullable(),
  clinicalNotes: z.string().optional().nullable(),
  clinicalNotesEnabled: z.boolean().default(false),
});

export type InsertVetReport = z.infer<typeof insertVetReportSchema>;
export type VetReport = typeof vetReports.$inferSelect;
export type TestResults = z.infer<typeof testResultsSchema>;

export const speciesOptions = [
  "dog",
  "cat", 
  "horse",
  "cattle",
  "sheep",
  "goat",
  "pig",
  "bird",
  "rabbit",
  "other"
] as const;

export type Species = typeof speciesOptions[number];
