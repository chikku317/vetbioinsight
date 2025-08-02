import { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MobileOptimizedFormProps {
  children: ReactNode;
  className?: string;
}

export function MobileOptimizedForm({ children, className }: MobileOptimizedFormProps) {
  return (
    <Card className={cn(
      "w-full",
      // Mobile-first responsive design
      "mx-auto",
      "touch-manipulation", // Optimizes touch events
      "select-none", // Prevents accidental text selection on mobile
      className
    )}>
      <CardContent className="p-4 sm:p-6">
        <div className={cn(
          "space-y-4 sm:space-y-6",
          // Touch-friendly spacing and sizing
          "[&_input]:text-base [&_input]:min-h-[44px]", // Prevents zoom on iOS
          "[&_select]:text-base [&_select]:min-h-[44px]",
          "[&_textarea]:text-base [&_textarea]:min-h-[88px]",
          "[&_button]:min-h-[44px] [&_button]:min-w-[44px]",
          // Better touch targets
          "[&_label]:text-sm [&_label]:font-medium [&_label]:mb-2 [&_label]:block",
          "[&_.form-item]:space-y-2"
        )}>
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

interface MobileActionButtonsProps {
  children: ReactNode;
  className?: string;
}

export function MobileActionButtons({ children, className }: MobileActionButtonsProps) {
  return (
    <div className={cn(
      // Stack buttons vertically on mobile, horizontal on larger screens  
      "flex flex-col sm:flex-row",
      "gap-3 sm:gap-4",
      "w-full sm:w-auto",
      // All buttons full width on mobile
      "[&_button]:w-full sm:[&_button]:w-auto",
      // Consistent button sizing
      "[&_button]:min-h-[48px] [&_button]:text-base",
      // Touch-friendly spacing
      "mt-6 sm:mt-4",
      className
    )}>
      {children}
    </div>
  );
}