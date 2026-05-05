import { Event } from "@/database";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

/// a route that returns all events

export async function GET(
  _request: NextRequest
): Promise<NextResponse> {
  try {
    await connectToDatabase();

    const events = await Event.find({})
      .lean()
      .exec();

    return NextResponse.json({ events: events ?? [] }, { status: 200 });
  } catch (error) {
    console.error("[events/route] GET error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred while fetching events.",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
