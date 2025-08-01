import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  progress: number;
  abnormalCount: number;
}

export function ProgressIndicator({ progress, abnormalCount }: ProgressIndicatorProps) {
  const sections = [
    { name: "Patient Info", completed: progress >= 20 },
    { name: "Lab Results", completed: progress >= 40 },
    { name: "Hepatic Panel", completed: progress >= 60 },
    { name: "Renal Panel", completed: progress >= 80 },
    { name: "Clinical Notes", completed: progress >= 90 },
    { name: "Review", completed: progress >= 100 }
  ];

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Report Progress</h2>
          <span className="text-sm text-medical-gray">
            {sections.filter(s => s.completed).length} of {sections.length} sections completed
          </span>
        </div>
        
        <Progress value={progress} className="w-full h-2 mb-2" />
        
        <div className="flex justify-between mt-2 text-xs text-medical-gray">
          {sections.map((section, index) => (
            <span key={index} className={section.completed ? "text-success-green" : ""}>
              {section.name} {section.completed && "✓"}
            </span>
          ))}
        </div>
        
        {abnormalCount > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center text-warning-yellow">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              <span className="text-sm font-medium">
                {abnormalCount} abnormal values detected
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
