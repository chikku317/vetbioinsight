import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VetReport, TestResults, Species } from "@shared/schema";
import { referenceRanges, getTestStatus, getStatusLabel } from "@/lib/reference-ranges";
import { generateVetReportPDF } from "@/lib/pdf-generator";
import { Eye, Download } from "lucide-react";
import { useState } from "react";

interface ReportPreviewModalProps {
  report: VetReport;
  trigger?: React.ReactNode;
}

export function ReportPreviewModal({ report, trigger }: ReportPreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleDownloadPDF = () => {
    const pdf = generateVetReportPDF(report);
    pdf.save(`VetLab_Report_${report.patientName}_${report.reportDate}.pdf`);
  };

  const testResults = report.testResults as TestResults;
  const species = report.species as Species;
  const ranges = referenceRanges[species];

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            Preview Report
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Report Preview</DialogTitle>
        </DialogHeader>
        
        {/* PDF Preview Content */}
        <div className="p-8 bg-gray-50 font-serif">
          {/* Professional Report Header */}
          <div className="bg-white p-8 shadow-sm mb-4">
            <div className="flex items-center justify-between border-b-2 border-medical-blue pb-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-medical-blue">VetLab Diagnostics</h1>
                <p className="text-sm text-gray-600">Veterinary Biochemistry Analysis Report</p>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p>Report ID: VLB-{new Date().getFullYear()}-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
                <p>Generated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            {/* Patient Demographics Table */}
            <div className="mb-6">
              <div className="bg-gray-50 p-2 border font-semibold text-gray-800 mb-2">
                PATIENT INFORMATION
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div><strong>Patient Name:</strong> {report.patientName}</div>
                  <div><strong>Age/Weight:</strong> {report.age} {report.ageUnit} / {report.weight} {report.weightUnit}</div>
                  <div><strong>Collection Date:</strong> {report.collectionDate}</div>
                </div>
                <div className="space-y-2">
                  <div><strong>Species/Breed:</strong> {report.species.charAt(0).toUpperCase() + report.species.slice(1)}{report.breed ? ` / ${report.breed}` : ""}</div>
                  <div><strong>Medical Record:</strong> {report.medicalRecordNumber || "N/A"}</div>
                  <div><strong>Veterinarian:</strong> {report.attendingVeterinarian}</div>
                </div>
              </div>
            </div>

            {/* Test Results Table */}
            <div className="mb-6">
              <div className="bg-medical-blue text-white p-2 mb-2">
                <div className="grid grid-cols-5 gap-4 text-sm font-bold">
                  <div>Test Parameter</div>
                  <div className="text-center">Result</div>
                  <div className="text-center">Units</div>
                  <div className="text-center">Reference Range</div>
                  <div className="text-center">Status</div>
                </div>
              </div>

              {testPanels.map((panel, panelIndex) => (
                <div key={panelIndex} className="mb-4">
                  <div className="bg-blue-50 p-2 font-semibold text-sm">{panel.name}</div>
                  {panel.tests.map((test, testIndex) => {
                    const value = testResults[test.key as keyof TestResults];
                    const status = value !== undefined && value !== null ? getTestStatus(Number(value), test.range) : null;
                    const statusLabel = status ? getStatusLabel(status) : "-";
                    
                    return (
                      <div key={testIndex} className={`grid grid-cols-5 gap-4 p-2 text-sm border-b ${
                        status === "high" || status === "low" ? "bg-yellow-50" : 
                        status === "critical" ? "bg-red-50" : ""
                      }`}>
                        <div>{test.name}</div>
                        <div className="text-center">{value !== undefined && value !== null ? value : "Not Tested"}</div>
                        <div className="text-center">{test.range.unit}</div>
                        <div className="text-center">{test.range.min}-{test.range.max}</div>
                        <div className="text-center">
                          {status && (
                            <Badge className={
                              status === "normal" ? "bg-success-green text-white" :
                              status === "critical" ? "bg-error-red text-white" :
                              "bg-warning-yellow text-white"
                            }>
                              {statusLabel}
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Clinical Notes */}
            {report.clinicalNotes && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">CLINICAL NOTES</h3>
                <div className="bg-blue-50 border-l-4 border-medical-blue p-4">
                  <p className="text-sm text-blue-700">{report.clinicalNotes}</p>
                </div>
              </div>
            )}

            {/* Report Footer */}
            <div className="mt-8 pt-4 border-t border-gray-300 text-xs text-gray-600">
              <div className="flex justify-between">
                <div>
                  <p><strong>{report.laboratoryName || "VetLab Diagnostics"}</strong></p>
                  <p>123 Medical Center Drive, Veterinary Plaza</p>
                  <p>Phone: (555) 123-4567 | Email: results@vetlab.com</p>
                </div>
                <div className="text-right">
                  <p>Reviewed and Approved by:</p>
                  <div className="mt-4 border-b border-gray-400 w-32 ml-auto"></div>
                  <p className="mt-1">{report.attendingVeterinarian}, DVM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close Preview
          </Button>
          <Button onClick={handleDownloadPDF} className="bg-medical-blue hover:bg-blue-600">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
