import { NextResponse } from "next/server";
import type { ApiResponse } from "@/contracts/api-response";
import type { AtlasPayload } from "@/contracts/atlas";
import { contentVersion } from "@/data/atlas";
import { getAtlasPayload } from "@/lib/atlas";

export function GET() {
  const response: ApiResponse<AtlasPayload> = {
    data: getAtlasPayload(),
    meta: {
      schemaVersion: "1.0",
      contentVersion,
      generatedAt: new Date().toISOString(),
    },
  };

  return NextResponse.json(response);
}
