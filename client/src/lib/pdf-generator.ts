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
  pdf.rect(0, 0, pageWidth, 40, "F");
  
  // Orange accent elements
  pdf.setFillColor(255, 165, 0); // Orange color
  pdf.ellipse(pageWidth - 30, 20, 25, 25, "F");
  
  // White text on dark background
  pdf.setTextColor(255, 255, 255);
  addText("ThePetNest", 20, 15, { fontSize: 20, fontStyle: "bold" });
  addText("PET STORE | LAB | SPA | CLINIC", 20, 25, { fontSize: 10 });
  
  // Malayalam text (approximation)
  addText("താനെപ്പെട്ട് നെസ്റ്റ്", 20, 32, { fontSize: 12 });
  
  // Contact information
  addText("8848216190 | 8590433937", pageWidth - 20, 15, { align: "right", fontSize: 12, fontStyle: "bold" });
  
  // Address
  pdf.setTextColor(255, 255, 255);
  addText("3358/2, Thiruvonam, Chanthavila, Trivandrum, 695584", 20, 45, { fontSize: 8 });
  addText("support.trivandrum@thepetnest.com", 20, 52, { fontSize: 8 });
  
  // Reset text color and set current position
  pdf.setTextColor(0, 0, 0);
  currentY = 65;
  
  // Report title
  addText("VETERINARY BIOCHEMISTRY ANALYSIS REPORT", 20, currentY, { fontSize: 14, fontStyle: "bold", align: "center" });
  addText(`Report ID: TPN-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, pageWidth - 20, currentY, { align: "right", fontSize: 10 });
  currentY += 8;
  
  addText(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 20, currentY, { align: "right", fontSize: 10 });
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

  // Draw table with better alignment
  pdf.setDrawColor(180, 180, 180);
  pdf.setLineWidth(0.5);
  
  tableData.forEach((row, index) => {
    checkPageBreak(15);
    
    // Alternating row colors for better readability
    if (index % 2 === 0) {
      pdf.setFillColor(248, 249, 250);
      pdf.rect(20, currentY - 8, pageWidth - 40, 12, "F");
    }
    
    // Draw horizontal lines
    addLine(20, currentY - 8, pageWidth - 20, currentY - 8);
    
    // Better column alignment
    addText(row[0], 25, currentY, { fontStyle: "bold", fontSize: 10 });
    addText(row[1], 70, currentY, { fontSize: 10 });
    addText(row[2], pageWidth/2 + 10, currentY, { fontStyle: "bold", fontSize: 10 });
    addText(row[3], pageWidth/2 + 60, currentY, { fontSize: 10 });
    
    // Vertical dividers
    addLine(pageWidth/2, currentY - 8, pageWidth/2, currentY + 4);
    
    currentY += 12;
  });

  // Bottom border
  addLine(20, currentY - 8, pageWidth - 20, currentY - 8);
  currentY += 15;

  // Test Results Table
  checkPageBreak(40);
  addText("LABORATORY RESULTS", 20, currentY, { fontSize: 14, fontStyle: "bold" });
  currentY += 10;

  // Table headers with better layout
  pdf.setFillColor(52, 73, 151); // ThePetNest dark blue
  pdf.rect(20, currentY - 5, pageWidth - 40, 15, "F");
  
  // Draw header borders
  pdf.setDrawColor(255, 255, 255);
  pdf.setLineWidth(0.5);
  addLine(80, currentY - 5, 80, currentY + 10); // After Test Parameter
  addLine(110, currentY - 5, 110, currentY + 10); // After Result
  addLine(130, currentY - 5, 130, currentY + 10); // After Units
  addLine(160, currentY - 5, 160, currentY + 10); // After Reference Range
  
  pdf.setTextColor(255, 255, 255); // white text
  addText("Test Parameter", 25, currentY + 5, { fontSize: 10, fontStyle: "bold" });
  addText("Result", 95, currentY + 5, { fontSize: 10, fontStyle: "bold", align: "center" });
  addText("Units", 120, currentY + 5, { fontSize: 10, fontStyle: "bold", align: "center" });
  addText("Reference Range", 145, currentY + 5, { fontSize: 10, fontStyle: "bold", align: "center" });
  addText("Status", 170, currentY + 5, { fontSize: 10, fontStyle: "bold", align: "center" });
  
  pdf.setTextColor(0, 0, 0); // reset to black
  pdf.setDrawColor(180, 180, 180); // reset border color
  currentY += 20;

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
        const numericValue = typeof value === 'number' ? value : Number(value);
        const status = getTestStatus(numericValue, test.range);
        const statusLabel = getStatusLabel(status);
        
        // Highlight abnormal values
        if (status !== "normal") {
          if (status === "critical") {
            pdf.setFillColor(220, 38, 38, 0.1); // red
          } else {
            pdf.setFillColor(245, 158, 11, 0.1); // yellow
          }
          pdf.rect(20, currentY - 6, pageWidth - 40, 8, "F");
        }

        // Draw row borders for better table structure
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
    
    let severityColor: [number, number, number, number];
    if (interpretation.severity === "severe") {
      severityColor = [220, 38, 38, 0.1];
    } else if (interpretation.severity === "moderate") {
      severityColor = [245, 158, 11, 0.1];
    } else if (interpretation.severity === "mild") {
      severityColor = [253, 224, 71, 0.1];
    } else {
      severityColor = [34, 197, 94, 0.1];
    }
    
    pdf.setFillColor(severityColor[0], severityColor[1], severityColor[2], severityColor[3]);
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

  // Clinical Notes - only include if enabled and has content
  if (report.clinicalNotesEnabled && report.clinicalNotes) {
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
