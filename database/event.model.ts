import {
  HydratedDocument,
  Model,
  Schema,
  model,
  models,
} from "mongoose";

interface IEvent {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

type EventDocument = HydratedDocument<IEvent>;

const nonEmptyRequired = (label: string) => ({
  validator: (value: string): boolean => value.trim().length > 0,
  message: `${label} is required.`,
});

const toSlug = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const normalizeDateToIso = (value: string): string => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Date must be a valid date string.");
  }
  return parsed.toISOString();
};

const normalizeTime = (value: string): string => {
  const normalizedInput = value.trim().toLowerCase();
  const twelveHourMatch = normalizedInput.match(
    /^(\d{1,2}):(\d{2})\s*(am|pm)$/
  );

  if (twelveHourMatch) {
    let hours = Number(twelveHourMatch[1]);
    const minutes = Number(twelveHourMatch[2]);
    const period = twelveHourMatch[3];

    if (hours < 1 || hours > 12 || minutes > 59) {
      throw new Error("Time must be a valid 12-hour clock value.");
    }

    if (period === "pm" && hours !== 12) hours += 12;
    if (period === "am" && hours === 12) hours = 0;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  }

  const twentyFourHourMatch = normalizedInput.match(/^(\d{1,2}):(\d{2})$/);
  if (!twentyFourHourMatch) {
    throw new Error("Time must be in HH:mm or h:mm AM/PM format.");
  }

  const hours = Number(twentyFourHourMatch[1]);
  const minutes = Number(twentyFourHourMatch[2]);

  if (hours > 23 || minutes > 59) {
    throw new Error("Time must be a valid 24-hour clock value.");
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required."],
      trim: true,
      validate: nonEmptyRequired("Title"),
    },
    slug: {
      type: String,
      unique: true,
      index: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
      validate: nonEmptyRequired("Description"),
    },
    overview: {
      type: String,
      required: [true, "Overview is required."],
      trim: true,
      validate: nonEmptyRequired("Overview"),
    },
    image: {
      type: String,
      required: [true, "Image is required."],
      trim: true,
      validate: nonEmptyRequired("Image"),
    },
    venue: {
      type: String,
      required: [true, "Venue is required."],
      trim: true,
      validate: nonEmptyRequired("Venue"),
    },
    location: {
      type: String,
      required: [true, "Location is required."],
      trim: true,
      validate: nonEmptyRequired("Location"),
    },
    date: {
      type: String,
      required: [true, "Date is required."],
      trim: true,
      validate: nonEmptyRequired("Date"),
    },
    time: {
      type: String,
      required: [true, "Time is required."],
      trim: true,
      validate: nonEmptyRequired("Time"),
    },
    mode: {
      type: String,
      required: [true, "Mode is required."],
      trim: true,
      validate: nonEmptyRequired("Mode"),
    },
    audience: {
      type: String,
      required: [true, "Audience is required."],
      trim: true,
      validate: nonEmptyRequired("Audience"),
    },
    agenda: {
      type: [String],
      required: [true, "Agenda is required."],
      validate: {
        validator: (value: string[]): boolean =>
          value.length > 0 && value.every((item) => item.trim().length > 0),
        message: "Agenda must contain at least one non-empty item.",
      },
    },
    organizer: {
      type: String,
      required: [true, "Organizer is required."],
      trim: true,
      validate: nonEmptyRequired("Organizer"),
    },
    tags: {
      type: [String],
      required: [true, "Tags are required."],
      validate: {
        validator: (value: string[]): boolean =>
          value.length > 0 && value.every((item) => item.trim().length > 0),
        message: "Tags must contain at least one non-empty item.",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

EventSchema.index({ slug: 1 }, { unique: true });

EventSchema.pre("save", function (next) {
  const doc = this as EventDocument;

  // Enforce non-empty required scalar fields before persistence.
  const requiredFields: Array<keyof Pick<
    IEvent,
    | "title"
    | "description"
    | "overview"
    | "image"
    | "venue"
    | "location" 
    | "date"
    | "time"
    | "mode"
    | "audience"
    | "organizer"
  >> = [
    "title",
    "description",
    "overview",
    "image",
    "venue",
    "location",
    "date",
    "time",
    "mode",
    "audience",
    "organizer",
  ];

  for (const field of requiredFields) {
    if (doc[field].trim().length === 0) {
      return next(new Error(`${field} is required.`));
    }
  }

  if (doc.agenda.length === 0 || doc.agenda.some((item) => item.trim() === "")) {
    return next(new Error("Agenda must contain at least one non-empty item."));
  }

  if (doc.tags.length === 0 || doc.tags.some((item) => item.trim() === "")) {
    return next(new Error("Tags must contain at least one non-empty item."));
  }

  // Keep URL slug in sync with title, but only when title changes.
  if (doc.isModified("title")) {
    doc.slug = toSlug(doc.title);
  }

  // Normalize date and time into a consistent storage format.
  try {
    if (doc.isModified("date")) {
      doc.date = normalizeDateToIso(doc.date);
    }
    if (doc.isModified("time")) {
      doc.time = normalizeTime(doc.time);
    }
    return next();
  } catch (error) {
    if (error instanceof Error) {
      return next(error);
    }
    return next(new Error("Invalid date or time value."));
  }
});

const Event: Model<IEvent> = models.Event || model<IEvent>("Event", EventSchema);

export { Event };
export type { IEvent };
