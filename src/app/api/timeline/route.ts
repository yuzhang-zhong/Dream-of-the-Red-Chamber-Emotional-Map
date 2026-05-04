import { NextResponse } from "next/server";
import type { ApiResponse } from "@/contracts/api-response";
import type { TimelineEvent } from "@/contracts/atlas";
import { contentVersion, timeline } from "@/data/atlas";

export function GET() {
  const response: ApiResponse<TimelineEvent[]> = {
    data: timeline,
    meta: {
      schemaVersion: "1.0",
      contentVersion,
      generatedAt: new Date().toISOString(),
    },
  };

  return NextResponse.json(response);
}
