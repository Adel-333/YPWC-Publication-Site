import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error:
        "Registration for the Youth Physics Writing Contest (YPWC) is officially closed. Submissions have concluded.",
    },
    { status: 403 }
  );
}
