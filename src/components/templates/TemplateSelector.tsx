/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllTemplates, canAccessTemplate } from "@/lib/templates";
import { SubscriptionLevel } from "@/lib/types";
import { TEMPLATE_IDS } from "@/lib/validation";
import TemplateCard from "./TemplateCard";

type TemplateId = (typeof TEMPLATE_IDS)[number];
type Filter = "all" | "available" | "locked";

interface TemplateSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTemplate: string;
  onSelectTemplate: (templateId: TemplateId) => void;
  subscriptionLevel: SubscriptionLevel;
}

export default function TemplateSelector({
  open,
  onOpenChange,
  currentTemplate,
  onSelectTemplate,
  subscriptionLevel,
}: TemplateSelectorProps) {
  const templates = getAllTemplates();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      // focus search on open for a premium feel
      setTimeout(() => searchRef.current?.focus(), 50);
    } else {
      setQuery("");
      setFilter("all");
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return templates
      .map((t) => ({
        ...t,
        locked: !canAccessTemplate(t.id, subscriptionLevel),
      }))
      .filter((t) => {
        if (filter === "available" && t.locked) return false;
        if (filter === "locked" && !t.locked) return false;
        if (!q) return true;

        // match by id + (optional) name if your template object has it
        const haystack = `${t.id} ${(t as any).name ?? ""}`.toLowerCase();
        return haystack.includes(q);
      });
  }, [templates, query, filter, subscriptionLevel]);

  const availableCount = useMemo(
    () =>
      templates.filter((t) => canAccessTemplate(t.id, subscriptionLevel))
        .length,
    [templates, subscriptionLevel],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl p-0">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
          <DialogHeader className="px-6 py-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <DialogTitle className="text-2xl">
                  Choose a template
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Pick a layoutâ€”locked templates require an upgrade.
                </DialogDescription>
              </div>

              <Badge variant="secondary" className="w-fit">
                Available: {availableCount}/{templates.length}
              </Badge>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search templates (e.g. modern, compact)â€¦"
                className="sm:max-w-sm"
              />

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={filter === "all" ? "default" : "secondary"}
                  onClick={() => setFilter("all")}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  type="button"
                  variant={filter === "available" ? "default" : "secondary"}
                  onClick={() => setFilter("available")}
                  size="sm"
                >
                  Available
                </Button>
                <Button
                  type="button"
                  variant={filter === "locked" ? "default" : "secondary"}
                  onClick={() => setFilter("locked")}
                  size="sm"
                >
                  Locked
                </Button>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="max-h-[75vh] overflow-y-auto px-6 pb-6 pt-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-10 text-center">
              <p className="text-base font-semibold">No templates found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different search or switch the filter.
              </p>
              <Button
                type="button"
                variant="secondary"
                className="mt-4"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                  searchRef.current?.focus();
                }}
              >
                Reset
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((template) => {
                const locked = !canAccessTemplate(
                  template.id,
                  subscriptionLevel,
                );
                return (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isSelected={currentTemplate === template.id}
                    isLocked={locked}
                    onSelect={() => onSelectTemplate(template.id as TemplateId)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
