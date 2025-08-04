import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { VetReport } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { FileText, Trash2, Download, Calendar, User } from "lucide-react";
import { format } from "date-fns";

export function ReportManagement() {
  const { toast } = useToast();

  const { data: reports, isLoading } = useQuery({
    queryKey: ["/api/vet-reports"],
    retry: false,
  });

  const deleteReportMutation = useMutation({
    mutationFn: async (reportId: string) => {
      return apiRequest(`/api/vet-reports/${reportId}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vet-reports"] });
      toast({
        title: "Report deleted",
        description: "Report has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete report",
        variant: "destructive",
      });
    },
  });

  const handleDeleteReport = (reportId: string, patientName: string) => {
    if (confirm(`Are you sure you want to delete the report for ${patientName}?`)) {
      deleteReportMutation.mutate(reportId);
    }
  };

  const getReportTypeLabel = (reportType: string) => {
    const types: Record<string, string> = {
      biochemistry: "Biochemistry",
      blood_smear: "Blood Smear",
      wet_film: "Wet Film",
      skin_scraping: "Skin Scraping",
      impression_smear: "Impression Smear",
      ear_swab: "Ear Swab",
      faecal_sample: "Faecal Sample",
      progesterone: "Progesterone",
    };
    return types[reportType] || reportType;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Report Management</h2>
        <p className="text-gray-600">View and manage all laboratory reports</p>
      </div>

      {reports && reports.length > 0 ? (
        <div className="grid gap-4">
          {reports.map((report: VetReport) => (
            <Card key={report.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">{report.patientName}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>Owner: {report.ownerName}</span>
                          <span>•</span>
                          <span>{report.species}</span>
                          {report.breed && (
                            <>
                              <span>•</span>
                              <span>{report.breed}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {report.createdAt 
                              ? format(new Date(report.createdAt), 'MMM dd, yyyy • HH:mm')
                              : 'No date'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Badge variant="secondary">
                      {getReportTypeLabel(report.reportType)}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteReport(report.id, report.patientName)}
                      disabled={deleteReportMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Alert>
          <AlertDescription>
            No reports found. Reports created by users will appear here.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}