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
import { v2 as cloudinary } from "cloudinary";
import connectToDatabase from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

//create event with form data and file upload to cloudinary
export async function POST(request: NextRequest) {
    try {
        await connectToDatabase();

        // Configure Cloudinary with environment variables
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        // Parse form data from the request
        const formData = await request.formData();
        const event = Object.fromEntries(formData.entries());

        // Parse stringified arrays sent from frontend
        // const agenda = JSON.parse(fields.agenda as string) as string[];
        // const tags = JSON.parse(fields.tags as string) as string[];

        let  tags = JSON.parse(formData.get("tags") as string) as string[];
        let agenda = JSON.parse(formData.get("agenda") as string) as string[];
        try {
            const file = formData.get("image") as File;
            if (!file) {
                return NextResponse.json(
                    { error: "Image file is required." },
                    { status: 400 }
                );
            } else {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const uploadResult = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { resource_type: "image", folder: "DevEvent" },
                        (error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    ).end(buffer);
                });
                event.image = (uploadResult as { secure_url: string }).secure_url;
            }

        } catch (error) {
            console.error("Error uploading file:", error);
            return NextResponse.json(
                { error: "An error occurred while uploading the file." },
                { status: 500 }
            );
        }




        //create event with validation
        try {
            const createdEvent = await Event.create({
                ...event,
                agenda,
                 tags,
            });
            return NextResponse.json(
                { message: "Event created successfully", event: createdEvent },
                { status: 201 }
            );
        } catch (error) {
            console.error("Error creating event:", error);
            return NextResponse.json(
                {
                    error: "An error occurred while creating the event. [events/route.ts]",
                    message: error instanceof Error ? error.message : "Unknown error",
                },
                { status: 500 }
            );
        }


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

//get all events
export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();
        const events = await Event.find().sort({ createdAt: -1 });
        return NextResponse.json({ message: "Events fetched successfully", events });





    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                error: "An error occurred while fetching events. [events/route.ts]",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }

};



