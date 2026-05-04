import { atlasPayload } from "../src/data/atlas";
import { chapterTitles } from "../src/data/chapter-titles";
import { getChapterAppearances } from "../src/data/chapter-appearances";

function assertUniqueIds<T extends { id: string }>(items: T[], label: string) {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) {
      throw new Error(`${label} has duplicate id: ${item.id}`);
    }
    seen.add(item.id);
  }
}

function assertInRange(value: number, min: number, max: number, label: string) {
  if (value < min || value > max) {
    throw new Error(`${label} must be between ${min} and ${max}, got ${value}`);
  }
}

function main() {
  const { locations, characters, relations, timeline } = atlasPayload;
  const locationIds = new Set(locations.map((item) => item.id));
  const characterIds = new Set(characters.map((item) => item.id));
  const relationIds = new Set(relations.map((item) => item.id));

  assertUniqueIds(locations, "locations");
  assertUniqueIds(characters, "characters");
  assertUniqueIds(relations, "relations");
  assertUniqueIds(timeline, "timeline");

  for (let chapter = 1; chapter <= 120; chapter += 1) {
    if (!chapterTitles[chapter]) {
      throw new Error(`chapter title missing: ${chapter}`);
    }
    const appearances = getChapterAppearances(chapter);
    if (appearances.length === 0) {
      throw new Error(`chapter appearances missing: ${chapter}`);
    }
    for (const appearance of appearances) {
      if (!locationIds.has(appearance.locationId)) {
        throw new Error(
          `chapter ${chapter} appearance ${appearance.id} has missing location ${appearance.locationId}`,
        );
      }
    }
  }

  for (const location of locations) {
    assertInRange(location.position.x, 0, 100, `${location.id}.position.x`);
    assertInRange(location.position.y, 0, 100, `${location.id}.position.y`);
    for (const characterId of location.characterIds) {
      if (!characterIds.has(characterId)) {
        throw new Error(`${location.id} references missing character ${characterId}`);
      }
    }
    for (const emotion of location.emotions) {
      assertInRange(emotion.value, 0, 100, `${location.id}.${emotion.label}`);
    }
    for (const point of location.chapterHeat) {
      assertInRange(point.chapter, 1, 120, `${location.id}.chapterHeat.chapter`);
      assertInRange(point.intensity, 0, 100, `${location.id}.chapterHeat.intensity`);
    }
  }

  for (const character of characters) {
    if (character.locationId && !locationIds.has(character.locationId)) {
      throw new Error(`${character.id} references missing location ${character.locationId}`);
    }
    for (const relationId of character.relationIds) {
      if (!relationIds.has(relationId)) {
        throw new Error(`${character.id} references missing relation ${relationId}`);
      }
    }
  }

  for (const relation of relations) {
    if (!characterIds.has(relation.source)) {
      throw new Error(`${relation.id} has missing source ${relation.source}`);
    }
    if (!characterIds.has(relation.target)) {
      throw new Error(`${relation.id} has missing target ${relation.target}`);
    }
    assertInRange(relation.strength, 0, 100, `${relation.id}.strength`);
  }

  for (const event of timeline) {
    for (const locationId of event.affectedLocationIds) {
      if (!locationIds.has(locationId)) {
        throw new Error(`${event.id} references missing location ${locationId}`);
      }
    }
    for (const characterId of event.affectedCharacterIds) {
      if (!characterIds.has(characterId)) {
        throw new Error(`${event.id} references missing character ${characterId}`);
      }
    }
    for (const relationId of event.affectedRelationIds ?? []) {
      if (!relationIds.has(relationId)) {
        throw new Error(`${event.id} references missing relation ${relationId}`);
      }
    }
  }

  console.log("Content validation passed.");
}

main();
