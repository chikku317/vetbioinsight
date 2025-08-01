import jsPDF from "jspdf";
import { VetReport, TestResults, Species } from "@shared/schema";
import { referenceRanges, getTestStatus, getStatusLabel } from "./reference-ranges";
import { generateClinicalInterpretations, generateOverallAssessment } from "./clinical-interpreter";

export interface PDFGenerationOptions {
  includelogo?: boolean;
  includeSignature?: boolean;
  customHeader?: string;
}

export function generateVetReportPDF(
  report: VetReport,
  options: PDFGenerationOptions = {}
): jsPDF {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let currentY = 20;

  // Helper functions
  const addText = (text: string, x: number, y: number, options?: { fontSize?: number; fontStyle?: string; align?: string }) => {
    if (options?.fontSize) pdf.setFontSize(options.fontSize);
    if (options?.fontStyle) pdf.setFont("helvetica", options.fontStyle);
    
    if (options?.align === "center") {
      pdf.text(text, pageWidth / 2, y, { align: "center" });
    } else if (options?.align === "right") {
      pdf.text(text, x, y, { align: "right" });
    } else {
      pdf.text(text, x, y);
    }
    
    // Reset to normal
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
  };

  const addLine = (x1: number, y1: number, x2: number, y2: number) => {
    pdf.line(x1, y1, x2, y2);
  };

  const checkPageBreak = (requiredSpace: number) => {
    if (currentY + requiredSpace > pageHeight - 20) {
      pdf.addPage();
      currentY = 20;
    }
  };

  // Header
  pdf.setDrawColor(41, 99, 235); // medical-blue
  addLine(20, currentY, pageWidth - 20, currentY);
  currentY += 5;

  addText("VetLab Diagnostics", 20, currentY, { fontSize: 20, fontStyle: "bold" });
  addText(`Report ID: VLB-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, pageWidth - 20, currentY, { align: "right", fontSize: 10 });
  currentY += 8;

  addText("Veterinary Biochemistry Analysis Report", 20, currentY, { fontSize: 12, fontStyle: "italic" });
  addText(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 20, currentY, { align: "right", fontSize: 10 });
  currentY += 10;

  addLine(20, currentY, pageWidth - 20, currentY);
  currentY += 15;

  // Patient Information Table
  addText("PATIENT INFORMATION", 20, currentY, { fontSize: 14, fontStyle: "bold" });
  currentY += 10;

  // Table headers and data
  const tableData = [
    ["Patient Name:", report.patientName, "Species/Breed:", `${report.species.charAt(0).toUpperCase() + report.species.slice(1)}${report.breed ? ` / ${report.breed}` : ""}`],
    ["Age/Weight:", `${report.age} ${report.ageUnit} / ${report.weight} ${report.weightUnit}`, "Medical Record:", report.medicalRecordNumber || "N/A"],
    ["Collection Date:", report.collectionDate, "Report Date:", report.reportDate],
    ["Veterinarian:", report.attendingVeterinarian, "Laboratory:", report.laboratoryName || "VetLab Diagnostics"]
  ];

  tableData.forEach(row => {
    checkPageBreak(15);
    
    // Draw table borders
    pdf.setDrawColor(200, 200, 200);
    addLine(20, currentY - 5, pageWidth - 20, currentY - 5);
    
    addText(row[0], 25, currentY, { fontStyle: "bold", fontSize: 10 });
    addText(row[1], 80, currentY, { fontSize: 10 });
    addText(row[2], 120, currentY, { fontStyle: "bold", fontSize: 10 });
    addText(row[3], 170, currentY, { fontSize: 10 });
    
    currentY += 10;
  });

  addLine(20, currentY - 5, pageWidth - 20, currentY - 5);
  currentY += 15;

  // Test Results Table
  checkPageBreak(40);
  addText("LABORATORY RESULTS", 20, currentY, { fontSize: 14, fontStyle: "bold" });
  currentY += 10;

  // Table headers
  pdf.setFillColor(41, 99, 235); // medical-blue
  pdf.rect(20, currentY - 8, pageWidth - 40, 12, "F");
  
  pdf.setTextColor(255, 255, 255); // white text
  addText("Test Parameter", 25, currentY, { fontSize: 10, fontStyle: "bold" });
  addText("Result", 90, currentY, { fontSize: 10, fontStyle: "bold", align: "center" });
  addText("Units", 120, currentY, { fontSize: 10, fontStyle: "bold", align: "center" });
  addText("Reference Range", 145, currentY, { fontSize: 10, fontStyle: "bold", align: "center" });
  addText("Status", 180, currentY, { fontSize: 10, fontStyle: "bold", align: "center" });
  
  pdf.setTextColor(0, 0, 0); // reset to black
  currentY += 15;

  const ranges = referenceRanges[report.species as Species];
  const testResults = report.testResults as TestResults;

  // Test panels
  const testPanels = [
    {
      name: "HEPATIC FUNCTION PANEL",
      tests: [
        { key: "alt", name: "Alanine Aminotransferase (ALT)", range: ranges.alt },
        { key: "alp", name: "Alkaline Phosphatase (ALP)", range: ranges.alp },
        { key: "ggt", name: "Gamma-Glutamyl Transferase (GGT)", range: ranges.ggt },
        { key: "totalBilirubin", name: "Total Bilirubin", range: ranges.totalBilirubin }
      ]
    },
    {
      name: "RENAL FUNCTION PANEL",
      tests: [
        { key: "bun", name: "Blood Urea Nitrogen (BUN)", range: ranges.bun },
        { key: "creatinine", name: "Creatinine", range: ranges.creatinine }
      ]
    },
    {
      name: "PANCREATIC FUNCTION PANEL",
      tests: [
        { key: "amylase", name: "Amylase", range: ranges.amylase },
        { key: "lipase", name: "Lipase", range: ranges.lipase }
      ]
    },
    {
      name: "GLUCOSE & ELECTROLYTES",
      tests: [
        { key: "glucose", name: "Glucose", range: ranges.glucose },
        { key: "sodium", name: "Sodium (Na+)", range: ranges.sodium },
        { key: "potassium", name: "Potassium (K+)", range: ranges.potassium },
        { key: "chloride", name: "Chloride (Cl-)", range: ranges.chloride }
      ]
    },
    {
      name: "PROTEINS & OTHER",
      tests: [
        { key: "totalProtein", name: "Total Protein", range: ranges.totalProtein },
        { key: "albumin", name: "Albumin", range: ranges.albumin },
        { key: "globulin", name: "Globulin", range: ranges.globulin },
        { key: "cholesterol", name: "Cholesterol", range: ranges.cholesterol },
        { key: "phosphorus", name: "Phosphorus", range: ranges.phosphorus },
        { key: "calcium", name: "Calcium (Ca++)", range: ranges.calcium }
      ]
    }
  ];

  testPanels.forEach(panel => {
    checkPageBreak(25 + panel.tests.length * 8);
    
    // Panel header
    pdf.setFillColor(59, 130, 246, 0.1); // light blue
    pdf.rect(20, currentY - 5, pageWidth - 40, 10, "F");
    addText(panel.name, 25, currentY, { fontSize: 10, fontStyle: "bold" });
    currentY += 12;

    panel.tests.forEach(test => {
      const value = testResults[test.key as keyof TestResults];
      
      if (value !== undefined && value !== null) {
        const status = getTestStatus(value, test.range);
        const statusLabel = getStatusLabel(status);
        
        // Highlight abnormal values
        if (status !== "normal") {
          const color = status === "critical" ? [220, 38, 38, 0.1] : [245, 158, 11, 0.1]; // red or yellow
          pdf.setFillColor(...color);
          pdf.rect(20, currentY - 6, pageWidth - 40, 8, "F");
        }

        addText(test.name, 25, currentY, { fontSize: 9 });
        addText(value.toString(), 90, currentY, { fontSize: 9, align: "center" });
        addText(test.range.unit, 120, currentY, { fontSize: 9, align: "center" });
        addText(`${test.range.min}-${test.range.max}`, 145, currentY, { fontSize: 9, align: "center" });
        addText(statusLabel, 180, currentY, { 
          fontSize: 9, 
          align: "center",
          fontStyle: status !== "normal" ? "bold" : "normal"
        });
      } else {
        addText(test.name, 25, currentY, { fontSize: 9 });
        addText("Not Tested", 90, currentY, { fontSize: 9, align: "center" });
        addText(test.range.unit, 120, currentY, { fontSize: 9, align: "center" });
        addText(`${test.range.min}-${test.range.max}`, 145, currentY, { fontSize: 9, align: "center" });
        addText("-", 180, currentY, { fontSize: 9, align: "center" });
      }
      
      currentY += 8;
    });
    
    currentY += 5;
  });

  // Clinical Interpretation
  checkPageBreak(50);
  currentY += 10;
  addText("CLINICAL INTERPRETATION", 20, currentY, { fontSize: 14, fontStyle: "bold" });
  currentY += 10;

  const interpretations = generateClinicalInterpretations(testResults, report.species as Species);
  const overallAssessment = generateOverallAssessment(interpretations);

  // Overall Assessment
  pdf.setFillColor(59, 130, 246, 0.1);
  pdf.rect(20, currentY - 5, pageWidth - 40, 20, "F");
  addText("Overall Assessment:", 25, currentY, { fontSize: 11, fontStyle: "bold" });
  currentY += 8;
  
  const assessmentLines = pdf.splitTextToSize(overallAssessment, pageWidth - 50);
  assessmentLines.forEach((line: string) => {
    addText(line, 25, currentY, { fontSize: 10 });
    currentY += 6;
  });
  
  currentY += 10;

  // Panel Interpretations
  interpretations.forEach(interpretation => {
    checkPageBreak(30);
    
    const severityColor = interpretation.severity === "severe" ? [220, 38, 38, 0.1] :
                         interpretation.severity === "moderate" ? [245, 158, 11, 0.1] :
                         interpretation.severity === "mild" ? [253, 224, 71, 0.1] :
                         [34, 197, 94, 0.1];
    
    pdf.setFillColor(...severityColor);
    pdf.rect(20, currentY - 5, pageWidth - 40, 8, "F");
    addText(`${interpretation.panel}:`, 25, currentY, { fontSize: 11, fontStyle: "bold" });
    currentY += 10;

    interpretation.findings.forEach(finding => {
      const findingLines = pdf.splitTextToSize(`• ${finding}`, pageWidth - 50);
      findingLines.forEach((line: string) => {
        checkPageBreak(8);
        addText(line, 30, currentY, { fontSize: 9 });
        currentY += 6;
      });
    });

    if (interpretation.recommendations.length > 0) {
      currentY += 3;
      addText("Recommendations:", 30, currentY, { fontSize: 10, fontStyle: "bold" });
      currentY += 7;
      
      interpretation.recommendations.forEach(rec => {
        const recLines = pdf.splitTextToSize(`• ${rec}`, pageWidth - 55);
        recLines.forEach((line: string) => {
          checkPageBreak(8);
          addText(line, 35, currentY, { fontSize: 9 });
          currentY += 6;
        });
      });
    }
    
    currentY += 8;
  });

  // Clinical Notes
  if (report.clinicalNotes) {
    checkPageBreak(30);
    addText("CLINICAL NOTES", 20, currentY, { fontSize: 12, fontStyle: "bold" });
    currentY += 10;
    
    const notesLines = pdf.splitTextToSize(report.clinicalNotes, pageWidth - 50);
    notesLines.forEach((line: string) => {
      checkPageBreak(8);
      addText(line, 25, currentY, { fontSize: 10 });
      currentY += 6;
    });
    
    currentY += 15;
  }

  // Footer
  checkPageBreak(40);
  currentY = Math.max(currentY, pageHeight - 60);
  
  addLine(20, currentY, pageWidth - 20, currentY);
  currentY += 10;

  addText("VetLab Diagnostics", 20, currentY, { fontSize: 10, fontStyle: "bold" });
  addText("Reviewed and Approved by:", pageWidth - 20, currentY, { align: "right", fontSize: 10 });
  currentY += 8;

  addText("123 Medical Center Drive, Veterinary Plaza", 20, currentY, { fontSize: 9 });
  currentY += 6;
  addText("Phone: (555) 123-4567 | Email: results@vetlab.com", 20, currentY, { fontSize: 9 });

  // Signature line
  addLine(pageWidth - 100, currentY + 10, pageWidth - 20, currentY + 10);
  addText(report.attendingVeterinarian + ", DVM", pageWidth - 20, currentY + 20, { align: "right", fontSize: 9 });

  return pdf;
}
