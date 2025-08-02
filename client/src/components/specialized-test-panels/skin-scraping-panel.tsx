import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scissors } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface SkinScrapingPanelProps {
  form: UseFormReturn<any>;
}

export function SkinScrapingPanel({ form }: SkinScrapingPanelProps) {
  const testResults = form.watch("testResults") || {};
  const secondaryInfections = testResults.secondaryInfections || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-500 text-white rounded-lg">
              <Scissors className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Skin Scraping Examination</CardTitle>
              <CardDescription>Analysis for mites, fungi, and secondary infections</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Scraping Site */}
            <FormField
              control={form.control}
              name="testResults.scrapingSite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scraping Site</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Left ear margin, Elbow lesion"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Scraping Depth */}
            <FormField
              control={form.control}
              name="testResults.scrapingDepth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scraping Depth</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select depth" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Superficial">Superficial</SelectItem>
                      <SelectItem value="Deep">Deep (until capillary bleeding)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Mites Detected */}
          <FormField
            control={form.control}
            name="testResults.mitesDetected"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mites Detected</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mite findings" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="None">None detected</SelectItem>
                    <SelectItem value="Demodex">Demodex spp.</SelectItem>
                    <SelectItem value="Sarcoptes">Sarcoptes scabiei</SelectItem>
                    <SelectItem value="Cheyletiella">Cheyletiella spp.</SelectItem>
                    <SelectItem value="Other">Other mites</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Fungal Elements */}
          <FormField
            control={form.control}
            name="testResults.fungalElements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fungal Elements</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fungal findings" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="None">None detected</SelectItem>
                    <SelectItem value="Dermatophytes">Dermatophytes</SelectItem>
                    <SelectItem value="Spores">Fungal spores</SelectItem>
                    <SelectItem value="Hyphae">Fungal hyphae</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Secondary Infections */}
          <FormField
            control={form.control}
            name="testResults.secondaryInfections"
            render={() => (
              <FormItem>
                <FormLabel>Secondary Infections</FormLabel>
                <div className="grid grid-cols-2 gap-3">
                  {["Bacterial", "Yeast"].map((infection) => (
                    <FormField
                      key={infection}
                      control={form.control}
                      name="testResults.secondaryInfections"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={infection}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(infection)}
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  return checked
                                    ? field.onChange([...currentValue, infection])
                                    : field.onChange(
                                        currentValue?.filter((value: string) => value !== infection)
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {infection} infection
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

          {/* Diagnostic Information */}
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Badge variant="outline">Diagnostic Guidelines</Badge>
            </h4>
            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
              <div><strong>Demodex:</strong> Deep scraping required, normal in small numbers</div>
              <div><strong>Sarcoptes:</strong> Highly contagious, may be difficult to find</div>
              <div><strong>Cheyletiella:</strong> "Walking dandruff", superficial scraping</div>
              <div><strong>Deep scraping:</strong> Until capillary bleeding occurs</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}