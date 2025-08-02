import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type RiskLevel = "normal" | "borderline" | "critical";

interface RiskAssessmentBadgeProps {
  level: RiskLevel;
  className?: string;
  showIcon?: boolean;
}

export function RiskAssessmentBadge({ level, className, showIcon = true }: RiskAssessmentBadgeProps) {
  const config = {
    normal: {
      label: "Normal",
      icon: CheckCircle,
      className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800",
    },
    borderline: {
      label: "Borderline", 
      icon: AlertCircle,
      className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-800",
    },
    critical: {
      label: "Critical",
      icon: AlertTriangle,
      className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-800",
    },
  };

  const { label, icon: Icon, className: badgeClassName } = config[level];

  return (
    <Badge 
      variant="outline" 
      className={cn(badgeClassName, className)}
    >
      {showIcon && <Icon className="h-3 w-3 mr-1" />}
      {label}
    </Badge>
  );
}

export function getRiskLevel(value: number, referenceRange: { min?: number; max?: number; critical?: { min?: number; max?: number } }): RiskLevel {
  const { min, max, critical } = referenceRange;
  
  // Check critical ranges first
  if (critical) {
    if ((critical.min !== undefined && value < critical.min) || 
        (critical.max !== undefined && value > critical.max)) {
      return "critical";
    }
  }
  
  // Check normal ranges
  if ((min !== undefined && value < min) || (max !== undefined && value > max)) {
    // If not in critical range but outside normal, it's borderline
    return "borderline";
  }
  
  return "normal";
}

export function getRiskAssessment(level: RiskLevel): {
  color: string;
  bgColor: string;
  description: string;
  priority: number;
} {
  const assessments = {
    normal: {
      color: "text-green-700 dark:text-green-300",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      description: "Within normal range",
      priority: 1,
    },
    borderline: {
      color: "text-yellow-700 dark:text-yellow-300",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20", 
      description: "Requires monitoring",
      priority: 2,
    },
    critical: {
      color: "text-red-700 dark:text-red-300",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      description: "Immediate attention required",
      priority: 3,
    },
  };
  
  return assessments[level];
}