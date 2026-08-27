"use client";

import { CheckCircle2, CircleAlert, Info, LoaderCircle, TriangleAlert, X } from "lucide-react";
import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-center"
      offset={16}
      mobileOffset={16}
      richColors
      closeButton
      icons={{
        success: <CheckCircle2 className="h-5 w-5" />,
        info: <Info className="h-5 w-5" />,
        warning: <TriangleAlert className="h-5 w-5" />,
        error: <CircleAlert className="h-5 w-5" />,
        loading: <LoaderCircle className="h-5 w-5 animate-spin" />,
        close: <X className="h-4 w-4" />
      }}
      toastOptions={{
        classNames: {
          toast: "!rounded-control !border-border !bg-apex-surface !font-sans !text-apex-ink !shadow-floating",
          title: "!font-bold",
          description: "!text-apex-muted",
          actionButton: "!rounded-xl !bg-apex-blue !font-bold !text-white",
          cancelButton: "!rounded-xl !bg-apex-soft !font-bold !text-apex-ink",
          closeButton: "!border-border !bg-apex-surface !text-apex-muted"
        }
      }}
    />
  );
}
