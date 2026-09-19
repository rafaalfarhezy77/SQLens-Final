import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type InputVariant = "default" | "error";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: InputVariant;
  hasIcon?: boolean;
}

/**
 * Shared SQLens input primitive. It is deliberately server-compatible: behavior
 * comes from the consuming form, while this component only supplies semantics
 * and visual variants.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, variant = "default", type = "text", hasIcon, ...props },
    ref,
  ) => {
    const isIconSpecified = hasIcon || className?.includes("pl-");

    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "w-full py-2.5 bg-[#F7F7F2] border-2 font-mono text-xs focus:outline-none focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed",
          isIconSpecified ? "pl-9 pr-3.5" : "px-3.5",
          variant === "error"
            ? "border-[#ef4444] bg-red-50/50 text-[#111111] focus:shadow-[2px_2px_0px_0px_#ef4444]"
            : "border-[#111111] text-[#111111] focus:shadow-[2px_2px_0px_0px_#111111]",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
