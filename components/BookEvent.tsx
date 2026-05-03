"use client";

import React, { useState } from "react";

interface BookEventProps {
  eventSlug: string;
  initialBookingCount: number;
}

export default function BookEvent({
  eventSlug,
  initialBookingCount,
}: BookEventProps) {
  const [email, setEmail] = useState("");
  const [bookingCount, setBookingCount] = useState(initialBookingCount);
  const [status, setStatus] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setPending(true);

    try {
      const res = await fetch(
        `/api/events/${encodeURIComponent(eventSlug)}/book`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        message?: string;
        bookingCount?: number;
      };

      if (!res.ok) {
        setStatus({
          tone: "error",
          message:
            typeof data?.error === "string"
              ? data.error
              : "Something went wrong. Try again.",
        });
        return;
      }

      if (typeof data.bookingCount === "number") {
        setBookingCount(data.bookingCount);
      }

      setStatus({
        tone: "success",
        message:
          typeof data.message === "string"
            ? data.message
            : "You are registered!",
      });
      setEmail("");
    } catch {
      setStatus({
        tone: "error",
        message: "Network error. Check your connection and try again.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-4 space-y-4">
      <p className="text-sm text-light-200">
        Seats are limited. Register early to reserve your place and receive
        event updates.
        {bookingCount > 0 ? (
          <span className="mt-2 block">
            <span className="text-light-100 font-medium tabular-nums">
              {bookingCount}
            </span>{" "}
            {bookingCount === 1 ? "person has" : "people have"} registered so
            far.
          </span>
        ) : (
          <span className="mt-2 block">Be among the first to register.</span>
        )}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label htmlFor="booking-email" className="sr-only">
          Email
        </label>
        <input
          id="booking-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-light-100 placeholder:text-light-200/45 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/35"
          disabled={pending}
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {pending ? "Registering…" : "Register"}
        </button>
      </form>

      {status ? (
        <p
          className={`text-sm ${
            status.tone === "success" ? "text-emerald-300" : "text-red-400"
          }`}
          role={status.tone === "error" ? "alert" : "status"}
        >
          {status.message}
        </p>
      ) : null}
    </div>
  );
}
