/* eslint-disable @typescript-eslint/no-explicit-any */
import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { formatDate } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";

interface TechTemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
  templateStyle?: any;
}

export default function TechTemplate({
  resumeData,
  contentRef,
  className,
}: TechTemplateProps) {
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
        className={cn("flex h-[1123px] gap-6 p-6", !width && "invisible")}
        ref={contentRef}
        id="resumePreviewContent"
      >
        {/* Left Sidebar - 35% */}
        <div className="w-[35%] space-y-6">
          <PersonalInfoSection resumeData={resumeData} />
          <SkillsSection resumeData={resumeData} />
          <EducationSection resumeData={resumeData} />
        </div>

        {/* Right Main Content - 65% */}
        <div className="w-[65%] space-y-6">
          <SummarySection resumeData={resumeData} />
          <WorkExperienceSection resumeData={resumeData} />
        </div>
      </div>
    </div>
  );
}

interface ResumeSectionProps {
  resumeData: ResumeValues;
}

function PersonalInfoSection({ resumeData }: ResumeSectionProps) {
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
    <div className="break-inside-avoid space-y-4">
      {photoSrc && (
        <Image
          src={photoSrc}
          alt="User photo"
          width={120}
          height={120}
          className="aspect-square w-full object-cover"
          style={{
            borderRadius:
              borderStyle === BorderStyles.SQUARE
                ? "0px"
                : borderStyle === BorderStyles.CIRCLE
                  ? "9999px"
                  : "10%",
          }}
        />
      )}

      <div className="space-y-3">
        <div className="space-y-1">
          <h1
            className="text-2xl font-bold leading-tight"
            style={{
              color: colorHex,
              fontFamily: "'JetBrains Mono', 'Consolas', monospace",
            }}
          >
            {firstName}
            <br />
            {lastName}
          </h1>
          <p
            className="text-sm font-medium uppercase tracking-wide"
            style={{ color: colorHex }}
          >
            {jobTitle}
          </p>
        </div>

        <div className="space-y-1 text-xs text-gray-600">
          {(city || country) && (
            <p className="flex items-start gap-2">
              <span className="font-mono text-gray-400">📍</span>
              <span>
                {city}
                {city && country ? ", " : ""}
                {country}
              </span>
            </p>
          )}
          {phone && (
            <p className="flex items-start gap-2">
              <span className="font-mono text-gray-400">📞</span>
              <span className="break-all">{phone}</span>
            </p>
          )}
          {email && (
            <p className="flex items-start gap-2">
              <span className="font-mono text-gray-400">✉️</span>
              <span className="break-all">{email}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function SummarySection({ resumeData }: ResumeSectionProps) {
  const { summary, colorHex } = resumeData;

  if (!summary) return null;

  return (
    <div className="break-inside-avoid space-y-3">
      <div className="flex items-center gap-2">
        <span
          className="font-mono text-lg font-bold"
          style={{ color: colorHex }}
        >
          {"//"}
        </span>
        <h2
          className="text-lg font-bold uppercase tracking-wide"
          style={{ color: colorHex }}
        >
          About
        </h2>
      </div>
      <div
        className="whitespace-pre-line border-l-4 pl-4 text-sm leading-relaxed"
        style={{ borderColor: colorHex }}
      >
        {summary}
      </div>
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
    <div className="break-inside-avoid space-y-4">
      <div className="flex items-center gap-2">
        <span
          className="font-mono text-lg font-bold"
          style={{ color: colorHex }}
        >
          {"//"}
        </span>
        <h2
          className="text-lg font-bold uppercase tracking-wide"
          style={{ color: colorHex }}
        >
          Experience
        </h2>
      </div>
      <div className="space-y-5">
        {workExperienceNotEmpty.map((exp, index) => (
          <div key={index} className="break-inside-avoid space-y-2">
            <div className="space-y-1">
              <h3 className="text-base font-bold" style={{ color: colorHex }}>
                {exp.position}
              </h3>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-700">
                  {exp.company}
                </span>
                {exp.startDate && (
                  <span
                    className="font-mono text-xs"
                    style={{ color: colorHex }}
                  >
                    {formatDate(exp.startDate, "MM/yyyy")} -{" "}
                    {exp.endDate
                      ? formatDate(exp.endDate, "MM/yyyy")
                      : "present"}
                  </span>
                )}
              </div>
            </div>
            {exp.description && (
              <div className="whitespace-pre-line text-xs leading-relaxed text-gray-700">
                {exp.description}
              </div>
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
    <div className="break-inside-avoid space-y-3">
      <h2
        className="border-b-2 pb-1 text-sm font-bold uppercase tracking-wide"
        style={{ color: colorHex, borderColor: colorHex }}
      >
        Education
      </h2>
      <div className="space-y-3">
        {educationNotEmpty.map((edu, index) => (
          <div key={index} className="break-inside-avoid space-y-1">
            <p
              className="text-xs font-bold leading-snug"
              style={{ color: colorHex }}
            >
              {edu.degree}
            </p>
            <p className="text-xs text-gray-700">{edu.school}</p>
            {edu.startDate && (
              <p className="font-mono text-[10px] text-gray-500">
                {formatDate(edu.startDate, "MM/yyyy")}
                {edu.endDate ? ` - ${formatDate(edu.endDate, "MM/yyyy")}` : ""}
              </p>
            )}
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
    <div className="break-inside-avoid space-y-3">
      <h2
        className="border-b-2 pb-1 text-sm font-bold uppercase tracking-wide"
        style={{ color: colorHex, borderColor: colorHex }}
      >
        Skills
      </h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Badge
            key={index}
            className="px-2 py-1 font-mono text-[10px] font-medium text-white hover:bg-transparent"
            style={{
              backgroundColor: colorHex,
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
