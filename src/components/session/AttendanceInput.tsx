"use client";

import { Plus } from "lucide-react";
import { useRef, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  appleDialogContent,
  appleInput,
  appleInputSurface,
  applePrimaryButton,
} from "@/lib/apple-ui";

type AttendanceInputProps = {
  onAdd: (name: string) => void;
  checkDuplicateName: (name: string) => boolean;
};

export function AttendanceInput({
  onAdd,
  checkDuplicateName,
}: AttendanceInputProps) {
  const [name, setName] = useState("");
  const [pendingName, setPendingName] = useState("");
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isComposingRef = useRef(false);

  const submitName = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    if (checkDuplicateName(trimmed)) {
      setPendingName(trimmed);
      setDuplicateOpen(true);
      return;
    }

    onAdd(trimmed);
    setName("");
    inputRef.current?.focus();
  };

  const handleSubmit = () => {
    submitName(inputRef.current?.value ?? name);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    if (isComposingRef.current || event.nativeEvent.isComposing) return;

    event.preventDefault();
    submitName(event.currentTarget.value);
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = (
    event: React.CompositionEvent<HTMLInputElement>,
  ) => {
    isComposingRef.current = false;
    setName(event.currentTarget.value);
  };

  const handleDuplicateOpenChange = (open: boolean) => {
    setDuplicateOpen(open);
    if (!open) {
      setPendingName("");
    }
  };

  const handleDuplicateConfirm = () => {
    onAdd(pendingName);
    setName("");
    setPendingName("");
    setDuplicateOpen(false);
    inputRef.current?.focus();
  };

  return (
    <>
      <section
        className={`${appleInputSurface} flex flex-col gap-4 sm:flex-row sm:items-center`}
      >
        <Input
          ref={inputRef}
          value={name}
          onChange={(event) => setName(event.target.value)}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onKeyDown={handleKeyDown}
          placeholder="선수 이름을 입력하세요"
          className={appleInput}
          aria-label="선수 이름 입력"
        />
        <Button type="button" onClick={handleSubmit} className={applePrimaryButton}>
          <Plus className="size-4" />
          추가
        </Button>
      </section>

      <AlertDialog open={duplicateOpen} onOpenChange={handleDuplicateOpenChange}>
        <AlertDialogContent className={appleDialogContent}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-neutral-100">
              중복된 이름
            </AlertDialogTitle>
            <AlertDialogDescription className="font-light text-neutral-400">
              &quot;{pendingName}&quot; 이름이 이미 출석 리스트에 있습니다.
              그래도 추가할까요?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="min-h-11 rounded-xl border-0 bg-white/8 text-neutral-200 hover-hover:bg-white/12">
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDuplicateConfirm}
              className={`${applePrimaryButton} min-h-10`}
            >
              추가
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
