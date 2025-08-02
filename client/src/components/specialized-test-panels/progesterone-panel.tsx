import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

          {/* Advice Selection */}
          <FormField
            control={form.control}
            name="advice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Advice</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recommendation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Proceed">Proceed</SelectItem>
                    <SelectItem value="Retest">Retest</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Doctor Notes */}
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doctor Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter any miscellaneous notes..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Reference Range Table */}
          <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Badge variant="outline">Reference Range for Dogs</Badge>
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2 px-3">Progesterone Level</th>
                    <th className="text-left py-2 px-3">Breeding Status</th>
                    <th className="text-left py-2 px-3">Recommendation</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-300">
                  <tr className="border-b">
                    <td className="py-2 px-3">&lt; 2.0 ng/mL</td>
                    <td className="py-2 px-3">Pre-LH surge</td>
                    <td className="py-2 px-3">Continue testing</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3">2.0-5.0 ng/mL</td>
                    <td className="py-2 px-3">LH surge occurring</td>
                    <td className="py-2 px-3">Breed in 24-48h</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3">5.0-8.0 ng/mL</td>
                    <td className="py-2 px-3">Optimal breeding window</td>
                    <td className="py-2 px-3">Proceed with breeding</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">&gt; 8.0 ng/mL</td>
                    <td className="py-2 px-3">Post-ovulation</td>
                    <td className="py-2 px-3">Window may be closing</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}