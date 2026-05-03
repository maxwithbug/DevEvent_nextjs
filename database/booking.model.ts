import {
  HydratedDocument,
  Model,
  Schema,
  Types,
  model,
  models,
} from "mongoose";
import { Event } from "./event.model";

interface IBooking {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

type BookingDocument = HydratedDocument<IBooking>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "eventId is required."],
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string): boolean => emailPattern.test(value),
        message: "Email must be a valid email address.",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

BookingSchema.index({ eventId: 1, email: 1 }, { unique: true });

BookingSchema.pre("save", async function () {
  const doc = this as BookingDocument;

  // Ensure this booking points to an existing event when eventId changes.
  if (doc.isModified("eventId")) {
    const eventExists = await Event.exists({ _id: doc.eventId });
    if (!eventExists) {
      throw new Error("Referenced event does not exist.");
    }
  }

  // Keep email format strict even if input comes from unchecked sources.
  if (!emailPattern.test(doc.email)) {
    throw new Error("Email must be a valid email address.");
  }
});

const Booking: Model<IBooking> =
  models.Booking || model<IBooking>("Booking", BookingSchema);

export { Booking };
export type { IBooking };
