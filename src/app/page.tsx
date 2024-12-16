'use client'

import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { Github, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="absolute top-5 left-5 flex items-center gap-2">
        {session?.user?.name && (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{session.user.name}</span>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            MongoDB integration with{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              Prisma ORM
            </code>
            {" "}for data storage.
          </li>
          <li className="mb-2">
            Authentication with{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              NextAuth.js
            </code>
            {" "}and MongoDB.
          </li>
          <li>
            Dark mode with{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              next-themes
            </code>
            {" "}support.
          </li>
        </ol>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/Nyaughh/nextjs-starter"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github aria-hidden width={16} height={16} />
          GitHub →
        </a>
        {!session?.user && (
          <Link
            href="/auth"
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          >
            <LogIn aria-hidden width={16} height={16} />
            Sign In →
          </Link>
        )}
      </footer>
    </div>
  );
}
