import { ResumeValues } from "@/lib/validation";
import { getTemplateById, DEFAULT_TEMPLATE_ID } from "@/lib/templates";
import ClassicTemplate from "./classic/ClassicTemplate";
import ModernTemplate from "./modern/ModernTemplate";
import MinimalTemplate from "./minimal/MinimalTemplate";
import CreativeTemplate from "./creative/CreativeTemplate";
import ProfessionalTemplate from "./professional/ProfessionalTemplate";
import CompactTemplate from "./compact/CompactTemplate";
import ElegantTemplate from "./elegant/ElegantTemplate";
import TechTemplate from "./tech/TechTemplate";

interface TemplatePreviewProps {
  resumeData: ResumeValues;
  contentRef?: React.RefObject<HTMLDivElement>;
  className?: string;
}

export default function TemplatePreview({
  resumeData,
  contentRef,
  className,
}: TemplatePreviewProps) {
  const templateId = resumeData.templateId || DEFAULT_TEMPLATE_ID;
  const template = getTemplateById(templateId);

  // Map template IDs to components
  const TemplateComponent =
    {
      classic: ClassicTemplate,
      modern: ModernTemplate,
      minimal: MinimalTemplate,
      creative: CreativeTemplate,
      professional: ProfessionalTemplate,
      compact: CompactTemplate,
      elegant: ElegantTemplate,
      tech: TechTemplate,
    }[templateId] || ClassicTemplate;

  return (
    <TemplateComponent
      resumeData={resumeData}
      contentRef={contentRef}
      className={className}
      templateStyle={template?.style}
    />
  );
}