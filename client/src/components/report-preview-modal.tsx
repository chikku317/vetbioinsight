import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VetReport, TestResults, Species } from "@shared/schema";
import { referenceRanges, getTestStatus, getStatusLabel } from "@/lib/reference-ranges";
import { generateVetReportPDF } from "@/lib/pdf-generator";
import { generateSimplifiedReportPDF } from "@/lib/simplified-pdf-generator";
import { Eye, Download } from "lucide-react";
import { WhatsAppShare } from "@/components/whatsapp-share";
import { RiskAssessmentBadge, getRiskLevel } from "@/components/risk-assessment-badge";
import { useState } from "react";

interface ReportPreviewModalProps {
  report: VetReport;
  trigger?: React.ReactNode;
}

export function ReportPreviewModal({ report, trigger }: ReportPreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleDownloadPDF = () => {
    try {
      // Use appropriate PDF generator based on report type
      const pdf = report.reportType === 'biochemistry' 
        ? generateVetReportPDF(report)
        : generateSimplifiedReportPDF(report);
      
      // New naming convention: LABTEST NAME_NAME OF PARENT_PATIENT NAME_DATE
      const labTestName = report.reportType?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Laboratory Report';
      const parentName = report.parentsName || 'Unknown';
      const patientName = report.patientName || 'Unknown';
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `${labTestName}_${parentName}_${patientName}_${currentDate}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  // Render different preview content based on report type
  const renderPreviewContent = () => {
    if (report.reportType === 'biochemistry') {
      const testResults = report.testResults as TestResults;
      const species = report.species as Species;
      const ranges = referenceRanges[species] || referenceRanges.dog;

      const testPanels = [
        {
          name: "LIVER FUNCTION TESTS",
          tests: [
            { key: "alt", name: "Alanine Aminotransferase (ALT)", range: ranges.alt },
            { key: "alp", name: "Alkaline Phosphatase (ALP)", range: ranges.alp },
            { key: "ggt", name: "Gamma Glutamyl Transferase (GGT)", range: ranges.ggt },
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
        }
      ];

      return (
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
                const value = testResults?.[test.key as keyof TestResults];
                // Only show tests that have values
                if (value === undefined || value === null || value === "" || String(value).trim() === "") {
                  return null;
                }
                
                const numericValue = Number(value);
                const status = !isNaN(numericValue) ? getTestStatus(numericValue, test.range) : "normal";
                const statusLabel = getStatusLabel(status);
                
                return (
                  <div key={testIndex} className={`grid grid-cols-5 gap-4 p-2 text-sm border-b ${
                    status === "high" || status === "low" ? "bg-yellow-50" : 
                    status === "critical" ? "bg-red-50" : ""
                  }`}>
                    <div>{test.name}</div>
                    <div className="text-center">{value}</div>
                    <div className="text-center">{test.range.unit}</div>
                    <div className="text-center">{test.range.min}-{test.range.max}</div>
                    <div className="text-center">
                      <Badge className={
                        status === "normal" ? "bg-success-green text-white" :
                        status === "critical" ? "bg-error-red text-white" :
                        "bg-warning-yellow text-white"
                      }>
                        {statusLabel}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      );
    } else {
      // For non-biochemistry reports, show test-specific content
      return (
        <div className="mb-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold text-gray-800 mb-3">TEST RESULTS</h3>
            {report.reportType === 'skin_scraping' && (
              <div className="space-y-2 text-sm">
                <div><strong>Scraping Site:</strong> {(report.testResults as any)?.scrapingSite || "Not specified"}</div>
                <div><strong>Scraping Depth:</strong> {(report.testResults as any)?.scrapingDepth || "Not specified"}</div>
                <div><strong>Mites Detected:</strong> {(report.testResults as any)?.mitesDetected || "None"}</div>
                <div><strong>Fungal Elements:</strong> {(report.testResults as any)?.fungalElements || "None"}</div>
                <div><strong>Secondary Infections:</strong> {(report.testResults as any)?.secondaryInfections?.join(", ") || "None"}</div>
              </div>
            )}
            {report.reportType === 'blood_smear' && (
              <div className="space-y-2 text-sm">
                <div><strong>RBC Morphology:</strong> {(report.testResults as any)?.rbcMorphology || "Not specified"}</div>
                <div><strong>WBC Count:</strong> {(report.testResults as any)?.wbcCount || "Not specified"}</div>
                <div><strong>Platelet Count:</strong> {(report.testResults as any)?.plateletCount || "Not specified"}</div>
                <div><strong>Parasites:</strong> {(report.testResults as any)?.parasites || "None detected"}</div>
                <div><strong>Cell Distribution:</strong> {(report.testResults as any)?.cellDistribution || "Not specified"}</div>
              </div>
            )}
            {report.reportType === 'progesterone' && (
              <div className="space-y-2 text-sm">
                <div><strong>Progesterone Level:</strong> {(report.testResults as any)?.progesteroneLevel || "Not tested"} ng/mL</div>
                {report.advice && <div><strong>Recommendation:</strong> {report.advice}</div>}
              </div>
            )}
            {/* Add other test types as needed */}
            {report.observation && (
              <div className="mt-3">
                <strong>Observation:</strong> {report.observation}
              </div>
            )}
            {report.notes && (
              <div className="mt-3">
                <strong>Notes:</strong> {report.notes}
              </div>
            )}
          </div>
        </div>
      );
    }
  };

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
                <h1 className="text-2xl font-bold text-medical-blue">ThePetNest Laboratory</h1>
                <p className="text-sm text-gray-600">{report.reportType?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Report</p>
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
                  <div><strong>Patient Name:</strong> {report.patientName || "Not Provided"}</div>
                  <div><strong>Parent Name:</strong> {report.parentsName || "Not Provided"}</div>
                  <div><strong>Age/Weight:</strong> {report.age || "N/A"} {report.ageUnit || ""} / {report.weight || "N/A"} {report.weightUnit || ""}</div>
                  <div><strong>Collection Date:</strong> {report.collectionDate || "Not Provided"}</div>
                </div>
                <div className="space-y-2">
                  <div><strong>Species/Breed:</strong> {report.species ? report.species.charAt(0).toUpperCase() + report.species.slice(1).toLowerCase() : "Not Specified"}{report.breed ? ` / ${report.breed}` : ""}</div>
                  <div><strong>Medical Record:</strong> {report.medicalRecordNumber || "N/A"}</div>
                  <div><strong>Report Date:</strong> {report.reportDate || "Not Provided"}</div>
                  <div><strong>Attending Veterinarian:</strong> {report.attendingVeterinarian || "Not Provided"}</div>
                  <div><strong>Notes:</strong> {(report as any).dogNotes || "Not Provided"}</div>
                </div>
              </div>
            </div>

            {/* Test Results */}
            {renderPreviewContent()}

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
                  <p><strong>ThePetNest Laboratory</strong></p>
                  <p>3358/2, Thiruvonam, Chanthavila, Trivandrum, 695584</p>
                  <p>Phone: 8848216190 | 8590433937 | Email: support.trivandrum@thepetnest.com</p>
                </div>
                <div className="text-right">
                  <p>Reviewed and Approved by:</p>
                  <div className="mt-4 border-b border-gray-400 w-32 ml-auto"></div>
                  <p className="mt-1">Veterinarian, DVM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full sm:w-auto">
            Close Preview
          </Button>
          <WhatsAppShare 
            report={report}
            trigger={
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <svg className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                </svg>
                Send to WhatsApp
              </Button>
            }
          />
          <Button onClick={handleDownloadPDF} className="bg-medical-blue hover:bg-blue-600 w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
