import Image from "next/image";
import logo from "@/assets/logo.png";
import resumeImage from "@/assets/cv.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 px-5 py-12 text-center text-gray-900 md:flex-row md:text-start lg:gap-12">
      <div className="max-w-prose space-y-3">
        <Image
          src={logo}
          alt="logo"
          width={150}
          height={150}
          className="mx-auto md:ms-0"
        />
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-3xl">
          Create{" "}
          <span className="inline-block bg-gradient-to-r from-purple-800 to-purple-600 bg-clip-text font-bold text-transparent">
            Perfect ATS Friendly Resumes
          </span>{" "}
          in minutes
        </h1>
        <p className="text-lg text-gray-500">
          Our <span className="font-bold">AI resume builder</span> helps you
          create a perfect ATS friendly resume in minutes even, if you
          don&apos;t have any resume writing experience.
        </p>
        <Button asChild size="lg" variant="premium">
          <Link href="/resumes">Get Started</Link>
        </Button>
      </div>
      <div>
        <Image
          src={resumeImage}
          alt="Resume Preview"
          width={420}
          className="shadow-md lg:rotate-[2.5deg]"
        />
      </div>
    </main>
  );
}
