import React from "react";
import ExploreBtn from "../components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { eventCardsdata } from "@/lib/constans";
import { IEvent } from "@/database";



const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const Home = async () => {
  const response = await fetch(`${BASE_URL}/api/events`);
  console.log("API Response:", response);
  if (!response.ok) {
    console.error("Failed to fetch events:", response.statusText);
    return <p className="text-center mt-10">Failed to load events. Please try again later.</p>;
  }

  const {events} = await response.json();


  return (
    <section>
      <h1 className="text-center mt-10">
        The Hub For Every dev <br /> Event You Can't Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons , Meetups, Conferences , All in One Place{" "}
      </p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <ul className="events">
          {events && events.length > 0 ? (
            events.map((event:IEvent) => (
              <li key={event.slug} className="list-none">
                <EventCard {...event} />
              </li>
            ))
          ) : (
            <p className="text-center">No featured events available.</p>
          )}
        </ul>
      </div>
    </section>
  );
}

export default Home;
