"use server";

import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
// TEMPORARY: Clerk authentication disabled for testing
// import { auth } from "@clerk/nextjs/server";
import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function deleteResume(id: string) {
  // TEMPORARY: Clerk authentication disabled for testing
  // const { userId } = await auth();
  // if (!userId) {
  //   throw new Error("User not authenticated");
  // }
  const userId = "test-user-123"; // Hardcoded test user ID

  await connectDB();

  const resume = await Resume.findOne({
    _id: id,
    userId,
  });

  if (!resume) {
    throw new Error("Resume not found");
  }

  if (resume.photoUrl) {
    await del(resume.photoUrl);
  }

  await Resume.findByIdAndDelete(id);

  revalidatePath("/resumes");
}
