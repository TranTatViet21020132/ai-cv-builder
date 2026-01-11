"use server";

import { resumeSchema, ResumeValues } from "@/lib/validation";
import { del, put } from "@vercel/blob";
import path from "path";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
// TEMPORARY: Clerk authentication disabled for testing
// import { auth } from "@clerk/nextjs/server";

export async function saveResume(values: ResumeValues) {
  console.log("11111", values);
  // Connect to MongoDB
  await connectDB();

  const { id } = values;

  console.log("Received values:", values);

  const { photo, workExperiences, educations, ...resumeValues } =
    resumeSchema.parse(values); // TEMPORARY: Clerk authentication disabled for testing
  // const { userId } = await auth();
  // if (!userId) {
  //   throw new Error("User not authenticated");
  // }

  console.log("11112", resumeValues.templateId);

  const userId = "test-user-123"; // Hardcoded test user ID

  const existingResume = id ? await Resume.findOne({ _id: id, userId }) : null;

  if (id && !existingResume) {
    throw new Error("Resume not found");
  }

  let newPhotoUrl: string | undefined | null = undefined;

  if (photo instanceof File) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }

    const blob = await put(
      `resume_photos/${crypto.randomUUID()}${path.extname(photo.name)}`,
      photo,
      {
        access: "public",
      },
    );

    newPhotoUrl = blob.url;
  } else if (photo === null) {
    if (existingResume?.photoUrl) {
      await del(existingResume.photoUrl);
    }

    newPhotoUrl = null;
  }

  if (id) {
    // Update existing resume with embedded workExperiences and educations
    const updatedResume = await Resume.findByIdAndUpdate(
      id,
      {
        ...resumeValues,
        ...(newPhotoUrl !== undefined && { photoUrl: newPhotoUrl }),
        workExperiences: workExperiences?.map((exp) => ({
          ...exp,
          startDate: exp.startDate ? new Date(exp.startDate) : undefined,
          endDate: exp.endDate ? new Date(exp.endDate) : undefined,
        })),
        educations: educations?.map((edu) => ({
          ...edu,
          startDate: edu.startDate ? new Date(edu.startDate) : undefined,
          endDate: edu.endDate ? new Date(edu.endDate) : undefined,
        })),
        updatedAt: new Date(),
      },
      { new: true, runValidators: true },
    );

    if (!updatedResume) {
      throw new Error("Failed to update resume");
    } // Properly serialize for client components

    console.log("11113", updatedResume);

    return {
      id: updatedResume._id.toString(),
      userId: updatedResume.userId,
      title: updatedResume.title,
      description: updatedResume.description,
      photoUrl: updatedResume.photoUrl,
      colorHex: updatedResume.colorHex,
      borderStyle: updatedResume.borderStyle,
      templateId: updatedResume.templateId,
      summary: updatedResume.summary,
      firstName: updatedResume.firstName,
      lastName: updatedResume.lastName,
      jobTitle: updatedResume.jobTitle,
      city: updatedResume.city,
      country: updatedResume.country,
      phone: updatedResume.phone,
      email: updatedResume.email,
      skills: updatedResume.skills || [],
      workExperiences: (updatedResume.workExperiences || []).map((exp) => ({
        position: exp.position,
        company: exp.company,
        startDate: exp.startDate ? exp.startDate.toISOString() : null,
        endDate: exp.endDate ? exp.endDate.toISOString() : null,
        description: exp.description,
      })),
      educations: (updatedResume.educations || []).map((edu) => ({
        degree: edu.degree,
        school: edu.school,
        startDate: edu.startDate ? edu.startDate.toISOString() : null,
        endDate: edu.endDate ? edu.endDate.toISOString() : null,
      })),
      createdAt: updatedResume.createdAt.toISOString(),
      updatedAt: updatedResume.updatedAt.toISOString(),
    };
  } else {
    // Create new resume with embedded workExperiences and educations
    const newResume = new Resume({
      ...resumeValues,
      userId,
      ...(newPhotoUrl !== undefined && { photoUrl: newPhotoUrl }),
      workExperiences: workExperiences?.map((exp) => ({
        ...exp,
        startDate: exp.startDate ? new Date(exp.startDate) : undefined,
        endDate: exp.endDate ? new Date(exp.endDate) : undefined,
      })),
      educations: educations?.map((edu) => ({
        ...edu,
        startDate: edu.startDate ? new Date(edu.startDate) : undefined,
        endDate: edu.endDate ? new Date(edu.endDate) : undefined,
      })),
    });

    await newResume.save(); // Properly serialize for client components

    return {
      id: newResume._id.toString(),
      userId: newResume.userId,
      title: newResume.title,
      description: newResume.description,
      photoUrl: newResume.photoUrl,
      colorHex: newResume.colorHex,
      borderStyle: newResume.borderStyle,
      templateId: newResume.templateId,
      summary: newResume.summary,
      firstName: newResume.firstName,
      lastName: newResume.lastName,
      jobTitle: newResume.jobTitle,
      city: newResume.city,
      country: newResume.country,
      phone: newResume.phone,
      email: newResume.email,
      skills: newResume.skills || [],
      workExperiences: (newResume.workExperiences || []).map((exp) => ({
        position: exp.position,
        company: exp.company,
        startDate: exp.startDate ? exp.startDate.toISOString() : null,
        endDate: exp.endDate ? exp.endDate.toISOString() : null,
        description: exp.description,
      })),
      educations: (newResume.educations || []).map((edu) => ({
        degree: edu.degree,
        school: edu.school,
        startDate: edu.startDate ? edu.startDate.toISOString() : null,
        endDate: edu.endDate ? edu.endDate.toISOString() : null,
      })),
      createdAt: newResume.createdAt.toISOString(),
      updatedAt: newResume.updatedAt.toISOString(),
    };
  }
}
