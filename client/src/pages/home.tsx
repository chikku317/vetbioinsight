import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useVetForm } from "@/hooks/use-vet-form";
import { ProgressIndicator } from "@/components/progress-indicator";
import { PatientInfoPanel } from "@/components/patient-info-panel";
import { TestResultPanelRouter } from "@/components/test-result-panel-router";
import { ReportPreviewModal } from "@/components/report-preview-modal";
import { ReportTypeSelector } from "@/components/report-type-selector";
import { generateVetReportPDF } from "@/lib/pdf-generator";
import { generateSimplifiedReportPDF } from "@/lib/simplified-pdf-generator";
import { WhatsAppShare } from "@/components/whatsapp-share";
import { Microscope, FileText, Download, Eye, CheckCircle, AlertTriangle, Info, ArrowLeft, LogOut, User, Users } from "lucide-react";
import { VetReport, ReportType, Species } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { form, progress, isLoading, onSubmit, getAbnormalTestCount } = useVetForm();
  const [currentTab, setCurrentTab] = useState<"patient" | "tests">("patient");
  const [selectedReportType, setSelectedReportType] = useState<ReportType | null>(null);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  // If no report type is selected, show the selector
  if (!selectedReportType) {
    return (
      <div className="min-h-screen bg-clinical-bg p-6">
        {/* Header with user info */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Veterinary Laboratory Report Generator
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Select the type of laboratory examination report you want to generate.
            </p>
          </div>
          
          {/* User menu */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{user?.fullName}</span>
              {user?.role === 'admin' && (
                <Badge variant="default" className="text-xs">Admin</Badge>
              )}
            </div>
            {user?.role === 'admin' && (
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin'}>
                <Users className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
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
      createdAt: new Date(),
      patientName: formData.patientName,
      parentsName: formData.parentsName || null,
      species: formData.species as Species,
      breed: formData.breed || null,
      age: Number(formData.age) || 0,
      ageUnit: String(formData.ageUnit || 'years'),
      weight: formData.weight || 0,
      weightUnit: formData.weightUnit || 'kg',
      medicalRecordNumber: formData.medicalRecordNumber || null,
      collectionDate: formData.collectionDate,
      reportDate: formData.reportDate,
      attendingVeterinarian: formData.attendingVeterinarian || '',
      testResults: formData.testResults,
      observation: formData.observation || null,
      advice: formData.advice || null,
      notes: formData.notes || null,
      images: formData.images || null,
      clinicalNotes: formData.clinicalNotes || null,
    };
  };

  const handleGeneratePDF = () => {
    const tempReport = createTempReport();
    
    // Use appropriate PDF generator based on report type
    const pdf = selectedReportType === 'biochemistry' 
      ? generateVetReportPDF(tempReport)
      : generateSimplifiedReportPDF(tempReport);
    
    // New naming convention: LABTEST NAME_NAME OF PARENT_PATIENT NAME_DATE
    const labTestName = selectedReportType?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Laboratory Report';
    const parentName = tempReport.parentsName || 'Unknown';
    const patientName = tempReport.patientName || 'Unknown';
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `${labTestName}_${parentName}_${patientName}_${currentDate}.pdf`;
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
                <TestResultPanelRouter reportType={selectedReportType} form={form} />
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
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <ReportPreviewModal 
                      report={createTempReport()}
                      trigger={
                        <Button variant="outline" disabled={!patientName} className="w-full sm:w-auto">
                          <Eye className="mr-2 h-4 w-4" />
                          Preview Report
                        </Button>
                      }
                    />
                    <WhatsAppShare 
                      report={createTempReport()}
                      trigger={
                        <Button variant="outline" disabled={!patientName} className="w-full sm:w-auto">
                          <svg className="mr-2 h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                          </svg>
                          Send to WhatsApp
                        </Button>
                      }
                    />
                    <Button 
                      onClick={handleGeneratePDF}
                      className="bg-medical-blue hover:bg-blue-600 w-full sm:w-auto"
                      disabled={!patientName}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isLoading || !isFormValid}
                      className="bg-success-green hover:bg-green-600 w-full sm:w-auto"
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
