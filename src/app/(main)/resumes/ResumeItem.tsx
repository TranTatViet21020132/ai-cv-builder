"use client";

import LoadingButton from "@/components/LoadingButton";
import ResumePreview from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { ResumeClientData } from "@/lib/types";
import { mapToResumeValues } from "@/lib/utils";
import { formatDate } from "date-fns";
import { MoreVertical, Printer, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { useReactToPrint } from "react-to-print";
import { deleteResume } from "./actions";

interface ResumeItemProps {
  resume: ResumeClientData;
}

export default function ResumeItem({ resume }: ResumeItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const reactToPrintFn = useReactToPrint({
    // @ts-expect-error: Suppress TypeScript error for contentRef
    contentRef,
    documentTitle: resume.title || "Resume",
  });

  const wasUpdated = resume.updatedAt !== resume.createdAt; // Convert client data back to server format for mapToResumeValues

  const resumeServerData = {
    ...resume,
    createdAt: new Date(resume.createdAt),
    updatedAt: new Date(resume.updatedAt),
    workExperiences: resume.workExperiences?.map((exp) => ({
      ...exp,
      startDate: exp.startDate ? new Date(exp.startDate) : undefined,
      endDate: exp.endDate ? new Date(exp.endDate) : undefined,
    })),
    educations: resume.educations?.map((edu) => ({
      ...edu,
      startDate: edu.startDate ? new Date(edu.startDate) : undefined,
      endDate: edu.endDate ? new Date(edu.endDate) : undefined,
    })),
  }; // Prevent hydration mismatch by only rendering date on client

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="group relative rounded-lg border border-transparent bg-secondary p-3 transition-colors hover:border-border">
           {" "}
      <div className="space-y-3">
               {" "}
        <Link
          href={`/editor?resumeId=${resume.id}`}
          className="inline-block w-full text-center"
        >
                   {" "}
          <p className="line-clamp-1 font-semibold">
                        {resume.title || "No title"}         {" "}
          </p>
                   {" "}
          {resume.description && (
            <p className="line-clamp-2 text-sm">{resume.description}</p>
          )}
                   {" "}
          <p className="text-xs text-muted-foreground">
                       {" "}
            {mounted ? (
              <>
                                {wasUpdated ? "Updated" : "Created"} on        
                        {formatDate(resume.updatedAt, "MMM d, yyyy h:mm a")}   
                         {" "}
              </>
            ) : (
              // Placeholder to prevent layout shift
              <span style={{ visibility: "hidden" }}>
                                {wasUpdated ? "Updated" : "Created"} on Jan 1,
                2026 12:00 AM              {" "}
              </span>
            )}
                     {" "}
          </p>
                 {" "}
        </Link>
               {" "}
        <Link
          href={`/editor?resumeId=${resume.id}`}
          className="relative inline-block w-full"
        >
                   {" "}
          <ResumePreview
            resumeData={mapToResumeValues(resumeServerData)}
            contentRef={contentRef}
            className="overflow-hidden shadow-sm transition-shadow group-hover:shadow-lg"
          />
                   {" "}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
                 {" "}
        </Link>
             {" "}
      </div>
            <MoreMenu resumeId={resume.id} onPrintClick={reactToPrintFn} />   {" "}
    </div>
  );
}

interface MoreMenuProps {
  resumeId: string;
  onPrintClick: () => void;
}

function MoreMenu({ resumeId, onPrintClick }: MoreMenuProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  return (
    <>
           {" "}
      <DropdownMenu>
               {" "}
        <DropdownMenuTrigger asChild>
                   {" "}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0.5 top-0.5 opacity-0 transition-opacity group-hover:opacity-100"
          >
                        <MoreVertical className="size-4" />           {" "}
            <span className="sr-only">More options</span>         {" "}
          </Button>
                 {" "}
        </DropdownMenuTrigger>
               {" "}
        <DropdownMenuContent>
                   {" "}
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={() => setShowDeleteConfirmation(true)}
          >
                        <Trash2 className="size-4" />            Delete        
             {" "}
          </DropdownMenuItem>
                   {" "}
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={onPrintClick}
          >
                        <Printer className="size-4" />            Print        
             {" "}
          </DropdownMenuItem>
                 {" "}
        </DropdownMenuContent>
             {" "}
      </DropdownMenu>
           {" "}
      <DeleteConfirmationDialog
        resumeId={resumeId}
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
      />
         {" "}
    </>
  );
}

interface DeleteConfirmationDialogProps {
  resumeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function DeleteConfirmationDialog({
  resumeId,
  open,
  onOpenChange,
}: DeleteConfirmationDialogProps) {
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    startTransition(async () => {
      try {
        await deleteResume(resumeId);
        onOpenChange(false);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          description: "Something went wrong. Please try again.",
        });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
           {" "}
      <DialogContent>
               {" "}
        <DialogHeader>
                    <DialogTitle>Delete resume?</DialogTitle>         {" "}
          <DialogDescription>
                        This will permanently delete this resume. This action
            cannot be             undone.          {" "}
          </DialogDescription>
                 {" "}
        </DialogHeader>
               {" "}
        <DialogFooter>
                   {" "}
          <LoadingButton
            variant="destructive"
            onClick={handleDelete}
            loading={isPending}
          >
                        Delete          {" "}
          </LoadingButton>
                   {" "}
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
                        Cancel          {" "}
          </Button>
                 {" "}
        </DialogFooter>
             {" "}
      </DialogContent>
         {" "}
    </Dialog>
  );
}
