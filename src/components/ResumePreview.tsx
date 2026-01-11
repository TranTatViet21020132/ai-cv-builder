import { ResumeValues } from "@/lib/validation";
import TemplatePreview from "./templates/TemplateReview";

interface ResumePreviewProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

export default function ResumePreview({
  resumeData,
  contentRef,
  className,
}: ResumePreviewProps) {
  return (
    <TemplatePreview
      resumeData={resumeData}
      // @ts-expect-error: Suppress TypeScript error for containerRef
      contentRef={contentRef}
      className={className}
    />
  );
}
