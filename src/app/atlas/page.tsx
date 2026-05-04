import { AtlasExperience } from "@/components/atlas/AtlasExperience";
import { getAtlasPayload } from "@/lib/atlas";

export default async function AtlasPage({
  searchParams,
}: {
  searchParams?: Promise<{ location?: string }>;
}) {
  const params = await searchParams;

  return (
    <AtlasExperience payload={getAtlasPayload()} initialLocationId={params?.location} />
  );
}
