import { UseFormReturn } from "react-hook-form";
import { TestResultPanel } from "@/components/test-result-panel";
import { BloodSmearPanel } from "@/components/specialized-test-panels/blood-smear-panel";
import { WetFilmPanel } from "@/components/specialized-test-panels/wet-film-panel";
import { SkinScrapingPanel } from "@/components/specialized-test-panels/skin-scraping-panel";
import { ImpressionSmearPanel } from "@/components/specialized-test-panels/impression-smear-panel";
import { EarSwabPanel } from "@/components/specialized-test-panels/ear-swab-panel";
import { FaecalSamplePanel } from "@/components/specialized-test-panels/faecal-sample-panel";
import { ProgesteronePanel } from "@/components/specialized-test-panels/progesterone-panel";
import { REPORT_TYPES, ReportType } from "@shared/schema";

interface TestResultPanelRouterProps {
  reportType: ReportType;
  form: UseFormReturn<any>;
}

export function TestResultPanelRouter({ reportType, form }: TestResultPanelRouterProps) {
  switch (reportType) {
    case REPORT_TYPES.BIOCHEMISTRY:
      return <TestResultPanel form={form} />;
    case REPORT_TYPES.BLOOD_SMEAR:
      return <BloodSmearPanel form={form} />;
    case REPORT_TYPES.WET_FILM:
      return <WetFilmPanel form={form} />;
    case REPORT_TYPES.SKIN_SCRAPING:
      return <SkinScrapingPanel form={form} />;
    case REPORT_TYPES.IMPRESSION_SMEAR:
      return <ImpressionSmearPanel form={form} />;
    case REPORT_TYPES.EAR_SWAB:
      return <EarSwabPanel form={form} />;
    case REPORT_TYPES.FAECAL_SAMPLE:
      return <FaecalSamplePanel form={form} />;
    case REPORT_TYPES.PROGESTERONE:
      return <ProgesteronePanel form={form} />;
    default:
      return <TestResultPanel form={form} />;
  }
}