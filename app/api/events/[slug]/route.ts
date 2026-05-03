import { Booking, Event } from "@/database";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

/// a rourte accepts a slug and returns the event details , if not return error message


interface RouteParams {
    params: Promise<{
        slug: string;
    }>;
}

const isValidSlug = (value: string): boolean =>
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.trim());

export async function GET(
    _request: NextRequest,
    { params }: RouteParams
): Promise<NextResponse> {
    const { slug: rawSlug } = await params;
    const slug = rawSlug?.trim();

    if (!slug) {
        return NextResponse.json(
            { error: "Missing slug parameter. Please provide an event slug." },
            { status: 400 }
        );
    }

    if (!isValidSlug(slug)) {
        return NextResponse.json(
            {
                error:
                    "Invalid slug format. Slug must use lowercase letters, numbers, and hyphens only.",
            },
            { status: 400 }
        );
    }

    try {
        await connectToDatabase();

        const normalizedSlug = slug.toLowerCase();
        const event = await Event.findOne({ slug: normalizedSlug })
            .lean()
            .exec();

        if (!event) {
            return NextResponse.json(
                { error: `Event not found for slug: ${normalizedSlug}` },
                { status: 404 }
            );
        }

        const bookingCount = await Booking.countDocuments({
            eventId: event._id,
        });

        return NextResponse.json({ event, bookingCount }, { status: 200 });
    } catch (error) {
        console.error("[events/[slug]/route] GET error:", error);
        return NextResponse.json(
            {
                error: "An unexpected error occurred while fetching the event.",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
