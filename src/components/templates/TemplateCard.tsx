"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Lock, Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Template } from "@/lib/templates";
import { cn } from "@/lib/utils";
import usePremiumModal from "@/hooks/usePremiumModal";

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  isLocked: boolean;
  onSelect: () => void;
}

export default function TemplateCard({
  template,
  isSelected,
  isLocked,
  onSelect,
}: TemplateCardProps) {
  const premiumModal = usePremiumModal();

  const handleSelect = () => {
    if (isLocked) {
      premiumModal.setOpen(true);
      return;
    }
    onSelect();
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect();
    }
  };

  const tierColors: Record<Template["tier"], string> = {
    free: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200",
    pro: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/40 dark:text-blue-200",
    pro_plus:
      "border-purple-200 bg-purple-50 text-purple-900 dark:border-purple-900/40 dark:bg-purple-950/40 dark:text-purple-200",
  };

  const tierLabels: Record<Template["tier"], string> = {
    free: "Free",
    pro: "Pro",
    pro_plus: "Pro Plus",
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-disabled={isLocked}
      aria-label={`Select template ${template.name}${isLocked ? " (locked)" : ""}`}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      className={cn(
        // Layout + motion
        "group relative cursor-pointer overflow-hidden transition-all",
        "hover:-translate-y-0.5 hover:shadow-xl",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",

        // Selected state
        isSelected && "shadow-lg ring-2 ring-primary",

        // Locked
        isLocked && "opacity-90",
      )}
    >
      {/* Preview */}
      <div className="relative aspect-[210/297] overflow-hidden bg-muted">
        <Image
          src={template.preview}
          alt={template.name}
          fill
          className={cn(
            "object-cover transition-transform duration-300",
            "group-hover:scale-[1.03]",
            isLocked && "scale-100",
          )}
          // Prefer optimized if these are local static assets
          // If template.preview is remote, configure next.config images domains
          unoptimized
        />

        {/* Subtle top gradient for readability */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/35 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

        {/* Locked overlay (more premium, less harsh) */}
        {isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/55 px-6 text-center backdrop-blur-[2px]">
            <div className="rounded-full bg-white/10 p-3 ring-1 ring-white/20">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-base font-semibold text-white">
                Premium template
              </p>
              <p className="mt-0.5 text-sm text-white/85">Upgrade to unlock</p>
            </div>

            <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/20">
              View plans <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        )}

        {/* Selected check */}
        {isSelected && !isLocked && (
          <div className="absolute right-3 top-3 rounded-full bg-primary p-2 shadow-lg">
            <Check className="h-5 w-5 text-primary-foreground" />
          </div>
        )}

        {/* Tier badge */}
        <div className="absolute left-3 top-3">
          <Badge
            variant="secondary"
            className={cn("border font-semibold", tierColors[template.tier])}
          >
            {template.tier !== "free" && <Sparkles className="mr-1 h-3 w-3" />}
            {tierLabels[template.tier]}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-6 sm:text-lg">
            {template.name}
          </CardTitle>

          <Badge variant="outline" className="text-xs capitalize">
            {template.layout.replace("-", " ")}
          </Badge>
        </div>

        <CardDescription className="line-clamp-2 text-sm">
          {template.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Features */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Features
          </p>
          <ul className="space-y-1 text-xs">
            {template.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended */}
        {template.recommended.length > 0 && (
          <div className="mt-3 border-t pt-3">
            <p className="mb-1 text-xs font-semibold text-muted-foreground">
              Best for:
            </p>
            <div className="flex flex-wrap gap-1">
              {template.recommended.slice(0, 2).map((rec, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {rec}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Micro CTA row (only when not locked) */}
        {!isLocked && (
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>{isSelected ? "Selected" : "Click to select"}</span>
            <span className="opacity-0 transition-opacity group-hover:opacity-100">
              Use template <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}