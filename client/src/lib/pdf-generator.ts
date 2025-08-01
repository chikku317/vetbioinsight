import jsPDF from "jspdf";
import { VetReport, TestResults, Species } from "@shared/schema";
import { referenceRanges, getTestStatus, getStatusLabel } from "./reference-ranges";
import { generateClinicalInterpretations, generateOverallAssessment } from "./clinical-interpreter";

export interface PDFGenerationOptions {
  includelogo?: boolean;
  includeSignature?: boolean;
  customHeader?: string;
}

export async function generateVetReportPDF(
  report: VetReport,
  options: PDFGenerationOptions = {}
): Promise<jsPDF> {
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

  // Header - Use uploaded ThePetNest header image
  try {
    // Import and add the header image
    const headerImageSrc = await import("@assets/The MAin Header_1754055653864.png");
    
    // Add header image at the top of the PDF (scaled to fit page width)
    pdf.addImage(headerImageSrc.default, 'PNG', 0, 0, pageWidth, 50);
    
    currentY = 60; // Start content below the header
  } catch (error) {
    // Fallback to text header if image fails to load
    console.warn("Could not load header image, using text header", error);
    
    // Dark blue background bar
    pdf.setFillColor(52, 73, 151);
    pdf.rect(0, 0, pageWidth, 50, "F");
    
    // White text on dark background
    pdf.setTextColor(255, 255, 255);
    addText("ThePetNest", 20, 18, { fontSize: 24, fontStyle: "bold" });
    addText("PET STORE | LAB | SPA | CLINIC", 20, 28, { fontSize: 11 });
    addText("8848216190 | 8590433937", pageWidth - 20, 18, { align: "right", fontSize: 12, fontStyle: "bold" });
    addText("3358/2, Thiruvonam, Chanthavila, Trivandrum, 695584", 20, 38, { fontSize: 9 });
    addText("support.trivandrum@thepetnest.com", 20, 46, { fontSize: 9 });
    
    pdf.setTextColor(0, 0, 0);
    currentY = 60;
  }
  
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
  
  // Header text aligned with data columns
  addText("Test Parameter", 25, currentY, { fontSize: 11, fontStyle: "bold" });
  addText("Result", 85, currentY, { fontSize: 11, fontStyle: "bold" });
  addText("Units", 115, currentY, { fontSize: 11, fontStyle: "bold" });
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

  // Filter panels to only include those with values
  const panelsWithValues = testPanels.filter(panel => {
    return panel.tests.some(test => {
      const value = testResults[test.key as keyof TestResults];
      return value !== undefined && value !== null && value !== "";
    });
  });

  // Only generate tables for panels that have values
  panelsWithValues.forEach(panel => {
    // Filter tests within the panel to only include those with values
    const testsWithValues = panel.tests.filter(test => {
      const value = testResults[test.key as keyof TestResults];
      return value !== undefined && value !== null && value !== "";
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
        const status = getTestStatus(numericValue, test.range);
        const statusLabel = getStatusLabel(status);
        
        // Draw row borders for better table structure (removed background colors)
        pdf.setDrawColor(200, 200, 200);
        addLine(20, currentY + 2, pageWidth - 20, currentY + 2);
        
        // Better text placement to avoid overlap
        addText(test.name, 25, currentY, { fontSize: 9 });
        addText(numericValue.toString(), 85, currentY, { fontSize: 9 });
        addText(test.range.unit, 115, currentY, { fontSize: 9 });
        addText(`${test.range.min}-${test.range.max}`, 140, currentY, { fontSize: 9 });
        addText(statusLabel, 170, currentY, { 
          fontSize: 9,
          fontStyle: status !== "normal" ? "bold" : "normal"
        });
        
        currentY += 8;
      });
      
      currentY += 5;
    }
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

  // Clinical Notes - only include if enabled and has meaningful content
  if (report.clinicalNotesEnabled && report.clinicalNotes && report.clinicalNotes.trim() !== "") {
    checkPageBreak(30);
    addText("CLINICAL NOTES", 20, currentY, { fontSize: 12, fontStyle: "bold" });
    currentY += 10;
    
    const notesLines = pdf.splitTextToSize(report.clinicalNotes.trim(), pageWidth - 50);
    if (notesLines && notesLines.length > 0) {
      notesLines.forEach((line: string) => {
        checkPageBreak(8);
        addText(line, 25, currentY, { fontSize: 10 });
        currentY += 6;
      });
    }
    
    currentY += 15;
  }

  // Footer - ThePetNest signature
  checkPageBreak(40);
  currentY = Math.max(currentY, pageHeight - 50);
  
  addLine(20, currentY, pageWidth - 20, currentY);
  currentY += 10;

  addText("ThePetNest Veterinary Services", 20, currentY, { fontSize: 10, fontStyle: "bold" });
  addText("Reviewed and Approved by:", pageWidth - 20, currentY, { align: "right", fontSize: 10 });
  currentY += 8;

  addText("3358/2, Thiruvonam, Chanthavila, Trivandrum, 695584", 20, currentY, { fontSize: 9 });
  currentY += 6;
  addText("Phone: 8848216190 | Email: support.trivandrum@thepetnest.com", 20, currentY, { fontSize: 9 });

  // Signature line
  addLine(pageWidth - 100, currentY + 10, pageWidth - 20, currentY + 10);
  addText((report.attendingVeterinarian || "Attending Veterinarian") + ", DVM", pageWidth - 20, currentY + 20, { align: "right", fontSize: 9 });

  return pdf;
}
