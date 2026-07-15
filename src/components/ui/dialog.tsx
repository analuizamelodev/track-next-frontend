"use client";

import { ReactNode, useEffect, useRef } from "react";
import { X } from "lucide-react";

export type DialogVariant = "default" | "danger" | "success" | "warning";

const headerColor: Record<DialogVariant, string> = {
  default: "bg-[#F0FDF4] border-green-100",
  danger: "bg-red-50 border-red-100",
  success: "bg-green-50 border-green-100",
  warning: "bg-amber-50 border-amber-100",
};

const iconColor: Record<DialogVariant, string> = {
  default: "bg-[#DCFCE7] text-[#15803D]",
  danger: "bg-red-100 text-red-700",
  success: "bg-green-100 text-[#15803D]",
  warning: "bg-amber-100 text-amber-700",
};

export function Dialog({
  title,
  subtitle,
  onClose,
  children,
  variant = "default",
  icon,
  open = true,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  variant?: DialogVariant;
  icon?: ReactNode;
  open?: boolean;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white shadow-xl">
        <div
          className={`flex items-start gap-3 rounded-t-2xl border-b p-5 ${headerColor[variant]}`}
        >
          {icon && (
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconColor[variant]}`}
            >
              {icon}
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-[#111827]">{title}</h3>
            {subtitle && (
              <p className="mt-0.5 text-sm text-[#6B7280]">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#6B7280] transition hover:bg-black/5 hover:text-[#111827]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
