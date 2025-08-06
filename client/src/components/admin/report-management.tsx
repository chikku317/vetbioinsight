import { useState, useMemo } from "react";
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
import { ReportFilters } from "@/components/report-filters";

export function ReportManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>({});

  const { data: reports, isLoading } = useQuery({
    queryKey: ["/api/vet-reports"],
    retry: false,
  });

  const deleteReportMutation = useMutation({
    mutationFn: async (reportId: string) => {
      return apiRequest("DELETE", `/api/vet-reports/${reportId}`);
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

  // Filter reports based on search term and date range
  const filteredReports = useMemo(() => {
    if (!reports) return [];
    
    return reports.filter((report: VetReport) => {
      // Filter by patient name (case insensitive)
      const matchesSearch = !searchTerm || 
        report.patientName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by date range
      const matchesDate = (!dateRange.from && !dateRange.to) || 
        (() => {
          const reportDate = new Date(report.createdAt);
          const fromDate = dateRange.from ? new Date(dateRange.from) : null;
          const toDate = dateRange.to ? new Date(dateRange.to + 'T23:59:59') : null;
          
          return (!fromDate || reportDate >= fromDate) && 
                 (!toDate || reportDate <= toDate);
        })();
      
      return matchesSearch && matchesDate;
    });
  }, [reports, searchTerm, dateRange]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleDateFilter = (range: { from?: string; to?: string }) => {
    setDateRange(range);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setDateRange({});
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

      {/* Search and Filter Component */}
      <ReportFilters
        onSearch={handleSearch}
        onDateFilter={handleDateFilter}
        onClearFilters={handleClearFilters}
        searchTerm={searchTerm}
        dateRange={dateRange}
      />

      {!reports || reports.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reports found</h3>
            <p className="text-gray-600">No laboratory reports have been created yet.</p>
          </CardContent>
        </Card>
      ) : filteredReports.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No matching reports</h3>
            <p className="text-gray-600">
              No reports match your current filters. Try adjusting your search criteria.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Showing {filteredReports.length} of {reports?.length || 0} reports
          </div>
          <div className="grid gap-4">
            {filteredReports.map((report: VetReport) => (
              <Card key={report.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <h3 className="font-semibold">{report.patientName}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Owner: {report.parentsName || 'Not specified'}</span>
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
        </div>
      )}
    </div>
  );
}