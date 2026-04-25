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

BookingSchema.pre("save", async function (next) {
  const doc = this as BookingDocument;

  // Ensure this booking always points to an existing event.
  const eventExists = await Event.exists({ _id: doc.eventId });
  if (!eventExists) {
    return next(new Error("Referenced event does not exist."));
  }

  // Keep email format strict even if input comes from unchecked sources.
  if (!emailPattern.test(doc.email)) {
    return next(new Error("Email must be a valid email address."));
  }

  return next();
});

const Booking: Model<IBooking> =
  models.Booking || model<IBooking>("Booking", BookingSchema);

export { Booking };
export type { IBooking };
