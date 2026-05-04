"use client";

import { useEffect, useMemo, useState } from "react";
import { Flame, Gauge, Pause, Play, UserRound, X } from "lucide-react";
import type { AtlasPayload } from "@/contracts/atlas";
import {
  getLocationHeatAtChapter,
  getLocationViewModels,
  getNearestChapterHeatLabel,
} from "@/lib/atlas";
import { Atmosphere } from "@/components/visual-effects/Atmosphere";
import { getChapterTitle } from "@/data/chapter-titles";
import { getChapterAppearances, groupAppearancesByLocation } from "@/data/chapter-appearances";
import { buildCharacterAnalytics, MAIN_CHARACTER_IDS } from "@/lib/character-analytics";
import { GardenMap } from "./GardenMap";

function buildChapterInsights({
  currentChapter,
  primaryLocationName,
  appearancesByLocation,
  appearanceCount,
}: {
  currentChapter: number;
  primaryLocationName?: string;
  appearancesByLocation: Record<string, unknown[]>;
  appearanceCount: number;
}) {
  const insights: Array<{ label: string; detail: string }> = [];
  const has = (locationId: string) => Boolean(appearancesByLocation[locationId]?.length);

  if (has("rongguo")) {
    insights.push({
      label: "家族秩序",
      detail: "本回人物落在荣国府时，地点热度更多来自权力、规矩与家族事务的推进。",
    });
  }

  if (has("poetry-club") || currentChapter === 37 || currentChapter === 38 || currentChapter === 70) {
    insights.push({
      label: "才情共同体",
      detail: "诗社相关章节会让群体人物靠近，地图的意义从单人命运转向青春与才情的短暂发光。",
    });
  }

  if (has("xiaoxiang") || has("flower-tomb")) {
    insights.push({
      label: "黛玉视角",
      detail: "潇湘馆与葬花坡发亮时，章节通常更接近敏感、自尊、误解和告别感。",
    });
  }

  if (has("yihong")) {
    insights.push({
      label: "宝玉场域",
      detail: "怡红院亮起时，温柔、照料、少年日常与无法承担的情感压力会同时出现。",
    });
  }

  if (has("taixu") || currentChapter <= 5 || currentChapter >= 115) {
    insights.push({
      label: "命运暗层",
      detail: "太虚幻境相关章节不只是场景变化，而是把全书结局感提前或重新拉回画面。",
    });
  }

  if (appearanceCount >= 5) {
    insights.push({
      label: "群像调度",
      detail: "本回出现人物较多，适合看谁聚在同一地点，以及家族空间如何重新分配人物。",
    });
  }

  if (insights.length === 0) {
    insights.push({
      label: primaryLocationName ? `${primaryLocationName}主场` : "章节主场",
      detail: "本回更适合从最高热区进入，观察地点怎样把人物情绪集中起来。",
    });
  }

  return insights.slice(0, 3);
}

export function AtlasExperience({
  payload,
  initialLocationId,
}: {
  payload: AtlasPayload;
  initialLocationId?: string;
}) {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    initialLocationId ?? null,
  );
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);
  const [currentChapter, setCurrentChapter] = useState(27);
  const [visualChapter, setVisualChapter] = useState(27);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 3>(1);
  const [showHotspots, setShowHotspots] = useState(false);
  const [showCharacterPanel, setShowCharacterPanel] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState("lin-daiyu");

  const locationViewModels = useMemo(() => getLocationViewModels(payload), [payload]);
  const characterAnalytics = useMemo(
    () => buildCharacterAnalytics(locationViewModels),
    [locationViewModels],
  );
  const selectedCharacter =
    characterAnalytics.find((character) => character.id === selectedCharacterId) ??
    characterAnalytics[0];
  const chapterAppearances = useMemo(() => getChapterAppearances(currentChapter), [currentChapter]);
  const appearancesByLocation = useMemo(
    () => groupAppearancesByLocation(chapterAppearances),
    [chapterAppearances],
  );
  const selectedLocation = selectedLocationId
    ? locationViewModels.find((location) => location.id === selectedLocationId) ?? null
    : null;

  const hotspots = [...locationViewModels]
    .map((location) => ({
      location,
      heat: getLocationHeatAtChapter(location, currentChapter),
      nearest: getNearestChapterHeatLabel(location, currentChapter),
    }))
    .sort((a, b) => b.heat - a.heat)
    .slice(0, 3);
  const primaryHotspot = hotspots[0];
  const primaryCharacters =
    (primaryHotspot ? appearancesByLocation[primaryHotspot.location.id] : undefined)
      ?.map((character) => character.name)
      .join("、") || chapterAppearances.map((character) => character.name).join("、");
  const primaryLocationName = primaryHotspot?.location.displayName;
  const chapterTitle = `第 ${currentChapter} 回 · ${getChapterTitle(currentChapter)}`;
  const chapterInsights = buildChapterInsights({
    currentChapter,
    primaryLocationName,
    appearancesByLocation,
    appearanceCount: chapterAppearances.length,
  });
  const chapterNarration = primaryHotspot
    ? `本回热度最高：${primaryHotspot.location.displayName}。关联人物：${primaryCharacters || "众人"}。${chapterInsights[0]?.detail ?? ""}`
    : `第 ${currentChapter} 回 · ${getChapterTitle(currentChapter)}`;

  useEffect(() => {
    let frameId = 0;

    const animate = () => {
      let shouldContinue = true;

      setVisualChapter((chapter) => {
        const delta = currentChapter - chapter;

        if (Math.abs(delta) < 0.04) {
          shouldContinue = false;
          return currentChapter;
        }

        return chapter + delta * (isPlaying ? 0.18 : 0.24);
      });

      if (shouldContinue) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    frameId = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(frameId);
  }, [currentChapter, isPlaying]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentChapter((chapter) => (chapter >= 120 ? 1 : chapter + 1));
    }, playbackSpeed === 3 ? 170 : 520);

    return () => window.clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <Atmosphere quiet />
      <header className="atlas-glass absolute left-1/2 top-4 z-40 flex w-[min(980px,calc(100vw-32px))] -translate-x-1/2 items-center justify-between rounded-full px-5 py-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#c8a45d]">
            Dream of the Red Chamber Emotional Landscape
          </p>
          <h1 className="serif-title truncate text-xl text-[#f7ecd3] sm:text-2xl">
            红楼梦情绪地景图
          </h1>
        </div>
        <div className="hidden shrink-0 text-right sm:block">
          <p className="text-xs text-[#d8c8ad]">拖动章节，观看人物与地点如何发光</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#8f826e]">
            Chapter {currentChapter} / 120
          </p>
        </div>
      </header>
      <div className="relative z-10">
        <GardenMap
          locations={locationViewModels}
          selectedLocationId={selectedLocationId}
          currentChapter={visualChapter}
          appearancesByLocation={appearancesByLocation}
          highlightedLocationIds={hoveredLocationId ? [hoveredLocationId] : []}
          onSelect={(id) => {
            setSelectedLocationId(id);
            setShowHotspots(false);
          }}
          onHover={setHoveredLocationId}
        />
      </div>

      <div className="pointer-events-none absolute left-1/2 top-[14%] z-20 w-[calc(100vw-48px)] -translate-x-1/2 overflow-hidden text-center">
        <p
          className={`display-title whitespace-nowrap leading-none transition-all duration-500 ${
            isPlaying
              ? "text-[#f7ecd3]/[0.18] [font-size:clamp(1rem,3.6vw,4.1rem)]"
              : "text-[#f7ecd3]/[0.34] [font-size:clamp(1rem,2.1vw,2.5rem)]"
          }`}
          style={{ whiteSpace: "nowrap" }}
        >
          {chapterTitle}
        </p>
        <p
          className={`mx-auto mt-3 max-w-2xl truncate text-sm leading-7 transition-opacity duration-500 ${
            isPlaying ? "text-[#f7ecd3]/[0.4]" : "text-[#f7ecd3]/[0.5]"
          }`}
        >
          {primaryHotspot?.location.displayName} / {primaryCharacters}
        </p>
      </div>

      <button
        aria-label="打开人物分析"
        onClick={() => {
          setShowCharacterPanel(true);
          setShowHotspots(false);
          setSelectedLocationId(null);
        }}
        className="atlas-glass absolute right-5 top-24 z-30 inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm text-[#f7ecd3] transition hover:border-[#c8a45d66] hover:bg-[#c8a45d12]"
      >
        <UserRound size={16} color="#C8A45D" />
        人物
      </button>

      {selectedLocation && (
        <aside className="atlas-glass absolute right-5 top-36 z-30 w-[min(340px,calc(100vw-40px))] rounded-lg p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em]" style={{ color: selectedLocation.color }}>
                {selectedLocation.englishName}
              </p>
              <h2 className="serif-title mt-2 text-3xl text-[#f7ecd3]">
                {selectedLocation.displayName}
              </h2>
            </div>
            <button
              aria-label="关闭地点说明"
              onClick={() => setSelectedLocationId(null)}
              className="grid size-9 place-items-center rounded border border-[#c8a45d33] text-[#d8c8ad] hover:bg-[#c8a45d16]"
            >
              <X size={16} />
            </button>
          </div>
          <p className="mt-4 text-sm leading-7 text-[#dacbb3]">{selectedLocation.shortSummary}</p>
          <blockquote className="serif-title mt-4 border-l border-[#c8a45d88] pl-4 text-lg leading-8 text-[#f0dec0]">
            {selectedLocation.fateQuote}
          </blockquote>
        </aside>
      )}

      {showCharacterPanel && selectedCharacter && (
        <aside className="atlas-glass absolute right-5 top-36 z-40 max-h-[calc(100vh-210px)] w-[min(440px,calc(100vw-40px))] overflow-y-auto rounded-lg p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#c8a45d]">Character Lens</p>
              <h2 className="serif-title mt-1 text-2xl text-[#f7ecd3]">人物去向</h2>
              <p className="mt-1 text-xs text-[#b9aa93]">
                主要人物 {Math.min(characterAnalytics.length, MAIN_CHARACTER_IDS.length)} 位
              </p>
            </div>
            <button
              aria-label="关闭人物分析"
              onClick={() => setShowCharacterPanel(false)}
              className="grid size-9 place-items-center rounded border border-[#c8a45d33] text-[#d8c8ad] hover:bg-[#c8a45d16]"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mt-4 grid max-h-36 grid-cols-4 gap-1.5 overflow-y-auto border-b border-[#c8a45d18] pb-3 pr-1">
            {characterAnalytics.map((character) => (
              <button
                key={character.id}
                onClick={() => setSelectedCharacterId(character.id)}
                className={`min-w-0 truncate rounded-full border px-2 py-1.5 text-xs ${
                  selectedCharacter.id === character.id
                    ? "border-[#c8a45d88] bg-[#c8a45d18] text-[#f7ecd3]"
                    : "border-[#c8a45d24] text-[#d8c8ad]"
                }`}
              >
                {character.name}
              </button>
            ))}
          </div>

          <section className="mt-4 rounded-lg border border-[#c8a45d1f] bg-[#0d0b0a52] p-4">
            <p className="text-xs uppercase tracking-[0.22em]" style={{ color: selectedCharacter.color }}>
              {selectedCharacter.totalAppearances} 次章节标注
            </p>
            <h3 className="serif-title mt-2 text-2xl text-[#f7ecd3]">{selectedCharacter.name}</h3>
            <p className="mt-3 text-sm leading-7 text-[#d8c8ad]">{selectedCharacter.pathSummary}</p>
          </section>

          <section className="mt-5">
            <p className="mb-2 text-[10px] uppercase tracking-[0.26em] text-[#c8a45d]">Favorite Place</p>
            <div className="space-y-1.5">
              {selectedCharacter.locationStats.slice(0, 5).map((stat) => (
                <button
                  key={stat.locationId}
                  onClick={() => {
                    setSelectedLocationId(stat.locationId);
                    setShowCharacterPanel(false);
                  }}
                  className="w-full rounded-md border border-[#c8a45d17] bg-[#0d0b0a36] p-2.5 text-left transition hover:bg-[#c8a45d0f]"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="serif-title text-base text-[#f7ecd3]">{stat.locationName}</span>
                    <span style={{ color: stat.color }}>{stat.percentage}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#f6e8c812]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${stat.percentage}%`, background: stat.color }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-5">
            <p className="mb-2 text-[10px] uppercase tracking-[0.26em] text-[#c8a45d]">Key Chapters</p>
            <div className="space-y-1.5">
              {selectedCharacter.highlightChapters.slice(0, 4).map((chapter) => (
                <button
                  key={chapter.chapter}
                  onClick={() => {
                    setCurrentChapter(chapter.chapter);
                    setShowCharacterPanel(false);
                    setIsPlaying(false);
                  }}
                  className="w-full rounded-md border border-[#c8a45d17] bg-[#0d0b0a36] p-2.5 text-left transition hover:bg-[#c8a45d0f]"
                >
                  <span className="text-sm" style={{ color: chapter.locationColor }}>
                    第 {chapter.chapter} 回 · {chapter.locationName}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[#b9aa93]">{chapter.title}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-5">
            <p className="mb-2 text-[10px] uppercase tracking-[0.26em] text-[#c8a45d]">Frequently Together</p>
            <div className="flex flex-wrap gap-2">
              {selectedCharacter.coAppearances.map((character) => (
                <button
                  key={character.id}
                  onClick={() => setSelectedCharacterId(character.id)}
                  className="rounded-full border border-[#c8a45d1f] bg-[#0d0b0a36] px-3 py-1.5 text-xs text-[#e8d8b8]"
                >
                  <span style={{ color: character.color }}>{character.name}</span>
                  <span className="ml-2 text-xs text-[#8f826e]">{character.count}</span>
                </button>
              ))}
            </div>
          </section>
        </aside>
      )}

      {showHotspots && (
        <aside className="atlas-glass absolute bottom-40 left-1/2 z-30 w-[min(520px,calc(100vw-32px))] -translate-x-1/2 rounded-lg p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.24em] text-[#c8a45d]">本回发光处</p>
            <button
              aria-label="关闭热点"
              onClick={() => setShowHotspots(false)}
              className="grid size-8 place-items-center rounded border border-[#c8a45d24] text-[#d8c8ad]"
            >
              <X size={14} />
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {hotspots.map(({ location, heat, nearest }) => (
              <button
                key={location.id}
                onClick={() => {
                  setSelectedLocationId(location.id);
                  setShowHotspots(false);
                }}
                className="rounded-md border border-[#c8a45d1f] bg-[#0d0b0a42] p-3 text-left"
              >
                <span className="serif-title block text-lg text-[#f7ecd3]">
                  {location.displayName}
                </span>
                <span className="mt-1 block text-xs" style={{ color: location.color }}>
                  热度 {heat}
                </span>
                <span className="mt-2 block text-xs leading-5 text-[#b9aa93]">
                  第 {nearest.chapter} 回：{getChapterTitle(nearest.chapter)}
                </span>
                <span className="mt-2 block text-xs leading-5 text-[#d8c8ad]">
                  人物：
                  {(appearancesByLocation[location.id] ?? [])
                    .map((character) => character.name)
                    .join("、") || "本回未直接点名"}
                </span>
              </button>
            ))}
          </div>
        </aside>
      )}

      <section className="absolute bottom-3 left-1/2 z-40 w-[min(860px,calc(100vw-24px))] -translate-x-1/2 rounded-2xl border border-[#c8a45d1f] bg-[#0d0b0af0] px-3 py-2.5 shadow-[0_18px_56px_rgba(0,0,0,0.28)] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            aria-label={isPlaying ? "暂停播放章节热力" : "播放章节热力"}
            onClick={() => setIsPlaying((value) => !value)}
            className="grid size-9 shrink-0 place-items-center rounded-full border border-[#c8a45d55] bg-[#c8a45d18] text-[#f7ecd3]"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <button
            aria-label="切换播放速度"
            onClick={() => setPlaybackSpeed((speed) => (speed === 1 ? 3 : 1))}
            className="grid size-9 shrink-0 place-items-center rounded-full border border-[#c8a45d33] bg-[#0d0b0a66] text-xs text-[#e8d8b8]"
            title="切换 1x / 3x"
          >
            {playbackSpeed}x
          </button>

          <div className="w-14 shrink-0 text-center">
            <p className="serif-title text-xl text-[#f7ecd3]">{currentChapter}</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#c8a45d]">Chapter</p>
          </div>

          <div className="min-w-0 flex-1">
            <input
              aria-label="拖动选择红楼梦章节"
              type="range"
              min="1"
              max="120"
              value={currentChapter}
              onChange={(event) => {
                setCurrentChapter(Number(event.target.value));
                setIsPlaying(false);
              }}
              className="h-2 w-full accent-[#c8a45d]"
            />
            <div className="mt-2 flex justify-between text-[11px] text-[#8f826e]">
              <span>1</span>
              <span>37 诗社</span>
              <span>74 抄检</span>
              <span>120</span>
            </div>
          </div>

          <button
            onClick={() => {
              setShowHotspots((value) => !value);
              setSelectedLocationId(null);
            }}
            className="hidden h-9 shrink-0 items-center gap-2 rounded-full border border-[#c8a45d33] px-3 text-xs text-[#e8d8b8] hover:bg-[#c8a45d12] sm:inline-flex"
          >
            <Flame size={16} />
            热点
          </button>
        </div>
        <div className="mt-2 grid gap-2 border-t border-[#c8a45d0f] px-2 pt-2 md:grid-cols-[1fr_auto] md:items-center">
          <div className="min-w-0">
            <p className="text-xs leading-6 text-[#cdbf9f]">{chapterNarration}</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {chapterInsights.map((insight) => (
                <span
                  key={insight.label}
                  title={insight.detail}
                  className="rounded-full border border-[#c8a45d22] bg-[#c8a45d0f] px-2 py-0.5 text-[10px] text-[#e8d8b8]"
                >
                  {insight.label}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-[#b9aa93] md:justify-end">
            <Gauge size={14} color="#C8A45D" />
            <span>
              {primaryHotspot?.location.displayName ?? "大观园"} · 热度 {primaryHotspot?.heat ?? 0}
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
