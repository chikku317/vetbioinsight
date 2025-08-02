// Comprehensive PDF generation error handler
import { VetReport, Species } from "@shared/schema";

export class PDFErrorHandler {
  static safeStringAccess(str: string | undefined | null, index: number): string {
    if (!str || typeof str !== 'string' || str.length <= index || index < 0) {
      return '';
    }
    return str.charAt(index);
  }

  static safeStringSlice(str: string | undefined | null, start: number, end?: number): string {
    if (!str || typeof str !== 'string') {
      return '';
    }
    return str.slice(start, end);
  }

  static safeStringSplit(str: string | undefined | null, separator: string): string[] {
    if (!str || typeof str !== 'string') {
      return [];
    }
    return str.split(separator);
  }

  static safeCapitalize(str: string | undefined | null): string {
    if (!str || typeof str !== 'string' || str.length === 0) {
      return 'N/A';
    }
    return this.safeStringAccess(str, 0).toUpperCase() + this.safeStringSlice(str, 1).toLowerCase();
  }

  static safeSpeciesFormat(species: Species | string | undefined | null): string {
    if (!species || typeof species !== 'string' || species.length === 0) {
      return 'N/A';
    }
    return this.safeCapitalize(species);
  }

  static safeReportValidation(report: VetReport): VetReport {
    // Create a safe copy with all required fields
    const safeReport: VetReport = {
      ...report,
      patientName: report.patientName || 'Unknown Patient',
      parentsName: report.parentsName || 'Unknown Parent',
      species: report.species || 'dog',
      breed: report.breed || '',
      age: report.age || 0,
      ageUnit: report.ageUnit || 'years',
      weight: report.weight || 0,
      weightUnit: report.weightUnit || 'kg',
      collectionDate: report.collectionDate || new Date().toISOString().split('T')[0],
      reportDate: report.reportDate || new Date().toISOString().split('T')[0],
      attendingVeterinarian: report.attendingVeterinarian || 'Not Specified',
      medicalRecordNumber: report.medicalRecordNumber || 'N/A',
      reportType: report.reportType || 'biochemistry',
      testResults: report.testResults || {},
      observation: report.observation || '',
      advice: report.advice || '',
      notes: report.notes || '',
      clinicalNotes: report.clinicalNotes || '',
      clinicalNotesEnabled: report.clinicalNotesEnabled || false
    };

    return safeReport;
  }

  static safeArrayAccess<T>(arr: T[] | undefined | null, index: number): T | undefined {
    if (!Array.isArray(arr) || arr.length <= index || index < 0) {
      return undefined;
    }
    return arr[index];
  }

  static safeSplitTextToSize(pdf: any, text: string | undefined | null, maxWidth: number): string[] {
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return [];
    }

    try {
      const result = pdf.splitTextToSize(text.trim(), maxWidth);
      return Array.isArray(result) ? result.filter(line => line && typeof line === 'string') : [];
    } catch (error) {
      console.warn('Error splitting text, using fallback:', error);
      // Fallback: simple word wrap
      const words = text.trim().split(' ');
      const lines: string[] = [];
      let currentLine = '';
      
      words.forEach(word => {
        if (currentLine.length + word.length + 1 <= 80) { // Approximate character limit
          currentLine += (currentLine ? ' ' : '') + word;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      });
      
      if (currentLine) lines.push(currentLine);
      return lines;
    }
  }

  static wrapWithErrorHandling<T>(operation: () => T, fallback: T, errorMessage?: string): T {
    try {
      return operation();
    } catch (error) {
      console.error(errorMessage || 'PDF operation failed:', error);
      return fallback;
    }
  }
}