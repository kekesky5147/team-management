"use client";

import { RotateCcw, Users } from "lucide-react";
import { useState } from "react";

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatSessionDate } from "@/lib/session";

type SessionHeaderProps = {
  sessionDate: string;
  totalCount: number;
  onReset: () => void;
};

export function SessionHeader({
  sessionDate,
  totalCount,
  onReset,
}: SessionHeaderProps) {
  const [resetOpen, setResetOpen] = useState(false);

  const handleResetOpenChange = (open: boolean) => {
    setResetOpen(open);
  };

  const handleReset = () => {
    onReset();
    setResetOpen(false);
  };

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          축구팀 매니지먼트
        </h1>
        <p className="text-sm text-muted-foreground">
          {formatSessionDate(sessionDate)}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge
          variant="secondary"
          className="min-h-11 gap-1.5 px-3 py-2 text-sm font-medium"
        >
          <Users className="size-4" />
          전체 출석 {totalCount}명
        </Badge>

        <Button
          type="button"
          variant="outline"
          className="min-h-11 gap-2 px-4"
          onClick={() => setResetOpen(true)}
        >
          <RotateCcw className="size-4" />
          전체 초기화
        </Button>

        <AlertDialog open={resetOpen} onOpenChange={handleResetOpenChange}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>전체 초기화</AlertDialogTitle>
              <AlertDialogDescription>
                오늘 출석 및 팀 배정 데이터를 모두 삭제할까요? 이 작업은
                되돌릴 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={handleReset}>
                초기화
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
}
