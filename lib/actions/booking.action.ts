'use server';



import { Booking } from "@/database";
import connectToDatabase from "../mongodb";

export const createEvent = async ({eventId , slug , email}: { eventId: string; slug: string; email: string }) => {
    try {
        await connectToDatabase();
        const booking = (await Booking.create({ eventId, slug, email })).lean();
        return {success: true, data: booking};
    } catch (error) {
        console.error('Error creating event:', error);
        return {success: false, message: 'Failed to create event'};
    }