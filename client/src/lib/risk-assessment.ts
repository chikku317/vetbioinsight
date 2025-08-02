import { TestResults, BiochemistryTestResults } from "@shared/schema";
import { referenceRanges } from "./reference-ranges";

export type RiskLevel = "normal" | "borderline" | "critical";

export interface RiskAssessment {
  level: RiskLevel;
  message: string;
  priority: number;
  color: string;
  bgColor: string;
}

// Critical thresholds for different test parameters
const criticalRanges = {
  // Liver function - critical values
  alt: { critical: { min: 0, max: 300 } }, // Very high ALT indicates severe liver damage
  ast: { critical: { min: 0, max: 400 } },
  alkp: { critical: { min: 0, max: 500 } },
  ggt: { critical: { min: 0, max: 150 } },
  bilirubin: { critical: { min: 0, max: 5.0 } },
  
  // Kidney function - critical values
  bun: { critical: { min: 0, max: 80 } }, // Very high BUN indicates kidney failure
  creatinine: { critical: { min: 0, max: 4.0 } },
  
  // Electrolytes - critical imbalances
  sodium: { critical: { min: 120, max: 160 } },
  potassium: { critical: { min: 2.5, max: 7.0 } },
  chloride: { critical: { min: 90, max: 130 } },
  
  // Proteins - critical levels
  totalProtein: { critical: { min: 4.0, max: 10.0 } },
  albumin: { critical: { min: 1.5, max: 5.0 } },
  
  // Metabolism - critical values
  glucose: { critical: { min: 40, max: 500 } }, // Hypoglycemia or severe diabetes
  cholesterol: { critical: { min: 0, max: 500 } },
  
  // Pancreatic enzymes - critical for pancreatitis
  amylase: { critical: { min: 0, max: 2000 } },
  lipase: { critical: { min: 0, max: 3000 } },
  
  // Other important parameters
  calcium: { critical: { min: 6.0, max: 14.0 } },
  phosphorus: { critical: { min: 1.0, max: 10.0 } }
};

export function getRiskLevel(
  testKey: keyof BiochemistryTestResults, 
  value: number, 
  species: string = "dog"
): RiskLevel {
  // Get normal reference range for the species
  const ranges = referenceRanges[species as keyof typeof referenceRanges] || referenceRanges.dog;
  const normalRange = ranges[testKey as keyof typeof ranges];
  const criticalRange = criticalRanges[testKey as keyof typeof criticalRanges];
  
  if (!normalRange) return "normal";
  
  // Check critical ranges first
  if (criticalRange?.critical) {
    const { min, max } = criticalRange.critical;
    if (value < min || value > max) {
      return "critical";
    }
  }
  
  // Check if outside normal range
  const { min, max } = normalRange;
  if (value < min || value > max) {
    // If significantly outside normal but not critical, it's borderline
    const deviation = Math.max(
      min ? Math.max(0, (min - value) / min) : 0,
      max ? Math.max(0, (value - max) / max) : 0
    );
    
    // If deviation is more than 50% from normal range, consider it more serious
    return deviation > 0.5 ? "borderline" : "borderline";
  }
  
  return "normal";
}

export function getRiskAssessment(level: RiskLevel): RiskAssessment {
  const assessments: Record<RiskLevel, RiskAssessment> = {
    normal: {
      level: "normal",
      message: "Within normal range",
      priority: 1,
      color: "text-green-700 dark:text-green-300",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    borderline: {
      level: "borderline", 
      message: "Requires monitoring",
      priority: 2,
      color: "text-yellow-700 dark:text-yellow-300",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20"
    },
    critical: {
      level: "critical",
      message: "Immediate attention required",
      priority: 3,
      color: "text-red-700 dark:text-red-300", 
      bgColor: "bg-red-50 dark:bg-red-900/20"
    }
  };
  
  return assessments[level];
}

export function getOverallRiskAssessment(testResults: BiochemistryTestResults, species: string = "dog"): {
  overallRisk: RiskLevel;
  criticalCount: number;
  borderlineCount: number;
  normalCount: number;
  recommendations: string[];
} {
  let criticalCount = 0;
  let borderlineCount = 0;
  let normalCount = 0;
  const recommendations: string[] = [];
  
  // Analyze each test result
  Object.entries(testResults).forEach(([key, value]) => {
    if (typeof value === 'number') {
      const risk = getRiskLevel(key as keyof BiochemistryTestResults, value, species);
      
      switch (risk) {
        case "critical":
          criticalCount++;
          recommendations.push(`${key.toUpperCase()}: Critical level detected - immediate veterinary attention required`);
          break;
        case "borderline":
          borderlineCount++;
          recommendations.push(`${key.toUpperCase()}: Outside normal range - monitor closely`);
          break;
        case "normal":
          normalCount++;
          break;
      }
    }
  });
  
  // Determine overall risk
  let overallRisk: RiskLevel = "normal";
  if (criticalCount > 0) {
    overallRisk = "critical";
    recommendations.unshift("URGENT: Multiple critical values detected. Contact veterinarian immediately.");
  } else if (borderlineCount >= 3) {
    overallRisk = "critical";
    recommendations.unshift("Multiple abnormal values detected. Veterinary consultation recommended.");
  } else if (borderlineCount > 0) {
    overallRisk = "borderline";
    recommendations.unshift("Some values outside normal range. Follow-up testing may be needed.");
  }
  
  return {
    overallRisk,
    criticalCount,
    borderlineCount, 
    normalCount,
    recommendations
  };
}