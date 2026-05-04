import { NextResponse } from "next/server";
import type { ApiResponse } from "@/contracts/api-response";
import type { Character } from "@/contracts/atlas";
import { characters, contentVersion } from "@/data/atlas";

export function GET() {
  const response: ApiResponse<Character[]> = {
    data: characters,
    meta: {
      schemaVersion: "1.0",
      contentVersion,
      generatedAt: new Date().toISOString(),
    },
  };

  return NextResponse.json(response);
}
