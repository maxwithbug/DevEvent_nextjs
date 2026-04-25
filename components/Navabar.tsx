import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

function Navabar() {
  return (
      <header>
          <nav>
              <Link href="/" className='logo'>
                  <Image src="/icons/logo.png" alt="logo" width={24} height={24} />

                <p>DevEvent</p>

              </Link>
              <ul>
                  <li><Link href="/events">Events</Link></li>
                  <li><Link href="/about">About</Link></li>
                  <li><Link href="/contact">Contact</Link></li>
              </ul>
          </nav>
    </header>
  )
}

export default Navabar