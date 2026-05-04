import { notFound } from "next/navigation";
import React from "react";
import { headers } from "next/headers";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import { IEvent } from "@/database";
import { getsimilarEventsBySlug } from "@/lib/actions/event.action";
import EventCard from "@/components/EventCard";

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

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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

  const bookingCountPayload = payload?.bookingCount;
  const safeBookingCount =
    typeof bookingCountPayload === "number" && Number.isFinite(bookingCountPayload)
      ? bookingCountPayload
      : 0;

  const similarEvents: IEvent[] = await getsimilarEventsBySlug(slug);
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
              <BookEvent
                eventSlug={slug}
                initialBookingCount={safeBookingCount}
              />
            </div>
          </aside>
        </div>


        {similarEvents.length > 0 ? (
          <aside
            aria-labelledby="similar-events-heading"
            className="similar-events relative isolate mt-12 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-black/55 via-black/35 to-black/60 p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] sm:p-8"
          >
            <div
              className="pointer-events-none absolute -right-20 -top-28 h-[22rem] w-[22rem] rounded-full bg-primary/12 blur-[100px]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-24 -left-16 h-[18rem] w-[18rem] rounded-full bg-[color:var(--color-blue)]/15 blur-[90px]"
              aria-hidden
            />

            <header className="relative flex flex-col gap-6 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl space-y-2">
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
                  Discover more
                </p>
                <h2
                  id="similar-events-heading"
                  className="font-schibsted-grotesk text-2xl font-bold leading-snug text-light-100 sm:text-3xl"
                >
                  Similar events
                </h2>
                <p className="text-sm leading-relaxed text-light-200">
                  Other events picked from shared themes so you never miss what
                  matters.
                </p>
              </div>
              <p className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-light-200 backdrop-blur-sm tabular-nums">
                <span className="font-semibold text-light-100">
                  {similarEvents.length}
                </span>
                <span className="text-light-200">
                  {similarEvents.length === 1 ? "matching event" : "matching events"}
                </span>
              </p>
            </header>

            <ul className="events relative mt-8" role="list">
              {similarEvents.map((item) => (
                <li key={item.slug} className="list-none">
                  <EventCard
                    title={item.title}
                    image={item.image}
                    slug={item.slug}
                    location={item.location}
                    date={item.date}
                    time={item.time}
                    className="h-full rounded-2xl border border-white/[0.06] bg-black/35 p-4 shadow-[0_22px_50px_-32px_rgba(0,0,0,0.9)] backdrop-blur-sm transition-colors duration-300 hover:border-primary/35 hover:bg-black/45 hover:shadow-[0_28px_60px_-24px_rgba(89,222,202,0.14)]"
                  />
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </section>
    </div>
  );
}

