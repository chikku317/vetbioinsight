import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface ProgesteronePanelProps {
  form: UseFormReturn<any>;
}

export function ProgesteronePanel({ form }: ProgesteronePanelProps) {
  const testResults = form.watch("testResults") || {};
  const progesteroneLevel = testResults.progesteroneLevel;

  const getBreedingInterpretation = (level: number) => {
    if (!level) return null;
    if (level < 2) return { status: "Pre-LH surge", color: "bg-blue-100 text-blue-800" };
    if (level >= 2 && level < 5) return { status: "LH surge occurring", color: "bg-yellow-100 text-yellow-800" };
    if (level >= 5 && level < 8) return { status: "Optimal breeding time", color: "bg-green-100 text-green-800" };
    if (level >= 8) return { status: "Post-ovulation", color: "bg-red-100 text-red-800" };
    return null;
  };

  const interpretation = progesteroneLevel ? getBreedingInterpretation(progesteroneLevel) : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-pink-500 text-white rounded-lg">
              <Heart className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Progesterone Test</CardTitle>
              <CardDescription>Reproductive hormone analysis for breeding timing</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progesterone Level */}
          <FormField
            control={form.control}
            name="testResults.progesteroneLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Progesterone Level (ng/mL)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.1"
                    placeholder="e.g., 2.5"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Automatic Interpretation */}
          {interpretation && (
            <div className={`p-3 rounded-lg ${interpretation.color}`}>
              <div className="font-medium text-sm">Breeding Status: {interpretation.status}</div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Testing Method */}
            <FormField
              control={form.control}
              name="testResults.testingMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Testing Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ELISA">ELISA</SelectItem>
                      <SelectItem value="Chemiluminescence">Chemiluminescence</SelectItem>
                      <SelectItem value="RIA">Radioimmunoassay (RIA)</SelectItem>
                      <SelectItem value="Other">Other method</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sample Quality */}
            <FormField
              control={form.control}
              name="testResults.sampleQuality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sample Quality</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select quality" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Adequate">Adequate</SelectItem>
                      <SelectItem value="Suboptimal">Suboptimal</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Breeding Advice */}
          <FormField
            control={form.control}
            name="testResults.breedingAdvice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breeding Recommendation</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recommendation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Proceed">Proceed with breeding</SelectItem>
                    <SelectItem value="Retest">Retest in 24-48 hours</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Reference Ranges */}
          <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Badge variant="outline">Breeding Timeline</Badge>
            </h4>
            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
              <div><strong>&lt; 2.0 ng/mL:</strong> Pre-LH surge (continue testing)</div>
              <div><strong>2.0-5.0 ng/mL:</strong> LH surge occurring (breed in 24-48h)</div>
              <div><strong>5.0-8.0 ng/mL:</strong> Optimal breeding window</div>
              <div><strong>&gt; 8.0 ng/mL:</strong> Post-ovulation (breeding window may be closing)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}