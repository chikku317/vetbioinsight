import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ear } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface EarSwabPanelProps {
  form: UseFormReturn<any>;
}

export function EarSwabPanel({ form }: EarSwabPanelProps) {
  const testResults = form.watch("testResults") || {};
  const inflammatoryCells = testResults.inflammatoryCells || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-yellow-500 text-white rounded-lg">
              <Ear className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Ear Swab Examination</CardTitle>
              <CardDescription>Comprehensive ear discharge analysis</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Ear Side */}
            <FormField
              control={form.control}
              name="testResults.earSide"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ear Side</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select side" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Left">Left</SelectItem>
                      <SelectItem value="Right">Right</SelectItem>
                      <SelectItem value="Both">Both ears</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sample Type */}
            <FormField
              control={form.control}
              name="testResults.sampleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sample Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Ear discharge">Ear discharge</SelectItem>
                      <SelectItem value="Wax">Ear wax</SelectItem>
                      <SelectItem value="Debris">Debris</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Odor */}
            <FormField
              control={form.control}
              name="testResults.odor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Odor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select odor intensity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Mild">Mild</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Strong">Strong</SelectItem>
                      <SelectItem value="Foul">Foul</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Color/Consistency */}
          <FormField
            control={form.control}
            name="testResults.colorConsistency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color & Consistency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select appearance" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Clear">Clear</SelectItem>
                    <SelectItem value="Yellow">Yellow</SelectItem>
                    <SelectItem value="Brown">Brown</SelectItem>
                    <SelectItem value="Black">Black</SelectItem>
                    <SelectItem value="Purulent">Purulent</SelectItem>
                    <SelectItem value="Waxy">Waxy</SelectItem>
                    <SelectItem value="Dry">Dry</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <SelectValue placeholder="Select bacterial findings" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="None detected">None detected</SelectItem>
                      <SelectItem value="Cocci (Gram+)">Cocci (Gram+)</SelectItem>
                      <SelectItem value="Bacilli (Gram+)">Bacilli (Gram+)</SelectItem>
                      <SelectItem value="Gram- bacteria">Gram- bacteria</SelectItem>
                      <SelectItem value="Mixed">Mixed bacteria</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Yeast/Fungi */}
            <FormField
              control={form.control}
              name="testResults.yeastFungi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yeast/Fungi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fungal findings" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="None detected">None detected</SelectItem>
                      <SelectItem value="Malassezia">Malassezia spp.</SelectItem>
                      <SelectItem value="Candida">Candida spp.</SelectItem>
                      <SelectItem value="Other yeast">Other yeast</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Parasites */}
            <FormField
              control={form.control}
              name="testResults.parasites"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parasites</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parasite findings" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="None detected">None detected</SelectItem>
                      <SelectItem value="Ear mites (Otodectes)">Ear mites (Otodectes)</SelectItem>
                      <SelectItem value="Other mites">Other mites</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Inflammatory Cells */}
          <FormField
            control={form.control}
            name="testResults.inflammatoryCells"
            render={() => (
              <FormItem>
                <FormLabel>Inflammatory Cells Present</FormLabel>
                <div className="grid grid-cols-2 gap-3">
                  {["Neutrophils", "Macrophages", "Eosinophils", "Lymphocytes"].map((cellType) => (
                    <FormField
                      key={cellType}
                      control={form.control}
                      name="testResults.inflammatoryCells"
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

          {/* Epithelial Cells */}
          <FormField
            control={form.control}
            name="testResults.epithelialCells"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Epithelial Cells</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select amount" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Few">Few</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Many">Many</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Clinical Guidelines */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Badge variant="outline">Clinical Guidelines</Badge>
            </h4>
            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
              <div><strong>Malassezia:</strong> Most common yeast in canine otitis externa</div>
              <div><strong>Gram+ cocci:</strong> Often Staphylococcus or Streptococcus</div>
              <div><strong>Otodectes mites:</strong> Highly contagious between pets</div>
              <div><strong>Purulent discharge:</strong> Indicates secondary bacterial infection</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}