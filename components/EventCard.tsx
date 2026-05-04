"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import posthog from "posthog-js";
import { cn } from "@/lib/utils";

interface EventCardProps {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
  /** Optional layout / surface styles (e.g. similar-events grid). */
  className?: string;
}

function EventCard({
  title,
  image,
  slug,
  location,
  date,
  time,
  className,
}: EventCardProps) {
  return (
    <Link
      href={`/events/${slug}`}
      className={cn(
        "event-card",
        "group relative flex flex-col gap-4 text-left outline-none transition-all duration-500 ease-out",
        "hover:transform hover:scale-[1.02] hover:-translate-y-2",
        "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030708]",
        className,
      )}
      onClick={() =>
        posthog.capture("event_card_clicked", {
          event_title: title,
          event_slug: slug,
          event_location: location,
          event_date: date,
        })
      }
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none"></div>

      {/* Featured badge */}
      <div className="absolute top-3 right-3 z-10">
        <div className="px-3 py-1 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
          <span className="text-primary text-xs font-semibold">FEATURED</span>
        </div>
      </div>

      {/* Image container with enhanced effects */}
      <div className="relative overflow-hidden rounded-xl ring-1 ring-white/10 group-hover:ring-primary/30 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <Image
          src={image}
          alt={title}
          height={300}
          width={410}
          className="poster transition-all duration-700 ease-out group-hover:scale-[1.05] group-hover:brightness-110"
        />

        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"></div>
      </div>

      {/* Content section */}
      <div className="flex flex-col gap-3 px-1">
        {/* Location with icon */}
        <div className="flex items-center gap-2 text-light-200/80 group-hover:text-light-200 transition-colors duration-300">
          <div className="relative">
            <Image
              src="/icons/pin.svg"
              alt="Location"
              height={14}
              width={14}
              className="group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm scale-150 group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
          </div>
          <span className="text-sm font-medium">{location}</span>
        </div>

        {/* Title with hover effect */}
        <h4 className="title text-xl font-semibold text-white group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight">
          {title}
        </h4>

        {/* Date and time info */}
        <div className="datetime flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 text-light-200/70 group-hover:text-light-200 transition-colors duration-300">
            <div className="flex items-center gap-1.5">
              <Image
                src="/icons/calendar.svg"
                alt="Day"
                height={14}
                width={14}
                className="group-hover:rotate-12 transition-transform duration-300"
              />
              <span className="text-sm font-medium day">{date}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-light-200/70 group-hover:text-light-200 transition-colors duration-300">
            <div className="flex items-center gap-1.5">
              <Image
                src="/icons/clock.svg"
                alt="Time"
                height={14}
                width={14}
                className="group-hover:rotate-12 transition-transform duration-300"
              />
              <span className="text-sm font-medium time">{time}</span>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="flex items-center justify-between mt-2">
          <span className="text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            View Details →
          </span>
          <div className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300"></div>
        </div>
      </div>
    </Link>
  );
}

export default EventCard;
