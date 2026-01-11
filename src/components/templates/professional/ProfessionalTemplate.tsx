/* eslint-disable @typescript-eslint/no-explicit-any */
import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { formatDate } from "date-fns";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import { Mail, MapPin, Phone } from "lucide-react";

interface ProfessionalTemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
  templateStyle?: any;
}

export default function ProfessionalTemplate({
  resumeData,
  contentRef,
  className,
}: ProfessionalTemplateProps) {
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
        {/* Left Sidebar - 35% */}
        <div
          className="w-[35%] space-y-6 p-8"
          style={{
            backgroundColor: resumeData.colorHex || "#0369a1",
            color: "white",
          }}
        >
          <PersonalPhoto resumeData={resumeData} />
          <ContactInfo resumeData={resumeData} />
          <SkillsSection resumeData={resumeData} />
        </div>

        {/* Right Main Content - 65% */}
        <div className="w-[65%] space-y-6 p-8">
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
        width={160}
        height={160}
        className="aspect-square border-4 border-white object-cover shadow-lg"
        style={{
          borderRadius:
            borderStyle === BorderStyles.SQUARE
              ? "0px"
              : borderStyle === BorderStyles.CIRCLE
                ? "9999px"
                : "8px",
        }}
      />
    </div>
  );
}

function ContactInfo({ resumeData }: ResumeSectionProps) {
  const { city, country, phone, email } = resumeData;

  const hasContact = city || country || phone || email;
  if (!hasContact) return null;

  return (
    <div className="space-y-4">
      <div className="border-b border-white/30 pb-2">
        <h3 className="font-serif text-sm font-bold uppercase tracking-widest">
          Contact
        </h3>
      </div>
      <div className="space-y-3 text-sm">
        {(city || country) && (
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 opacity-80" />
            <span className="leading-relaxed">
              {city}
              {city && country ? ", " : ""}
              {country}
            </span>
          </div>
        )}
        {phone && (
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 opacity-80" />
            <span className="leading-relaxed">{phone}</span>
          </div>
        )}
        {email && (
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 opacity-80" />
            <span className="break-all leading-relaxed">{email}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SkillsSection({ resumeData }: ResumeSectionProps) {
  const { skills } = resumeData;

  if (!skills?.length) return null;

  return (
    <div className="space-y-4">
      <div className="border-b border-white/30 pb-2">
        <h3 className="font-serif text-sm font-bold uppercase tracking-widest">
          Expertise
        </h3>
      </div>
      <div className="space-y-2">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="border-l-2 border-white/40 pl-3 text-sm leading-relaxed"
          >
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
}

function HeaderSection({ resumeData }: ResumeSectionProps) {
  const { firstName, lastName, jobTitle, colorHex } = resumeData;

  return (
    <div
      className="space-y-3 border-b-2 pb-4"
      style={{ borderColor: colorHex || "#0369a1" }}
    >
      <h1
        className="font-serif text-4xl font-bold tracking-tight"
        style={{ color: colorHex || "#0369a1" }}
      >
        {firstName} {lastName}
      </h1>
      {jobTitle && (
        <p className="font-serif text-xl italic text-gray-600">{jobTitle}</p>
      )}
    </div>
  );
}

function SummarySection({ resumeData }: ResumeSectionProps) {
  const { summary, colorHex } = resumeData;

  if (!summary) return null;

  return (
    <div className="space-y-3">
      <h2
        className="font-serif text-lg font-bold uppercase tracking-wide"
        style={{ color: colorHex || "#0369a1" }}
      >
        Executive Summary
      </h2>
      <p className="whitespace-pre-line font-serif text-sm leading-relaxed text-gray-700">
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
      <h2
        className="font-serif text-lg font-bold uppercase tracking-wide"
        style={{ color: colorHex || "#0369a1" }}
      >
        Professional Experience
      </h2>
      {workExperienceNotEmpty.map((exp, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-baseline justify-between">
            <h3 className="font-serif text-base font-bold text-gray-900">
              {exp.position}
            </h3>
            {exp.startDate && (
              <span className="font-serif text-xs italic text-gray-500">
                {formatDate(exp.startDate, "MMMM yyyy")} -{" "}
                {exp.endDate ? formatDate(exp.endDate, "MMMM yyyy") : "Present"}
              </span>
            )}
          </div>
          <p
            className="font-serif text-sm font-semibold italic"
            style={{ color: colorHex || "#0369a1" }}
          >
            {exp.company}
          </p>
          <p className="whitespace-pre-line font-serif text-sm leading-relaxed text-gray-700">
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
    <div className="space-y-4">
      <h2
        className="font-serif text-lg font-bold uppercase tracking-wide"
        style={{ color: colorHex || "#0369a1" }}
      >
        Education
      </h2>
      {educationNotEmpty.map((edu, index) => (
        <div key={index} className="space-y-1">
          <div className="flex items-baseline justify-between">
            <h3 className="font-serif text-base font-bold text-gray-900">
              {edu.degree}
            </h3>
            {edu.startDate && (
              <span className="font-serif text-xs italic text-gray-500">
                {formatDate(edu.startDate, "MMMM yyyy")}
                {edu.endDate
                  ? ` - ${formatDate(edu.endDate, "MMMM yyyy")}`
                  : ""}
              </span>
            )}
          </div>
          <p
            className="font-serif text-sm font-semibold italic"
            style={{ color: colorHex || "#0369a1" }}
          >
            {edu.school}
          </p>
        </div>
      ))}
    </div>
  );
}
