import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
// TEMPORARY: Clerk authentication disabled for testing
// import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import ResumeEditor from "./ResumeEditor";

interface PageProps {
  searchParams: Promise<{ resumeId?: string }>;
}

export const metadata: Metadata = {
  title: "Design your resume",
};

export default async function Page({ searchParams }: PageProps) {
  const { resumeId } = await searchParams; // TEMPORARY: Clerk authentication disabled for testing
  // const { userId } = await auth();
  // if (!userId) {
  //   return null;
  // }

  const userId = "test-user-123"; // Hardcoded test user ID

  await connectDB();

  const resumeDoc = resumeId
    ? await Resume.findOne({ _id: resumeId, userId })
    : null; // Properly serialize the Mongoose document for client component

  const resumeToEdit = resumeDoc
    ? {
        id: resumeDoc._id.toString(),
        userId: resumeDoc.userId,
        title: resumeDoc.title,
        description: resumeDoc.description,
        photoUrl: resumeDoc.photoUrl,
        colorHex: resumeDoc.colorHex,
        borderStyle: resumeDoc.borderStyle,
        summary: resumeDoc.summary,
        firstName: resumeDoc.firstName,
        lastName: resumeDoc.lastName,
        jobTitle: resumeDoc.jobTitle,
        city: resumeDoc.city,
        country: resumeDoc.country,
        phone: resumeDoc.phone,
        email: resumeDoc.email,
        skills: resumeDoc.skills || [],
        workExperiences: (resumeDoc.workExperiences || []).map((exp) => ({
          position: exp.position,
          company: exp.company,
          startDate: exp.startDate ? exp.startDate.toISOString() : null,
          endDate: exp.endDate ? exp.endDate.toISOString() : null,
          description: exp.description,
        })),
        educations: (resumeDoc.educations || []).map((edu) => ({
          degree: edu.degree,
          school: edu.school,
          startDate: edu.startDate ? edu.startDate.toISOString() : null,
          endDate: edu.endDate ? edu.endDate.toISOString() : null,
        })),
        createdAt: resumeDoc.createdAt.toISOString(),
        updatedAt: resumeDoc.updatedAt.toISOString(),
      }
    : null;

  return <ResumeEditor resumeToEdit={resumeToEdit} />;
}
