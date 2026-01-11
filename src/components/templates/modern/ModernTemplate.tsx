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

interface ModernTemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
  templateStyle?: any;
}

export default function ModernTemplate({
  resumeData,
  contentRef,
  className,
}: ModernTemplateProps) {
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
        {/* Left Sidebar - 1/3 width */}
        <div
          className="w-1/3 space-y-6 p-6"
          style={{ backgroundColor: resumeData.colorHex + "15" || "#f3f4f6" }}
        >
          <PersonalPhoto resumeData={resumeData} />
          <ContactInfo resumeData={resumeData} />
          <SkillsSection resumeData={resumeData} />
        </div>

        {/* Right Main Content - 2/3 width */}
        <div className="w-2/3 space-y-6 p-6">
          <HeaderSection resumeData={resumeData} />
          <SummarySection resumeData={resumeData} />
          <WorkExperienceSection resumeData={resumeData} />
          <EducationSection resumeData={resumeData} />
        </div>
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
    <div className="flex justify-center">
      <Image
        src={photoSrc}
        alt="Profile photo"
        width={120}
        height={120}
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

function ContactInfo({ resumeData }: ResumeSectionProps) {
  const { city, country, phone, email, colorHex } = resumeData;

  const hasContact = city || country || phone || email;
  if (!hasContact) return null;

  return (
    <div className="space-y-3">
      <h3
        className="text-sm font-bold uppercase tracking-wider"
        style={{ color: colorHex }}
      >
        Contact
      </h3>
      <div className="space-y-2 text-xs">
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
    <div className="space-y-3">
      <h3
        className="text-sm font-bold uppercase tracking-wider"
        style={{ color: colorHex }}
      >
        Skills
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="text-xs"
            style={{
              backgroundColor: (colorHex || "#6366f1") + "1A",
              color: colorHex || "#6366f1",
              border: `1px solid ${colorHex || "#6366f1"}33`,
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
    <div className="space-y-2">
      <h1
        className="text-4xl font-bold uppercase tracking-tight"
        style={{ color: colorHex }}
      >
        {firstName} {lastName}
      </h1>
      {jobTitle && (
        <p className="text-lg font-medium text-gray-600">{jobTitle}</p>
      )}
    </div>
  );
}

function SummarySection({ resumeData }: ResumeSectionProps) {
  const { summary, colorHex } = resumeData;

  if (!summary) return null;

  return (
    <div className="space-y-2">
      <h2
        className="border-b-2 pb-1 text-sm font-bold uppercase tracking-wider"
        style={{ borderColor: colorHex, color: colorHex }}
      >
        Profile
      </h2>
      <p className="whitespace-pre-line text-xs leading-relaxed">{summary}</p>
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
    <div className="space-y-3">
      <h2
        className="border-b-2 pb-1 text-sm font-bold uppercase tracking-wider"
        style={{ borderColor: colorHex, color: colorHex }}
      >
        Experience
      </h2>
      {workExperienceNotEmpty.map((exp, index) => (
        <div key={index} className="space-y-1">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-bold">{exp.position}</h3>
            {exp.startDate && (
              <span className="text-xs text-gray-500">
                {formatDate(exp.startDate, "MMM yyyy")} -{" "}
                {exp.endDate ? formatDate(exp.endDate, "MMM yyyy") : "Present"}
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-gray-600">{exp.company}</p>
          <p className="whitespace-pre-line text-xs leading-relaxed text-gray-700">
            {exp.description}
          </p>
        </div>
      ))}
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
    <div className="space-y-3">
      <h2
        className="border-b-2 pb-1 text-sm font-bold uppercase tracking-wider"
        style={{ borderColor: colorHex, color: colorHex }}
      >
        Education
      </h2>
      {educationNotEmpty.map((edu, index) => (
        <div key={index} className="space-y-1">
          <div className="flex items-baseline justify-between">
            <h3 className="text-sm font-bold">{edu.degree}</h3>
            {edu.startDate && (
              <span className="text-xs text-gray-500">
                {formatDate(edu.startDate, "MMM yyyy")}
                {edu.endDate ? ` - ${formatDate(edu.endDate, "MMM yyyy")}` : ""}
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-gray-600">{edu.school}</p>
        </div>
      ))}
    </div>
  );
}
