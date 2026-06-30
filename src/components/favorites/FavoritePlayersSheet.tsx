"use client";

import { Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  appleInput,
  appleMuted,
  applePrimaryButton,
  appleSelectableCard,
  appleSelectableCardSelected,
  appleSelectableCardUnselected,
  appleTouchIconButton,
} from "@/lib/apple-ui";
import { cn } from "@/lib/utils";
import type { FavoritePlayer } from "@/types/favorites";

type FavoritePlayersSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  favorites: FavoritePlayer[];
  onAddFavorite: (name: string) => void;
  onRemoveFavorite: (id: string) => void;
  onRemoveFavoritesBulk: (ids: string[]) => void;
  onAddToWaiting: (names: string[]) => { addedCount: number; skippedCount: number };
  checkDuplicateFavoriteName: (name: string) => boolean;
};

export function FavoritePlayersSheet({
  open,
  onOpenChange,
  favorites,
  onAddFavorite,
  onRemoveFavorite,
  onRemoveFavoritesBulk,
  onAddToWaiting,
  checkDuplicateFavoriteName,
}: FavoritePlayersSheetProps) {
  const [name, setName] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isComposingRef = useRef(false);

  const resetSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  useEffect(() => {
    if (!open) {
      setName("");
      resetSelection();
      setFeedback(null);
    }
  }, [open, resetSelection]);

  useEffect(() => {
    if (!feedback) return;

    const timer = window.setTimeout(() => {
      setFeedback(null);
      resetSelection();
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [feedback, resetSelection]);

  const submitFavorite = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    if (checkDuplicateFavoriteName(trimmed)) {
      setFeedback(`"${trimmed}"은(는) 이미 등록된 선수입니다`);
      return;
    }

    onAddFavorite(trimmed);
    setName("");
    inputRef.current?.focus();
  };

  const handleSubmit = () => {
    submitFavorite(inputRef.current?.value ?? name);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    if (isComposingRef.current || event.nativeEvent.isComposing) return;

    event.preventDefault();
    submitFavorite(event.currentTarget.value);
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectionKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    id: string,
  ) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggleSelection(id);
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;

    const count = selectedIds.size;
    onRemoveFavoritesBulk(Array.from(selectedIds));
    resetSelection();
    setFeedback(`${count}명 삭제됨`);
  };

  const handleAddToWaiting = () => {
    if (selectedIds.size === 0) return;

    const selectedNames = favorites
      .filter((player) => selectedIds.has(player.id))
      .map((player) => player.name);

    const { addedCount, skippedCount } = onAddToWaiting(selectedNames);

    if (addedCount === 0 && skippedCount === 0) {
      setFeedback("추가할 선수를 선택해 주세요");
      return;
    }

    resetSelection();
    setFeedback(null);
    onOpenChange(false);
  };

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title="자주 쓰는 선수"
      footer={
        <div className="flex flex-col gap-2">
          {feedback && (
            <p className={`${appleMuted} text-center text-xs`}>{feedback}</p>
          )}
          <Button
            type="button"
            variant="destructive"
            disabled={selectedIds.size === 0}
            onClick={handleBulkDelete}
            className="min-h-12 w-full gap-2 rounded-xl border-0 text-base font-medium shadow-none transition-all duration-200 ease-out active:scale-95 disabled:opacity-40"
          >
            <Trash2 className="size-4" />
            선택 삭제
            {selectedIds.size > 0 && ` (${selectedIds.size}명)`}
          </Button>
          <Button
            type="button"
            disabled={selectedIds.size === 0}
            onClick={handleAddToWaiting}
            className={applePrimaryButton}
          >
            출석 대기 추가
            {selectedIds.size > 0 && ` (${selectedIds.size}명)`}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            ref={inputRef}
            value={name}
            onChange={(event) => setName(event.target.value)}
            onCompositionStart={() => {
              isComposingRef.current = true;
            }}
            onCompositionEnd={(event) => {
              isComposingRef.current = false;
              setName(event.currentTarget.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder="선수 이름 추가"
            className={appleInput}
            aria-label="자주 쓰는 선수 이름 입력"
          />
          <Button type="button" onClick={handleSubmit} className={applePrimaryButton}>
            <Plus className="size-4" />
            추가
          </Button>
        </div>

        {favorites.length === 0 ? (
          <p className={`${appleMuted} py-8 text-center`}>
            자주 쓰는 선수를 추가해 보세요
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-2 min-[400px]:grid-cols-3 min-[480px]:grid-cols-4">
            {favorites.map((player) => {
              const selected = selectedIds.has(player.id);

              return (
                <li key={player.id} className="min-w-0">
                  <div
                    role="button"
                    tabIndex={0}
                    aria-pressed={selected}
                    aria-label={`${player.name} ${selected ? "선택됨" : "선택 안 됨"}`}
                    onClick={() => toggleSelection(player.id)}
                    onKeyDown={(event) => handleSelectionKeyDown(event, player.id)}
                    className={cn(
                      appleSelectableCard,
                      "relative h-10 min-h-10 w-full items-center justify-center px-7",
                      selected
                        ? appleSelectableCardSelected
                        : appleSelectableCardUnselected,
                    )}
                  >
                    <span
                      className={cn(
                        "block w-full truncate text-center text-xs font-medium text-neutral-200",
                        selected && "text-blue-100",
                      )}
                    >
                      {player.name}
                    </span>

                    <Button
                      type="button"
                      variant="ghost"
                      className={cn(
                        appleTouchIconButton,
                        "absolute top-0 right-0 h-8 min-h-8 w-8 min-w-8 -translate-y-0",
                      )}
                      aria-label={`${player.name} 삭제`}
                      onClick={(event) => {
                        event.stopPropagation();
                        onRemoveFavorite(player.id);
                        setSelectedIds((prev) => {
                          const next = new Set(prev);
                          next.delete(player.id);
                          return next;
                        });
                      }}
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </BottomSheet>
  );
}
