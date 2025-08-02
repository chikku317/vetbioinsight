import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface WetFilmPanelProps {
  form: UseFormReturn<any>;
}

export function WetFilmPanel({ form }: WetFilmPanelProps) {
  const testResults = form.watch("testResults") || {};
  const cellsPresent = testResults.cellsPresent || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-500 text-white rounded-lg">
              <Droplets className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Wet Film Examination</CardTitle>
              <CardDescription>Direct microscopic examination of fresh samples</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
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
                      <SelectValue placeholder="Select sample type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Urine">Urine</SelectItem>
                    <SelectItem value="Vaginal discharge">Vaginal discharge</SelectItem>
                    <SelectItem value="Ear discharge">Ear discharge</SelectItem>
                    <SelectItem value="Other">Other fluid</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bacteria */}
            <FormField
              control={form.control}
              name="testResults.bacteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bacteria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bacterial findings" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="None">None detected</SelectItem>
                      <SelectItem value="Cocci">Cocci</SelectItem>
                      <SelectItem value="Bacilli">Bacilli</SelectItem>
                      <SelectItem value="Mixed">Mixed bacteria</SelectItem>
                      <SelectItem value="Other">Other morphology</SelectItem>
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
                      <SelectItem value="Candida">Candida spp.</SelectItem>
                      <SelectItem value="Malassezia">Malassezia spp.</SelectItem>
                      <SelectItem value="Other">Other fungi</SelectItem>
                    </SelectContent>
                  </Select>
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
                <FormLabel>Parasites</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parasite findings" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="None detected">None detected</SelectItem>
                    <SelectItem value="Trichomonas">Trichomonas spp.</SelectItem>
                    <SelectItem value="Other">Other parasites</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cells Present */}
          <FormField
            control={form.control}
            name="testResults.cellsPresent"
            render={() => (
              <FormItem>
                <FormLabel>Cells Present</FormLabel>
                <div className="grid grid-cols-2 gap-3">
                  {["Epithelial cells", "WBCs", "RBCs", "Other"].map((cell) => (
                    <FormField
                      key={cell}
                      control={form.control}
                      name="testResults.cellsPresent"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={cell}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(cell)}
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  return checked
                                    ? field.onChange([...currentValue, cell])
                                    : field.onChange(
                                        currentValue?.filter((value: string) => value !== cell)
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {cell}
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

          {/* Clinical Significance */}
          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Badge variant="outline">Clinical Significance</Badge>
            </h4>
            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
              <div><strong>Bacteria:</strong> Indicates bacterial infection or contamination</div>
              <div><strong>Yeast:</strong> Common in otitis externa, skin infections</div>
              <div><strong>WBCs:</strong> Inflammatory response present</div>
              <div><strong>Trichomonas:</strong> Sexually transmitted parasite</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}