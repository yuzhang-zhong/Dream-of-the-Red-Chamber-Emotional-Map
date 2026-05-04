import { NextResponse } from "next/server";
import type { ApiResponse } from "@/contracts/api-response";
import type { Location } from "@/contracts/atlas";
import { contentVersion, locations } from "@/data/atlas";

export function GET() {
  const response: ApiResponse<Location[]> = {
    data: locations,
    meta: {
      schemaVersion: "1.0",
      contentVersion,
      generatedAt: new Date().toISOString(),
    },
  };

  return NextResponse.json(response);
}
