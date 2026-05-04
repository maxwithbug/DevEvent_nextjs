
import Image from "next/image";
import ExploreBtn from "../components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Home = async () => {
  'use cache';
  cacheLife('hours');
  let events: IEvent[] = [];
  try {
    const response = await fetch(`${BASE_URL}/api/events`);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    events = data.events ?? [];
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return (
      <p className="text-center mt-10">
        Failed to load events. Please try again later.
      </p>
    );
  }

  return (
    <section>
      <h1 className="text-center mt-10">
        The Hub For Every dev <br /> Event You Can't Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons , Meetups, Conferences , All in One Place{" "}
      </p>

      <ExploreBtn />

      <div className="mt-20 space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-primary text-sm font-medium">
              Featured Events
            </span>
          </div>
          <h3 className="text-4xl font-bold text-gradient">
            Discover Amazing Events
          </h3>
          <p className="text-light-100 text-lg max-w-2xl mx-auto">
            Join thousands of developers at the most exciting tech events around
            the world
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue/5 to-primary/5 rounded-3xl blur-3xl"></div>
          <ul className="events relative">
            {events && events.length > 0 ? (
              events.map((event: IEvent) => (
                <li key={event.slug} className="list-none">
                  <EventCard {...event} />
                </li>
              ))
            ) : (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-dark-100 mb-4">
                  <Image
                    src="/icons/calendar.svg"
                    alt="No events"
                    width={24}
                    height={24}
                  />
                </div>
                <p className="text-light-200 text-lg">
                  No featured events available.
                </p>
                <p className="text-light-200/60 text-sm mt-2">
                  Check back soon for exciting new events!
                </p>
              </div>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Home;
