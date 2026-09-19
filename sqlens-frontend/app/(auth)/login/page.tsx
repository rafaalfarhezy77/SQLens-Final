import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Masuk ke SQLens - Database Query Tutor. Lanjutkan progres pembelajaran SQL kamu.",
};

export default function LoginPage() {
  return (
    <div className="neo-card p-6 sm:p-8 bg-white space-y-6 shadow-[6px_6px_0_#111111]">
      {/* Heading Section */}
      <div className="space-y-1.5 border-b-2 border-[#111111] pb-4">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#111111]">
          WELCOME BACK.
        </h1>
        <p className="font-mono text-xs font-bold uppercase text-[#555555] tracking-wider">
          Continue your SQL learning journey.
        </p>
        <p className="text-xs text-[#444444] font-medium leading-relaxed pt-1">
          Masuk ke SQLens untuk membuka Learning Dashboard, SQL Playground, AI
          Tutor, dan Query History.
        </p>
      </div>

      {/* Form with Suspense */}
      <Suspense
        fallback={
          <div className="space-y-4 py-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>

      {/* Card Footer Link */}
      <div className="pt-4 border-t-2 border-[#111111] flex items-center justify-between text-xs font-mono">
        <span className="text-[#555555]">Don&apos;t have an account?</span>
        <Link
          href="/register"
          className="font-bold uppercase underline hover:bg-[#FFF3A3] p-0.5 text-[#111111]"
        >
          REGISTER HERE &rarr;
        </Link>
      </div>
    </div>
  );
}
