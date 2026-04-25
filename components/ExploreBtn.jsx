"use client";

import Image from "next/image";
import React from "react";
import posthog from "posthog-js";

function ExploreBtn() {
  return (
      <button
          type="button"
          id="explore-btn"
          className="text-white mt-7 mx-auto"
          onClick={() => {
            console.log("Explore button clicked!");
            posthog.capture("explore_events_clicked");
          }}
        >
          <a href="#events">Explore Events
              <Image src="/icons/arrow-down.svg" alt="arrow-down" width={24} height={24} />
          </a>
          
            

        </button>
  );
}

export default ExploreBtn;
