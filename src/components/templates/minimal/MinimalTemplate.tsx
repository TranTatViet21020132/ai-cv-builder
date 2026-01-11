/* eslint-disable @typescript-eslint/no-explicit-any */
import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { formatDate } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";

interface MinimalTemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
  templateStyle?: any;
}

export default function MinimalTemplate({
  resumeData,
  contentRef,
  className,
}: MinimalTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // @ts-expect-error: Suppress TypeScript error for containerRef
  const { width } = useDimensions(containerRef);

  return (
    <div
      className={cn(
        "aspect-[210/297] h-fit w-full bg-white text-black",
        className,
      )}
      ref={containerRef}
    >
      <div
        style={{ zoom: (1 / 794) * width }}
        className={cn("space-y-8 p-8", !width && "invisible")}
        ref={contentRef}
        id="resumePreviewContent"
      >
        <PersonalInfoHeader resumeData={resumeData} />
        <SummarySection resumeData={resumeData} />
        <WorkExperienceSection resumeData={resumeData} />
        <EducationSection resumeData={resumeData} />
        <SkillsSection resumeData={resumeData} />
      </div>
    </div>
  );
}

interface ResumeSectionProps {
  resumeData: ResumeValues;
}

function PersonalInfoHeader({ resumeData }: ResumeSectionProps) {
  const {
    photo,
    firstName,
    lastName,
    jobTitle,
    city,
    country,
    phone,
    email,
    colorHex,
    borderStyle,
  } = resumeData;

  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
    if (objectUrl) setPhotoSrc(objectUrl);
    if (photo === null) setPhotoSrc("");
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  return (
    <div className="space-y-4 text-center">
      {photoSrc && (
        <div className="flex justify-center">
          <Image
            src={photoSrc}
            alt="User photo"
            width={100}
            height={100}
            className="aspect-square object-cover"
            style={{
              borderRadius:
                borderStyle === BorderStyles.SQUARE
                  ? "0px"
                  : borderStyle === BorderStyles.CIRCLE
                    ? "9999px"
                    : "10%",
            }}
          />
        </div>
      )}

      <div className="space-y-2">
        <h1
          className="text-3xl font-light tracking-wide"
          style={{ color: colorHex }}
        >
          {firstName} {lastName}
        </h1>
        {jobTitle && (
          <p className="text-sm font-medium uppercase tracking-widest text-gray-600">
            {jobTitle}
          </p>
        )}
        <div className="flex justify-center gap-3 text-xs text-gray-500">
          {city && <span>{city}</span>}
          {country && <span>{country}</span>}
          {phone && <span>{phone}</span>}
          {email && <span>{email}</span>}
        </div>
      </div>
    </div>
  );
}

function SummarySection({ resumeData }: ResumeSectionProps) {
  const { summary, colorHex } = resumeData;

  if (!summary) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-300" />
        <h2
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: colorHex }}
        >
          About
        </h2>
        <div className="h-px flex-1 bg-gray-300" />
      </div>
      <p className="whitespace-pre-line text-center text-sm leading-relaxed text-gray-700">
        {summary}
      </p>
    </div>
  );
}

function WorkExperienceSection({ resumeData }: ResumeSectionProps) {
  const { workExperiences, colorHex } = resumeData;

  const workExperienceNotEmpty = workExperiences?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0,
  );

  if (!workExperienceNotEmpty?.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-300" />
        <h2
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: colorHex }}
        >
          Experience
        </h2>
        <div className="h-px flex-1 bg-gray-300" />
      </div>
      <div className="space-y-6">
        {workExperienceNotEmpty.map((exp, index) => (
          <div key={index} className="space-y-2">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold" style={{ color: colorHex }}>
                {exp.position}
              </h3>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-gray-600">{exp.company}</span>
                {exp.startDate && (
                  <span className="text-gray-500">
                    {formatDate(exp.startDate, "MMM yyyy")} -{" "}
                    {exp.endDate
                      ? formatDate(exp.endDate, "MMM yyyy")
                      : "Present"}
                  </span>
                )}
              </div>
            </div>
            {exp.description && (
              <p className="whitespace-pre-line text-xs leading-relaxed text-gray-700">
                {exp.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationSection({ resumeData }: ResumeSectionProps) {
  const { educations, colorHex } = resumeData;

  const educationNotEmpty = educations?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0,
  );

  if (!educationNotEmpty?.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-300" />
        <h2
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: colorHex }}
        >
          Education
        </h2>
        <div className="h-px flex-1 bg-gray-300" />
      </div>
      <div className="space-y-4">
        {educationNotEmpty.map((edu, index) => (
          <div key={index} className="space-y-1">
            <h3 className="text-sm font-semibold" style={{ color: colorHex }}>
              {edu.degree}
            </h3>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-gray-600">{edu.school}</span>
              {edu.startDate && (
                <span className="text-gray-500">
                  {formatDate(edu.startDate, "MMM yyyy")}
                  {edu.endDate
                    ? ` - ${formatDate(edu.endDate, "MMM yyyy")}`
                    : ""}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsSection({ resumeData }: ResumeSectionProps) {
  const { skills, colorHex, borderStyle } = resumeData;

  if (!skills?.length) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-300" />
        <h2
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: colorHex }}
        >
          Skills
        </h2>
        <div className="h-px flex-1 bg-gray-300" />
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {skills.map((skill, index) => (
          <Badge
            key={index}
            variant="outline"
            className="border-2 text-xs font-normal"
            style={{
              borderColor: colorHex,
              color: colorHex,
              borderRadius:
                borderStyle === BorderStyles.SQUARE
                  ? "0px"
                  : borderStyle === BorderStyles.CIRCLE
                    ? "9999px"
                    : "4px",
            }}
          >
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
}
