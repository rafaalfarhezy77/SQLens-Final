"use client";

import { useState } from "react";
import { KeyRound, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface PasswordFieldProps {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  defaultValue?: string;
  error?: string;
}

export function PasswordField({
  id,
  name,
  label,
  placeholder = "••••••••",
  autoComplete = "current-password",
  defaultValue = "",
  error,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="block text-xs font-mono font-bold uppercase tracking-wider text-[#111111]"
        >
          {label}
        </label>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black/50">
          <KeyRound size={16} />
        </div>

        <Input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          defaultValue={defaultValue}
          variant={error ? "error" : "default"}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          hasIcon
          className="pr-10"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={
            showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
          }
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-black/50 hover:text-black cursor-pointer"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-[11px] font-mono font-bold text-[#ef4444] mt-1 flex items-center gap-1"
        >
          <span>✕</span> {error}
        </p>
      )}
    </div>
  );
}
