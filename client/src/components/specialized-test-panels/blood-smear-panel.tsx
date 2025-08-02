import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Microscope } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface BloodSmearPanelProps {
  form: UseFormReturn<any>;
}

export function BloodSmearPanel({ form }: BloodSmearPanelProps) {
  const testResults = form.watch("testResults") || {};

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-500 text-white rounded-lg">
              <Microscope className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Blood Smear Examination</CardTitle>
              <CardDescription>Microscopic examination of blood cell morphology and parasites</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* RBC Morphology */}
          <FormField
            control={form.control}
            name="testResults.rbcMorphology"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Red Blood Cell Morphology</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select RBC morphology" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Anisocytosis">Anisocytosis (Size variation)</SelectItem>
                    <SelectItem value="Poikilocytosis">Poikilocytosis (Shape variation)</SelectItem>
                    <SelectItem value="Polychromasia">Polychromasia (Color variation)</SelectItem>
                    <SelectItem value="Other">Other abnormalities</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* WBC Count */}
            <FormField
              control={form.control}
              name="testResults.wbcCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>White Blood Cell Count (×10³/μL)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.1"
                      placeholder="e.g., 8.5"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Platelet Count */}
            <FormField
              control={form.control}
              name="testResults.plateletCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platelet Count (×10³/μL)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="1"
                      placeholder="e.g., 350"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Parasites */}
          <FormField
            control={form.control}
            name="testResults.parasites"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood Parasites</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parasite findings" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="None detected">None detected</SelectItem>
                    <SelectItem value="Babesia">Babesia spp.</SelectItem>
                    <SelectItem value="Ehrlichia">Ehrlichia spp.</SelectItem>
                    <SelectItem value="Anaplasma">Anaplasma spp.</SelectItem>
                    <SelectItem value="Other">Other parasites</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cell Distribution */}
          <FormField
            control={form.control}
            name="testResults.cellDistribution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cell Distribution & Additional Findings</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe differential count, cell distribution patterns, or other microscopic findings..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Reference Information */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Badge variant="outline">Reference Ranges</Badge>
            </h4>
            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
              <div><strong>Dog WBC:</strong> 5.5-16.9 ×10³/μL</div>
              <div><strong>Cat WBC:</strong> 5.5-19.5 ×10³/μL</div>
              <div><strong>Dog Platelets:</strong> 175-500 ×10³/μL</div>
              <div><strong>Cat Platelets:</strong> 230-680 ×10³/μL</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}