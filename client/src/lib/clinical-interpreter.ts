import { TestResults, Species } from "@shared/schema";
import { referenceRanges, getTestStatus } from "./reference-ranges";

export interface ClinicalInterpretation {
  panel: string;
  findings: string[];
  severity: "normal" | "mild" | "moderate" | "severe";
  recommendations: string[];
}

export function generateClinicalInterpretations(
  testResults: TestResults,
  species: Species
): ClinicalInterpretation[] {
  const interpretations: ClinicalInterpretation[] = [];
  const ranges = referenceRanges[species];

  // Hepatic Function Panel Interpretation
  const hepaticFindings: string[] = [];
  const hepaticRecommendations: string[] = [];
  let hepaticSeverity: "normal" | "mild" | "moderate" | "severe" = "normal";

  if (testResults.alt !== undefined) {
    const altStatus = getTestStatus(testResults.alt, ranges.alt);
    if (altStatus === "high" || altStatus === "critical") {
      hepaticFindings.push(`Elevated ALT (${testResults.alt} U/L) suggests hepatocellular injury`);
      if (altStatus === "critical") hepaticSeverity = "severe";
      else if (hepaticSeverity === "normal") hepaticSeverity = "mild";
    }
  }

  if (testResults.alp !== undefined) {
    const alpStatus = getTestStatus(testResults.alp, ranges.alp);
    if (alpStatus === "high" || alpStatus === "critical") {
      hepaticFindings.push(`Elevated ALP (${testResults.alp} U/L) may indicate cholestatic pattern or bone turnover`);
      if (altStatus === "critical") hepaticSeverity = "severe";
      else if (hepaticSeverity === "normal") hepaticSeverity = "mild";
    }
  }

  if (testResults.ggt !== undefined) {
    const ggtStatus = getTestStatus(testResults.ggt, ranges.ggt);
    if (ggtStatus === "high" || ggtStatus === "critical") {
      hepaticFindings.push(`Elevated GGT (${testResults.ggt} U/L) supports cholestatic liver disease`);
      if (ggtStatus === "critical") hepaticSeverity = "moderate";
    }
  }

  if (testResults.totalBilirubin !== undefined) {
    const bilirubinStatus = getTestStatus(testResults.totalBilirubin, ranges.totalBilirubin);
    if (bilirubinStatus === "high" || bilirubinStatus === "critical") {
      hepaticFindings.push(`Elevated total bilirubin (${testResults.totalBilirubin} mg/dL) indicates impaired bilirubin metabolism`);
      if (bilirubinStatus === "critical") hepaticSeverity = "severe";
      else if (hepaticSeverity === "normal") hepaticSeverity = "moderate";
    }
  }

  // Check for cholestatic pattern
  if (testResults.alp !== undefined && testResults.ggt !== undefined) {
    const alpStatus = getTestStatus(testResults.alp, ranges.alp);
    const ggtStatus = getTestStatus(testResults.ggt, ranges.ggt);
    if ((alpStatus === "high" || alpStatus === "critical") && 
        (ggtStatus === "high" || ggtStatus === "critical")) {
      hepaticFindings.push("Cholestatic pattern (elevated ALP + GGT) suggests bile duct involvement");
      hepaticRecommendations.push("Consider imaging studies (ultrasound) to evaluate bile duct patency");
    }
  }

  if (hepaticFindings.length > 0) {
    hepaticRecommendations.push("Monitor liver enzymes with follow-up testing in 1-2 weeks");
    hepaticRecommendations.push("Consider hepatic function tests and coagulation profile");
  }

  interpretations.push({
    panel: "Hepatic Function",
    findings: hepaticFindings.length > 0 ? hepaticFindings : ["All hepatic parameters within normal limits"],
    severity: hepaticSeverity,
    recommendations: hepaticRecommendations
  });

  // Renal Function Panel Interpretation
  const renalFindings: string[] = [];
  const renalRecommendations: string[] = [];
  let renalSeverity: "normal" | "mild" | "moderate" | "severe" = "normal";

  if (testResults.bun !== undefined && testResults.creatinine !== undefined) {
    const bunStatus = getTestStatus(testResults.bun, ranges.bun);
    const creatinineStatus = getTestStatus(testResults.creatinine, ranges.creatinine);
    
    if ((bunStatus === "high" || bunStatus === "critical") && 
        (creatinineStatus === "high" || creatinineStatus === "critical")) {
      const bunCreatRatio = testResults.bun / testResults.creatinine;
      renalFindings.push(`Elevated BUN (${testResults.bun} mg/dL) and creatinine (${testResults.creatinine} mg/dL) suggest renal dysfunction`);
      renalFindings.push(`BUN:Creatinine ratio = ${bunCreatRatio.toFixed(1)}`);
      
      if (bunCreatRatio > 20) {
        renalFindings.push("Ratio suggests possible pre-renal azotemia or dehydration");
      } else if (bunCreatRatio < 15) {
        renalFindings.push("Ratio suggests possible primary renal disease");
      }

      if (bunStatus === "critical" || creatinineStatus === "critical") {
        renalSeverity = "severe";
      } else {
        renalSeverity = "moderate";
      }

      renalRecommendations.push("Recommend urinalysis with microscopic examination");
      renalRecommendations.push("Consider urine protein:creatinine ratio");
      renalRecommendations.push("Evaluate hydration status and blood pressure");
      renalRecommendations.push("Recheck renal parameters in 2-3 weeks");
    } else if (bunStatus === "high" || creatinineStatus === "high") {
      renalFindings.push("Mild elevation in renal parameters - monitor closely");
      renalSeverity = "mild";
      renalRecommendations.push("Recheck in 1-2 weeks");
    }
  }

  interpretations.push({
    panel: "Renal Function",
    findings: renalFindings.length > 0 ? renalFindings : ["Renal parameters within normal limits"],
    severity: renalSeverity,
    recommendations: renalRecommendations
  });

  // Electrolyte Panel Interpretation
  const electrolyteFindings: string[] = [];
  const electrolyteRecommendations: string[] = [];
  let electrolyteSeverity: "normal" | "mild" | "moderate" | "severe" = "normal";

  if (testResults.potassium !== undefined) {
    const potassiumStatus = getTestStatus(testResults.potassium, ranges.potassium);
    if (potassiumStatus === "low" || potassiumStatus === "critical") {
      electrolyteFindings.push(`Hypokalemia (${testResults.potassium} mEq/L) detected`);
      electrolyteRecommendations.push("Consider potassium supplementation");
      electrolyteRecommendations.push("Monitor for cardiac arrhythmias");
      if (potassiumStatus === "critical") electrolyteSeverity = "severe";
      else electrolyteSeverity = "moderate";
    } else if (potassiumStatus === "high") {
      electrolyteFindings.push(`Hyperkalemia (${testResults.potassium} mEq/L) detected`);
      electrolyteRecommendations.push("Evaluate for hemolysis or tissue breakdown");
      if (potassiumStatus === "critical") electrolyteSeverity = "severe";
      else electrolyteSeverity = "moderate";
    }
  }

  if (testResults.sodium !== undefined) {
    const sodiumStatus = getTestStatus(testResults.sodium, ranges.sodium);
    if (sodiumStatus === "low") {
      electrolyteFindings.push(`Hyponatremia (${testResults.sodium} mEq/L) present`);
      electrolyteRecommendations.push("Evaluate hydration status and fluid balance");
      if (electrolyteSeverity === "normal") electrolyteSeverity = "mild";
    } else if (sodiumStatus === "high") {
      electrolyteFindings.push(`Hypernatremia (${testResults.sodium} mEq/L) present`);
      electrolyteRecommendations.push("Assess water intake and losses");
      if (electrolyteSeverity === "normal") electrolyteSeverity = "mild";
    }
  }

  interpretations.push({
    panel: "Electrolytes",
    findings: electrolyteFindings.length > 0 ? electrolyteFindings : ["Electrolyte balance within normal limits"],
    severity: electrolyteSeverity,
    recommendations: electrolyteRecommendations
  });

  return interpretations;
}

export function generateOverallAssessment(interpretations: ClinicalInterpretation[]): string {
  const abnormalPanels = interpretations.filter(i => i.severity !== "normal");
  
  if (abnormalPanels.length === 0) {
    return "All biochemical parameters are within normal limits for this species.";
  }

  const severePanels = abnormalPanels.filter(i => i.severity === "severe");
  const moderatePanels = abnormalPanels.filter(i => i.severity === "moderate");
  
  if (severePanels.length > 0) {
    return `Critical abnormalities detected in ${severePanels.map(p => p.panel).join(", ")}. Immediate veterinary attention recommended.`;
  } else if (moderatePanels.length > 0) {
    return `Moderate abnormalities noted in ${moderatePanels.map(p => p.panel).join(", ")}. Close monitoring and follow-up testing recommended.`;
  } else {
    return `Mild abnormalities detected in ${abnormalPanels.map(p => p.panel).join(", ")}. Monitor and recheck as recommended.`;
  }
}
