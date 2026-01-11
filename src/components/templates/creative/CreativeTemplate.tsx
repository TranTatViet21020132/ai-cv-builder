/* eslint-disable @typescript-eslint/no-explicit-any */
import useDimensions from "@/hooks/useDimensions";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { formatDate } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";
import {
  Mail,
  MapPin,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
} from "lucide-react";

interface CreativeTemplateProps {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
  templateStyle?: any;
}

export default function CreativeTemplate({
  resumeData,
  contentRef,
  className,
}: CreativeTemplateProps) {
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
        className={cn("flex h-full flex-col", !width && "invisible")}
        ref={contentRef}
        id="resumePreviewContent"
      >
        {/* Creative Header with Diagonal Split */}
        <div className="relative h-48">
          {/* Diagonal Background */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${resumeData.colorHex || "#7c3aed"} 0%, ${resumeData.colorHex || "#7c3aed"}dd 60%, transparent 60%)`,
            }}
          />

          {/* Accent Diagonal */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, transparent 58%, ${resumeData.colorHex ? resumeData.colorHex + "40" : "#ec489940"} 58%, ${resumeData.colorHex ? resumeData.colorHex + "40" : "#ec489940"} 62%, transparent 62%)`,
            }}
          />

          {/* Header Content */}
          <div className="relative z-10 flex h-full items-center justify-between px-8">
            <HeaderSection resumeData={resumeData} />
            <PersonalPhoto resumeData={resumeData} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1">
          {/* Left Column - 60% */}
          <div className="w-[60%] space-y-6 p-8">
            <SummarySection resumeData={resumeData} />
            <WorkExperienceSection resumeData={resumeData} />
            <EducationSection resumeData={resumeData} />
          </div>

          {/* Right Sidebar - 40% */}
          <div
            className="w-[40%] space-y-6 p-8"
            style={{
              backgroundColor: resumeData.colorHex
                ? `${resumeData.colorHex}08`
                : "#7c3aed08",
            }}
          >
            <ContactInfo resumeData={resumeData} />
            <SkillsSection resumeData={resumeData} />
          </div>
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
    <div className="relative">
      {/* Decorative Circle Background */}
      <div
        className="absolute -right-4 -top-4 h-32 w-32 rounded-full opacity-20"
        style={{ backgroundColor: "#ec4899" }}
      />
      <Image
        src={photoSrc}
        alt="Profile photo"
        width={140}
        height={140}
        className="relative z-10 aspect-square border-4 border-white object-cover shadow-xl"
        style={{
          borderRadius:
            borderStyle === BorderStyles.SQUARE
              ? "0px"
              : borderStyle === BorderStyles.CIRCLE
                ? "9999px"
                : "20%",
        }}
      />
    </div>
  );
}

function HeaderSection({ resumeData }: ResumeSectionProps) {
  const { firstName, lastName, jobTitle } = resumeData;

  return (
    <div className="space-y-3 text-white">
      <div>
        <h1 className="text-5xl font-bold tracking-tight">{firstName}</h1>
        <h1 className="text-5xl font-bold tracking-tight">{lastName}</h1>
      </div>
      {jobTitle && (
        <div className="flex items-center gap-2">
          <div className="h-1 w-12 bg-pink-400" />
          <p className="text-xl font-medium">{jobTitle}</p>
        </div>
      )}
    </div>
  );
}

function ContactInfo({ resumeData }: ResumeSectionProps) {
  const { city, country, phone, email, colorHex } = resumeData;

  const hasContact = city || country || phone || email;
  if (!hasContact) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div
          className="h-8 w-1 rounded-full"
          style={{ backgroundColor: colorHex || "#7c3aed" }}
        />
        <h3
          className="text-lg font-bold uppercase tracking-wide"
          style={{ color: colorHex || "#7c3aed" }}
        >
          Contact
        </h3>
      </div>
      <div className="space-y-3 pl-3 text-sm">
        {(city || country) && (
          <div className="flex items-start gap-3">
            <MapPin
              className="mt-0.5 h-4 w-4 flex-shrink-0"
              style={{ color: colorHex || "#7c3aed" }}
            />
            <span className="text-gray-700">
              {city}
              {city && country ? ", " : ""}
              {country}
            </span>
          </div>
        )}
        {phone && (
          <div className="flex items-start gap-3">
            <Phone
              className="mt-0.5 h-4 w-4 flex-shrink-0"
              style={{ color: colorHex || "#7c3aed" }}
            />
            <span className="text-gray-700">{phone}</span>
          </div>
        )}
        {email && (
          <div className="flex items-start gap-3">
            <Mail
              className="mt-0.5 h-4 w-4 flex-shrink-0"
              style={{ color: colorHex || "#7c3aed" }}
            />
            <span className="break-all text-gray-700">{email}</span>
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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div
          className="h-8 w-1 rounded-full"
          style={{ backgroundColor: colorHex || "#7c3aed" }}
        />
        <h3
          className="text-lg font-bold uppercase tracking-wide"
          style={{ color: colorHex || "#7c3aed" }}
        >
          Skills
        </h3>
      </div>
      <div className="flex flex-wrap gap-2 pl-3">
        {skills.map((skill, index) => (
          <Badge
            key={index}
            className="rounded-full px-3 py-1 text-xs font-medium shadow-sm"
            style={{
              backgroundColor: colorHex || "#7c3aed",
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

function SummarySection({ resumeData }: ResumeSectionProps) {
  const { summary, colorHex } = resumeData;

  if (!summary) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <Award className="h-6 w-6" style={{ color: colorHex || "#7c3aed" }} />
        <h2
          className="text-xl font-bold uppercase tracking-wide"
          style={{ color: colorHex || "#7c3aed" }}
        >
          About Me
        </h2>
      </div>
      <div
        className="border-l-4 pl-4"
        style={{ borderColor: colorHex ? `${colorHex}40` : "#7c3aed40" }}
      >
        <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
          {summary}
        </p>
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
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Briefcase
          className="h-6 w-6"
          style={{ color: colorHex || "#7c3aed" }}
        />
        <h2
          className="text-xl font-bold uppercase tracking-wide"
          style={{ color: colorHex || "#7c3aed" }}
        >
          Experience
        </h2>
      </div>
      <div className="space-y-5">
        {workExperienceNotEmpty.map((exp, index) => (
          <div
            key={index}
            className="relative border-l-4 pl-6"
            style={{ borderColor: colorHex ? `${colorHex}40` : "#7c3aed40" }}
          >
            {/* Timeline Dot */}
            <div
              className="absolute -left-2 top-1 h-4 w-4 rounded-full border-2 border-white"
              style={{ backgroundColor: colorHex || "#7c3aed" }}
            />

            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="text-base font-bold text-gray-900">
                  {exp.position}
                </h3>
                {exp.startDate && (
                  <span
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: colorHex ? `${colorHex}15` : "#7c3aed15",
                      color: colorHex || "#7c3aed",
                    }}
                  >
                    {formatDate(exp.startDate, "MMM yyyy")} -{" "}
                    {exp.endDate
                      ? formatDate(exp.endDate, "MMM yyyy")
                      : "Present"}
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-gray-600">
                {exp.company}
              </p>
              <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
                {exp.description}
              </p>
            </div>
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
        <GraduationCap
          className="h-6 w-6"
          style={{ color: colorHex || "#7c3aed" }}
        />
        <h2
          className="text-xl font-bold uppercase tracking-wide"
          style={{ color: colorHex || "#7c3aed" }}
        >
          Education
        </h2>
      </div>
      <div className="space-y-4">
        {educationNotEmpty.map((edu, index) => (
          <div
            key={index}
            className="relative border-l-4 pl-6"
            style={{ borderColor: colorHex ? `${colorHex}40` : "#7c3aed40" }}
          >
            {/* Timeline Dot */}
            <div
              className="absolute -left-2 top-1 h-4 w-4 rounded-full border-2 border-white"
              style={{ backgroundColor: colorHex || "#7c3aed" }}
            />

            <div className="space-y-1">
              <div className="flex items-start justify-between">
                <h3 className="text-base font-bold text-gray-900">
                  {edu.degree}
                </h3>
                {edu.startDate && (
                  <span
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: colorHex ? `${colorHex}15` : "#7c3aed15",
                      color: colorHex || "#7c3aed",
                    }}
                  >
                    {formatDate(edu.startDate, "MMM yyyy")}
                    {edu.endDate
                      ? ` - ${formatDate(edu.endDate, "MMM yyyy")}`
                      : ""}
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-gray-600">
                {edu.school}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
