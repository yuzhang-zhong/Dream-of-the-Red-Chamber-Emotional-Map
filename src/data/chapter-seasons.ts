import { getChapterTitle } from "./chapter-titles";

export type ChapterSeason = "spring" | "summer" | "autumn" | "winter";

export interface ChapterSeasonInfo {
  season: ChapterSeason;
  label: string;
}

const seasonLabels: Record<ChapterSeason, string> = {
  spring: "春",
  summer: "夏",
  autumn: "秋",
  winter: "冬",
};

function seasonByTitle(title: string): ChapterSeason | null {
  if (/雪|芦雪|琉璃世界|白雪|梅|寒|冷/.test(title)) return "winter";
  if (/秋|菊|蟹|桂|月|中秋/.test(title)) return "autumn";
  if (/端阳|端午|蒲艾|清虚|暑|夏/.test(title)) return "summer";
  if (/春|花|桃|柳|杏|梨香|葬花|海棠|芙蓉|牡丹|红香圃/.test(title)) return "spring";

  return null;
}

function seasonByChapterArc(chapter: number): ChapterSeason {
  if (chapter <= 27) return "spring";
  if (chapter <= 36) return "summer";
  if (chapter <= 49) return "autumn";
  if (chapter <= 53) return "winter";
  if (chapter <= 70) return "spring";
  if (chapter <= 86) return "autumn";

  return "winter";
}

export function getChapterSeason(chapter: number): ChapterSeasonInfo {
  const title = getChapterTitle(Math.round(chapter));
  const season = seasonByTitle(title) ?? seasonByChapterArc(chapter);

  return {
    season,
    label: seasonLabels[season],
  };
}
