import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useVetForm } from "@/hooks/use-vet-form";
import { ProgressIndicator } from "@/components/progress-indicator";
import { PatientInfoPanel } from "@/components/patient-info-panel";
import { TestResultPanel } from "@/components/test-result-panel";
import { ReportPreviewModal } from "@/components/report-preview-modal";
import { ReportTypeSelector } from "@/components/report-type-selector";
import { generateVetReportPDF } from "@/lib/pdf-generator";
import { Microscope, FileText, Download, Eye, CheckCircle, AlertTriangle, Info, ArrowLeft } from "lucide-react";
import { VetReport, ReportType } from "@shared/schema";

export default function Home() {
  const { form, progress, isLoading, onSubmit, getAbnormalTestCount } = useVetForm();
  const [currentTab, setCurrentTab] = useState<"patient" | "tests">("patient");
  const [selectedReportType, setSelectedReportType] = useState<ReportType | null>(null);

  // If no report type is selected, show the selector
  if (!selectedReportType) {
    return (
      <div className="min-h-screen bg-clinical-bg p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Veterinary Laboratory Report Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select the type of laboratory examination report you want to generate.
          </p>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Biochemistry Report */}
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => setSelectedReportType("biochemistry")}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-lg bg-blue-500 text-white group-hover:bg-blue-600 transition-colors">
                    <Microscope className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Biochemistry Report</h3>
                    <Badge variant="secondary" className="text-xs">Most Popular</Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Comprehensive blood chemistry analysis with liver, kidney, and metabolic parameters
                </p>
                <div className="text-xs text-gray-500 mb-4">
                  ✓ Automated interpretation • ✓ Species-specific ranges • ✓ Abnormal alerts
                </div>
                <Button className="w-full group-hover:bg-primary/90 transition-colors">Create Report</Button>
              </CardContent>
            </Card>

            {/* Blood Smear */}
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => setSelectedReportType("blood_smear")}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-lg bg-red-500 text-white group-hover:bg-red-600 transition-colors">
                    <Eye className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Blood Smear</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Microscopic examination of blood cells, morphology, and parasites
                </p>
                <div className="text-xs text-gray-500 mb-4">
                  ✓ Cell morphology • ✓ Parasite detection • ✓ Image upload
                </div>
                <Button className="w-full group-hover:bg-primary/90 transition-colors">Create Report</Button>
              </CardContent>
            </Card>

            {/* Wet Film */}
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => setSelectedReportType("wet_film")}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-lg bg-cyan-500 text-white group-hover:bg-cyan-600 transition-colors">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Wet Film</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Direct microscopic examination of fresh samples for bacteria and parasites
                </p>
                <div className="text-xs text-gray-500 mb-4">
                  ✓ Bacteria ID • ✓ Parasite screening • ✓ Cell analysis
                </div>
                <Button className="w-full group-hover:bg-primary/90 transition-colors">Create Report</Button>
              </CardContent>
            </Card>

            {/* Skin Scraping */}
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => setSelectedReportType("skin_scraping")}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-lg bg-orange-500 text-white group-hover:bg-orange-600 transition-colors">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Skin Scraping</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Analysis of skin samples for mites, fungi, and secondary infections
                </p>
                <div className="text-xs text-gray-500 mb-4">
                  ✓ Mite detection • ✓ Fungal screening • ✓ Depth analysis
                </div>
                <Button className="w-full group-hover:bg-primary/90 transition-colors">Create Report</Button>
              </CardContent>
            </Card>

            {/* Impression Smear */}
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => setSelectedReportType("impression_smear")}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-lg bg-purple-500 text-white group-hover:bg-purple-600 transition-colors">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Impression Smear</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Cytological examination of wounds, masses, and discharge samples
                </p>
                <div className="text-xs text-gray-500 mb-4">
                  ✓ Cell typing • ✓ Malignancy screening • ✓ Inflammation patterns
                </div>
                <Button className="w-full group-hover:bg-primary/90 transition-colors">Create Report</Button>
              </CardContent>
            </Card>

            {/* Ear Swab */}
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => setSelectedReportType("ear_swab")}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-lg bg-yellow-500 text-white group-hover:bg-yellow-600 transition-colors">
                    <Info className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Ear Swab</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Comprehensive ear discharge analysis for otitis and parasites
                </p>
                <div className="text-xs text-gray-500 mb-4">
                  ✓ Bacteria/yeast ID • ✓ Mite detection • ✓ Odor assessment
                </div>
                <Button className="w-full group-hover:bg-primary/90 transition-colors">Create Report</Button>
              </CardContent>
            </Card>

            {/* Faecal Sample */}
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => setSelectedReportType("faecal_sample")}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-lg bg-green-500 text-white group-hover:bg-green-600 transition-colors">
                    <Download className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Faecal Sample</h3>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Complete parasitological and microbiological examination of stool
                </p>
                <div className="text-xs text-gray-500 mb-4">
                  ✓ Parasite ID • ✓ Load assessment • ✓ Consistency analysis
                </div>
                <Button className="w-full group-hover:bg-primary/90 transition-colors">Create Report</Button>
              </CardContent>
            </Card>

            {/* Progesterone Test */}
            <Card 
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => setSelectedReportType("progesterone")}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-lg bg-pink-500 text-white group-hover:bg-pink-600 transition-colors">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Progesterone Test</h3>
                    <Badge variant="secondary" className="text-xs">Specialized</Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Reproductive hormone analysis for breeding timing and pregnancy monitoring
                </p>
                <div className="text-xs text-gray-500 mb-4">
                  ✓ Breeding advice • ✓ Reference ranges • ✓ Timing recommendations
                </div>
                <Button className="w-full group-hover:bg-primary/90 transition-colors">Create Report</Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg">
              <Microscope className="h-4 w-4" />
              <span>Professional reports with ThePetNest branding • Species-specific references • PDF export</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Create a temporary report object for preview
  const createTempReport = (): VetReport => {
    const formData = form.getValues();
    return {
      id: "temp-preview",
      reportType: selectedReportType || "biochemistry",
      createdAt: new Date().toISOString().split('T')[0],
      ...formData,
      parentsName: formData.parentsName || null,
      breed: formData.breed || null,
      medicalRecordNumber: formData.medicalRecordNumber || null,
      observation: null,
      advice: null,
      notes: null,
      images: null,
      clinicalNotes: formData.clinicalNotes || null,
    };
  };

  const handleGeneratePDF = () => {
    const tempReport = createTempReport();
    const pdf = generateVetReportPDF(tempReport);
    const filename = `BIOCHEMISTRY ANALYSIS REPORT_${tempReport.patientName || 'Patient'}_${tempReport.parentsName || 'Owner'}_${tempReport.collectionDate || tempReport.reportDate}.pdf`;
    pdf.save(filename);
  };

  const abnormalCount = getAbnormalTestCount();
  const isFormValid = form.formState.isValid;
  const patientName = form.watch("patientName");

  return (
    <div className="min-h-screen bg-clinical-bg">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedReportType(null)}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="bg-medical-blue text-white p-3 rounded-lg">
                <Microscope className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ThePetNest Analyzer</h1>
                <p className="text-sm text-medical-gray">{selectedReportType?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Report Generator</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-medical-gray">
                Progress: <span className="font-medium text-medical-blue">{progress}%</span>
              </div>
              <Button 
                onClick={handleGeneratePDF}
                className="bg-medical-blue hover:bg-blue-600"
                disabled={!patientName}
              >
                <Download className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Progress Indicator */}
        <ProgressIndicator progress={progress} abnormalCount={abnormalCount} />

        <Form {...form}>
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Patient Information */}
              <div className="lg:col-span-1">
                <PatientInfoPanel form={form} />
              </div>

              {/* Right Column: Test Results */}
              <div className="lg:col-span-2">
                <TestResultPanel form={form} />
              </div>

            </div>

            {/* Summary Actions */}
            <Card className="mt-8">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Report Summary</h3>
                    <p className="text-sm text-medical-gray mt-1">
                      Review all sections before generating the final report
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <ReportPreviewModal 
                      report={createTempReport()}
                      trigger={
                        <Button variant="outline" disabled={!patientName}>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview Report
                        </Button>
                      }
                    />
                    <Button 
                      type="submit"
                      disabled={isLoading || !isFormValid}
                      className="bg-medical-blue hover:bg-blue-600"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      {isLoading ? "Saving..." : "Save Report"}
                    </Button>
                  </div>
                </div>
                
                {/* Validation Summary */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="text-success-green mr-2 h-5 w-5" />
                      <span className="text-sm font-medium text-green-800">
                        {progress >= 50 ? "Patient Info Complete" : "Patient Info Pending"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertTriangle className="text-warning-yellow mr-2 h-5 w-5" />
                      <span className="text-sm font-medium text-yellow-800">
                        {abnormalCount} Abnormal Values
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Info className="text-medical-blue mr-2 h-5 w-5" />
                      <span className="text-sm font-medium text-blue-800">
                        {progress >= 80 ? "Ready for Review" : "In Progress"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
