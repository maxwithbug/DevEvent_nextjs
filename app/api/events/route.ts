// import { Event } from "@/database";
// import connectToDatabase from "@/lib/mongodb";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(request: NextRequest) {
//     try {
//         await connectToDatabase();

//         const body = await request.json();
//         const createdEvent = await Event.create(body);

//         return NextResponse.json(
//             { message: "Event created successfully", event: createdEvent },
//             { status: 201 }
//         );
//     } catch (error) {
//         console.log(error);
//         return NextResponse.json(
//             {
//                 error: "An error occurred while creating the event. [events/route.ts]",
//                 message: error instanceof Error ? error.message : "Unknown error",
//             },
//             { status: 500 }
//         );
//     }
// }




//with form data 




import { Event } from "@/database";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        await connectToDatabase();

        const formData = await request.formData();
        const fields = Object.fromEntries(formData.entries());

        // Parse stringified arrays sent from frontend
        const agenda = JSON.parse(fields.agenda as string) as string[];
        const tags = JSON.parse(fields.tags as string) as string[];

        const createdEvent = await Event.create({
            ...fields,
            agenda,
            tags,
        });

        return NextResponse.json(
            { message: "Event created successfully", event: createdEvent },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                error: "An error occurred while creating the event. [events/route.ts]",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}