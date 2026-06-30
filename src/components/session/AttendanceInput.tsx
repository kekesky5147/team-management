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
      <section className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
        <Input
          ref={inputRef}
          value={name}
          onChange={(event) => setName(event.target.value)}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          onKeyDown={handleKeyDown}
          placeholder="선수 이름을 입력하세요"
          className="min-h-11 flex-1 text-base"
          aria-label="선수 이름 입력"
        />
        <Button
          type="button"
          onClick={handleSubmit}
          className="min-h-11 gap-2 px-5 text-base sm:w-auto"
        >
          <Plus className="size-4" />
          추가
        </Button>
      </section>

      <AlertDialog open={duplicateOpen} onOpenChange={handleDuplicateOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>중복된 이름</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{pendingName}&quot; 이름이 이미 출석 리스트에 있습니다.
              그래도 추가할까요?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDuplicateConfirm}>
              추가
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
