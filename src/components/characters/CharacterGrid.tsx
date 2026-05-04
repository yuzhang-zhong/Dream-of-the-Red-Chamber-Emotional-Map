"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MapPin, Network, Search } from "lucide-react";
import type { AtlasPayload } from "@/contracts/atlas";
import { buildAtlasIndex } from "@/lib/atlas";

export function CharacterGrid({ payload }: { payload: AtlasPayload }) {
  const [query, setQuery] = useState("");
  const index = useMemo(() => buildAtlasIndex(payload), [payload]);
  const normalizedQuery = query.trim().toLowerCase();

  const characters = payload.characters.filter((character) => {
    if (!normalizedQuery) {
      return true;
    }

    const haystack = [
      character.name,
      character.englishName,
      character.locationId ? index.locationsById[character.locationId]?.name : "",
      ...character.coreEmotions,
      ...character.symbols,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });

  return (
    <main className="relative min-h-screen px-4 pb-12 pt-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.36em] text-[#c8a45d]">Characters</p>
            <h1 className="serif-title mt-2 text-4xl text-[#f7ecd3]">红楼人物情绪身份卡</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#b9aa93]">
              每张卡不是百科条目，而是一种精神姿态：她如何感受世界，又如何被园子安放。
            </p>
          </div>
          <label className="atlas-panel flex h-11 w-full items-center gap-2 rounded px-3 lg:w-80">
            <Search size={16} color="#C8A45D" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索人物 / 情绪 / 象征物"
              className="min-w-0 flex-1 bg-transparent text-sm text-[#f7ecd3] outline-none placeholder:text-[#8f826e]"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {characters.map((character) => {
            const location = character.locationId ? index.locationsById[character.locationId] : null;
            const relations = index.relationsByCharacterId[character.id] ?? [];

            return (
              <article key={character.id} className="atlas-panel relative overflow-hidden rounded-lg p-5">
                <div
                  className="absolute -right-10 -top-10 size-36 rounded-full blur-3xl"
                  style={{ background: `${character.color}34` }}
                />
                <div className="relative">
                  <p className="text-xs uppercase tracking-[0.24em]" style={{ color: character.color }}>
                    {character.englishName}
                  </p>
                  <h2 className="serif-title mt-2 text-3xl text-[#f7ecd3]">{character.name}</h2>
                  <p className="mt-3 text-sm leading-7 text-[#d8c8ad]">{character.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {character.coreEmotions.map((emotion) => (
                      <span
                        key={emotion}
                        className="rounded border border-[#c8a45d26] bg-[#0d0b0a77] px-2.5 py-1 text-xs text-[#e8d8b8]"
                      >
                        {emotion}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-3 text-sm text-[#b9aa93]">
                    <div className="flex items-center gap-2">
                      <MapPin size={15} color={location?.color ?? "#C8A45D"} />
                      <span>居所：{location?.name ?? "未绑定"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Network size={15} color="#C8A45D" />
                      <span>关系线：{relations.length} 条</span>
                    </div>
                  </div>

                  <blockquote className="serif-title mt-5 border-l pl-4 text-lg leading-8 text-[#f0dec0]" style={{ borderColor: character.color }}>
                    {character.cardQuote}
                  </blockquote>

                  <div className="mt-5 flex gap-2">
                    <Link
                      href={`/atlas?location=${character.locationId ?? ""}`}
                      className="gold-button rounded px-3 py-2 text-xs"
                    >
                      查看地图位置
                    </Link>
                    <Link
                      href={`/relations?character=${character.id}`}
                      className="rounded border border-[#c8a45d2b] px-3 py-2 text-xs text-[#d8c8ad]"
                    >
                      查看关系
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
