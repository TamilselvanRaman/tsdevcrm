import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { success: true, message: "Local seed data has been removed. Backend and Firestore database are used as primary storage." },
    { status: 200 }
  );
}

