import jsPDF from "jspdf";
import { VetReport, Species, TestResults } from "@shared/schema";
import headerImagePath from "@assets/The MAin Header_1754116167505.png";
import { PDFErrorHandler } from "./pdf-error-handler";
import { referenceRanges, getTestStatus, getStatusLabel, SpeciesReferenceRanges } from "./reference-ranges";

export function generateSimplifiedReportPDF(report: VetReport): jsPDF {
  // Create a safe report with error handling
  const safeReport = PDFErrorHandler.safeReportValidation(report);
  
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let currentY = 20;

  // Helper functions
  const addText = (text: string, x: number, y: number, options?: { 
    fontSize?: number; 
    fontStyle?: string; 
    align?: string;
  }) => {
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

  const checkPageBreak = (requiredSpace: number) => {
    if (currentY + requiredSpace > pageHeight - 50) {
      pdf.addPage();
      currentY = 30;
    }
  };

  // Header - ThePetNest professional header with Extended Professional specifications
  try {
    // Extended Professional Header: 2480x500 pixels (14% of A4 height, 210mm x 42mm)
    const headerHeight = Math.round(pageHeight * 0.14); // 14% of page height (~42mm)
    const headerWidth = pageWidth;
    const marginTop = Math.round(pageHeight * 0.01); // 1% margin (~3mm)
    
    pdf.addImage(headerImagePath, 'PNG', 0, marginTop, headerWidth, headerHeight);
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
    addText("ThePetNest", 20, marginTop + 18, { fontSize: 24, fontStyle: "bold" });
    addText("PET STORE | LAB | SPA | CLINIC", 20, marginTop + 28, { fontSize: 11 });
    addText("8848216190 | 8590433937", pageWidth - 50, marginTop + 18, { fontSize: 12, fontStyle: "bold" });
    addText("3358/2, Thiruvonam, Chanthavila, Trivandrum, 695584", 20, marginTop + 38, { fontSize: 9 });
    addText("support.trivandrum@thepetnest.com", 20, marginTop + 46, { fontSize: 9 });
    pdf.setTextColor(0, 0, 0);
    currentY = headerHeight + marginTop + 10;
  }
  
  // Report title
  const reportTitle = getReportTitle(safeReport.reportType);
  addText(reportTitle, pageWidth / 2, currentY, { fontSize: 16, fontStyle: "bold", align: "center" });
  currentY += 10;
  
  addText(`Report ID: TPN-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, pageWidth - 20, currentY, { align: "right", fontSize: 10 });
  addText(`Generated: ${new Date().toLocaleDateString()}`, 20, currentY, { fontSize: 10 });
  currentY += 15;

  // Patient Information Section
  addText("PATIENT INFORMATION", 20, currentY, { fontSize: 12, fontStyle: "bold" });
  currentY += 8;

  const patientInfo = [
    [`Patient Name:`, safeReport.patientName],
    [`Parent Name:`, safeReport.parentsName],
    [`Species:`, PDFErrorHandler.safeSpeciesFormat(safeReport.species)],
    [`Breed:`, safeReport.breed || 'N/A'],
    [`Age:`, `${safeReport.age} ${safeReport.ageUnit}`],
    [`Weight:`, `${safeReport.weight} ${safeReport.weightUnit}`],
    [`Collection Date:`, safeReport.collectionDate],
    [`Report Date:`, safeReport.reportDate],
    [`Attending Veterinarian:`, safeReport.attendingVeterinarian],
    [`Notes:`, (safeReport as any).dogNotes || 'N/A'],
    [`Follow-up Date:`, safeReport.followUpDate || 'N/A'],
  ];

  patientInfo.forEach(([label, value]) => {
    addText(label, 25, currentY, { fontSize: 10, fontStyle: "bold" });
    addText(value.toString(), 100, currentY, { fontSize: 10 });
    currentY += 6;
  });

  currentY += 10;

  // Test Results Section
  addText("TEST RESULTS", 20, currentY, { fontSize: 12, fontStyle: "bold" });
  currentY += 8;

  // Handle different report types
  if (report.reportType === 'progesterone') {
    // Progesterone specific fields
    const progLevel = (report.testResults as any)?.progesteroneLevel;
    if (progLevel !== undefined) {
      addText(`Progesterone Level:`, 25, currentY, { fontSize: 10, fontStyle: "bold" });
      addText(`${progLevel} ng/mL`, 120, currentY, { fontSize: 10 });
      currentY += 8;
    }

    // Show only selected advice option
    if (report.advice) {
      addText(`Recommendation:`, 25, currentY, { fontSize: 10, fontStyle: "bold" });
      addText(report.advice, 120, currentY, { fontSize: 10 });
      currentY += 8;
    }

    // Doctor notes
    if (report.notes && typeof report.notes === 'string' && report.notes.trim()) {
      checkPageBreak(20);
      addText("DOCTOR NOTES", 20, currentY, { fontSize: 11, fontStyle: "bold" });
      currentY += 8;
      
      const notesLines = PDFErrorHandler.safeSplitTextToSize(pdf, safeReport.notes, pageWidth - 50);
      notesLines.forEach((line: string) => {
        checkPageBreak(6);
        addText(line, 25, currentY, { fontSize: 10 });
        currentY += 5;
      });
      currentY += 5;
    }

    // Reference Range Table
    checkPageBreak(50);
    addText("REFERENCE RANGE FOR DOGS", 20, currentY, { fontSize: 11, fontStyle: "bold" });
    currentY += 8;
    
    // Table headers
    addText("Progesterone Level", 25, currentY, { fontSize: 9, fontStyle: "bold" });
    addText("Breeding Status", 80, currentY, { fontSize: 9, fontStyle: "bold" });
    addText("Recommendation", 140, currentY, { fontSize: 9, fontStyle: "bold" });
    currentY += 6;
    
    // Table rows
    const referenceData = [
      ["< 2.0 ng/mL", "Pre-LH surge", "Continue testing"],
      ["2.0-5.0 ng/mL", "LH surge occurring", "Breed in 24-48h"],
      ["5.0-8.0 ng/mL", "Optimal breeding window", "Proceed with breeding"],
      ["> 8.0 ng/mL", "Post-ovulation", "Window may be closing"]
    ];
    
    referenceData.forEach(([level, status, recommendation]) => {
      addText(level, 25, currentY, { fontSize: 8 });
      addText(status, 80, currentY, { fontSize: 8 });
      addText(recommendation, 140, currentY, { fontSize: 8 });
      currentY += 5;
    });
    
  } else if (report.reportType === 'biochemistry') {
    // Handle biochemistry reports with color coding for critical values
    const testResults = report.testResults as TestResults;
    const ranges = referenceRanges[safeReport.species as Species];
    
    if (testResults && ranges) {
      checkPageBreak(50);
      addText("BIOCHEMISTRY TEST RESULTS", 20, currentY, { fontSize: 11, fontStyle: "bold" });
      currentY += 10;
      
      // Test panels with thyroid function included
      const testPanels = [
        {
          name: "LIVER FUNCTION",
          tests: [
            { key: "alt", name: "ALT", range: ranges.alt },
            { key: "alp", name: "ALP", range: ranges.alp },
            { key: "ggt", name: "GGT", range: ranges.ggt },
            { key: "sgot", name: "SGOT", range: ranges.sgot },
            { key: "sgpt", name: "SGPT", range: ranges.sgpt },
            { key: "totalBilirubin", name: "Total Bilirubin", range: ranges.totalBilirubin }
          ]
        },
        {
          name: "KIDNEY FUNCTION", 
          tests: [
            { key: "bun", name: "BUN", range: ranges.bun },
            { key: "creatinine", name: "Creatinine", range: ranges.creatinine }
          ]
        },
        {
          name: "THYROID FUNCTION",
          tests: [
            { key: "t3", name: "T3", range: ranges.t3 },
            { key: "t4", name: "T4", range: ranges.t4 },
            { key: "tsh", name: "TSH", range: ranges.tsh }
          ]
        }
      ];

      testPanels.forEach(panel => {
        const testsWithValues = panel.tests.filter(test => {
          const value = testResults[test.key as keyof TestResults];
          return value !== undefined && value !== null && String(value).trim() !== "";
        });

        if (testsWithValues.length > 0) {
          checkPageBreak(20);
          addText(panel.name, 25, currentY, { fontSize: 10, fontStyle: "bold" });
          currentY += 8;

          testsWithValues.forEach(test => {
            const value = testResults[test.key as keyof TestResults];
            const numericValue = typeof value === 'number' ? value : Number(value);
            const status = getTestStatus(test.key as keyof SpeciesReferenceRanges, numericValue, safeReport.species as Species);
            const statusLabel = getStatusLabel(status);
            
            // Color coding for high/critical values
            const isHighOrCritical = status === "high" || status === "critical";
            
            // Enhanced column alignment for better readability
            const testNameLines = pdf.splitTextToSize(`${test.name}:`, 50);
            if (Array.isArray(testNameLines) && testNameLines.length > 0) {
              addText(testNameLines[0], 25, currentY, { fontSize: 9 });
            }
            
            // Set red color for high/critical values
            if (isHighOrCritical) {
              pdf.setTextColor(220, 20, 20);
            }
            
            addText(`${numericValue} ${test.range.unit}`, 80, currentY, { fontSize: 9 });
            addText(`(${statusLabel})`, 130, currentY, { fontSize: 9 });
            
            // Reset color to black
            pdf.setTextColor(0, 0, 0);
            
            currentY += 6;
          });
          currentY += 5;
        }
      });
    }
    
  } else {
    // Simplified format for other tests (Observation, Advice, Image)
    
    // Observation
    if (report.observation && typeof report.observation === 'string' && report.observation.trim()) {
      checkPageBreak(30);
      addText("OBSERVATION", 20, currentY, { fontSize: 11, fontStyle: "bold" });
      currentY += 8;
      
      const observationLines = pdf.splitTextToSize(report.observation.trim(), pageWidth - 50);
      if (Array.isArray(observationLines)) {
        observationLines.forEach((line: string) => {
          if (line && typeof line === 'string') {
            checkPageBreak(6);
            addText(line, 25, currentY, { fontSize: 10 });
            currentY += 5;
          }
        });
      }
      currentY += 8;
    }

    // Advice
    if (report.advice && typeof report.advice === 'string' && report.advice.trim()) {
      checkPageBreak(30);
      addText("ADVICE", 20, currentY, { fontSize: 11, fontStyle: "bold" });
      currentY += 8;
      
      const adviceLines = pdf.splitTextToSize(report.advice.trim(), pageWidth - 50);
      if (Array.isArray(adviceLines)) {
        adviceLines.forEach((line: string) => {
          if (line && typeof line === 'string') {
            checkPageBreak(6);
            addText(line, 25, currentY, { fontSize: 10 });
            currentY += 5;
          }
        });
      }
      currentY += 8;
    }

    // Notes section - Always include if notes are provided
    if (report.notes && typeof report.notes === 'string' && report.notes.trim()) {
      checkPageBreak(30);
      addText("NOTES", 20, currentY, { fontSize: 11, fontStyle: "bold" });
      currentY += 8;
      
      const notesLines = pdf.splitTextToSize(report.notes.trim(), pageWidth - 50);
      if (Array.isArray(notesLines)) {
        notesLines.forEach((line: string) => {
          if (line && typeof line === 'string') {
            checkPageBreak(6);
            addText(line, 25, currentY, { fontSize: 10 });
            currentY += 5;
          }
        });
      }
      currentY += 8;
    }

    // Image (if present)
    if (report.images && Array.isArray(report.images) && report.images.length > 0) {
      checkPageBreak(80);
      addText("SPECIMEN IMAGE", 20, currentY, { fontSize: 11, fontStyle: "bold" });
      currentY += 8;
      
      try {
        // Add the first image with preserved original dimensions
        const imageData = report.images[0];
        if (typeof imageData === 'string' && imageData.startsWith('data:image/')) {
          // Create a temporary image to get original dimensions
          const tempImage = new Image();
          tempImage.src = imageData;
          
          // Calculate dimensions while preserving aspect ratio
          const maxWidth = pageWidth - 50; // Leave margins
          const maxHeight = 80; // Maximum height for layout
          
          // Get original dimensions (fallback if unable to detect)
          const originalWidth = tempImage.naturalWidth || 800;
          const originalHeight = tempImage.naturalHeight || 600;
          
          // Calculate scale to fit within bounds while preserving aspect ratio
          const scaleWidth = maxWidth / originalWidth;
          const scaleHeight = maxHeight / originalHeight;
          const scale = Math.min(scaleWidth, scaleHeight);
          
          const imgWidth = originalWidth * scale;
          const imgHeight = originalHeight * scale;
          
          pdf.addImage(imageData, 'JPEG', 25, currentY, imgWidth, imgHeight);
          currentY += imgHeight + 10;
        }
      } catch (error) {
        console.warn("Could not add specimen image:", error);
        addText("Image could not be displayed", 25, currentY, { fontSize: 9 });
        currentY += 8;
      }
    }
  }

  // Footer with diagnostic info
  checkPageBreak(20);
  currentY = Math.max(currentY, pageHeight - 40);
  pdf.setDrawColor(200, 200, 200);
  pdf.line(20, currentY, pageWidth - 20, currentY);
  currentY += 5;
  
  addText("This report has been generated by ThePetNest Laboratory", pageWidth / 2, currentY, { 
    fontSize: 8, 
    align: "center" 
  });
  currentY += 4;
  addText("For queries, contact: support.trivandrum@thepetnest.com | 8848216190", pageWidth / 2, currentY, { 
    fontSize: 8, 
    align: "center" 
  });

  return pdf;
}

function getReportTitle(reportType: string): string {
  const titles: Record<string, string> = {
    'blood_smear': 'BLOOD SMEAR EXAMINATION REPORT',
    'wet_film': 'WET FILM EXAMINATION REPORT',
    'skin_scraping': 'SKIN SCRAPING EXAMINATION REPORT',
    'impression_smear': 'IMPRESSION SMEAR EXAMINATION REPORT',
    'ear_swab': 'EAR SWAB EXAMINATION REPORT',
    'faecal_sample': 'FAECAL SAMPLE EXAMINATION REPORT',
    'progesterone': 'PROGESTERONE TEST REPORT',
    'biochemistry': 'BIOCHEMISTRY ANALYSIS REPORT'
  };
  
  return titles[reportType] || 'LABORATORY EXAMINATION REPORT';
}