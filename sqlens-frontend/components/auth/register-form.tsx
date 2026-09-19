"use client";

import { useActionState, useState } from "react";
import { UserPlus, AlertCircle, Eye, EyeOff } from "lucide-react";
import { registerAction } from "@/lib/auth/actions";
import type { AuthActionState } from "@/lib/schemas/auth";
import { Input } from "@/components/ui/input";

const initialState: AuthActionState = {};

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState,
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const nameError = state.fieldErrors?.name?.[0];
  const emailError = state.fieldErrors?.email?.[0];
  const passwordError = state.fieldErrors?.password?.[0];
  const confirmPasswordError = state.fieldErrors?.confirmPassword?.[0];

  // Requirements checks
  const hasLength = password.length >= 6;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const passedCount = [hasLength, hasUpper, hasLower, hasNumber].filter(
    Boolean,
  ).length;
  let strengthLabel = "NO INPUT";
  let strengthColor = "bg-neutral-300";
  let strengthWidth = "0%";

  if (password.length > 0) {
    if (passedCount <= 1) {
      strengthLabel = "WEAK";
      strengthColor = "bg-[#FF5A5F]";
      strengthWidth = "25%";
    } else if (passedCount <= 3) {
      strengthLabel = "MEDIUM";
      strengthColor = "bg-[#FFD600]";
      strengthWidth = "65%";
    } else {
      strengthLabel = "STRONG";
      strengthColor = "bg-[#00D084]";
      strengthWidth = "100%";
    }
  }

  return (
    <form action={formAction} className="space-y-4">
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
              Silakan lengkapi semua kolom yang bertanda error.
            </p>
          </div>
        </div>
      )}

      {/* Full Name Field */}
      <div className="space-y-1">
        <label
          htmlFor="name"
          className="block font-mono text-xs font-bold uppercase tracking-wider text-[#111111]"
        >
          FULL NAME <span className="text-[#FF5A5F]">*</span>
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Andi Saputra"
          autoComplete="name"
          variant={nameError ? "error" : "default"}
          aria-invalid={Boolean(nameError)}
          aria-describedby={nameError ? "register-name-error" : undefined}
          className="p-2.5 text-xs sm:text-sm"
        />
        {nameError && (
          <p
            id="register-name-error"
            role="alert"
            className="text-[11px] font-mono font-bold text-[#FF5A5F] mt-1 flex items-center gap-1"
          >
            <span>✕</span> {nameError}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-1">
        <label
          htmlFor="reg-email"
          className="block font-mono text-xs font-bold uppercase tracking-wider text-[#111111]"
        >
          EMAIL <span className="text-[#FF5A5F]">*</span>
        </label>
        <Input
          id="reg-email"
          name="email"
          type="email"
          placeholder="andi@example.com"
          autoComplete="email"
          variant={emailError ? "error" : "default"}
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "register-email-error" : undefined}
          className="p-2.5 text-xs sm:text-sm"
        />
        {emailError && (
          <p
            id="register-email-error"
            role="alert"
            className="text-[11px] font-mono font-bold text-[#FF5A5F] mt-1 flex items-center gap-1"
          >
            <span>✕</span> {emailError}
          </p>
        )}
      </div>

      {/* Role Selector */}
      <div className="space-y-1">
        <label
          htmlFor="role"
          className="block font-mono text-xs font-bold uppercase tracking-wider text-[#111111]"
        >
          ROLE <span className="text-[#FF5A5F]">*</span>
        </label>
        <select
          id="role"
          name="role"
          defaultValue="mahasiswa"
          className="w-full bg-[#F7F7F2] border-2 border-[#111111] p-2.5 font-mono text-xs sm:text-sm text-[#111111] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
        >
          <option value="mahasiswa">Student (Mahasiswa)</option>
          <option value="dosen">Lecturer / Teaching Assistant (Dosen)</option>
        </select>
      </div>

      {/* Password Field */}
      <div className="space-y-1">
        <label
          htmlFor="reg-password"
          className="block font-mono text-xs font-bold uppercase tracking-wider text-[#111111]"
        >
          PASSWORD <span className="text-[#FF5A5F]">*</span>
        </label>

        <div className="relative flex items-center">
          <Input
            id="reg-password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 6 characters"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant={passwordError ? "error" : "default"}
            aria-invalid={Boolean(passwordError)}
            aria-describedby={
              passwordError ? "register-password-error" : undefined
            }
            className="p-2.5 pr-20 text-xs sm:text-sm"
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
            id="register-password-error"
            role="alert"
            className="text-[11px] font-mono font-bold text-[#FF5A5F] mt-1 flex items-center gap-1"
          >
            <span>✕</span> {passwordError}
          </p>
        )}
      </div>

      {/* Password Requirements Checklist Box matching reference */}
      <div className="p-3 bg-[#F7F7F2] border-2 border-[#111111] space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-black uppercase tracking-wider text-[#333333]">
            PASSWORD REQUIREMENTS:
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] uppercase text-[#666666]">
              Strength:
            </span>
            <span className="font-mono text-[11px] font-black uppercase text-[#111111]">
              {strengthLabel}
            </span>
          </div>
        </div>

        {/* Strength Bar Indicator */}
        <div className="w-full h-2 bg-neutral-200 border border-[#111111] overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strengthColor}`}
            style={{ width: strengthWidth }}
          />
        </div>

        {/* Checklist items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium">
            <span
              className={`w-4 h-4 border border-[#111111] flex items-center justify-center shrink-0 text-[10px] font-bold ${
                hasLength
                  ? "bg-[#00D084] text-black"
                  : "bg-neutral-200 text-neutral-600"
              }`}
            >
              {hasLength ? "✓" : "-"}
            </span>
            <span>6+ Characters</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono font-medium">
            <span
              className={`w-4 h-4 border border-[#111111] flex items-center justify-center shrink-0 text-[10px] font-bold ${
                hasUpper
                  ? "bg-[#00D084] text-black"
                  : "bg-neutral-200 text-neutral-600"
              }`}
            >
              {hasUpper ? "✓" : "-"}
            </span>
            <span>Uppercase Letter</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono font-medium">
            <span
              className={`w-4 h-4 border border-[#111111] flex items-center justify-center shrink-0 text-[10px] font-bold ${
                hasLower
                  ? "bg-[#00D084] text-black"
                  : "bg-neutral-200 text-neutral-600"
              }`}
            >
              {hasLower ? "✓" : "-"}
            </span>
            <span>Lowercase Letter</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono font-medium">
            <span
              className={`w-4 h-4 border border-[#111111] flex items-center justify-center shrink-0 text-[10px] font-bold ${
                hasNumber
                  ? "bg-[#00D084] text-black"
                  : "bg-neutral-200 text-neutral-600"
              }`}
            >
              {hasNumber ? "✓" : "-"}
            </span>
            <span>Number (0-9)</span>
          </div>
        </div>
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-1">
        <label
          htmlFor="confirmPassword"
          className="block font-mono text-xs font-bold uppercase tracking-wider text-[#111111]"
        >
          CONFIRM PASSWORD <span className="text-[#FF5A5F]">*</span>
        </label>

        <div className="relative flex items-center">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Repeat your password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            variant={confirmPasswordError ? "error" : "default"}
            aria-invalid={Boolean(confirmPasswordError)}
            aria-describedby={
              confirmPasswordError
                ? "register-confirm-password-error"
                : undefined
            }
            className="p-2.5 pr-20 text-xs sm:text-sm"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2 px-2.5 py-1 bg-white border-2 border-[#111111] font-mono font-bold text-xs uppercase shadow-[1px_1px_0_#111111] hover:bg-[#FFD600] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer"
            aria-label={
              showConfirmPassword
                ? "Hide confirm password"
                : "Show confirm password"
            }
          >
            {showConfirmPassword ? <EyeOff size={13} /> : <Eye size={13} />}
            <span>{showConfirmPassword ? "HIDE" : "SHOW"}</span>
          </button>
        </div>

        {confirmPasswordError && (
          <p
            id="register-confirm-password-error"
            role="alert"
            className="text-[11px] font-mono font-bold text-[#FF5A5F] mt-1 flex items-center gap-1"
          >
            <span>✕</span> {confirmPasswordError}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full neo-btn py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[4px_4px_0_#111111] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 mt-2"
      >
        <UserPlus size={16} />
        <span>{isPending ? "Mendaftarkan Akun..." : "CREATE ACCOUNT"}</span>
      </button>
    </form>
  );
}
