"use client";

import ResumePreview from "@/components/ResumePreview";
import { ResumeValues, TEMPLATE_IDS } from "@/lib/validation";
import ColorPicker from "./ColorPicker";
import BorderStyleButton from "./BorderStyleButton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutTemplate } from "lucide-react";
import { useState } from "react";
import TemplateSelector from "@/components/templates/TemplateSelector";
import { useSubscriptionLevel } from "../SubscriptionLevelProvider";

type TemplateId = (typeof TEMPLATE_IDS)[number];

interface ResumePreviewSectionProps {
  resumeData: ResumeValues;
  setResumeData: (data: ResumeValues) => void;
  className?: string;
}

export default function ResumePreviewSection({
  resumeData,
  setResumeData,
  className,
}: ResumePreviewSectionProps) {
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const subscriptionLevel = useSubscriptionLevel();

  const handleTemplateSelect = (templateId: TemplateId) => {
    setResumeData({ ...resumeData, templateId });
    setShowTemplateSelector(false);
  };

  return (
    <div
      className={cn(
        "group relative hidden w-full overflow-y-auto md:flex md:w-1/2",
        className,
      )}
    >
      <div className="absolute left-1 top-1 z-10 flex flex-none flex-col gap-3 opacity-50 transition-opacity group-hover:opacity-100 lg:left-3 lg:top-3 xl:opacity-100">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowTemplateSelector(true)}
          title="Change Template"
          className="h-10 w-10 bg-background shadow-sm"
        >
          <LayoutTemplate className="h-5 w-5" />
        </Button>
        <ColorPicker
          color={resumeData.colorHex}
          onChange={(color) =>
            setResumeData({ ...resumeData, colorHex: color.hex })
          }
        />
        <BorderStyleButton
          borderStyle={resumeData.borderStyle}
          onChange={(borderStyle) =>
            setResumeData({ ...resumeData, borderStyle })
          }
        />
      </div>
      <div className="flex w-full justify-center bg-secondary p-3">
        <ResumePreview
          resumeData={resumeData}
          className="max-w-2xl shadow-md"
        />
      </div>

      <TemplateSelector
        open={showTemplateSelector}
        onOpenChange={setShowTemplateSelector}
        currentTemplate={resumeData.templateId || "classic"}
        onSelectTemplate={handleTemplateSelect}
        subscriptionLevel={subscriptionLevel}
      />
    </div>
  );
}