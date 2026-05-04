import type { LocationViewModel } from "@/contracts/atlas";
import { getChapterAppearances } from "@/data/chapter-appearances";
import { getChapterTitle } from "@/data/chapter-titles";

export interface CharacterLocationStat {
  locationId: string;
  locationName: string;
  color: string;
  count: number;
  percentage: number;
}

export interface CharacterHighlightChapter {
  chapter: number;
  title: string;
  locationName: string;
  locationColor: string;
}

export interface CharacterCoAppearance {
  id: string;
  name: string;
  color: string;
  count: number;
}

export interface CharacterAnalytics {
  id: string;
  name: string;
  color: string;
  totalAppearances: number;
  favoriteLocation: CharacterLocationStat | null;
  locationStats: CharacterLocationStat[];
  highlightChapters: CharacterHighlightChapter[];
  coAppearances: CharacterCoAppearance[];
  pathSummary: string;
}

export const MAIN_CHARACTER_IDS = [
  "jia-baoyu",
  "lin-daiyu",
  "xue-baochai",
  "wang-xifeng",
  "jia-tanchun",
  "shi-xiangyun",
  "li-wan",
  "qingwen",
  "xiren",
  "jiamu",
  "wang-furen",
  "zijuan",
  "jia-yuanchun",
  "liu-laolao",
  "qin-keqing",
  "ping-er",
  "yuanyang",
  "miaoyu",
  "xiangling",
  "jia-zheng",
  "jia-zhen",
  "jia-lian",
  "jia-huan",
  "jia-yingchun",
  "jia-xichun",
  "jia-qiaojie",
  "you-erjie",
  "you-sanjie",
  "zhen-shiyin",
  "jia-yucun",
  "xue-yima",
  "lin-ruhai",
  "jia-she",
  "xing-furen",
  "jia-rui",
] as const;

const mainCharacterOrder = new Map<string, number>(
  MAIN_CHARACTER_IDS.map((id, index) => [id, index]),
);

export function buildCharacterAnalytics(locations: LocationViewModel[]): CharacterAnalytics[] {
  const locationById = Object.fromEntries(locations.map((location) => [location.id, location]));
  const characterMap = new Map<string, { id: string; name: string; color: string }>();
  const locationCounts = new Map<string, Map<string, number>>();
  const highlightChapters = new Map<string, CharacterHighlightChapter[]>();
  const coCounts = new Map<string, Map<string, CharacterCoAppearance>>();

  for (let chapter = 1; chapter <= 120; chapter += 1) {
    const appearances = getChapterAppearances(chapter);

    for (const appearance of appearances) {
      characterMap.set(appearance.id, {
        id: appearance.id,
        name: appearance.name,
        color: appearance.color,
      });

      const location = locationById[appearance.locationId];
      if (!location) continue;

      const counts = locationCounts.get(appearance.id) ?? new Map<string, number>();
      counts.set(appearance.locationId, (counts.get(appearance.locationId) ?? 0) + 1);
      locationCounts.set(appearance.id, counts);

      const chapters = highlightChapters.get(appearance.id) ?? [];
      if (chapters.length < 8) {
        chapters.push({
          chapter,
          title: getChapterTitle(chapter),
          locationName: location.displayName,
          locationColor: location.color,
        });
        highlightChapters.set(appearance.id, chapters);
      }

      const pairs = coCounts.get(appearance.id) ?? new Map<string, CharacterCoAppearance>();
      for (const other of appearances) {
        if (other.id === appearance.id) continue;
        const existing = pairs.get(other.id);
        pairs.set(other.id, {
          id: other.id,
          name: other.name,
          color: other.color,
          count: (existing?.count ?? 0) + 1,
        });
      }
      coCounts.set(appearance.id, pairs);
    }
  }

  return [...characterMap.values()]
    .filter((character) => mainCharacterOrder.has(character.id))
    .map((character) => {
      const counts = locationCounts.get(character.id) ?? new Map<string, number>();
      const totalAppearances = [...counts.values()].reduce((sum, count) => sum + count, 0);
      const locationStats = [...counts.entries()]
        .map(([locationId, count]) => {
          const location = locationById[locationId];
          return {
            locationId,
            locationName: location?.displayName ?? locationId,
            color: location?.color ?? character.color,
            count,
            percentage: totalAppearances ? Math.round((count / totalAppearances) * 100) : 0,
          };
        })
        .sort((a, b) => b.count - a.count);

      const favoriteLocation = locationStats[0] ?? null;
      const coAppearances = [...(coCounts.get(character.id)?.values() ?? [])]
        .sort((a, b) => b.count - a.count)
        .slice(0, 4);

      return {
        ...character,
        totalAppearances,
        favoriteLocation,
        locationStats,
        highlightChapters: highlightChapters.get(character.id) ?? [],
        coAppearances,
        pathSummary: favoriteLocation
          ? `${character.name}最常被叙事推向${favoriteLocation.locationName}，占已标注出场的 ${favoriteLocation.percentage}%。`
          : `${character.name}暂无足够的章节出场数据。`,
      };
    })
    .sort((a, b) => {
      const aOrder = mainCharacterOrder.get(a.id) ?? 999;
      const bOrder = mainCharacterOrder.get(b.id) ?? 999;

      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }

      return b.totalAppearances - a.totalAppearances;
    });
}
