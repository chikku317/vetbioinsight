import jsPDF from "jspdf";
import { VetReport } from "@shared/schema";
import headerImagePath from "@assets/Lab Header The PetNest_1754069909688.png";

export function generateSimplifiedReportPDF(report: VetReport): jsPDF {
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

  // Header - ThePetNest professional header with A4 optimized sizing
  try {
    // A4 optimized header: 794x150 pixels (5-7% of page height with proper margins)
    const headerHeight = Math.round(pageHeight * 0.06); // 6% of page height (~40mm)
    const headerWidth = pageWidth;
    const marginTop = Math.round(pageHeight * 0.015); // 1.5% margin (~4mm)
    
    pdf.addImage(headerImagePath, 'PNG', 0, marginTop, headerWidth, headerHeight);
    currentY = headerHeight + marginTop + 10;
  } catch (error) {
    console.warn("Could not load header image, using fallback:", error);
    // Fallback header with proper A4 proportions
    const headerHeight = Math.round(pageHeight * 0.06);
    const marginTop = Math.round(pageHeight * 0.015);
    
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
  const reportTitle = getReportTitle(report.reportType);
  addText(reportTitle, pageWidth / 2, currentY, { fontSize: 16, fontStyle: "bold", align: "center" });
  currentY += 10;
  
  addText(`Report ID: TPN-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`, pageWidth - 20, currentY, { align: "right", fontSize: 10 });
  addText(`Generated: ${new Date().toLocaleDateString()}`, 20, currentY, { fontSize: 10 });
  currentY += 15;

  // Patient Information Section
  addText("PATIENT INFORMATION", 20, currentY, { fontSize: 12, fontStyle: "bold" });
  currentY += 8;

  const patientInfo = [
    [`Patient Name:`, report.patientName || 'N/A'],
    [`Parent Name:`, report.parentsName || 'N/A'],
    [`Species:`, report.species || 'N/A'],
    [`Breed:`, report.breed || 'N/A'],
    [`Age:`, `${report.age || 'N/A'} ${report.ageUnit || ''}`],
    [`Weight:`, `${report.weight || 'N/A'} ${report.weightUnit || ''}`],
    [`Collection Date:`, report.collectionDate || 'N/A'],
    [`Report Date:`, report.reportDate || 'N/A'],
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
    if (report.notes) {
      checkPageBreak(20);
      addText("DOCTOR NOTES", 20, currentY, { fontSize: 11, fontStyle: "bold" });
      currentY += 8;
      
      const notesLines = pdf.splitTextToSize(report.notes, pageWidth - 50);
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
    // Use the existing complex biochemistry generator
    // This will be handled by the original PDF generator
    addText("For biochemistry reports, use the detailed generator.", 25, currentY, { fontSize: 10 });
    currentY += 8;
    
  } else {
    // Simplified format for other tests (Observation, Advice, Image)
    
    // Observation
    if (report.observation) {
      checkPageBreak(30);
      addText("OBSERVATION", 20, currentY, { fontSize: 11, fontStyle: "bold" });
      currentY += 8;
      
      const observationLines = pdf.splitTextToSize(report.observation, pageWidth - 50);
      observationLines.forEach((line: string) => {
        checkPageBreak(6);
        addText(line, 25, currentY, { fontSize: 10 });
        currentY += 5;
      });
      currentY += 8;
    }

    // Advice
    if (report.advice) {
      checkPageBreak(30);
      addText("ADVICE", 20, currentY, { fontSize: 11, fontStyle: "bold" });
      currentY += 8;
      
      const adviceLines = pdf.splitTextToSize(report.advice, pageWidth - 50);
      adviceLines.forEach((line: string) => {
        checkPageBreak(6);
        addText(line, 25, currentY, { fontSize: 10 });
        currentY += 5;
      });
      currentY += 8;
    }

    // Image (if present)
    if (report.images && Array.isArray(report.images) && report.images.length > 0) {
      checkPageBreak(80);
      addText("SPECIMEN IMAGE", 20, currentY, { fontSize: 11, fontStyle: "bold" });
      currentY += 8;
      
      try {
        // Add the first image (optimized for specimens)
        const imageData = report.images[0];
        if (typeof imageData === 'string' && imageData.startsWith('data:image/')) {
          const imgWidth = Math.min(120, pageWidth - 50);
          const imgHeight = 60; // Fixed height for consistency
          
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