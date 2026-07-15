"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";

export function AlertBanner({
  type,
  message,
}: {
  type: "error" | "success";
  message: string;
}) {
  if (!message) return null;

  if (type === "error") {
    return (
      <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <AlertCircle className="h-4 w-4 shrink-0" />
        {message}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-[#15803D]">
      <CheckCircle2 className="h-4 w-4 shrink-0" />
      {message}
    </div>
  );
}
