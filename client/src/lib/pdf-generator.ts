import jsPDF from "jspdf";
import headerImagePath from "@assets/The MAin Header_1754116167505.png";
import { VetReport, TestResults, Species } from "@shared/schema";
import { referenceRanges, getTestStatus, getStatusLabel, SpeciesReferenceRanges } from "./reference-ranges";
import { generateClinicalInterpretations, generateOverallAssessment } from "./clinical-interpreter";
import { PDFErrorHandler } from "./pdf-error-handler";

export interface PDFGenerationOptions {
  includelogo?: boolean;
  includeSignature?: boolean;
  customHeader?: string;
}

export function generateVetReportPDF(
  report: VetReport,
  options: PDFGenerationOptions = {}
): jsPDF {
  // Create a safe report with error handling
  const safeReport = PDFErrorHandler.safeReportValidation(report);
  
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
    if (currentY + requiredSpace > pageHeight - 50) {
      pdf.addPage();
      currentY = 30; // More space from top on new pages
    }
  };

  // Header - ThePetNest professional header with Extended Professional specifications
  try {
    // Extended Professional Header: 2480x500 pixels (14% of A4 height, 210mm x 42mm)
    const headerHeight = Math.round(pageHeight * 0.14); // 14% of page height (~42mm)
    const marginTop = Math.round(pageHeight * 0.01); // 1% margin (~3mm)
    
    pdf.addImage(headerImagePath, 'PNG', 0, marginTop, pageWidth, headerHeight);
    currentY = headerHeight + marginTop + 10;
  } catch (error) {
    console.warn("Could not load header image, using fallback:", error);
    // Fallback header with Extended Professional proportions
    const headerHeight = Math.round(pageHeight * 0.14);
    const marginTop = Math.round(pageHeight * 0.01);
    
    pdf.setFillColor(52, 73, 151);
    pdf.rect(0, marginTop, pageWidth, headerHeight, "F");
    pdf.setFillColor(255, 140, 0);
    pdf.rect(pageWidth - 40, marginTop, 40, headerHeight, "F");
    pdf.setTextColor(255, 255, 255);
    addText("ThePetNest", 20, marginTop + 25, { fontSize: 24, fontStyle: "bold" });
    addText("PET STORE | LAB | SPA | CLINIC", 20, marginTop + 38, { fontSize: 11 });
    addText("8848216190 | 8590433937", pageWidth - 50, marginTop + 25, { fontSize: 12, fontStyle: "bold" });
    addText("3358/2, Thiruvonam, Chanthavila, Trivandrum, 695584", 20, marginTop + 48, { fontSize: 9 });
    addText("support.trivandrum@thepetnest.com", 20, marginTop + 58, { fontSize: 9 });
    pdf.setTextColor(0, 0, 0);
    currentY = headerHeight + marginTop + 10;
  }
  
  // Report title
  addText("BIOCHEMISTRY ANALYSIS REPORT", pageWidth / 2, currentY, { fontSize: 16, fontStyle: "bold", align: "center" });
  currentY += 10;
  
  addText(`Report ID: TPN-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, pageWidth - 20, currentY, { align: "right", fontSize: 10 });
  addText(`Generated: ${new Date().toLocaleDateString()}`, 20, currentY, { fontSize: 10 });
  currentY += 15;

  // Patient Information Table
  addText("PATIENT INFORMATION", 20, currentY, { fontSize: 12, fontStyle: "bold" });
  currentY += 8;

  // Patient Information Table with better alignment
  const tableData = [
    ["Patient Name:", report.patientName, "Species/Breed:", `${report.species && report.species.length > 0 ? report.species.charAt(0).toUpperCase() + report.species.slice(1).toLowerCase() : 'N/A'}${report.breed ? ` / ${report.breed}` : ""}`],
    ["Parents Name:", report.parentsName || "N/A", "Medical Record:", report.medicalRecordNumber || "N/A"],
    ["Age/Weight:", `${report.age} ${report.ageUnit} / ${report.weight} ${report.weightUnit}`, "Collection Date:", report.collectionDate],
    ["Attending Veterinarian:", report.attendingVeterinarian || 'N/A', "Report Date:", report.reportDate],
    ["Notes:", (report as any).dogNotes || 'N/A', "", ""]
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
    
    currentY += 10;
  });

  currentY += 8;

  // Test Results Table
  checkPageBreak(40);
  addText("LABORATORY RESULTS", 20, currentY, { fontSize: 12, fontStyle: "bold" });
  currentY += 8;

  // Simple clean table headers
  pdf.setDrawColor(100, 100, 100);
  pdf.setLineWidth(0.5);
  
  // Table header border
  addLine(20, currentY - 5, pageWidth - 20, currentY - 5);
  
  // Header text aligned with data columns - better spacing
  addText("Test Parameter", 25, currentY, { fontSize: 11, fontStyle: "bold" });
  addText("Result", 90, currentY, { fontSize: 11, fontStyle: "bold" });
  addText("Units", 120, currentY, { fontSize: 11, fontStyle: "bold" });
  addText("Reference Range", 145, currentY, { fontSize: 11, fontStyle: "bold" });
  addText("Status", 180, currentY, { fontSize: 11, fontStyle: "bold" });
  
  // Header bottom border
  addLine(20, currentY + 5, pageWidth - 20, currentY + 5);
  currentY += 15;

  const ranges = referenceRanges[report.species as Species];
  const testResults = report.testResults as TestResults;

  // Test panels
  const testPanels = [
    {
      name: "LIVER FUNCTION TESTS",
      tests: [
        { key: "alt", name: "Alanine Aminotransferase (ALT)", range: ranges.alt },
        { key: "alp", name: "Alkaline Phosphatase (ALP)", range: ranges.alp },
        { key: "ggt", name: "Gamma Glutamyl Transferase (GGT)", range: ranges.ggt },
        { key: "sgot", name: "Serum Glutamic Oxaloacetic Transaminase (SGOT)", range: ranges.sgot },
        { key: "sgpt", name: "Serum Glutamic Pyruvic Transaminase (SGPT)", range: ranges.sgpt },
        { key: "totalBilirubin", name: "Total Bilirubin", range: ranges.totalBilirubin }
      ]
    },
    {
      name: "KIDNEY FUNCTION TESTS",
      tests: [
        { key: "bun", name: "Blood Urea Nitrogen (BUN)", range: ranges.bun },
        { key: "creatinine", name: "Creatinine", range: ranges.creatinine },
        { key: "phosphorus", name: "Phosphorus", range: ranges.phosphorus }
      ]
    },
    {
      name: "ELECTROLYTES & MINERALS",
      tests: [
        { key: "sodium", name: "Sodium (Na+)", range: ranges.sodium },
        { key: "potassium", name: "Potassium (K+)", range: ranges.potassium },
        { key: "chloride", name: "Chloride (Cl-)", range: ranges.chloride },
        { key: "calcium", name: "Calcium (Total)", range: ranges.calcium }
      ]
    },
    {
      name: "PROTEIN STUDIES",
      tests: [
        { key: "totalProtein", name: "Total Protein", range: ranges.totalProtein },
        { key: "albumin", name: "Albumin", range: ranges.albumin },
        { key: "globulin", name: "Globulin", range: ranges.globulin }
      ]
    },
    {
      name: "METABOLISM & ENZYMES",
      tests: [
        { key: "glucose", name: "Glucose", range: ranges.glucose },
        { key: "cholesterol", name: "Cholesterol", range: ranges.cholesterol },
        { key: "amylase", name: "Amylase", range: ranges.amylase },
        { key: "lipase", name: "Lipase", range: ranges.lipase }
      ]
    },
    {
      name: "THYROID FUNCTION",
      tests: [
        { key: "t3", name: "T3 (Triiodothyronine)", range: ranges.t3 },
        { key: "t4", name: "T4 (Thyroxine)", range: ranges.t4 },
        { key: "tsh", name: "TSH", range: ranges.tsh }
      ]
    }
  ];

  // Filter panels to only include those with values
  const panelsWithValues = testPanels.filter(panel => {
    return panel.tests.some(test => {
      const value = testResults[test.key as keyof TestResults];
      return value !== undefined && value !== null && String(value).trim() !== "";
    });
  });

  // Only generate tables for panels that have values
  panelsWithValues.forEach(panel => {
    // Filter tests within the panel to only include those with values
    const testsWithValues = panel.tests.filter(test => {
      const value = testResults[test.key as keyof TestResults];
      return value !== undefined && value !== null && String(value).trim() !== "";
    });

    if (testsWithValues.length > 0) {
      checkPageBreak(25 + testsWithValues.length * 8);
      
      // Panel header (clean, no background)
      addText(panel.name, 25, currentY, { fontSize: 12, fontStyle: "bold" });
      addLine(20, currentY + 3, pageWidth - 20, currentY + 3);
      currentY += 15;

      testsWithValues.forEach(test => {
        const value = testResults[test.key as keyof TestResults];
        const numericValue = typeof value === 'number' ? value : Number(value);
        const status = getTestStatus(test.key as keyof SpeciesReferenceRanges, numericValue, safeReport.species as Species);
        const statusLabel = getStatusLabel(status);
        
        // Draw row borders for better table structure (removed background colors)
        pdf.setDrawColor(200, 200, 200);
        addLine(20, currentY + 2, pageWidth - 20, currentY + 2);
        
        // Better text placement with proper column alignment and color coding for critical values
        addText(test.name, 25, currentY, { fontSize: 9 });
        
        // Set color for value text based on status - RED for critical/high values
        const isHighOrCritical = status === "high" || status === "critical";
        if (isHighOrCritical) {
          pdf.setTextColor(220, 20, 20); // Red color for high/critical values
        } else {
          pdf.setTextColor(0, 0, 0); // Black color for normal/low values
        }
        
        addText(numericValue.toString(), 90, currentY, { fontSize: 9 });
        
        // Reset to black for other columns
        pdf.setTextColor(0, 0, 0);
        addText(test.range.unit, 120, currentY, { fontSize: 9 });
        addText(`${test.range.min}-${test.range.max}`, 145, currentY, { fontSize: 9 });
        
        // Status label with red color for critical values
        if (isHighOrCritical) {
          pdf.setTextColor(220, 20, 20); // Red color for high/critical status
        }
        addText(statusLabel, 180, currentY, { 
          fontSize: 9,
          fontStyle: status !== "normal" ? "bold" : "normal"
        });
        
        // Reset color for next iteration
        pdf.setTextColor(0, 0, 0);
        
        currentY += 6;
      });
      
      currentY += 3;
    }
  });

  // Skip clinical interpretations to keep report concise

  // Clinical Notes - only include if enabled and has meaningful content
  if (safeReport.clinicalNotesEnabled && safeReport.clinicalNotes && typeof safeReport.clinicalNotes === 'string' && safeReport.clinicalNotes.trim() !== "") {
    checkPageBreak(30);
    addText("CLINICAL NOTES", 20, currentY, { fontSize: 11, fontStyle: "bold" });
    currentY += 8;
    
    const notesLines = PDFErrorHandler.safeSplitTextToSize(pdf, safeReport.clinicalNotes, pageWidth - 50);
    notesLines.forEach((line: string) => {
      checkPageBreak(6);
      addText(line, 25, currentY, { fontSize: 9 });
      currentY += 4;
    });
    
    currentY += 6;
  }

  // No footer - removed as requested

  return pdf;
}
