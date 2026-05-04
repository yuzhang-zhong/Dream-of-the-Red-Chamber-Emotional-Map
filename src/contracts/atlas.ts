export type TimelinePhase = "early" | "middle" | "late";

export type RelationType =
  | "intimacy"
  | "conflict"
  | "power"
  | "dependence"
  | "misunderstanding"
  | "fate";

export interface MapPosition {
  x: number;
  y: number;
}

export interface EmotionScore {
  label: string;
  value: number;
}

export interface LocationCopy {
  tooltip: string;
  shortSummary: string;
  detailSummary: string;
  fateQuote: string;
}

export interface ChapterHeatPoint {
  chapter: number;
  intensity: number;
  label: string;
}

export interface Location {
  id: string;
  name: string;
  englishName: string;
  characterIds: string[];
  color: string;
  symbols: string[];
  emotions: EmotionScore[];
  copy: LocationCopy;
  position: MapPosition;
  chapterHeat: ChapterHeatPoint[];
  atmosphere:
    | "rain"
    | "flower"
    | "snow"
    | "grain"
    | "autumn"
    | "mist"
    | "power"
    | "wither"
    | "poetry";
}

export interface Character {
  id: string;
  name: string;
  englishName: string;
  locationId?: string;
  color: string;
  symbols: string[];
  coreEmotions: string[];
  description: string;
  relationIds: string[];
  narrativeWeight: number;
  fateKeywords: string[];
  cardQuote: string;
}

export interface Relation {
  id: string;
  source: string;
  target: string;
  primaryType: RelationType;
  types: RelationType[];
  strength: number;
  keywords: string[];
  emotionFlow: string;
  summary: string;
  phaseWeights?: Partial<Record<TimelinePhase, number>>;
}

export interface TimelineEvent {
  id: string;
  title: string;
  phase: TimelinePhase;
  order: number;
  description: string;
  affectedLocationIds: string[];
  affectedCharacterIds: string[];
  affectedRelationIds?: string[];
  mood: "bright" | "tense" | "declining" | "illusory";
  quote?: string;
}

export interface EmotionLegendItem {
  label: string;
  color: string;
  locationId: string;
}

export interface CharacterSummary {
  id: string;
  name: string;
  englishName: string;
  color: string;
}

export interface LocationViewModel {
  id: string;
  displayName: string;
  englishName: string;
  color: string;
  symbols: string[];
  emotionBars: EmotionScore[];
  representativeCharacters: CharacterSummary[];
  tooltip: string;
  shortSummary: string;
  detailSummary: string;
  fateQuote: string;
  mapPosition: MapPosition;
  chapterHeat: ChapterHeatPoint[];
  atmosphere: Location["atmosphere"];
}

export interface AtlasPayload {
  locations: Location[];
  characters: Character[];
  relations: Relation[];
  timeline: TimelineEvent[];
  emotionLegend: EmotionLegendItem[];
}

export interface AtlasIndex {
  locationsById: Record<string, Location>;
  charactersById: Record<string, Character>;
  relationsById: Record<string, Relation>;
  relationsByCharacterId: Record<string, Relation[]>;
}
