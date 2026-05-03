"use server";

import { Event, type IEvent } from "@/database";
import { connectToDatabase } from "../mongodb";

export async function getsimilarEventsBySlug(eventSlug: string): Promise<IEvent[]> {
    try {
        await connectToDatabase();
        const event = await Event.findOne({ slug: eventSlug }).exec();
        if (!event) {
            return [];
        }
        const similarDocs = await Event.find({
            _id: { $ne: event._id },
            tags: { $in: event.tags },
        })
            .lean<IEvent>()
            .exec();

        return (similarDocs ?? []) as unknown as IEvent[];
    } catch (error) {
        console.error("Error getting similar events by slug:", error);
        return [];
    }
}