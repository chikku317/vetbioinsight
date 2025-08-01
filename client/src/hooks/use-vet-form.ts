import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertVetReportSchema, type InsertVetReport, type TestResults, type Species } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useVetForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<InsertVetReport>({
    resolver: zodResolver(insertVetReportSchema),
    defaultValues: {
      patientName: "",
      parentsName: "",
      species: "dog",
      breed: "",
      age: "0",
      ageUnit: "years",
      weight: "0",
      weightUnit: "kg",
      medicalRecordNumber: "",
      collectionDate: new Date().toISOString().split('T')[0],
      reportDate: new Date().toISOString().split('T')[0],
      attendingVeterinarian: "",
      testResults: {},
      clinicalNotes: "",
      clinicalNotesEnabled: false,
    },
  });

  // Auto-calculate globulin when total protein or albumin changes
  const watchedValues = form.watch(["testResults.totalProtein", "testResults.albumin"]);
  
  useEffect(() => {
    const totalProtein = form.getValues("testResults.totalProtein");
    const albumin = form.getValues("testResults.albumin");
    
    if (totalProtein !== undefined && albumin !== undefined && 
        typeof totalProtein === "number" && typeof albumin === "number") {
      const globulin = totalProtein - albumin;
      form.setValue("testResults.globulin", Number(globulin.toFixed(1)));
    }
  }, [watchedValues, form]);

  // Calculate form completion progress
  const calculateProgress = (): number => {
    const values = form.getValues();
    const requiredFields = [
      "patientName", "species", "age", "weight", "collectionDate", 
      "reportDate", "attendingVeterinarian"
    ];
    
    const testFields = [
      "testResults.alt", "testResults.alp", "testResults.bun", 
      "testResults.creatinine", "testResults.glucose"
    ];
    
    const completedRequired = requiredFields.filter(field => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], values);
      return value && value !== "";
    }).length;
    
    const completedTests = testFields.filter(field => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], values);
      return value !== undefined && value !== null && value !== "";
    }).length;
    
    const totalFields = requiredFields.length + testFields.length;
    const completedFields = completedRequired + completedTests;
    
    return Math.round((completedFields / totalFields) * 100);
  };

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const subscription = form.watch(() => {
      setProgress(calculateProgress());
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Save report mutation
  const saveReportMutation = useMutation({
    mutationFn: async (data: InsertVetReport) => {
      const response = await apiRequest("POST", "/api/vet-reports", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report Saved",
        description: "The veterinary report has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vet-reports"] });
    },
    onError: (error: any) => {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save the report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: InsertVetReport) => {
    try {
      await saveReportMutation.mutateAsync(data);
    } catch (error) {
      console.error("Failed to save report:", error);
    }
  };

  // Get abnormal test count
  const getAbnormalTestCount = (): number => {
    // This would require implementing the test validation logic
    // For now, return a placeholder
    return 0;
  };

  return {
    form,
    progress,
    isLoading: saveReportMutation.isPending,
    onSubmit: form.handleSubmit(onSubmit),
    getAbnormalTestCount,
    saveReport: saveReportMutation.mutate,
  };
}
