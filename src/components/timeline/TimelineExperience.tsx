"use client";

import { useMemo, useState } from "react";
import type { AtlasPayload, TimelinePhase } from "@/contracts/atlas";
import { getLocationViewModels } from "@/lib/atlas";
import { GardenMap } from "@/components/atlas/GardenMap";
import { LocationDetailPanel } from "@/components/atlas/LocationDetailPanel";

const phaseLabels: Record<TimelinePhase, string> = {
  early: "早期：入园、诗社、青春与才情",
  middle: "中期：权力、婚姻、矛盾加深",
  late: "后期：离散、衰败、幻灭",
};

export function TimelineExperience({ payload }: { payload: AtlasPayload }) {
  const [activePhase, setActivePhase] = useState<TimelinePhase>("early");
  const phaseEvents = payload.timeline.filter((event) => event.phase === activePhase);
  const [activeEventId, setActiveEventId] = useState(phaseEvents[0]?.id ?? "");
  const locationViewModels = useMemo(() => getLocationViewModels(payload), [payload]);
  const activeEvent =
    payload.timeline.find((event) => event.id === activeEventId && event.phase === activePhase) ??
    phaseEvents[0] ??
    payload.timeline[0];
  const selectedLocation =
    locationViewModels.find((location) => activeEvent?.affectedLocationIds.includes(location.id)) ??
    null;

  function changePhase(phase: TimelinePhase) {
    setActivePhase(phase);
    const firstEvent = payload.timeline.find((event) => event.phase === phase);
    setActiveEventId(firstEvent?.id ?? "");
  }

  return (
    <main className="min-h-screen px-4 pb-10 pt-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.36em] text-[#c8a45d]">Timeline</p>
          <h1 className="serif-title mt-2 text-4xl text-[#f7ecd3]">命运时间线</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#b9aa93]">
            拖动时间的第一版先用阶段切换表达：花开、权力入侵、雾气加重，地图会跟随命运逐渐暗下去。
          </p>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {(["early", "middle", "late"] as TimelinePhase[]).map((phase) => (
            <button
              key={phase}
              onClick={() => changePhase(phase)}
              className={`rounded px-4 py-2 text-sm ${
                activePhase === phase
                  ? "bg-[#c8a45d] text-[#17100d]"
                  : "border border-[#c8a45d2b] bg-[#0d0b0a77] text-[#d8c8ad]"
              }`}
            >
              {phaseLabels[phase]}
            </button>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_400px]">
          <GardenMap
            locations={locationViewModels}
            selectedLocationId={selectedLocation?.id ?? null}
            currentChapter={activeEvent?.order ? Math.min(120, activeEvent.order * 18) : 27}
            highlightedLocationIds={activeEvent?.affectedLocationIds ?? []}
            onSelect={() => undefined}
            onHover={() => undefined}
          />
          <aside className="space-y-4">
            <section className="atlas-panel rounded-lg p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[#c8a45d]">Events</p>
              <div className="mt-4 space-y-2">
                {phaseEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setActiveEventId(event.id)}
                    className={`w-full rounded border px-4 py-3 text-left ${
                      activeEvent?.id === event.id
                        ? "border-[#c8a45d88] bg-[#c8a45d18]"
                        : "border-[#c8a45d24] bg-[#0d0b0a66]"
                    }`}
                  >
                    <span className="block text-sm text-[#f7ecd3]">{event.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-[#b9aa93]">
                      {event.description}
                    </span>
                  </button>
                ))}
              </div>
            </section>
            <section className="atlas-panel rounded-lg p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[#c8a45d]">Fate Note</p>
              <h2 className="serif-title mt-3 text-3xl text-[#f7ecd3]">{activeEvent?.title}</h2>
              <p className="mt-4 text-sm leading-7 text-[#dacbb3]">{activeEvent?.description}</p>
              {activeEvent?.quote && (
                <blockquote className="serif-title mt-5 border-l border-[#c8a45d88] pl-4 text-lg leading-8 text-[#f0dec0]">
                  {activeEvent.quote}
                </blockquote>
              )}
            </section>
          </aside>
        </div>

        <div className="mt-4 hidden xl:block">
          <LocationDetailPanel location={selectedLocation} onClose={() => undefined} />
        </div>
      </div>
    </main>
  );
}
