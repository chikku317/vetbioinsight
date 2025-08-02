import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, date, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Report Types
export const REPORT_TYPES = {
  BIOCHEMISTRY: 'biochemistry',
  BLOOD_SMEAR: 'blood_smear', 
  WET_FILM: 'wet_film',
  SKIN_SCRAPING: 'skin_scraping',
  IMPRESSION_SMEAR: 'impression_smear',
  EAR_SWAB: 'ear_swab',
  FAECAL_SAMPLE: 'faecal_sample',
  PROGESTERONE: 'progesterone'
} as const;

export type ReportType = typeof REPORT_TYPES[keyof typeof REPORT_TYPES];

export const vetReports = pgTable("vet_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reportType: text("report_type").notNull().default("biochemistry"),
  patientName: text("patient_name").notNull(),
  parentsName: text("parents_name"),
  species: text("species").notNull(),
  breed: text("breed"),
  age: decimal("age").notNull(),
  ageUnit: text("age_unit").notNull().default("years"),
  weight: decimal("weight").notNull(),
  weightUnit: text("weight_unit").notNull().default("kg"),
  medicalRecordNumber: text("medical_record_number"),
  followUpDate: date("follow_up_date"),
  collectionDate: date("collection_date").notNull(),
  reportDate: date("report_date").notNull(),
  attendingVeterinarian: text("attending_veterinarian").notNull(),
  
  // Test Results stored as JSON for flexibility (structure varies by report type)
  testResults: jsonb("test_results").notNull(),
  
  // Examination fields
  observation: text("observation"),
  advice: text("advice"),
  notes: text("notes"),
  dogNotes: text("dog_notes"), // Additional notes field for dog details
  
  // Image attachments
  images: jsonb("images").default([]),
  
  // Clinical Notes - optional (for biochemistry reports)
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
  sgot: z.number().optional(), // Added SGOT
  sgpt: z.number().optional(), // Added SGPT
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

// First define all result schemas before using them

// Blood Smear Results Schema
export const bloodSmearResultsSchema = z.object({
  rbcMorphology: z.enum(["Normal", "Anisocytosis", "Poikilocytosis", "Polychromasia", "Other"]).optional(),
  wbcCount: z.number().optional(),
  plateletCount: z.number().optional(), 
  parasites: z.enum(["None detected", "Babesia", "Ehrlichia", "Anaplasma", "Other"]).optional(),
  cellDistribution: z.string().optional(),
});

// Wet Film Results Schema
export const wetFilmResultsSchema = z.object({
  sampleType: z.enum(["Urine", "Vaginal discharge", "Ear discharge", "Other"]).optional(),
  bacteria: z.enum(["None", "Cocci", "Bacilli", "Mixed", "Other"]).optional(),
  yeastFungi: z.enum(["None detected", "Candida", "Malassezia", "Other"]).optional(),
  parasites: z.enum(["None detected", "Trichomonas", "Other"]).optional(),
  cellsPresent: z.array(z.enum(["Epithelial cells", "WBCs", "RBCs", "Other"])).default([]),
});

// Skin Scraping Results Schema  
export const skinScrapingResultsSchema = z.object({
  scrapingSite: z.string().optional(),
  scrapingDepth: z.enum(["Superficial", "Deep"]).optional(),
  mitesDetected: z.enum(["None", "Demodex", "Sarcoptes", "Cheyletiella", "Other"]).optional(),
  fungalElements: z.enum(["None", "Dermatophytes", "Spores", "Hyphae"]).optional(),
  secondaryInfections: z.array(z.enum(["Bacterial", "Yeast"])).default([]),
});

// Impression Smear Results Schema
export const impressionSmearResultsSchema = z.object({
  sampleSource: z.string().optional(),
  cellTypesObserved: z.array(z.enum(["Neutrophils", "Macrophages", "Lymphocytes", "Plasma cells", "Other"])).default([]),
  bacteriaPresent: z.enum(["None", "Intracellular", "Extracellular", "Mixed"]).optional(),
  malignantCells: z.enum(["Not detected", "Suspected", "Present"]).optional(),
  inflammatoryPattern: z.enum(["Acute", "Chronic", "Granulomatous", "Mixed"]).optional(),
});

// Ear Swab Results Schema
export const earSwabResultsSchema = z.object({
  earSide: z.enum(["Left", "Right", "Both"]).optional(),
  sampleType: z.enum(["Ear discharge", "Wax", "Debris"]).optional(),
  odor: z.enum(["None", "Mild", "Moderate", "Strong", "Foul"]).optional(),
  colorConsistency: z.enum(["Clear", "Yellow", "Brown", "Black", "Purulent", "Waxy", "Dry"]).optional(),
  bacteriaPresent: z.enum(["None detected", "Cocci (Gram+)", "Bacilli (Gram+)", "Gram- bacteria", "Mixed"]).optional(),
  yeastFungi: z.enum(["None detected", "Malassezia", "Candida", "Other yeast"]).optional(),
  parasites: z.enum(["None detected", "Ear mites (Otodectes)", "Other mites"]).optional(),
  inflammatoryCells: z.array(z.enum(["Neutrophils", "Macrophages", "Eosinophils", "Lymphocytes"])).default([]),
  epithelialCells: z.enum(["Few", "Moderate", "Many"]).optional(),
});

// Faecal Sample Results Schema
export const faecalSampleResultsSchema = z.object({
  sampleConsistency: z.enum(["Formed", "Soft", "Loose", "Watery", "Mucoid", "Bloody"]).optional(),
  sampleColor: z.enum(["Brown", "Yellow", "Green", "Black", "Red-tinged", "Clay-colored"]).optional(),
  parasiteEggs: z.array(z.enum(["None detected", "Roundworm", "Hookworm", "Whipworm", "Tapeworm segments"])).default([]),
  parasiteProtozoa: z.array(z.enum(["None detected", "Giardia cysts", "Coccidia oocysts", "Other"])).default([]),
  parasiteLoad: z.enum(["None", "Light (+)", "Moderate (++)", "Heavy (+++)"]).optional(),
  bacteria: z.enum(["Normal flora", "Overgrowth", "Pathogenic bacteria suspected"]).optional(),
  bloodMucus: z.array(z.enum(["None", "Occult blood", "Visible blood", "Mucus present"])).default([]),
  undigestedFood: z.enum(["None", "Minimal", "Moderate", "Excessive"]).optional(),
  fatGlobules: z.enum(["None", "Few", "Moderate", "Many"]).optional(),
  yeastFungi: z.enum(["None detected", "Present", "Overgrowth"]).optional(),
});

// Progesterone Results Schema
export const progesteroneResultsSchema = z.object({
  progesteroneLevel: z.number().optional(),
  testingMethod: z.enum(["ELISA", "Chemiluminescence", "RIA", "Other"]).optional(),
  sampleQuality: z.enum(["Adequate", "Suboptimal", "Poor"]).optional(),
  breedingAdvice: z.enum(["Proceed", "Retest"]).optional(),
});

// Now create the insert schema with proper references
export const insertVetReportSchema = createInsertSchema(vetReports).omit({
  id: true,
  createdAt: true,
}).extend({
  reportType: z.enum(["biochemistry", "blood_smear", "wet_film", "skin_scraping", "impression_smear", "ear_swab", "faecal_sample", "progesterone"]).default("biochemistry"),
  testResults: z.union([
    testResultsSchema,
    bloodSmearResultsSchema,
    wetFilmResultsSchema,
    skinScrapingResultsSchema,
    impressionSmearResultsSchema,
    earSwabResultsSchema,
    faecalSampleResultsSchema,
    progesteroneResultsSchema
  ]),
  breed: z.string().optional().nullable(),
  parentsName: z.string().optional().nullable(),
  medicalRecordNumber: z.string().optional().nullable(),
  followUpDate: z.string().optional().nullable(),
  observation: z.string().optional().nullable(),
  advice: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  dogNotes: z.string().optional().nullable(),
  images: z.array(z.string()).default([]),
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
  "exotic",
  "other"
] as const;

export type Species = typeof speciesOptions[number];

// Type guards and helpers for test results
export type BloodSmearResults = z.infer<typeof bloodSmearResultsSchema>;
export type WetFilmResults = z.infer<typeof wetFilmResultsSchema>;
export type SkinScrapingResults = z.infer<typeof skinScrapingResultsSchema>;
export type ImpressionSmearResults = z.infer<typeof impressionSmearResultsSchema>;
export type EarSwabResults = z.infer<typeof earSwabResultsSchema>;
export type FaecalSampleResults = z.infer<typeof faecalSampleResultsSchema>;
export type ProgesteroneResults = z.infer<typeof progesteroneResultsSchema>;
