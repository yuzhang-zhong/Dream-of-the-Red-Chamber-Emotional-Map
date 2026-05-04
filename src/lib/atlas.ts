import type {
  AtlasIndex,
  AtlasPayload,
  CharacterSummary,
  Location,
  LocationViewModel,
  Relation,
} from "@/contracts/atlas";
import { atlasPayload } from "@/data/atlas";

export function getAtlasPayload(): AtlasPayload {
  return atlasPayload;
}

export function buildAtlasIndex(payload: AtlasPayload = atlasPayload): AtlasIndex {
  const locationsById = Object.fromEntries(
    payload.locations.map((location) => [location.id, location]),
  );
  const charactersById = Object.fromEntries(
    payload.characters.map((character) => [character.id, character]),
  );
  const relationsById = Object.fromEntries(
    payload.relations.map((relation) => [relation.id, relation]),
  );

  const relationsByCharacterId: Record<string, Relation[]> = {};
  for (const character of payload.characters) {
    relationsByCharacterId[character.id] = [];
  }

  for (const relation of payload.relations) {
    relationsByCharacterId[relation.source]?.push(relation);
    relationsByCharacterId[relation.target]?.push(relation);
  }

  return {
    locationsById,
    charactersById,
    relationsById,
    relationsByCharacterId,
  };
}

export function toCharacterSummary(id: string, index = buildAtlasIndex()): CharacterSummary | null {
  const character = index.charactersById[id];
  if (!character) {
    return null;
  }

  return {
    id: character.id,
    name: character.name,
    englishName: character.englishName,
    color: character.color,
  };
}

export function toLocationViewModel(
  location: Location,
  index = buildAtlasIndex(),
): LocationViewModel {
  const representativeCharacters = location.characterIds
    .map((id) => toCharacterSummary(id, index))
    .filter((item): item is CharacterSummary => Boolean(item));

  return {
    id: location.id,
    displayName: location.name,
    englishName: location.englishName,
    color: location.color,
    symbols: location.symbols,
    emotionBars: location.emotions,
    representativeCharacters,
    tooltip: location.copy.tooltip,
    shortSummary: location.copy.shortSummary,
    detailSummary: location.copy.detailSummary,
    fateQuote: location.copy.fateQuote,
    mapPosition: location.position,
    chapterHeat: location.chapterHeat,
    atmosphere: location.atmosphere,
  };
}

export function getLocationViewModels(payload: AtlasPayload = atlasPayload) {
  const index = buildAtlasIndex(payload);
  return payload.locations.map((location) => toLocationViewModel(location, index));
}

export const relationTypeLabels = {
  intimacy: "亲密",
  conflict: "冲突",
  power: "权力",
  dependence: "依赖",
  misunderstanding: "误解",
  fate: "命运绑定",
} as const;

export const relationTypeColors = {
  intimacy: "#C76B7A",
  conflict: "#B84A3A",
  power: "#C8A45D",
  dependence: "#6FA8A6",
  misunderstanding: "#8D72B8",
  fate: "#D8D2C4",
} as const;

export function getLocationHeatAtChapter(location: LocationViewModel, chapter: number) {
  const heat = location.chapterHeat.reduce((maxHeat, point) => {
    const distance = Math.abs(chapter - point.chapter);
    const falloff = Math.exp(-(distance * distance) / (2 * 7.5 * 7.5));
    return Math.max(maxHeat, point.intensity * falloff);
  }, 0);

  return Math.round(Math.min(100, heat));
}

export function getNearestChapterHeatLabel(location: LocationViewModel, chapter: number) {
  return location.chapterHeat.reduce((nearest, point) => {
    return Math.abs(point.chapter - chapter) < Math.abs(nearest.chapter - chapter)
      ? point
      : nearest;
  }, location.chapterHeat[0]);
}

export function getTimelinePhaseByChapter(chapter: number) {
  if (chapter <= 40) {
    return "early";
  }

  if (chapter <= 80) {
    return "middle";
  }

  return "late";
}
