import { AppNav } from "@/components/layout/AppNav";
import { RelationGraph } from "@/components/relations/RelationGraph";
import { getAtlasPayload } from "@/lib/atlas";

export default async function RelationsPage({
  searchParams,
}: {
  searchParams?: Promise<{ character?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <AppNav />
      <RelationGraph payload={getAtlasPayload()} initialCharacterId={params?.character} />
    </>
  );
}
