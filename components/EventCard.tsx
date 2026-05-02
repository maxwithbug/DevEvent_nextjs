"use client";

import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import posthog from 'posthog-js';

interface EventCardProps {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

function EventCard({ title, image, slug, location, date, time }: EventCardProps) {
  return (
    <Link
      href={`/events/${slug}`}
      id="event-card"
      onClick={() =>
        posthog.capture("event_card_clicked", {
          event_title: title,
          event_slug: slug,
          event_location: location,
          event_date: date,
        })
      }
    >
          <Image src={image} alt={title} height={300} width={410} />
          
          <div className='flex flex-row gap-2'>
              <Image src="/icons/pin.svg" alt="Location" height={14} width={14} />
              <span>{location}</span>
          </div>
            
      <p className='title'>{title}</p>

          <div className='datetime'>
              <div>
                  <Image
                    src="/icons/calendar.svg"
                    alt="Day"
                    height={14}
                    width={14}
                  />
                  <p className='day'>{date}</p>
              </div>
              <div>
                  <Image
                    src="/icons/clock.svg"
                    alt="Time"
                    height={14}
                    width={14}
                  />
                  <p className='time'>{time}</p>
              </div>
          </div>
    </Link>
  );
}

export default EventCard