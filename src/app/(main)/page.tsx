import Image from "next/image";
import logo from "@/assets/logo.png";
import resumeImage from "@/assets/cv.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl flex-col items-center justify-center gap-10 px-4 py-14 md:flex-row md:justify-between">
        {/* Left */}
        <div className="max-w-xl space-y-5 text-center md:text-left">
          <Image
            src={logo}
            alt="logo"
            width={150}
            height={150}
            className="mx-auto md:mx-0"
            priority
          />

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Create{" "}
            <span className="bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent">
              ATS-friendly resumes
            </span>{" "}
            in minutes
          </h1>

          <p className="text-lg text-muted-foreground">
            Our{" "}
            <span className="font-semibold text-foreground">
              AI resume builder
            </span>{" "}
            helps you craft a clean, professional resume, even if youve never
            written one before.
          </p>

          <ul className="mx-auto grid max-w-lg gap-2 text-left text-sm text-muted-foreground md:mx-0">
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />
              Multiple modern templates (Classic, Modern, Compact, etc.)
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />
              AI-assisted summaries and experience descriptions
            </li>
            <li className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />
              Customize theme colors and layout quickly
            </li>
          </ul>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
            <Button asChild size="lg" variant="premium">
              <Link href="/resumes">Get Started</Link>
            </Button>

            <Button asChild size="lg" variant="secondary">
              <Link href="/editor">Open Editor</Link>
            </Button>
          </div>
        </div>

        {/* Right */}
        <div className="relative">
          <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-purple-500/20 to-cyan-500/10 blur-2xl" />
          <Image
            src={resumeImage}
            alt="Resume Preview"
            width={460}
            className="rounded-xl border bg-card shadow-lg md:rotate-[2deg]"
            priority
          />
        </div>
      </div>
    </main>
  );
}
