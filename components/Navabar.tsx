"use client";

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import posthog from 'posthog-js';

function Navabar() {
  return (
      <header>
          <nav>
              <Link href="/" className='logo'>
                  <Image src="/icons/logo.png" alt="logo" width={24} height={24} />

                <p>DevEvent</p>

              </Link>
              <ul>
                  <li><Link href="/events" onClick={() => posthog.capture("nav_link_clicked", { link: "events" })}>Events</Link></li>
                  <li><Link href="/about" onClick={() => posthog.capture("nav_link_clicked", { link: "about" })}>About</Link></li>
                  <li><Link href="/contact" onClick={() => posthog.capture("nav_link_clicked", { link: "contact" })}>Contact</Link></li>
              </ul>
          </nav>
    </header>
  )
}

export default Navabar