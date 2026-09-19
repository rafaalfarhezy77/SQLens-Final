import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Buat akun SQLens untuk memulai pembelajaran SQL interaktif dan visual.",
};

export default function RegisterPage() {
  return (
    <div className="neo-card p-6 sm:p-8 bg-white space-y-6 shadow-[6px_6px_0_#111111]">
      {/* Heading Section */}
      <div className="space-y-1.5 border-b-2 border-[#111111] pb-4">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#111111]">
          CREATE YOUR ACCOUNT.
        </h1>
        <p className="font-mono text-xs font-bold uppercase text-[#555555] tracking-wider">
          Start learning SQL with visual feedback.
        </p>
        <p className="text-xs text-[#444444] font-medium leading-relaxed pt-1">
          Daftar akun SQLens untuk mempraktikkan kueri database relasional
          secara interaktif dan visual.
        </p>
      </div>

      {/* Form with Suspense */}
      <Suspense
        fallback={
          <div className="space-y-4 py-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        }
      >
        <RegisterForm />
      </Suspense>

      {/* Card Footer Link */}
      <div className="pt-4 border-t-2 border-[#111111] flex items-center justify-between text-xs font-mono">
        <span className="text-[#555555]">Already have an account?</span>
        <Link
          href="/login"
          className="font-bold uppercase underline hover:bg-[#FFF3A3] p-0.5 text-[#111111]"
        >
          SIGN IN HERE &rarr;
        </Link>
      </div>
    </div>
  );
}
