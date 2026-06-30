"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { TeamColumn } from "@/components/team/TeamColumn";
import { cn } from "@/lib/utils";
import type { Player, TeamColumnConfig, TeamId } from "@/types/session";

type TeamCarouselProps = {
  teamConfigs: TeamColumnConfig[];
  getPlayers: (teamId: TeamColumnConfig["id"]) => Player[];
  onAssignTeam: (id: string, teamId: TeamId | null) => void;
  onRemove: (id: string) => void;
};

export function TeamCarousel({
  teamConfigs,
  getPlayers,
  onAssignTeam,
  onRemove,
}: TeamCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveIndex = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const slides = Array.from(container.children) as HTMLElement[];
    if (slides.length === 0) return;

    const center = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    slides.forEach((slide, index) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const distance = Math.abs(center - slideCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    updateActiveIndex();
    container.addEventListener("scroll", updateActiveIndex, { passive: true });
    return () => container.removeEventListener("scroll", updateActiveIndex);
  }, [updateActiveIndex]);

  const scrollToIndex = (index: number) => {
    const container = scrollRef.current;
    if (!container) return;

    const slide = container.children[index] as HTMLElement | undefined;
    slide?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
    setActiveIndex(index);
  };

  return (
    <div className="lg:hidden">
      <div
        ref={scrollRef}
        className={cn(
          "flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        )}
        aria-label="A/B/C 팀 배정 스와이프"
      >
        {teamConfigs.map((config) => (
          <div
            key={config.id}
            className="w-[calc(100%-0.75rem)] min-w-[calc(100%-0.75rem)] shrink-0 snap-center"
          >
            <TeamColumn
              config={config}
              players={getPlayers(config.id)}
              onAssignTeam={onAssignTeam}
              onRemove={onRemove}
            />
          </div>
        ))}
      </div>

      <div
        className="mt-3 flex items-center justify-center gap-2"
        role="tablist"
        aria-label="팀 선택"
      >
        {teamConfigs.map((config, index) => (
          <button
            key={config.id}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            onClick={() => scrollToIndex(index)}
            className={cn(
              "min-h-11 rounded-full px-4 text-sm font-medium transition-all duration-200 active:scale-95",
              activeIndex === index
                ? cn("text-neutral-100 shadow-sm", config.badgeClass)
                : "bg-white/8 text-neutral-400",
            )}
          >
            {config.label}
          </button>
        ))}
      </div>

      <p className="mt-2 text-center text-xs font-light text-neutral-500">
        좌우로 스와이프하거나 탭을 눌러 팀을 전환하세요
      </p>
    </div>
  );
}
