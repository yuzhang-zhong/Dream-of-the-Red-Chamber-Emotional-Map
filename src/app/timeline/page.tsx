import { AppNav } from "@/components/layout/AppNav";
import { TimelineExperience } from "@/components/timeline/TimelineExperience";
import { getAtlasPayload } from "@/lib/atlas";

export default function TimelinePage() {
  return (
    <>
      <AppNav />
      <TimelineExperience payload={getAtlasPayload()} />
    </>
  );
}
