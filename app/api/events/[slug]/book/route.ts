import { Booking, Event } from "@/database";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ slug: string; }>;
}

const isValidSlug = (value: string): boolean =>
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.trim());

function isMongoDuplicate(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: number; }).code === 11000
  );
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  const { slug: rawSlug } = await params;
  const slug = rawSlug?.trim();

  if (!slug) {
    return NextResponse.json(
      { error: "Missing slug parameter." },
      { status: 400 },
    );
  }

  if (!isValidSlug(slug)) {
    return NextResponse.json(
      { error: "Invalid event slug format." },
      { status: 400 },
    );
  }

  let email: unknown;
  try {
    const body = await request.json();
    email = body?.email;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  if (typeof email !== "string" || !email.trim()) {
    return NextResponse.json(
      { error: "Email is required." },
      { status: 400 },
    );
  }

  try {
    await connectToDatabase();
    const normalizedSlug = slug.toLowerCase();
    const event = await Event.findOne({ slug: normalizedSlug })
      .select("_id")
      .lean()
      .exec();

    if (!event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    await Booking.create({
      eventId: event._id,
      email: email.trim(),
    });

    const bookingCount = await Booking.countDocuments({ eventId: event._id });

    return NextResponse.json(
      { message: "Registration successful.", bookingCount },
      { status: 201 },
    );
  } catch (error) {
    if (isMongoDuplicate(error)) {
      return NextResponse.json(
        { error: "This email is already registered for this event." },
        { status: 409 },
      );
    }
    console.error("[events/[slug]/book/route] POST error:", error);
    return NextResponse.json(
      {
        error: "Registration failed.",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
