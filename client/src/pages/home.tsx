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
import { generateVetReportPDF } from "@/lib/pdf-generator";
import { Microscope, FileText, Download, Eye, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { VetReport } from "@shared/schema";

export default function Home() {
  const { form, progress, isLoading, onSubmit, getAbnormalTestCount } = useVetForm();
  const [currentTab, setCurrentTab] = useState<"patient" | "tests">("patient");

  // Create a temporary report object for preview
  const createTempReport = (): VetReport => {
    const formData = form.getValues();
    return {
      id: "temp-preview",
      createdAt: new Date().toISOString().split('T')[0],
      ...formData,
    };
  };

  const handleGeneratePDF = () => {
    const tempReport = createTempReport();
    const pdf = generateVetReportPDF(tempReport);
    pdf.save(`VetLab_Report_${tempReport.patientName || "Patient"}_${tempReport.reportDate}.pdf`);
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
              <div className="bg-medical-blue text-white p-3 rounded-lg">
                <Microscope className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ThePetNest Analyzer</h1>
                <p className="text-sm text-medical-gray">Biochemistry Report Generator</p>
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
