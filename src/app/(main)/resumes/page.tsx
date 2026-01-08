import { canCreateResume } from "@/lib/permissions";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { getUserSubscriptionLevel } from "@/lib/subscription";
import { ResumeClientData } from "@/lib/types";
// TEMPORARY: Clerk authentication disabled for testing
// import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import CreateResumeButton from "./CreateResumeButton";
import ResumeItem from "./ResumeItem";

export const metadata: Metadata = {
  title: "Your resumes",
};

export default async function Page() {
  // TEMPORARY: Clerk authentication disabled for testing
  // const { userId } = await auth();
  // if (!userId) {
  //   return null;
  // }
  const userId = "test-user-123"; // Hardcoded test user ID

  await connectDB();

  const [resumeDocs, totalCount, subscriptionLevel] = await Promise.all([
    Resume.find({ userId }).sort({ updatedAt: -1 }),
    Resume.countDocuments({ userId }),
    getUserSubscriptionLevel(userId),
  ]); // Convert Mongoose documents to plain objects for serialization with string dates

  const resumes: ResumeClientData[] = resumeDocs.map((doc) => {
    const obj = doc.toObject();
    return {
      id: obj._id.toString(),
      userId: obj.userId,
      title: obj.title,
      description: obj.description,
      photoUrl: obj.photoUrl,
      colorHex: obj.colorHex,
      borderStyle: obj.borderStyle,
      summary: obj.summary,
      firstName: obj.firstName,
      lastName: obj.lastName,
      jobTitle: obj.jobTitle,
      city: obj.city,
      country: obj.country,
      phone: obj.phone,
      email: obj.email,
      skills: obj.skills || [], // Serialize dates to ISO strings
      createdAt: obj.createdAt.toISOString(),
      updatedAt: obj.updatedAt.toISOString(), // Properly serialize work experiences with date handling
      workExperiences: (obj.workExperiences ?? []).map((exp) => ({
        position: exp.position,
        company: exp.company,
        startDate: exp.startDate ? exp.startDate.toISOString() : null,
        endDate: exp.endDate ? exp.endDate.toISOString() : null,
        description: exp.description,
      })), // Properly serialize educations with date handling
      educations: (obj.educations ?? []).map((edu) => ({
        degree: edu.degree,
        school: edu.school,
        startDate: edu.startDate ? edu.startDate.toISOString() : null,
        endDate: edu.endDate ? edu.endDate.toISOString() : null,
      })),
    };
  });

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
           {" "}
      <CreateResumeButton
        canCreate={canCreateResume(subscriptionLevel, totalCount)}
      />
           {" "}
      <div className="space-y-1">
                <h1 className="text-3xl font-bold">Your resumes</h1>       {" "}
        <p>Total: {totalCount}</p>     {" "}
      </div>
           {" "}
      <div className="flex w-full grid-cols-2 flex-col gap-3 sm:grid md:grid-cols-3 lg:grid-cols-4">
               {" "}
        {resumes.map((resume) => (
          <ResumeItem key={resume.id} resume={resume} />
        ))}
             {" "}
      </div>
         {" "}
    </main>
  );
}
