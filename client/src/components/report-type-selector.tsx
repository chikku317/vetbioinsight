import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FlaskConical, 
  Microscope, 
  Droplets, 
  Scissors, 
  FileText, 
  Ear, 
  Pill, 
  Heart,
  ArrowRight
} from "lucide-react";
import { REPORT_TYPES, ReportType } from "@shared/schema";

interface ReportTypeSelectorProps {
  onSelectReportType: (reportType: ReportType) => void;
}

const reportTypeConfig = {
  [REPORT_TYPES.BIOCHEMISTRY]: {
    title: "Biochemistry Analyzer Report",
    description: "Comprehensive blood chemistry analysis with liver, kidney, and metabolic parameters",
    icon: FlaskConical,
    color: "bg-blue-500",
    features: ["Automated interpretation", "Species-specific ranges", "Abnormal value alerts"]
  },
  [REPORT_TYPES.BLOOD_SMEAR]: {
    title: "Blood Smear Examination",
    description: "Microscopic examination of blood cells, morphology, and parasites",
    icon: Microscope,
    color: "bg-red-500",
    features: ["Cell morphology", "Parasite detection", "Image upload"]
  },
  [REPORT_TYPES.WET_FILM]: {
    title: "Wet Film Examination",
    description: "Direct microscopic examination of fresh samples for bacteria and parasites",
    icon: Droplets,
    color: "bg-cyan-500", 
    features: ["Bacteria identification", "Parasite screening", "Cell analysis"]
  },
  [REPORT_TYPES.SKIN_SCRAPING]: {
    title: "Skin Scraping Examination",
    description: "Analysis of skin samples for mites, fungi, and secondary infections",
    icon: Scissors,
    color: "bg-orange-500",
    features: ["Mite detection", "Fungal screening", "Depth analysis"]
  },
  [REPORT_TYPES.IMPRESSION_SMEAR]: {
    title: "Impression Smear Examination", 
    description: "Cytological examination of wounds, masses, and discharge samples",
    icon: FileText,
    color: "bg-purple-500",
    features: ["Cell typing", "Malignancy screening", "Inflammation patterns"]
  },
  [REPORT_TYPES.EAR_SWAB]: {
    title: "Ear Swab Examination",
    description: "Comprehensive ear discharge analysis for otitis and parasites",
    icon: Ear,
    color: "bg-yellow-500",
    features: ["Bacteria/yeast ID", "Mite detection", "Odor assessment"]
  },
  [REPORT_TYPES.FAECAL_SAMPLE]: {
    title: "Faecal Sample Report",
    description: "Complete parasitological and microbiological examination of stool",
    icon: Pill,
    color: "bg-green-500",
    features: ["Parasite identification", "Load assessment", "Consistency analysis"]
  },
  [REPORT_TYPES.PROGESTERONE]: {
    title: "Progesterone Test Report",
    description: "Reproductive hormone analysis for breeding timing and pregnancy monitoring",
    icon: Heart,
    color: "bg-pink-500",
    features: ["Breeding advice", "Reference ranges", "Timing recommendations"]
  }
};

export function ReportTypeSelector({ onSelectReportType }: ReportTypeSelectorProps) {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Veterinary Laboratory Report Generator
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Select the type of laboratory examination report you want to generate. 
          Each report type includes specialized fields and reference ranges for accurate diagnostic analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(reportTypeConfig).map(([reportType, config]) => {
          const Icon = config.icon;
          return (
            <Card 
              key={reportType} 
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => onSelectReportType(reportType as ReportType)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${config.color} text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">{config.title}</CardTitle>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <CardDescription className="text-sm">
                  {config.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Key Features:</div>
                  <div className="flex flex-wrap gap-1">
                    {config.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button 
                  className="w-full mt-4 group-hover:bg-primary/90 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectReportType(reportType as ReportType);
                  }}
                >
                  Create Report
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg">
          <FlaskConical className="h-4 w-4" />
          <span>Professional reports with ThePetNest branding • Species-specific references • PDF export</span>
        </div>
      </div>
    </div>
  );
}