import { Species } from "@shared/schema";

export interface ReferenceRange {
  min: number;
  max: number;
  unit: string;
  criticalLow?: number;
  criticalHigh?: number;
}

export interface SpeciesReferenceRanges {
  // Hepatic Function Panel
  alt: ReferenceRange;
  alp: ReferenceRange;
  ggt: ReferenceRange;
  sgot: ReferenceRange; // Added SGOT
  sgpt: ReferenceRange; // Added SGPT
  totalBilirubin: ReferenceRange;
  
  // Renal Function Panel
  bun: ReferenceRange;
  creatinine: ReferenceRange;
  
  // Pancreatic Function Panel
  amylase: ReferenceRange;
  lipase: ReferenceRange;
  
  // Glucose & Electrolytes Panel
  glucose: ReferenceRange;
  sodium: ReferenceRange;
  potassium: ReferenceRange;
  chloride: ReferenceRange;
  
  // Proteins & Other Panel
  totalProtein: ReferenceRange;
  albumin: ReferenceRange;
  globulin: ReferenceRange;
  cholesterol: ReferenceRange;
  phosphorus: ReferenceRange;
  calcium: ReferenceRange;
}

export const referenceRanges: Record<Species, SpeciesReferenceRanges> = {
  dog: {
    alt: { min: 10, max: 100, unit: "U/L", criticalHigh: 200 },
    alp: { min: 20, max: 150, unit: "U/L", criticalHigh: 300 },
    ggt: { min: 0, max: 10, unit: "U/L", criticalHigh: 20 },
    sgot: { min: 8, max: 40, unit: "U/L", criticalHigh: 80 },
    sgpt: { min: 10, max: 100, unit: "U/L", criticalHigh: 200 },
    totalBilirubin: { min: 0.0, max: 0.9, unit: "mg/dL", criticalHigh: 2.0 },
    bun: { min: 7, max: 27, unit: "mg/dL", criticalHigh: 60 },
    creatinine: { min: 0.5, max: 1.6, unit: "mg/dL", criticalHigh: 4.0 },
    amylase: { min: 200, max: 800, unit: "U/L", criticalHigh: 1500 },
    lipase: { min: 20, max: 200, unit: "U/L", criticalHigh: 400 },
    glucose: { min: 70, max: 143, unit: "mg/dL", criticalLow: 40, criticalHigh: 250 },
    sodium: { min: 144, max: 160, unit: "mEq/L", criticalLow: 130, criticalHigh: 170 },
    potassium: { min: 3.5, max: 5.8, unit: "mEq/L", criticalLow: 2.5, criticalHigh: 7.0 },
    chloride: { min: 109, max: 122, unit: "mEq/L", criticalLow: 95, criticalHigh: 135 },
    totalProtein: { min: 5.4, max: 7.1, unit: "g/dL", criticalLow: 4.0, criticalHigh: 9.0 },
    albumin: { min: 2.3, max: 4.0, unit: "g/dL", criticalLow: 1.5, criticalHigh: 5.0 },
    globulin: { min: 2.5, max: 4.5, unit: "g/dL", criticalHigh: 6.0 },
    cholesterol: { min: 112, max: 320, unit: "mg/dL", criticalHigh: 500 },
    phosphorus: { min: 2.6, max: 6.2, unit: "mg/dL", criticalHigh: 10.0 },
    calcium: { min: 9.1, max: 11.7, unit: "mg/dL", criticalLow: 7.0, criticalHigh: 14.0 },
  },
  cat: {
    alt: { min: 10, max: 80, unit: "U/L", criticalHigh: 150 },
    alp: { min: 14, max: 111, unit: "U/L", criticalHigh: 200 },
    ggt: { min: 0, max: 7, unit: "U/L", criticalHigh: 15 },
    sgot: { min: 5, max: 55, unit: "U/L", criticalHigh: 110 },
    sgpt: { min: 6, max: 83, unit: "U/L", criticalHigh: 166 },
    totalBilirubin: { min: 0.0, max: 0.4, unit: "mg/dL", criticalHigh: 1.5 },
    bun: { min: 16, max: 36, unit: "mg/dL", criticalHigh: 80 },
    creatinine: { min: 0.8, max: 2.4, unit: "mg/dL", criticalHigh: 5.0 },
    amylase: { min: 500, max: 1500, unit: "U/L", criticalHigh: 2500 },
    lipase: { min: 0, max: 160, unit: "U/L", criticalHigh: 300 },
    glucose: { min: 71, max: 159, unit: "mg/dL", criticalLow: 40, criticalHigh: 250 },
    sodium: { min: 150, max: 165, unit: "mEq/L", criticalLow: 135, criticalHigh: 175 },
    potassium: { min: 3.5, max: 5.8, unit: "mEq/L", criticalLow: 2.5, criticalHigh: 7.0 },
    chloride: { min: 117, max: 123, unit: "mEq/L", criticalLow: 105, criticalHigh: 135 },
    totalProtein: { min: 5.4, max: 7.8, unit: "g/dL", criticalLow: 4.0, criticalHigh: 9.0 },
    albumin: { min: 2.1, max: 3.3, unit: "g/dL", criticalLow: 1.5, criticalHigh: 4.5 },
    globulin: { min: 2.6, max: 5.1, unit: "g/dL", criticalHigh: 6.5 },
    cholesterol: { min: 82, max: 218, unit: "mg/dL", criticalHigh: 350 },
    phosphorus: { min: 3.1, max: 7.0, unit: "mg/dL", criticalHigh: 12.0 },
    calcium: { min: 8.2, max: 10.8, unit: "mg/dL", criticalLow: 6.5, criticalHigh: 13.0 },
  },
  horse: {
    alt: { min: 3, max: 23, unit: "U/L", criticalHigh: 50 },
    alp: { min: 143, max: 395, unit: "U/L", criticalHigh: 600 },
    ggt: { min: 4, max: 13, unit: "U/L", criticalHigh: 25 },
    sgot: { min: 226, max: 366, unit: "U/L", criticalHigh: 500 },
    sgpt: { min: 3, max: 23, unit: "U/L", criticalHigh: 50 },
    totalBilirubin: { min: 1.0, max: 2.0, unit: "mg/dL", criticalHigh: 4.0 },
    bun: { min: 10, max: 24, unit: "mg/dL", criticalHigh: 50 },
    creatinine: { min: 1.2, max: 1.9, unit: "mg/dL", criticalHigh: 4.0 },
    amylase: { min: 23, max: 83, unit: "U/L", criticalHigh: 150 },
    lipase: { min: 1, max: 17, unit: "U/L", criticalHigh: 35 },
    glucose: { min: 75, max: 115, unit: "mg/dL", criticalLow: 40, criticalHigh: 200 },
    sodium: { min: 132, max: 146, unit: "mEq/L", criticalLow: 125, criticalHigh: 155 },
    potassium: { min: 2.4, max: 4.7, unit: "mEq/L", criticalLow: 2.0, criticalHigh: 6.0 },
    chloride: { min: 99, max: 109, unit: "mEq/L", criticalLow: 90, criticalHigh: 120 },
    totalProtein: { min: 5.2, max: 7.9, unit: "g/dL", criticalLow: 4.0, criticalHigh: 9.0 },
    albumin: { min: 2.6, max: 3.7, unit: "g/dL", criticalLow: 2.0, criticalHigh: 4.5 },
    globulin: { min: 2.6, max: 4.0, unit: "g/dL", criticalHigh: 5.5 },
    cholesterol: { min: 75, max: 150, unit: "mg/dL", criticalHigh: 250 },
    phosphorus: { min: 1.0, max: 4.0, unit: "mg/dL", criticalHigh: 7.0 },
    calcium: { min: 11.2, max: 13.6, unit: "mg/dL", criticalLow: 9.0, criticalHigh: 16.0 },
  },
  cattle: {
    alt: { min: 11, max: 40, unit: "U/L", criticalHigh: 80 },
    alp: { min: 0, max: 488, unit: "U/L", criticalHigh: 700 },
    ggt: { min: 6.1, max: 17.4, unit: "U/L", criticalHigh: 30 },
    sgot: { min: 78, max: 132, unit: "U/L", criticalHigh: 200 },
    sgpt: { min: 11, max: 40, unit: "U/L", criticalHigh: 80 },
    totalBilirubin: { min: 0.04, max: 0.44, unit: "mg/dL", criticalHigh: 1.0 },
    bun: { min: 6, max: 27, unit: "mg/dL", criticalHigh: 50 },
    creatinine: { min: 1.0, max: 2.0, unit: "mg/dL", criticalHigh: 4.0 },
    amylase: { min: 200, max: 800, unit: "U/L", criticalHigh: 1200 },
    lipase: { min: 20, max: 200, unit: "U/L", criticalHigh: 350 },
    glucose: { min: 45, max: 75, unit: "mg/dL", criticalLow: 30, criticalHigh: 120 },
    sodium: { min: 132, max: 152, unit: "mEq/L", criticalLow: 125, criticalHigh: 165 },
    potassium: { min: 3.9, max: 5.8, unit: "mEq/L", criticalLow: 3.0, criticalHigh: 7.0 },
    chloride: { min: 97, max: 111, unit: "mEq/L", criticalLow: 90, criticalHigh: 125 },
    totalProtein: { min: 5.7, max: 8.1, unit: "g/dL", criticalLow: 4.5, criticalHigh: 9.5 },
    albumin: { min: 3.0, max: 3.6, unit: "g/dL", criticalLow: 2.0, criticalHigh: 4.5 },
    globulin: { min: 3.0, max: 4.8, unit: "g/dL", criticalHigh: 6.0 },
    cholesterol: { min: 80, max: 280, unit: "mg/dL", criticalHigh: 400 },
    phosphorus: { min: 5.6, max: 6.5, unit: "mg/dL", criticalHigh: 10.0 },
    calcium: { min: 9.7, max: 10.4, unit: "mg/dL", criticalLow: 8.0, criticalHigh: 12.0 },
  },
  // Using baseline values for remaining species with SGOT/SGPT added
  sheep: {
    alt: { min: 10, max: 100, unit: "U/L", criticalHigh: 200 },
    alp: { min: 20, max: 150, unit: "U/L", criticalHigh: 300 },
    ggt: { min: 0, max: 10, unit: "U/L", criticalHigh: 20 },
    sgot: { min: 60, max: 280, unit: "U/L", criticalHigh: 400 },
    sgpt: { min: 10, max: 100, unit: "U/L", criticalHigh: 200 },
    totalBilirubin: { min: 0.0, max: 0.9, unit: "mg/dL", criticalHigh: 2.0 },
    bun: { min: 7, max: 27, unit: "mg/dL", criticalHigh: 60 },
    creatinine: { min: 0.5, max: 1.6, unit: "mg/dL", criticalHigh: 4.0 },
    amylase: { min: 200, max: 800, unit: "U/L", criticalHigh: 1500 },
    lipase: { min: 20, max: 200, unit: "U/L", criticalHigh: 400 },
    glucose: { min: 50, max: 80, unit: "mg/dL", criticalLow: 35, criticalHigh: 150 },
    sodium: { min: 144, max: 160, unit: "mEq/L", criticalLow: 130, criticalHigh: 170 },
    potassium: { min: 3.5, max: 5.8, unit: "mEq/L", criticalLow: 2.5, criticalHigh: 7.0 },
    chloride: { min: 109, max: 122, unit: "mEq/L", criticalLow: 95, criticalHigh: 135 },
    totalProtein: { min: 6.0, max: 7.9, unit: "g/dL", criticalLow: 4.5, criticalHigh: 9.0 },
    albumin: { min: 2.4, max: 3.0, unit: "g/dL", criticalLow: 1.8, criticalHigh: 4.0 },
    globulin: { min: 3.5, max: 5.7, unit: "g/dL", criticalHigh: 7.0 },
    cholesterol: { min: 112, max: 320, unit: "mg/dL", criticalHigh: 500 },
    phosphorus: { min: 2.6, max: 6.2, unit: "mg/dL", criticalHigh: 10.0 },
    calcium: { min: 9.1, max: 11.7, unit: "mg/dL", criticalLow: 7.0, criticalHigh: 14.0 },
  },
  goat: {
    alt: { min: 10, max: 100, unit: "U/L", criticalHigh: 200 },
    alp: { min: 20, max: 150, unit: "U/L", criticalHigh: 300 },
    ggt: { min: 0, max: 10, unit: "U/L", criticalHigh: 20 },
    sgot: { min: 60, max: 280, unit: "U/L", criticalHigh: 400 },
    sgpt: { min: 10, max: 100, unit: "U/L", criticalHigh: 200 },
    totalBilirubin: { min: 0.0, max: 0.9, unit: "mg/dL", criticalHigh: 2.0 },
    bun: { min: 7, max: 27, unit: "mg/dL", criticalHigh: 60 },
    creatinine: { min: 0.5, max: 1.6, unit: "mg/dL", criticalHigh: 4.0 },
    amylase: { min: 200, max: 800, unit: "U/L", criticalHigh: 1500 },
    lipase: { min: 20, max: 200, unit: "U/L", criticalHigh: 400 },
    glucose: { min: 50, max: 80, unit: "mg/dL", criticalLow: 35, criticalHigh: 150 },
    sodium: { min: 144, max: 160, unit: "mEq/L", criticalLow: 130, criticalHigh: 170 },
    potassium: { min: 3.5, max: 5.8, unit: "mEq/L", criticalLow: 2.5, criticalHigh: 7.0 },
    chloride: { min: 109, max: 122, unit: "mEq/L", criticalLow: 95, criticalHigh: 135 },
    totalProtein: { min: 5.4, max: 7.1, unit: "g/dL", criticalLow: 4.0, criticalHigh: 9.0 },
    albumin: { min: 2.3, max: 4.0, unit: "g/dL", criticalLow: 1.5, criticalHigh: 5.0 },
    globulin: { min: 2.5, max: 4.5, unit: "g/dL", criticalHigh: 6.0 },
    cholesterol: { min: 112, max: 320, unit: "mg/dL", criticalHigh: 500 },
    phosphorus: { min: 2.6, max: 6.2, unit: "mg/dL", criticalHigh: 10.0 },
    calcium: { min: 9.1, max: 11.7, unit: "mg/dL", criticalLow: 7.0, criticalHigh: 14.0 },
  },
  pig: {
    alt: { min: 10, max: 100, unit: "U/L", criticalHigh: 200 },
    alp: { min: 20, max: 150, unit: "U/L", criticalHigh: 300 },
    ggt: { min: 0, max: 10, unit: "U/L", criticalHigh: 20 },
    sgot: { min: 8, max: 40, unit: "U/L", criticalHigh: 80 },
    sgpt: { min: 10, max: 100, unit: "U/L", criticalHigh: 200 },
    totalBilirubin: { min: 0.0, max: 0.9, unit: "mg/dL", criticalHigh: 2.0 },
    bun: { min: 7, max: 27, unit: "mg/dL", criticalHigh: 60 },
    creatinine: { min: 0.5, max: 1.6, unit: "mg/dL", criticalHigh: 4.0 },
    amylase: { min: 200, max: 800, unit: "U/L", criticalHigh: 1500 },
    lipase: { min: 20, max: 200, unit: "U/L", criticalHigh: 400 },
    glucose: { min: 70, max: 143, unit: "mg/dL", criticalLow: 40, criticalHigh: 250 },
    sodium: { min: 144, max: 160, unit: "mEq/L", criticalLow: 130, criticalHigh: 170 },
    potassium: { min: 3.5, max: 5.8, unit: "mEq/L", criticalLow: 2.5, criticalHigh: 7.0 },
    chloride: { min: 109, max: 122, unit: "mEq/L", criticalLow: 95, criticalHigh: 135 },
    totalProtein: { min: 5.4, max: 7.1, unit: "g/dL", criticalLow: 4.0, criticalHigh: 9.0 },
    albumin: { min: 2.3, max: 4.0, unit: "g/dL", criticalLow: 1.5, criticalHigh: 5.0 },
    globulin: { min: 2.5, max: 4.5, unit: "g/dL", criticalHigh: 6.0 },
    cholesterol: { min: 112, max: 320, unit: "mg/dL", criticalHigh: 500 },
    phosphorus: { min: 2.6, max: 6.2, unit: "mg/dL", criticalHigh: 10.0 },
    calcium: { min: 9.1, max: 11.7, unit: "mg/dL", criticalLow: 7.0, criticalHigh: 14.0 },
  },
  bird: {
    alt: { min: 10, max: 100, unit: "U/L", criticalHigh: 200 },
    alp: { min: 20, max: 150, unit: "U/L", criticalHigh: 300 },
    ggt: { min: 0, max: 10, unit: "U/L", criticalHigh: 20 },
    sgot: { min: 8, max: 40, unit: "U/L", criticalHigh: 80 },
    sgpt: { min: 10, max: 100, unit: "U/L", criticalHigh: 200 },
    totalBilirubin: { min: 0.0, max: 0.9, unit: "mg/dL", criticalHigh: 2.0 },
    bun: { min: 7, max: 27, unit: "mg/dL", criticalHigh: 60 },
    creatinine: { min: 0.5, max: 1.6, unit: "mg/dL", criticalHigh: 4.0 },
    amylase: { min: 200, max: 800, unit: "U/L", criticalHigh: 1500 },
    lipase: { min: 20, max: 200, unit: "U/L", criticalHigh: 400 },
    glucose: { min: 70, max: 143, unit: "mg/dL", criticalLow: 40, criticalHigh: 250 },
    sodium: { min: 144, max: 160, unit: "mEq/L", criticalLow: 130, criticalHigh: 170 },
    potassium: { min: 3.5, max: 5.8, unit: "mEq/L", criticalLow: 2.5, criticalHigh: 7.0 },
    chloride: { min: 109, max: 122, unit: "mEq/L", criticalLow: 95, criticalHigh: 135 },
    totalProtein: { min: 5.4, max: 7.1, unit: "g/dL", criticalLow: 4.0, criticalHigh: 9.0 },
    albumin: { min: 2.3, max: 4.0, unit: "g/dL", criticalLow: 1.5, criticalHigh: 5.0 },
    globulin: { min: 2.5, max: 4.5, unit: "g/dL", criticalHigh: 6.0 },
    cholesterol: { min: 112, max: 320, unit: "mg/dL", criticalHigh: 500 },
    phosphorus: { min: 2.6, max: 6.2, unit: "mg/dL", criticalHigh: 10.0 },
    calcium: { min: 9.1, max: 11.7, unit: "mg/dL", criticalLow: 7.0, criticalHigh: 14.0 },
  },
  rabbit: {
    alt: { min: 10, max: 100, unit: "U/L", criticalHigh: 200 },
    alp: { min: 20, max: 150, unit: "U/L", criticalHigh: 300 },
    ggt: { min: 0, max: 10, unit: "U/L", criticalHigh: 20 },
    sgot: { min: 8, max: 40, unit: "U/L", criticalHigh: 80 },
    sgpt: { min: 10, max: 100, unit: "U/L", criticalHigh: 200 },
    totalBilirubin: { min: 0.0, max: 0.9, unit: "mg/dL", criticalHigh: 2.0 },
    bun: { min: 7, max: 27, unit: "mg/dL", criticalHigh: 60 },
    creatinine: { min: 0.5, max: 1.6, unit: "mg/dL", criticalHigh: 4.0 },
    amylase: { min: 200, max: 800, unit: "U/L", criticalHigh: 1500 },
    lipase: { min: 20, max: 200, unit: "U/L", criticalHigh: 400 },
    glucose: { min: 70, max: 143, unit: "mg/dL", criticalLow: 40, criticalHigh: 250 },
    sodium: { min: 144, max: 160, unit: "mEq/L", criticalLow: 130, criticalHigh: 170 },
    potassium: { min: 3.5, max: 5.8, unit: "mEq/L", criticalLow: 2.5, criticalHigh: 7.0 },
    chloride: { min: 109, max: 122, unit: "mEq/L", criticalLow: 95, criticalHigh: 135 },
    totalProtein: { min: 5.4, max: 7.1, unit: "g/dL", criticalLow: 4.0, criticalHigh: 9.0 },
    albumin: { min: 2.3, max: 4.0, unit: "g/dL", criticalLow: 1.5, criticalHigh: 5.0 },
    globulin: { min: 2.5, max: 4.5, unit: "g/dL", criticalHigh: 6.0 },
    cholesterol: { min: 112, max: 320, unit: "mg/dL", criticalHigh: 500 },
    phosphorus: { min: 2.6, max: 6.2, unit: "mg/dL", criticalHigh: 10.0 },
    calcium: { min: 9.1, max: 11.7, unit: "mg/dL", criticalLow: 7.0, criticalHigh: 14.0 },
  },
  exotic: {
    alt: { min: 10, max: 100, unit: "U/L", criticalHigh: 200 },
    alp: { min: 20, max: 150, unit: "U/L", criticalHigh: 300 },
    ggt: { min: 0, max: 10, unit: "U/L", criticalHigh: 20 },
    sgot: { min: 8, max: 40, unit: "U/L", criticalHigh: 80 },
    sgpt: { min: 10, max: 100, unit: "U/L", criticalHigh: 200 },
    totalBilirubin: { min: 0.0, max: 0.9, unit: "mg/dL", criticalHigh: 2.0 },
    bun: { min: 7, max: 27, unit: "mg/dL", criticalHigh: 60 },
    creatinine: { min: 0.5, max: 1.6, unit: "mg/dL", criticalHigh: 4.0 },
    amylase: { min: 200, max: 800, unit: "U/L", criticalHigh: 1500 },
    lipase: { min: 20, max: 200, unit: "U/L", criticalHigh: 400 },
    glucose: { min: 70, max: 143, unit: "mg/dL", criticalLow: 40, criticalHigh: 250 },
    sodium: { min: 144, max: 160, unit: "mEq/L", criticalLow: 130, criticalHigh: 170 },
    potassium: { min: 3.5, max: 5.8, unit: "mEq/L", criticalLow: 2.5, criticalHigh: 7.0 },
    chloride: { min: 109, max: 122, unit: "mEq/L", criticalLow: 95, criticalHigh: 135 },
    totalProtein: { min: 5.4, max: 7.1, unit: "g/dL", criticalLow: 4.0, criticalHigh: 9.0 },
    albumin: { min: 2.3, max: 4.0, unit: "g/dL", criticalLow: 1.5, criticalHigh: 5.0 },
    globulin: { min: 2.5, max: 4.5, unit: "g/dL", criticalHigh: 6.0 },
    cholesterol: { min: 112, max: 320, unit: "mg/dL", criticalHigh: 500 },
    phosphorus: { min: 2.6, max: 6.2, unit: "mg/dL", criticalHigh: 10.0 },
    calcium: { min: 9.1, max: 11.7, unit: "mg/dL", criticalLow: 7.0, criticalHigh: 14.0 },
  },
  other: {
    alt: { min: 10, max: 100, unit: "U/L", criticalHigh: 200 },
    alp: { min: 20, max: 150, unit: "U/L", criticalHigh: 300 },
    ggt: { min: 0, max: 10, unit: "U/L", criticalHigh: 20 },
    sgot: { min: 8, max: 40, unit: "U/L", criticalHigh: 80 },
    sgpt: { min: 10, max: 100, unit: "U/L", criticalHigh: 200 },
    totalBilirubin: { min: 0.0, max: 0.9, unit: "mg/dL", criticalHigh: 2.0 },
    bun: { min: 7, max: 27, unit: "mg/dL", criticalHigh: 60 },
    creatinine: { min: 0.5, max: 1.6, unit: "mg/dL", criticalHigh: 4.0 },
    amylase: { min: 200, max: 800, unit: "U/L", criticalHigh: 1500 },
    lipase: { min: 20, max: 200, unit: "U/L", criticalHigh: 400 },
    glucose: { min: 70, max: 143, unit: "mg/dL", criticalLow: 40, criticalHigh: 250 },
    sodium: { min: 144, max: 160, unit: "mEq/L", criticalLow: 130, criticalHigh: 170 },
    potassium: { min: 3.5, max: 5.8, unit: "mEq/L", criticalLow: 2.5, criticalHigh: 7.0 },
    chloride: { min: 109, max: 122, unit: "mEq/L", criticalLow: 95, criticalHigh: 135 },
    totalProtein: { min: 5.4, max: 7.1, unit: "g/dL", criticalLow: 4.0, criticalHigh: 9.0 },
    albumin: { min: 2.3, max: 4.0, unit: "g/dL", criticalLow: 1.5, criticalHigh: 5.0 },
    globulin: { min: 2.5, max: 4.5, unit: "g/dL", criticalHigh: 6.0 },
    cholesterol: { min: 112, max: 320, unit: "mg/dL", criticalHigh: 500 },
    phosphorus: { min: 2.6, max: 6.2, unit: "mg/dL", criticalHigh: 10.0 },
    calcium: { min: 9.1, max: 11.7, unit: "mg/dL", criticalLow: 7.0, criticalHigh: 14.0 },
  },
};

// Status checking functions
export function getTestStatus(testKey: keyof SpeciesReferenceRanges, value: number, species: Species): 'normal' | 'low' | 'high' | 'critical' {
  const range = referenceRanges[species][testKey];
  if (!range) return 'normal';
  
  if (range.criticalLow && value < range.criticalLow) return 'critical';
  if (range.criticalHigh && value > range.criticalHigh) return 'critical';
  if (value < range.min) return 'low';
  if (value > range.max) return 'high';
  return 'normal';
}

export function getStatusLabel(status: 'normal' | 'low' | 'high' | 'critical'): string {
  switch (status) {
    case 'normal': return 'Normal';
    case 'low': return 'Low';
    case 'high': return 'High';
    case 'critical': return 'Critical';
    default: return 'Normal';
  }
}

export function getStatusColor(status: 'normal' | 'low' | 'high' | 'critical'): string {
  switch (status) {
    case 'normal': return 'text-green-700 bg-green-100 border-green-300';
    case 'low': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
    case 'high': return 'text-orange-700 bg-orange-100 border-orange-300';
    case 'critical': return 'text-red-700 bg-red-100 border-red-300';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function getStatusTextColor(status: 'normal' | 'low' | 'high' | 'critical'): string {
  switch (status) {
    case 'normal': return 'text-green-700';
    case 'low': return 'text-yellow-700';
    case 'high': return 'text-orange-700';
    case 'critical': return 'text-red-700';
    default: return 'text-gray-600';
  }
}