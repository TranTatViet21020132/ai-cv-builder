import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ResumeServerData, ResumeClientData } from "./types";
import { ResumeValues, TEMPLATE_IDS } from "./validation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fileReplacer(key: unknown, value: unknown) {
  return value instanceof File
    ? {
        name: value.name,
        size: value.size,
        type: value.type,
        lastModified: value.lastModified,
      }
    : value;
}

// Type guard to check if a string is a valid template ID
function isValidTemplateId(id: string | undefined): id is typeof TEMPLATE_IDS[number] {
  return id !== undefined && TEMPLATE_IDS.includes(id as typeof TEMPLATE_IDS[number]);
}

export function mapToResumeValues(
  data: ResumeServerData | ResumeClientData,
): ResumeValues {
  return {
    id: data.id,
    title: data.title || undefined,
    description: data.description || undefined,
    photo: data.photoUrl || undefined,
    firstName: data.firstName || undefined,
    lastName: data.lastName || undefined,
    jobTitle: data.jobTitle || undefined,
    city: data.city || undefined,
    country: data.country || undefined,
    phone: data.phone || undefined,
    email: data.email || undefined,
    workExperiences: data.workExperiences?.map((exp) => ({
      position: exp.position || undefined,
      company: exp.company || undefined,
      startDate: exp.startDate
        ? typeof exp.startDate === "string"
          ? exp.startDate.split("T")[0]
          : exp.startDate.toISOString().split("T")[0]
        : undefined,
      endDate: exp.endDate
        ? typeof exp.endDate === "string"
          ? exp.endDate.split("T")[0]
          : exp.endDate.toISOString().split("T")[0]
        : undefined,
      description: exp.description || undefined,
    })),
    educations: data.educations?.map((edu) => ({
      degree: edu.degree || undefined,
      school: edu.school || undefined,
      startDate: edu.startDate
        ? typeof edu.startDate === "string"
          ? edu.startDate.split("T")[0]
          : edu.startDate.toISOString().split("T")[0]
        : undefined,
      endDate: edu.endDate
        ? typeof edu.endDate === "string"
          ? edu.endDate.split("T")[0]
          : edu.endDate.toISOString().split("T")[0]
        : undefined,
    })),
    skills: data.skills,
    borderStyle: data.borderStyle,
    colorHex: data.colorHex,
    templateId: isValidTemplateId(data.templateId)
      ? data.templateId
      : "classic",
    summary: data.summary || undefined,
  };
}
