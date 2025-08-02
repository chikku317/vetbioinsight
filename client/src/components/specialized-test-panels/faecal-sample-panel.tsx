import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface FaecalSamplePanelProps {
  form: UseFormReturn<any>;
}

export function FaecalSamplePanel({ form }: FaecalSamplePanelProps) {
  const testResults = form.watch("testResults") || {};
  const parasiteEggs = testResults.parasiteEggs || [];
  const parasiteProtozoa = testResults.parasiteProtozoa || [];
  const bloodMucus = testResults.bloodMucus || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-500 text-white rounded-lg">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-lg">Faecal Sample Examination</CardTitle>
              <CardDescription>Complete parasitological and microbiological analysis</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sample Consistency */}
            <FormField
              control={form.control}
              name="testResults.sampleConsistency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sample Consistency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select consistency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Formed">Formed</SelectItem>
                      <SelectItem value="Soft">Soft</SelectItem>
                      <SelectItem value="Loose">Loose</SelectItem>
                      <SelectItem value="Watery">Watery</SelectItem>
                      <SelectItem value="Mucoid">Mucoid</SelectItem>
                      <SelectItem value="Bloody">Bloody</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sample Color */}
            <FormField
              control={form.control}
              name="testResults.sampleColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sample Color</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Brown">Brown</SelectItem>
                      <SelectItem value="Yellow">Yellow</SelectItem>
                      <SelectItem value="Green">Green</SelectItem>
                      <SelectItem value="Black">Black</SelectItem>
                      <SelectItem value="Red-tinged">Red-tinged</SelectItem>
                      <SelectItem value="Clay-colored">Clay-colored</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Parasite Eggs */}
          <FormField
            control={form.control}
            name="testResults.parasiteEggs"
            render={() => (
              <FormItem>
                <FormLabel>Parasite Eggs/Segments</FormLabel>
                <div className="grid grid-cols-2 gap-3">
                  {["None detected", "Roundworm", "Hookworm", "Whipworm", "Tapeworm segments"].map((parasite) => (
                    <FormField
                      key={parasite}
                      control={form.control}
                      name="testResults.parasiteEggs"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={parasite}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(parasite)}
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  return checked
                                    ? field.onChange([...currentValue, parasite])
                                    : field.onChange(
                                        currentValue?.filter((value: string) => value !== parasite)
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {parasite}
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

          {/* Parasite Protozoa */}
          <FormField
            control={form.control}
            name="testResults.parasiteProtozoa"
            render={() => (
              <FormItem>
                <FormLabel>Protozoan Parasites</FormLabel>
                <div className="grid grid-cols-2 gap-3">
                  {["None detected", "Giardia cysts", "Coccidia oocysts", "Other"].map((protozoa) => (
                    <FormField
                      key={protozoa}
                      control={form.control}
                      name="testResults.parasiteProtozoa"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={protozoa}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(protozoa)}
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  return checked
                                    ? field.onChange([...currentValue, protozoa])
                                    : field.onChange(
                                        currentValue?.filter((value: string) => value !== protozoa)
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {protozoa}
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
            {/* Parasite Load */}
            <FormField
              control={form.control}
              name="testResults.parasiteLoad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parasite Load</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select load intensity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Light (+)">Light (+)</SelectItem>
                      <SelectItem value="Moderate (++)">Moderate (++)</SelectItem>
                      <SelectItem value="Heavy (+++)">Heavy (+++)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bacteria */}
            <FormField
              control={form.control}
              name="testResults.bacteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bacterial Assessment</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bacterial findings" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Normal flora">Normal flora</SelectItem>
                      <SelectItem value="Overgrowth">Bacterial overgrowth</SelectItem>
                      <SelectItem value="Pathogenic bacteria suspected">Pathogenic bacteria suspected</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Blood/Mucus */}
          <FormField
            control={form.control}
            name="testResults.bloodMucus"
            render={() => (
              <FormItem>
                <FormLabel>Blood/Mucus</FormLabel>
                <div className="grid grid-cols-2 gap-3">
                  {["None", "Occult blood", "Visible blood", "Mucus present"].map((finding) => (
                    <FormField
                      key={finding}
                      control={form.control}
                      name="testResults.bloodMucus"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={finding}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(finding)}
                                onCheckedChange={(checked) => {
                                  const currentValue = field.value || [];
                                  return checked
                                    ? field.onChange([...currentValue, finding])
                                    : field.onChange(
                                        currentValue?.filter((value: string) => value !== finding)
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {finding}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Undigested Food */}
            <FormField
              control={form.control}
              name="testResults.undigestedFood"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Undigested Food</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select amount" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Minimal">Minimal</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Excessive">Excessive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fat Globules */}
            <FormField
              control={form.control}
              name="testResults.fatGlobules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fat Globules</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select amount" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Few">Few</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Many">Many</SelectItem>
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
                        <SelectValue placeholder="Select findings" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="None detected">None detected</SelectItem>
                      <SelectItem value="Present">Present</SelectItem>
                      <SelectItem value="Overgrowth">Overgrowth</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Clinical Significance */}
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Badge variant="outline">Clinical Significance</Badge>
            </h4>
            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
              <div><strong>Giardia:</strong> Common cause of diarrhea, zoonotic</div>
              <div><strong>Coccidia:</strong> More common in young animals</div>
              <div><strong>Heavy parasite load:</strong> Clinical significance higher</div>
              <div><strong>Blood/mucus:</strong> Indicates colitis or lower GI irritation</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}