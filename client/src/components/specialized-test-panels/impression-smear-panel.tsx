import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface ImpressionSmearPanelProps {
  form: UseFormReturn<any>;
}

export function ImpressionSmearPanel({ form }: ImpressionSmearPanelProps) {
  const testResults = form.watch("testResults") || {};
  const cellTypesObserved = testResults.cellTypesObserved || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-500 text-white rounded-lg">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Impression Smear Examination</CardTitle>
              <CardDescription>Cytological examination of lesions and discharge</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sample Source */}
          <FormField
            control={form.control}
            name="testResults.sampleSource"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sample Source</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g., Wound discharge, Mass aspirate, Skin lesion"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cell Types Observed */}
          <FormField
            control={form.control}
            name="testResults.cellTypesObserved"
            render={() => (
              <FormItem>
                <FormLabel>Cell Types Observed</FormLabel>
                <div className="grid grid-cols-2 gap-3">
                  {["Neutrophils", "Macrophages", "Lymphocytes", "Plasma cells", "Other"].map((cellType) => (
                    <FormField
                      key={cellType}
                      control={form.control}
                      name="testResults.cellTypesObserved"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={cellType}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(cellType)}
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  return checked
                                    ? field.onChange([...currentValue, cellType])
                                    : field.onChange(
                                        currentValue?.filter((value: string) => value !== cellType)
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {cellType}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bacteria Present */}
            <FormField
              control={form.control}
              name="testResults.bacteriaPresent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bacteria Present</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bacterial location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Intracellular">Intracellular</SelectItem>
                      <SelectItem value="Extracellular">Extracellular</SelectItem>
                      <SelectItem value="Mixed">Mixed (intra & extracellular)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Malignant Cells */}
            <FormField
              control={form.control}
              name="testResults.malignantCells"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Malignant Cells</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select malignancy status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Not detected">Not detected</SelectItem>
                      <SelectItem value="Suspected">Suspected</SelectItem>
                      <SelectItem value="Present">Present</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Inflammatory Pattern */}
          <FormField
            control={form.control}
            name="testResults.inflammatoryPattern"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inflammatory Pattern</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select inflammatory pattern" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Acute">Acute inflammation</SelectItem>
                    <SelectItem value="Chronic">Chronic inflammation</SelectItem>
                    <SelectItem value="Granulomatous">Granulomatous inflammation</SelectItem>
                    <SelectItem value="Mixed">Mixed pattern</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Diagnostic Guidelines */}
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Badge variant="outline">Interpretation Guidelines</Badge>
            </h4>
            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
              <div><strong>Neutrophils dominant:</strong> Acute bacterial infection</div>
              <div><strong>Macrophages dominant:</strong> Chronic inflammation or foreign body</div>
              <div><strong>Intracellular bacteria:</strong> Active phagocytosis, viable organisms</div>
              <div><strong>Granulomatous:</strong> Consider mycobacterial, fungal, or foreign body</div>
              <div><strong>Atypical cells:</strong> Require histopathology for definitive diagnosis</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}