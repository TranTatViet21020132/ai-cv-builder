/* eslint-disable @typescript-eslint/no-explicit-any */
import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { formatDate } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { Mail, MapPin, Phone } from "lucide-react";

interface CompactTemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
  templateStyle?: any;
}

export default function CompactTemplate({
  resumeData,
  contentRef,
  className,
}: CompactTemplateProps) {
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
        className={cn("flex h-full", !width && "invisible")}
        ref={contentRef}
        id="resumePreviewContent"
      >
        {/* Left Sidebar - compact */}
        <aside
          className="w-[32%] space-y-4 border-r p-5"
          style={{
            backgroundColor: resumeData.colorHex
              ? `${resumeData.colorHex}0D`
              : "#f3f4f6",
            borderColor: resumeData.colorHex
              ? `${resumeData.colorHex}33`
              : "#e5e7eb",
          }}
        >
          <PersonalPhoto resumeData={resumeData} />
          <ContactInfo resumeData={resumeData} />
          <SkillsSection resumeData={resumeData} />
        </aside>

        {/* Main Content */}
        <main className="w-[68%] space-y-4 p-5">
          <HeaderSection resumeData={resumeData} />
          <SummarySection resumeData={resumeData} />
          <WorkExperienceSection resumeData={resumeData} />
          <EducationSection resumeData={resumeData} />
        </main>
      </div>
    </div>
  );
}

interface ResumeSectionProps {
  resumeData: ResumeValues;
}

function PersonalPhoto({ resumeData }: ResumeSectionProps) {
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
    <div className="flex justify-center pb-1">
      <Image
        src={photoSrc}
        alt="Profile photo"
        width={92}
        height={92}
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
  );
}

function SectionTitle({
  title,
  colorHex,
}: {
  title: string;
  colorHex?: string | null;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: colorHex || "#059669" }}
      />
      <h3
        className="text-[11px] font-bold uppercase tracking-wider"
        style={{ color: colorHex || "#059669" }}
      >
        {title}
      </h3>
    </div>
  );
}

function ContactInfo({ resumeData }: ResumeSectionProps) {
  const { city, country, phone, email, colorHex } = resumeData;

  const hasContact = city || country || phone || email;
  if (!hasContact) return null;

  return (
    <div className="space-y-2">
      <SectionTitle title="Contact" colorHex={colorHex} />
      <div className="space-y-1.5 text-[11px] text-gray-700">
        {(city || country) && (
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-3 w-3 flex-shrink-0" />
            <span>
              {city}
              {city && country ? ", " : ""}
              {country}
            </span>
          </div>
        )}
        {phone && (
          <div className="flex items-start gap-2">
            <Phone className="mt-0.5 h-3 w-3 flex-shrink-0" />
            <span>{phone}</span>
          </div>
        )}
        {email && (
          <div className="flex items-start gap-2">
            <Mail className="mt-0.5 h-3 w-3 flex-shrink-0" />
            <span className="break-all">{email}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SkillsSection({ resumeData }: ResumeSectionProps) {
  const { skills, colorHex } = resumeData;

  if (!skills?.length) return null;

  return (
    <div className="space-y-2">
      <SectionTitle title="Skills" colorHex={colorHex} />
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="px-2 py-0.5 text-[10px]"
            style={{
              backgroundColor: colorHex || "#059669",
              color: "white",
            }}
          >
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function HeaderSection({ resumeData }: ResumeSectionProps) {
  const { firstName, lastName, jobTitle, colorHex } = resumeData;

  return (
    <div
      className="space-y-1.5 border-b pb-2"
      style={{ borderColor: colorHex ? `${colorHex}33` : "#e5e7eb" }}
    >
      <h1
        className="text-2xl font-bold leading-tight"
        style={{ color: colorHex || "#059669" }}
      >
        {firstName} {lastName}
      </h1>
      {jobTitle && (
        <p className="text-[12px] font-medium text-gray-600">{jobTitle}</p>
      )}
    </div>
  );
}

function SummarySection({ resumeData }: ResumeSectionProps) {
  const { summary, colorHex } = resumeData;

  if (!summary) return null;

  return (
    <div className="space-y-2">
      <SectionTitle title="Summary" colorHex={colorHex} />
      <p className="whitespace-pre-line text-[11px] leading-relaxed text-gray-700">
        {summary}
      </p>
    </div>
  );
}

function WorkExperienceSection({ resumeData }: ResumeSectionProps) {
  const { workExperiences, colorHex } = resumeData;

  const items = workExperiences?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0,
  );

  if (!items?.length) return null;

  return (
    <div className="space-y-2">
      <SectionTitle title="Experience" colorHex={colorHex} />
      <div className="space-y-2.5">
        {items.map((exp, index) => (
          <div key={index} className="space-y-0.5">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-[12px] font-bold text-gray-900">
                {exp.position}
              </h3>
              {exp.startDate && (
                <span className="shrink-0 text-[10px] text-gray-500">
                  {formatDate(exp.startDate, "MMM yyyy")} -{" "}
                  {exp.endDate
                    ? formatDate(exp.endDate, "MMM yyyy")
                    : "Present"}
                </span>
              )}
            </div>
            <p className="text-[11px] font-semibold text-gray-600">
              {exp.company}
            </p>
            <p className="whitespace-pre-line text-[11px] leading-relaxed text-gray-700">
              {exp.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationSection({ resumeData }: ResumeSectionProps) {
  const { educations, colorHex } = resumeData;

  const items = educations?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0,
  );

  if (!items?.length) return null;

  return (
    <div className="space-y-2">
      <SectionTitle title="Education" colorHex={colorHex} />
      <div className="space-y-2">
        {items.map((edu, index) => (
          <div key={index} className="space-y-0.5">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-[12px] font-bold text-gray-900">
                {edu.degree}
              </h3>
              {edu.startDate && (
                <span className="shrink-0 text-[10px] text-gray-500">
                  {formatDate(edu.startDate, "MMM yyyy")}
                  {edu.endDate
                    ? ` - ${formatDate(edu.endDate, "MMM yyyy")}`
                    : ""}
                </span>
              )}
            </div>
            <p className="text-[11px] font-semibold text-gray-600">
              {edu.school}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}