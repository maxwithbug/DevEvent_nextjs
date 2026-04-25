export interface EventCardData {
  title: string;
  image: string;
  slug: string;
  location: string;
  day: string;
  time: string;
}           

export const eventCardsdata: EventCardData[] = [
  {
    title: "Sunrise Yoga Retreat",
    image: "/images/event1.png",
    slug: "sunrise-yoga-retreat",
    location: "Santa Monica, CA",
    day: "Saturday, May 10",
    time: "7:00 AM - 9:00 AM",
  },
  {
    title: "Creative Coding Workshop",
    image: "/images/event2.png",
    slug: "creative-coding-workshop",
    location: "Austin, TX",
    day: "Sunday, May 18",
    time: "1:00 PM - 4:00 PM",
  },
  {
    title: "Outdoor Film Night",
    image: "/images/event3.png",
    slug: "outdoor-film-night",
    location: "Brooklyn, NY",
    day: "Friday, June 6",
    time: "8:30 PM - 11:00 PM",
  },
  {
    title: "Farmers Market Food Tour",
    image: "/images/event4.png",
    slug: "farmers-market-food-tour",
    location: "Portland, OR",
    day: "Saturday, June 14",
    time: "10:00 AM - 1:00 PM",
  },
  {
    title: "Indie Music Showcase",
    image: "/images/event5.png",
    slug: "indie-music-showcase",
    location: "Nashville, TN",
    day: "Thursday, June 19",
    time: "7:30 PM - 10:00 PM",
  },
  {
    title: "Tech & Startup Meetup",
    image: "/images/event6.png",
    slug: "tech-startup-meetup",
    location: "San Francisco, CA",
    day: "Tuesday, June 24",
    time: "6:00 PM - 8:00 PM",
  },
];
