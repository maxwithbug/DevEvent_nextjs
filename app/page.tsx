import React from "react";
import ExploreBtn from "../components/ExploreBtn";
import EventCard from "@/components/EventCard";
import { eventCardsdata } from "@/lib/constans";

function Home() {
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
          {eventCardsdata.map((event) => (
            <li key={event.slug}>
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Home;
