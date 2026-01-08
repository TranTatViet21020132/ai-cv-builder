"use client";

import logo from "@/assets/logo.png";
import ThemeToggle from "@/components/ThemeToggle";
// TEMPORARY: UserButton and Clerk imports disabled for testing
// import { UserButton } from "@clerk/nextjs";
// import { dark } from "@clerk/themes";
// import { CreditCard } from "lucide-react";
// import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  // TEMPORARY: theme hook disabled (was used for UserButton appearance)
  // const { theme } = useTheme();

  return (
    <header className="shadow-sm">
           {" "}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 p-3">
               {" "}
        <Link href="/resumes" className="flex items-center gap-2">
                   {" "}
          <Image
            src={logo}
            alt="Logo"
            width={35}
            height={35}
            className="rounded-full"
          />
                   {" "}
          <span className="text-xl font-bold tracking-tight">
                        AI Resume Builder          {" "}
          </span>
                 {" "}
        </Link>
               {" "}
        <div className="flex items-center gap-3">
                    <ThemeToggle />         {" "}
          {/* TEMPORARY: UserButton disabled for testing */}         {" "}
          {/* <UserButton
            appearance={{
              baseTheme: theme === "dark" ? dark : undefined,
              elements: {
                avatarBox: {
                  width: 35,
                  height: 35,
                },
              },
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Link
                label="Billing"
                labelIcon={<CreditCard className="size-4" />}
                href="/billing"
              />
            </UserButton.MenuItems>
          </UserButton> */}
                   {" "}
          <div className="rounded-md bg-yellow-100 px-3 py-1.5 text-sm font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Test Mode          {" "}
          </div>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </header>
  );
}
