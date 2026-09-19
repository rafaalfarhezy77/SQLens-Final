"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  LogIn,
  AlertTriangle,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { loginAction } from "@/lib/auth/actions";
import type { AuthActionState } from "@/lib/schemas/auth";
import { Input } from "@/components/ui/input";

const initialState: AuthActionState = {};

export function LoginForm() {
  const searchParams = useSearchParams();
  const isUnauthorized = searchParams.get("unauthorized") === "1";

  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  const [emailVal, setEmailVal] = useState("student@sqlens.edu");
  const [passwordVal, setPasswordVal] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);

  const emailError = state.fieldErrors?.email?.[0];
  const passwordError = state.fieldErrors?.password?.[0];

  const handleAutoFill = () => {
    setEmailVal("student@sqlens.edu");
    setPasswordVal("password123");
  };

  return (
    <form action={formAction} className="space-y-4">
      {/* Unauthorized Redirect Warning Banner (from Middleware) */}
      {isUnauthorized && (
        <div className="p-3 bg-[#FFF3A3] border-2 border-[#111111] shadow-[3px_3px_0px_0px_#111111] text-xs font-mono space-y-1">
          <div className="flex items-center gap-2 font-black text-[#111111]">
            <AlertTriangle size={16} className="text-[#111111] shrink-0" />
            <span>AKSES DIBATASI (ROUTE GUARD)</span>
          </div>
          <p className="text-black/80">
            Halaman Dashboard dilindungi. Silakan masuk terlebih dahulu untuk
            mengakses fitur praktikum.
          </p>
        </div>
      )}

      {/* General Form Error */}
      {state.message && !state.success && (
        <div
          role="alert"
          className="p-3.5 bg-red-50 border-2 border-[#111111] shadow-[3px_3px_0px_0px_#111111] text-xs font-mono flex items-start gap-2"
        >
          <AlertCircle
            aria-hidden="true"
            size={16}
            className="text-[#FF5A5F] shrink-0 mt-0.5"
          />
          <div>
            <p className="font-bold text-[#FF5A5F]">{state.message}</p>
            <p className="text-[10px] text-black/70 mt-0.5">
              Pastikan email terdaftar dan kata sandi benar.
            </p>
          </div>
        </div>
      )}

      {/* Compact Demo Account Helper */}
      <div className="p-3 bg-[#FFF3A3] border-2 border-[#111111] shadow-[2px_2px_0_#111111] flex items-center justify-between gap-2">
        <div className="font-mono text-[11px] leading-tight">
          <span className="font-black uppercase text-[#111111] flex items-center gap-1">
            <Sparkles size={12} /> Demo Account:
          </span>
          <span className="text-[#333333]">
            student@sqlens.edu &bull; password123
          </span>
        </div>
        <button
          type="button"
          onClick={handleAutoFill}
          className="px-2.5 py-1.5 bg-white hover:bg-black hover:text-[#FFD600] border-2 border-[#111111] font-mono font-bold text-[11px] uppercase shadow-[1px_1px_0_#111111] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-black cursor-pointer"
        >
          Auto Fill
        </button>
      </div>

      {/* Email Field */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block font-mono text-xs font-bold uppercase tracking-wider text-[#111111]"
        >
          EMAIL <span className="text-[#FF5A5F]">*</span>
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="student@example.com"
          autoComplete="email"
          value={emailVal}
          onChange={(e) => setEmailVal(e.target.value)}
          variant={emailError ? "error" : "default"}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "login-email-error" : undefined}
          className="p-3 text-sm"
        />
        {emailError && (
          <p
            id="login-email-error"
            role="alert"
            className="text-[11px] font-mono font-bold text-[#FF5A5F] mt-1 flex items-center gap-1"
          >
            <span>✕</span> {emailError}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block font-mono text-xs font-bold uppercase tracking-wider text-[#111111]"
          >
            PASSWORD <span className="text-[#FF5A5F]">*</span>
          </label>
        </div>

        <div className="relative flex items-center">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 8 characters"
            autoComplete="current-password"
            value={passwordVal}
            onChange={(e) => setPasswordVal(e.target.value)}
            variant={passwordError ? "error" : "default"}
            aria-invalid={Boolean(passwordError)}
            aria-describedby={
              passwordError ? "login-password-error" : undefined
            }
            className="p-3 pr-20 text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 px-2.5 py-1 bg-white border-2 border-[#111111] font-mono font-bold text-xs uppercase shadow-[1px_1px_0_#111111] hover:bg-[#FFD600] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
            <span>{showPassword ? "HIDE" : "SHOW"}</span>
          </button>
        </div>

        {passwordError && (
          <p
            id="login-password-error"
            role="alert"
            className="text-[11px] font-mono font-bold text-[#FF5A5F] mt-1 flex items-center gap-1"
          >
            <span>✕</span> {passwordError}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full neo-btn py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[4px_4px_0_#111111] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 mt-2"
      >
        <LogIn size={16} />
        <span>{isPending ? "Memverifikasi Kredensial..." : "SIGN IN"}</span>
      </button>
    </form>
  );
}
