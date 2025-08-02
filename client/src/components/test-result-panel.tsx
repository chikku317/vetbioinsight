import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { InsertVetReport, TestResults, Species } from "@shared/schema";
import { referenceRanges, getTestStatus, getStatusColor, getStatusLabel, SpeciesReferenceRanges } from "@/lib/reference-ranges";
import { generateClinicalInterpretations } from "@/lib/clinical-interpreter";
import { Activity, Cat, Zap, Dna, Clock, FileText } from "lucide-react";

interface TestResultPanelProps {
  form: UseFormReturn<InsertVetReport>;
}

interface TestFieldProps {
  form: UseFormReturn<InsertVetReport>;
  testKey: keyof SpeciesReferenceRanges;
  label: string;
  unit?: string;
  species: Species;
  step?: string;
  className?: string;
}

function TestField({ form, testKey, label, unit, species, step = "1", className = "" }: TestFieldProps) {
  const ranges = referenceRanges[species];
  const range = ranges[testKey];
  const testValue = form.watch(`testResults.${testKey}`);
  
  let status: "normal" | "high" | "low" | "critical" = "normal";
  if (typeof testValue === 'number' && !isNaN(testValue)) {
    status = getTestStatus(testKey, testValue, species);
  }

  const statusColor = getStatusColor(status);
  const statusLabel = getStatusLabel(status);

  return (
    <div className={`bg-gray-50 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <FormLabel className="text-sm font-medium text-gray-700">{label}</FormLabel>
        {typeof testValue === 'number' && !isNaN(testValue) && (
          <Badge className={`px-2 py-1 text-xs rounded-full ${statusColor}`}>
            {statusLabel}
          </Badge>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        <FormField
          control={form.control}
          name={`testResults.${testKey}`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  type="number"
                  step={step}
                  placeholder={range?.min.toString() || "0"}
                  className={typeof testValue === 'number' && !isNaN(testValue) && status !== "normal" 
                    ? status === "critical" ? "border-red-300 focus:ring-error-red" : "border-yellow-300 focus:ring-warning-yellow"
                    : ""
                  }
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {unit && <span className="text-sm text-gray-500">{unit}</span>}
      </div>
      
      {range && (
        <div className="text-xs text-medical-gray mt-2">
          Reference: {range.min}-{range.max} {range.unit} ({species.charAt(0).toUpperCase() + species.slice(1)})
        </div>
      )}
    </div>
  );
}

export function TestResultPanel({ form }: TestResultPanelProps) {
  const species = form.watch("species") as Species;
  const testResults = form.watch("testResults") as TestResults;
  const interpretations = generateClinicalInterpretations(testResults, species);

  return (
    <div className="space-y-6">
      {/* Liver Function Tests */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="flex items-center text-lg">
            <Activity className="text-medical-blue mr-2 h-5 w-5" />
            Liver Function Tests
          </CardTitle>
          <p className="text-sm text-medical-gray mt-1">Liver enzyme and function markers</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TestField form={form} testKey="alt" label="Alanine Aminotransferase (ALT)" unit="U/L" species={species} />
            <TestField form={form} testKey="alp" label="Alkaline Phosphatase (ALP)" unit="U/L" species={species} />
            <TestField form={form} testKey="ggt" label="Gamma Glutamyl Transferase (GGT)" unit="U/L" species={species} />
            <TestField form={form} testKey="sgot" label="Serum Glutamic Oxaloacetic Transaminase (SGOT)" unit="U/L" species={species} />
            <TestField form={form} testKey="sgpt" label="Serum Glutamic Pyruvic Transaminase (SGPT)" unit="U/L" species={species} />
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <FormLabel className="text-sm font-medium text-gray-700">Total Bilirubin</FormLabel>
              </div>
              <div className="flex items-center space-x-3">
                <FormField
                  control={form.control}
                  name="testResults.totalBilirubin"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="0.3"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="testResults.bilirubinUnit"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mg/dl">mg/dL</SelectItem>
                          <SelectItem value="umol/l">μmol/L</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="text-xs text-medical-gray mt-2">
                Reference: {referenceRanges[species].totalBilirubin.min}-{referenceRanges[species].totalBilirubin.max} mg/dL ({species.charAt(0).toUpperCase() + species.slice(1)})
              </div>
            </div>
          </div>

          {/* Automated Interpretation */}
          {interpretations.find(i => i.panel === "Hepatic Function") && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                Automated Interpretation
              </h4>
              <div className="text-sm text-blue-800">
                {interpretations.find(i => i.panel === "Hepatic Function")?.findings.map((finding, index) => (
                  <p key={index} className="mb-1">{finding}</p>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Kidney Function Tests */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="flex items-center text-lg">
            <Cat className="text-medical-blue mr-2 h-5 w-5" />
            Kidney Function Tests
          </CardTitle>
          <p className="text-sm text-medical-gray mt-1">Kidney function markers</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TestField form={form} testKey="bun" label="Blood Urea Nitrogen (BUN)" unit="mg/dL" species={species} />
            <TestField form={form} testKey="creatinine" label="Creatinine" unit="mg/dL" species={species} step="0.1" />
            <TestField form={form} testKey="phosphorus" label="Phosphorus" unit="mg/dL" species={species} step="0.1" />
          </div>

          {/* Clinical Alert for Renal Issues */}
          {interpretations.find(i => i.panel === "Renal Function" && i.severity !== "normal") && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-red-900 mb-2 flex items-center">
                <span className="mr-1">⚠️</span>
                Clinical Alert
              </h4>
              <div className="text-sm text-red-800">
                {interpretations.find(i => i.panel === "Renal Function")?.findings.map((finding, index) => (
                  <p key={index} className="mb-1">{finding}</p>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Electrolytes & Minerals */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="flex items-center text-lg">
            <Zap className="text-medical-blue mr-2 h-5 w-5" />
            Electrolytes & Minerals
          </CardTitle>
          <p className="text-sm text-medical-gray mt-1">Electrolyte balance and mineral levels</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TestField form={form} testKey="sodium" label="Sodium (Na+)" unit="mEq/L" species={species} />
            <TestField form={form} testKey="potassium" label="Potassium (K+)" unit="mEq/L" species={species} step="0.1" />
            <TestField form={form} testKey="chloride" label="Chloride (Cl-)" unit="mEq/L" species={species} />
            <TestField form={form} testKey="calcium" label="Calcium (Total)" unit="mg/dL" species={species} step="0.1" />
          </div>
        </CardContent>
      </Card>

      {/* Protein Studies */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="flex items-center text-lg">
            <Dna className="text-medical-blue mr-2 h-5 w-5" />
            Protein Studies
          </CardTitle>
          <p className="text-sm text-medical-gray mt-1">Protein levels and ratios</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TestField form={form} testKey="totalProtein" label="Total Protein" unit="g/dL" species={species} step="0.1" />
            <TestField form={form} testKey="albumin" label="Albumin" unit="g/dL" species={species} step="0.1" />
            <TestField form={form} testKey="globulin" label="Globulin" unit="g/dL" species={species} step="0.1" />
          </div>
        </CardContent>
      </Card>

      {/* Metabolism & Enzymes */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="flex items-center text-lg">
            <Activity className="text-medical-blue mr-2 h-5 w-5" />
            Metabolism & Enzymes
          </CardTitle>
          <p className="text-sm text-medical-gray mt-1">Metabolic markers and enzyme levels</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TestField form={form} testKey="glucose" label="Glucose" unit="mg/dL" species={species} />
            <TestField form={form} testKey="cholesterol" label="Cholesterol" unit="mg/dL" species={species} />
            <TestField form={form} testKey="amylase" label="Amylase" unit="U/L" species={species} />
            <TestField form={form} testKey="lipase" label="Lipase" unit="U/L" species={species} />
          </div>
        </CardContent>
      </Card>

      {/* Clinical Notes Panel */}
      <Card>
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center">
              <FileText className="text-medical-blue mr-2 h-5 w-5" />
              Clinical Notes
            </div>
            <FormField
              control={form.control}
              name="clinicalNotesEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal cursor-pointer">
                    Enable Clinical Notes
                  </FormLabel>
                </FormItem>
              )}
            />
          </CardTitle>
          <p className="text-sm text-medical-gray mt-1">Additional veterinarian observations and comments (optional)</p>
        </CardHeader>
        <CardContent className="p-6">
          {form.watch("clinicalNotesEnabled") && (
            <FormField
              control={form.control}
              name="clinicalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      rows={6}
                      placeholder="Enter clinical observations, differential diagnoses, recommendations for follow-up testing, treatment notes, or other relevant clinical information..."
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-medical-gray">
                      Character count: {field.value?.length || 0}/2000
                    </span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {!form.watch("clinicalNotesEnabled") && (
            <div className="text-sm text-medical-gray italic">
              Clinical notes are disabled. Enable the checkbox above to add clinical observations.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
