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

  // Header - ThePetNest Clinic Header
  // Dark blue background bar
  pdf.setFillColor(52, 73, 151); // Dark blue color matching the header
  pdf.rect(0, 0, pageWidth, 50, "F");
  
  // Orange accent (simplified as rectangle for PDF compatibility)
  pdf.setFillColor(255, 140, 0); // Orange color
  pdf.rect(pageWidth - 40, 0, 40, 50, "F"); // Simple rectangle instead of triangle
  
  // White text on dark background
  pdf.setTextColor(255, 255, 255);
  addText("ThePetNest", 20, 18, { fontSize: 24, fontStyle: "bold" });
  addText("PET STORE | LAB | SPA | CLINIC", 20, 28, { fontSize: 11 });
  
  // Contact information aligned to right
  addText("8848216190 | 8590433937", pageWidth - 20, 18, { align: "right", fontSize: 12, fontStyle: "bold" });
  
  // Address information
  addText("3358/2, Thiruvonam, Chanthavila, Trivandrum, 695584", 20, 38, { fontSize: 9 });
  addText("support.trivandrum@thepetnest.com", 20, 46, { fontSize: 9 });
  
  // Reset text color and set current position
  pdf.setTextColor(0, 0, 0);
  currentY = 70;
  
  // Report title
  addText("VETERINARY BIOCHEMISTRY ANALYSIS REPORT", pageWidth / 2, currentY, { fontSize: 16, fontStyle: "bold", align: "center" });
  currentY += 10;
  
  addText(`Report ID: TPN-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, pageWidth - 20, currentY, { align: "right", fontSize: 10 });
  addText(`Generated: ${new Date().toLocaleDateString()}`, 20, currentY, { fontSize: 10 });
  currentY += 15;

  // Patient Information Table
  addText("PATIENT INFORMATION", 20, currentY, { fontSize: 14, fontStyle: "bold" });
  currentY += 10;

  // Patient Information Table with better alignment
  const tableData = [
    ["Patient Name:", report.patientName, "Species/Breed:", `${report.species.charAt(0).toUpperCase() + report.species.slice(1)}${report.breed ? ` / ${report.breed}` : ""}`],
    ["Parents Name:", report.parentsName || "N/A", "Medical Record:", report.medicalRecordNumber || "N/A"],
    ["Age/Weight:", `${report.age} ${report.ageUnit} / ${report.weight} ${report.weightUnit}`, "Collection Date:", report.collectionDate],
    ["Veterinarian:", report.attendingVeterinarian, "Report Date:", report.reportDate]
  ];

  // Draw table with better alignment (simple clean table)
  pdf.setDrawColor(100, 100, 100);
  pdf.setLineWidth(0.5);
  
  // Table top border
  addLine(20, currentY - 5, pageWidth - 20, currentY - 5);
  
  tableData.forEach((row, index) => {
    checkPageBreak(15);
    
    // Clean table rows without background colors
    addText(row[0], 25, currentY, { fontStyle: "bold", fontSize: 10 });
    addText(row[1], 90, currentY, { fontSize: 10 });
    addText(row[2], 120, currentY, { fontStyle: "bold", fontSize: 10 });
    addText(row[3], 160, currentY, { fontSize: 10 });
    
    // Horizontal line after each row
    addLine(20, currentY + 5, pageWidth - 20, currentY + 5);
    
    currentY += 12;
  });

  currentY += 10;

  // Test Results Table
  checkPageBreak(40);
  addText("LABORATORY RESULTS", 20, currentY, { fontSize: 14, fontStyle: "bold" });
  currentY += 10;

  // Simple clean table headers
  pdf.setDrawColor(100, 100, 100);
  pdf.setLineWidth(0.5);
  
  // Table header border
  addLine(20, currentY - 5, pageWidth - 20, currentY - 5);
  
  // Header text (black text, no background)
  addText("Test Parameter", 25, currentY, { fontSize: 11, fontStyle: "bold" });
  addText("Result", 90, currentY, { fontSize: 11, fontStyle: "bold" });
  addText("Units", 120, currentY, { fontSize: 11, fontStyle: "bold" });
  addText("Reference Range", 140, currentY, { fontSize: 11, fontStyle: "bold" });
  addText("Status", 170, currentY, { fontSize: 11, fontStyle: "bold" });
  
  // Header bottom border
  addLine(20, currentY + 5, pageWidth - 20, currentY + 5);
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
    
    // Panel header (clean, no background)
    addText(panel.name, 25, currentY, { fontSize: 12, fontStyle: "bold" });
    addLine(20, currentY + 3, pageWidth - 20, currentY + 3);
    currentY += 15;

    panel.tests.forEach(test => {
      const value = testResults[test.key as keyof TestResults];
      
      if (value !== undefined && value !== null) {
        const numericValue = typeof value === 'number' ? value : Number(value);
        const status = getTestStatus(numericValue, test.range);
        const statusLabel = getStatusLabel(status);
        
        // Draw row borders for better table structure (removed background colors)
        pdf.setDrawColor(200, 200, 200);
        addLine(20, currentY + 2, pageWidth - 20, currentY + 2);
        
        addText(test.name, 25, currentY, { fontSize: 9 });
        addText(numericValue.toString(), 95, currentY, { fontSize: 9, align: "center" });
        addText(test.range.unit, 120, currentY, { fontSize: 9, align: "center" });
        addText(`${test.range.min}-${test.range.max}`, 145, currentY, { fontSize: 9, align: "center" });
        addText(statusLabel, 170, currentY, { 
          fontSize: 9, 
          align: "center",
          fontStyle: status !== "normal" ? "bold" : "normal"
        });
        
        // Draw vertical separators
        addLine(80, currentY - 4, 80, currentY + 2);
        addLine(110, currentY - 4, 110, currentY + 2);
        addLine(130, currentY - 4, 130, currentY + 2);
        addLine(160, currentY - 4, 160, currentY + 2);
      } else {
        // Draw row borders for better table structure
        pdf.setDrawColor(200, 200, 200);
        addLine(20, currentY + 2, pageWidth - 20, currentY + 2);
        
        addText(test.name, 25, currentY, { fontSize: 9 });
        addText("Not Tested", 95, currentY, { fontSize: 9, align: "center" });
        addText(test.range.unit, 120, currentY, { fontSize: 9, align: "center" });
        addText(`${test.range.min}-${test.range.max}`, 145, currentY, { fontSize: 9, align: "center" });
        addText("-", 170, currentY, { fontSize: 9, align: "center" });
        
        // Draw vertical separators
        addLine(80, currentY - 4, 80, currentY + 2);
        addLine(110, currentY - 4, 110, currentY + 2);
        addLine(130, currentY - 4, 130, currentY + 2);
        addLine(160, currentY - 4, 160, currentY + 2);
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

  // Overall Assessment (clean, no background)
  addText("OVERALL ASSESSMENT:", 20, currentY, { fontSize: 12, fontStyle: "bold" });
  addLine(20, currentY + 3, pageWidth - 20, currentY + 3);
  currentY += 10;
  
  const assessmentLines = pdf.splitTextToSize(overallAssessment || "", pageWidth - 50);
  if (assessmentLines && assessmentLines.length > 0) {
    assessmentLines.forEach((line: string) => {
      addText(line, 25, currentY, { fontSize: 10 });
      currentY += 6;
    });
  }
  
  currentY += 10;

  // Panel Interpretations
  interpretations.forEach(interpretation => {
    checkPageBreak(30);
    
    // Panel interpretation header (clean, no background)
    addText(`${interpretation.panel}:`, 25, currentY, { fontSize: 11, fontStyle: "bold" });
    currentY += 8;

    if (interpretation.findings && interpretation.findings.length > 0) {
      interpretation.findings.forEach(finding => {
        const findingLines = pdf.splitTextToSize(`• ${finding}`, pageWidth - 50);
        if (findingLines && findingLines.length > 0) {
          findingLines.forEach((line: string) => {
            checkPageBreak(8);
            addText(line, 30, currentY, { fontSize: 9 });
            currentY += 6;
          });
        }
      });
    }

    if (interpretation.recommendations && interpretation.recommendations.length > 0) {
      currentY += 3;
      addText("Recommendations:", 30, currentY, { fontSize: 10, fontStyle: "bold" });
      currentY += 7;
      
      interpretation.recommendations.forEach(rec => {
        const recLines = pdf.splitTextToSize(`• ${rec}`, pageWidth - 55);
        if (recLines && recLines.length > 0) {
          recLines.forEach((line: string) => {
            checkPageBreak(8);
            addText(line, 35, currentY, { fontSize: 9 });
            currentY += 6;
          });
        }
      });
    }
    
    currentY += 8;
  });

  // Clinical Notes - only include if enabled and has content
  if (report.clinicalNotesEnabled && report.clinicalNotes) {
    checkPageBreak(30);
    addText("CLINICAL NOTES", 20, currentY, { fontSize: 12, fontStyle: "bold" });
    currentY += 10;
    
    const notesLines = pdf.splitTextToSize(report.clinicalNotes || "", pageWidth - 50);
    if (notesLines && notesLines.length > 0) {
      notesLines.forEach((line: string) => {
        checkPageBreak(8);
        addText(line, 25, currentY, { fontSize: 10 });
        currentY += 6;
      });
    }
    
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
