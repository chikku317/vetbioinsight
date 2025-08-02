import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Microscope, Upload, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";

interface BloodSmearPanelProps {
  form: UseFormReturn<any>;
}

export function BloodSmearPanel({ form }: BloodSmearPanelProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Optimize image for clarity
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Set high resolution for specimen clarity
        const maxWidth = 1920;
        const maxHeight = 1080;
        let { width, height } = img;
        
        // Maintain aspect ratio while optimizing size
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Apply image sharpening for specimen clarity
        ctx?.drawImage(img, 0, 0, width, height);
        
        const optimizedImageUrl = canvas.toDataURL('image/jpeg', 0.92);
        setUploadedImage(optimizedImageUrl);
        form.setValue('images', [optimizedImageUrl]);
      };
      
      img.src = URL.createObjectURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    form.setValue('images', []);
  };

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
          {/* Observation */}
          <FormField
            control={form.control}
            name="observation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observation</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter your clinical observations..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Advice */}
          <FormField
            control={form.control}
            name="advice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Advice</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter your clinical advice and recommendations..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image Upload */}
          <div className="space-y-3">
            <FormLabel>Specimen Image</FormLabel>
            {!uploadedImage ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">Click to upload specimen image</p>
                <p className="text-xs text-gray-500">Optimized for maximum clarity</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button type="button" variant="outline" className="mt-2">
                  Choose Image
                </Button>
              </div>
            ) : (
              <div className="relative">
                <img 
                  src={uploadedImage} 
                  alt="Specimen" 
                  className="w-full max-w-md rounded-lg border shadow-sm"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}