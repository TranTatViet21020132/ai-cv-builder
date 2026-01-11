/* eslint-disable @typescript-eslint/no-explicit-any */
import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { formatDate } from "date-fns";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { Mail, MapPin, Phone } from "lucide-react";

interface ElegantTemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
  templateStyle?: any;
}

export default function ElegantTemplate({
  resumeData,
  contentRef,
  className,
}: ElegantTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // @ts-expect-error: Suppress TypeScript error for containerRef
  const { width } = useDimensions(containerRef);

  const accent = resumeData.colorHex || "#92400e";

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
        className={cn("flex h-full flex-col", !width && "invisible")}
        ref={contentRef}
        id="resumePreviewContent"
      >
        {/* Header */}
        <div className="px-8 pb-4 pt-8">
          <HeaderSection resumeData={resumeData} accent={accent} />
        </div>

        {/* Body */}
        <div className="flex flex-1 gap-8 px-8 pb-8">
          {/* Left rail */}
          <aside className="w-[34%] space-y-6">
            <PersonalPhoto resumeData={resumeData} accent={accent} />
            <ContactInfo resumeData={resumeData} accent={accent} />
            <SkillsSection resumeData={resumeData} accent={accent} />
          </aside>

          {/* Main */}
          <main className="w-[66%] space-y-6">
            <SummarySection resumeData={resumeData} accent={accent} />
            <WorkExperienceSection resumeData={resumeData} accent={accent} />
            <EducationSection resumeData={resumeData} accent={accent} />
          </main>
        </div>
      </div>
    </div>
  );
}

function SectionHeading({
  children,
  accent,
}: {
  children: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="space-y-2">
      <h2
        className="font-serif text-[12px] font-bold uppercase tracking-[0.18em]"
        style={{ color: accent }}
      >
        {children}
      </h2>
      <div className="h-px w-full" style={{ backgroundColor: `${accent}33` }} />
    </div>
  );
}

interface ResumeSectionProps {
  resumeData: ResumeValues;
  accent: string;
}

function PersonalPhoto({ resumeData, accent }: ResumeSectionProps) {
  const { photo, borderStyle } = resumeData;
  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
    if (objectUrl) setPhotoSrc(objectUrl);
    if (photo === null) setPhotoSrc("");
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  if (!photoSrc) return null;

  return (
    <div className="flex justify-start">
      <div className="relative">
        <div
          className="absolute -inset-2 rounded-[16px]"
          style={{ backgroundColor: `${accent}12` }}
        />
        <Image
          src={photoSrc}
          alt="Profile photo"
          width={120}
          height={120}
          className="relative aspect-square object-cover shadow-sm"
          style={{
            borderRadius:
              borderStyle === BorderStyles.SQUARE
                ? "0px"
                : borderStyle === BorderStyles.CIRCLE
                  ? "9999px"
                  : "14px",
          }}
        />
      </div>
    </div>
  );
}

function HeaderSection({
  resumeData,
  accent,
}: {
  resumeData: ResumeValues;
  accent: string;
}) {
  const { firstName, lastName, jobTitle } = resumeData;

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h1 className="font-serif text-4xl font-bold leading-tight text-stone-800">
          {firstName} {lastName}
        </h1>
        {jobTitle && (
          <p className="font-serif text-sm italic text-stone-600">{jobTitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="h-0.5 w-16" style={{ backgroundColor: accent }} />
        <div className="h-0.5 w-6 bg-stone-200" />
      </div>
    </div>
  );
}

function ContactInfo({ resumeData, accent }: ResumeSectionProps) {
  const { city, country, phone, email } = resumeData;

  const hasContact = city || country || phone || email;
  if (!hasContact) return null;

  return (
    <div className="space-y-3">
      <SectionHeading accent={accent}>Contact</SectionHeading>
      <div className="space-y-2 text-[12px] text-stone-700">
        {(city || country) && (
          <div className="flex items-start gap-2">
            <MapPin
              className="mt-0.5 h-3.5 w-3.5 flex-shrink-0"
              style={{ color: accent }}
            />
            <span className="leading-relaxed">
              {city}
              {city && country ? ", " : ""}
              {country}
            </span>
          </div>
        )}
        {phone && (
          <div className="flex items-start gap-2">
            <Phone
              className="mt-0.5 h-3.5 w-3.5 flex-shrink-0"
              style={{ color: accent }}
            />
            <span className="leading-relaxed">{phone}</span>
          </div>
        )}
        {email && (
          <div className="flex items-start gap-2">
            <Mail
              className="mt-0.5 h-3.5 w-3.5 flex-shrink-0"
              style={{ color: accent }}
            />
            <span className="break-all leading-relaxed">{email}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SkillsSection({ resumeData, accent }: ResumeSectionProps) {
  const { skills } = resumeData;
  if (!skills?.length) return null;

  return (
    <div className="space-y-3">
      <SectionHeading accent={accent}>Skills</SectionHeading>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="rounded-full border px-3 py-1 font-serif text-[11px] text-stone-700"
            style={{
              borderColor: `${accent}40`,
              backgroundColor: `${accent}0A`,
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function SummarySection({ resumeData, accent }: ResumeSectionProps) {
  const { summary } = resumeData;
  if (!summary) return null;

  return (
    <div className="space-y-3">
      <SectionHeading accent={accent}>Profile</SectionHeading>
      <p className="whitespace-pre-line font-serif text-[12px] leading-relaxed text-stone-700">
        {summary}
      </p>
    </div>
  );
}

function WorkExperienceSection({ resumeData, accent }: ResumeSectionProps) {
  const { workExperiences } = resumeData;

  const items = workExperiences?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0,
  );

  if (!items?.length) return null;

  return (
    <div className="space-y-4">
      <SectionHeading accent={accent}>Experience</SectionHeading>
      <div className="space-y-4">
        {items.map((exp, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-serif text-[13px] font-bold text-stone-800">
                {exp.position}
              </h3>
              {exp.startDate && (
                <span className="shrink-0 font-serif text-[11px] italic text-stone-500">
                  {formatDate(exp.startDate, "MMM yyyy")} â€“{" "}
                  {exp.endDate
                    ? formatDate(exp.endDate, "MMM yyyy")
                    : "Present"}
                </span>
              )}
            </div>

            <p
              className="font-serif text-[12px] font-semibold italic"
              style={{ color: accent }}
            >
              {exp.company}
            </p>

            <p className="whitespace-pre-line font-serif text-[12px] leading-relaxed text-stone-700">
              {exp.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationSection({ resumeData, accent }: ResumeSectionProps) {
  const { educations } = resumeData;

  const items = educations?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0,
  );

  if (!items?.length) return null;

  return (
    <div className="space-y-4">
      <SectionHeading accent={accent}>Education</SectionHeading>
      <div className="space-y-3">
        {items.map((edu, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-serif text-[13px] font-bold text-stone-800">
                {edu.degree}
              </h3>
              {edu.startDate && (
                <span className="shrink-0 font-serif text-[11px] italic text-stone-500">
                  {formatDate(edu.startDate, "MMM yyyy")}
                  {edu.endDate
                    ? ` â€“ ${formatDate(edu.endDate, "MMM yyyy")}`
                    : ""}
                </span>
              )}
            </div>
            <p
              className="font-serif text-[12px] font-semibold italic"
              style={{ color: accent }}
            >
              {edu.school}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
