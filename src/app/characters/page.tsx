import { CharacterGrid } from "@/components/characters/CharacterGrid";
import { AppNav } from "@/components/layout/AppNav";
import { getAtlasPayload } from "@/lib/atlas";

export default function CharactersPage() {
  return (
    <>
      <AppNav />
      <CharacterGrid payload={getAtlasPayload()} />
    </>
  );
}
