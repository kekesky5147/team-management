"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import {
  appleBottomSheetHandle,
  appleBottomSheetOverlay,
  appleBottomSheetPanel,
  appleTouchIconButton,
} from "@/lib/apple-ui";
import { cn } from "@/lib/utils";

type BottomSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function BottomSheet({
  open,
  onOpenChange,
  title,
  children,
  footer,
}: BottomSheetProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!mounted) return null;

  const state = open && visible ? "open" : "closed";

  return createPortal(
    <div
      aria-hidden={!open}
      className={cn(open ? "pointer-events-auto" : "pointer-events-none")}
    >
      <button
        type="button"
        aria-label="닫기"
        data-state={state}
        className={cn(appleBottomSheetOverlay, !open && "pointer-events-none")}
        onClick={() => onOpenChange(false)}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bottom-sheet-title"
        data-state={state}
        className={appleBottomSheetPanel}
      >
        <div className={appleBottomSheetHandle} aria-hidden="true" />

        <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-2">
          <h2
            id="bottom-sheet-title"
            className="text-lg font-semibold tracking-tight text-neutral-100"
          >
            {title}
          </h2>
          <Button
            type="button"
            variant="ghost"
            className={appleTouchIconButton}
            aria-label="닫기"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5">{children}</div>

        {footer && (
          <div className="shrink-0 border-0 bg-neutral-900/95 px-5 pb-5 pt-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
