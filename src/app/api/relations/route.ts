import { NextResponse } from "next/server";
import type { ApiResponse } from "@/contracts/api-response";
import type { Relation } from "@/contracts/atlas";
import { contentVersion, relations } from "@/data/atlas";

export function GET() {
  const response: ApiResponse<Relation[]> = {
    data: relations,
    meta: {
      schemaVersion: "1.0",
      contentVersion,
      generatedAt: new Date().toISOString(),
    },
  };

  return NextResponse.json(response);
}
