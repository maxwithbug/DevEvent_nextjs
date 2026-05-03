import { notFound } from "next/navigation";
import React from "react";
import { headers } from "next/headers";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";


type EventDetail = {
  title?: string;
  description: string;
  image: string;
  overview: string;
  date: string;
  time: string;
  mode: string;
  venue?: string;
  location: string;
  audience: string;
  agenda?: string[];
  tags?: string[];
};

const EventDetailsItem = ({
  icon,
  alt,
  labelTitle,
  label,
}: {
  icon: string;
  alt: string;
  labelTitle: string;
  label: string;
}) => {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-black/20 p-3">
      <Image src={icon} alt={alt} width={20} height={20} />
      <div className="space-y-0.5">
        <p className="text-xs uppercase tracking-wide text-light-200">
          {labelTitle}
        </p>
        <p className="text-sm text-light-100">{label}</p>
      </div>
    </div>
  );
};

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => {
  if (!agendaItems.length) return null;

  return (
    <div className="agenda rounded-xl border border-white/10 bg-black/20 p-5">
      <h2>Event Agenda</h2>
      <ul className="mt-3 list-disc list-inside space-y-2 ">
        {agendaItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const EventTags = ({ tags }: { tags: string[] }) => {
  if (!tags.length) return null;
  return (
    <div className="mt-5 flex flex-row flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span key={`${tag}-${index}`} className="pill">
          #{tag}
        </span>
      ))}
    </div>
  );
};

/**
 * Same as `JSON.parse(values[0])` for tags/agenda saved as one JSON string in the first slot;
 * falls back to a normal Mongoose string[] when that cell is not JSON.
 */
function itemsFromJSONParseFirst(values: string[] | undefined): string[] {
  if (!values?.length) return [];
  try {
    const parsed = JSON.parse(values[0]) as unknown;
    return Array.isArray(parsed)
      ? parsed.map((item) => String(item).trim()).filter(Boolean)
      : [];
  } catch {
    return values.map((item) => String(item).trim()).filter(Boolean);
  }
}

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  // Extract the slug from the route parameters and trim any whitespace
  const { slug: rawSlug } = await params;
  const slug = rawSlug?.trim();
  if (!slug) return notFound();

  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol = headerStore.get("x-forwarded-proto") ?? "http";
  const baseUrl = host
    ? `${protocol}://${host}`
    : process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) {
    console.error("Missing base URL for event details request.");
    return notFound();
  }

  const request = await fetch(
    `${baseUrl}/api/events/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    },
  );

  if (!request.ok) return notFound();

  const payload = await request.json();
  const event = payload?.event as EventDetail | undefined;
  if (!event) return notFound();

  const {
    title,
    description,
    image,
    overview,
    date,
    time,
    mode,
    venue,
    location,
    audience,
    agenda,
    tags,
  } = event;

  if (!description) return notFound();

  const agendaItems = itemsFromJSONParseFirst(agenda);



  const bookings = 10 

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-10">
      <section id="event" className="space-y-8">
        <div className="header rounded-2xl border border-white/10 bg-black/25 p-6 sm:p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-primary">
            Developer Event
          </p>
          <h1 className="mt-3">{title ?? "Event Details"}</h1>
          <p className="mt-4 text-light-100/95">{description}</p>
          {tags?.length ? (
            <EventTags tags={itemsFromJSONParseFirst(tags)} />
          ) : null}
        </div>

        <div className="details grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
          {/* leftside event details */}
          <div className="content space-y-6">
            <Image
              src={image}
              alt="Event Banner"
              width={1280}
              height={720}
              className="banner h-auto w-full rounded-2xl border border-white/10 object-cover"
              unoptimized
            />

            <section className="overview rounded-2xl border border-white/10 bg-black/25 p-6">
              <h2>Overview</h2>
              <p className="mt-3">{overview}</p>
            </section>

            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <EventDetailsItem
                icon="/icons/calendar.svg"
                alt="Calendar Icon"
                labelTitle="Date"
                label={date}
              />
              <EventDetailsItem
                icon="/icons/clock.svg"
                alt="Time Icon"
                labelTitle="Time"
                label={time}
              />
              {venue ? (
                <EventDetailsItem
                  icon="/icons/pin.svg"
                  alt="Venue Icon"
                  labelTitle="Venue"
                  label={venue}
                />
              ) : null}
              <EventDetailsItem
                icon="/icons/pin.svg"
                alt="Location Icon"
                labelTitle="Location"
                label={location}
              />
              <EventDetailsItem
                icon="/icons/audience.svg"
                alt="Audience Icon"
                labelTitle="Audience"
                label={audience}
              />
              <EventDetailsItem
                icon="/icons/mode.svg"
                alt="Mode Icon"
                labelTitle="Mode"
                label={mode}
              />
            </section>
            <EventAgenda agendaItems={agendaItems} />
          </div>

          {/* rightside booking information */}
          <aside className="booking lg:sticky lg:top-24">
            <div className="signup-card rounded-2xl border border-white/10 bg-black/30 p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-light-200">
                Registration
              </p>
              <p className="mt-2 text-2xl font-semibold">Book your spot now</p>
              {bookings > 0 ? (
                <p className="mt-3 text-sm text-light-200">
                  Seats are limited. Register early to reserve your place and
                  receive event updates.
                </p>
              ) : (
                  <p className="mt-3 text-sm text-light-200">
                    Be among the first to register.
                  </p>
              )}
              <BookEvent
                eventSlug={slug}
                initialBookingCount={bookings}
              />
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

export default EventDetailsPage;
