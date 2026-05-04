"use client";

import { X } from "lucide-react";
import type { LocationViewModel } from "@/contracts/atlas";

export function LocationDetailPanel({
  location,
  onClose,
}: {
  location: LocationViewModel | null;
  onClose: () => void;
}) {
  if (!location) {
    return (
      <aside className="atlas-panel hidden w-[380px] shrink-0 rounded-lg p-6 text-[#b9aa93] xl:block">
        <p className="text-xs uppercase tracking-[0.24em] text-[#c8a45d]">Location</p>
        <h2 className="serif-title mt-4 text-3xl text-[#f7ecd3]">选择一处园林</h2>
        <p className="mt-5 leading-7">
          在地图上点击潇湘馆、怡红院或太虚幻境，查看地点的情绪结构、代表人物与命运注释。
        </p>
      </aside>
    );
  }

  return (
    <aside className="atlas-panel w-full rounded-lg p-5 xl:w-[400px] xl:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em]" style={{ color: location.color }}>
            {location.englishName}
          </p>
          <h2 className="serif-title mt-2 text-3xl text-[#f7ecd3]">{location.displayName}</h2>
        </div>
        <button
          aria-label="关闭地点详情"
          onClick={onClose}
          className="grid size-9 place-items-center rounded border border-[#c8a45d33] text-[#d8c8ad] hover:bg-[#c8a45d16]"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {location.symbols.map((symbol) => (
          <span
            key={symbol}
            className="rounded border border-[#c8a45d2e] bg-[#c8a45d10] px-2.5 py-1 text-xs text-[#e8d8b8]"
          >
            {symbol}
          </span>
        ))}
      </div>

      <p className="mt-5 text-sm leading-7 text-[#dacbb3]">{location.detailSummary}</p>

      <div className="mt-6 space-y-3">
        {location.emotionBars.map((emotion) => (
          <div key={emotion.label}>
            <div className="mb-1 flex items-center justify-between text-xs text-[#d8c8ad]">
              <span>{emotion.label}</span>
              <span>{emotion.value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#f6e8c814]">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${emotion.value}%`,
                  background: `linear-gradient(90deg, ${location.color}, #D6B76D)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <p className="text-xs uppercase tracking-[0.22em] text-[#c8a45d]">Characters</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {location.representativeCharacters.map((character) => (
            <span
              key={character.id}
              className="rounded bg-[#0d0b0a99] px-3 py-1.5 text-sm"
              style={{ border: `1px solid ${character.color}66`, color: "#f5ead3" }}
            >
              {character.name}
            </span>
          ))}
        </div>
      </div>

      <blockquote className="serif-title mt-6 border-l border-[#c8a45d88] pl-4 text-lg leading-8 text-[#f0dec0]">
        {location.fateQuote}
      </blockquote>
    </aside>
  );
}
