<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your DevEvent Next.js application. Here's a summary of what was added:

- **`instrumentation-client.ts`** (new): Initializes PostHog on the client side using the `instrumentation-client` pattern for Next.js 15.3+. Configured with a reverse proxy path (`/ingest`), exception capture, and debug mode in development.
- **`next.config.ts`** (updated): Added rewrites to proxy PostHog traffic through your own domain (`/ingest/*`), reducing the chance of ad-blockers interfering with event capture.
- **`.env.local`** (updated): Added `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.
- **`components/ExploreBtn.jsx`** (updated): Added `posthog.capture('explore_events_clicked')` to the button's onClick handler.
- **`components/EventCard.tsx`** (updated): Converted to a client component and added `posthog.capture('event_card_clicked')` with event properties (title, slug, location, day) on click.
- **`components/Navabar.tsx`** (updated): Converted to a client component and added `posthog.capture('nav_link_clicked')` with a `link` property on each navigation link.

## Events

| Event Name | Description | File |
|---|---|---|
| `explore_events_clicked` | User clicks the "Explore Events" button on the home page hero section | `components/ExploreBtn.jsx` |
| `event_card_clicked` | User clicks on an event card to view event details | `components/EventCard.tsx` |
| `nav_link_clicked` | User clicks a navigation link in the navbar (Events, About, Contact) | `components/Navabar.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/396851/dashboard/1509407
- **Explore Events Clicks** (trend): https://us.posthog.com/project/396851/insights/aXUi2CKc
- **Event Card Clicks** (trend): https://us.posthog.com/project/396851/insights/mdIPZgg2
- **Most Popular Event Cards** (breakdown by event title): https://us.posthog.com/project/396851/insights/EadhqZTO
- **Event Discovery Funnel** (explore → card click conversion): https://us.posthog.com/project/396851/insights/4DX4SSmX
- **Nav Link Clicks by Destination** (breakdown by link): https://us.posthog.com/project/396851/insights/Eg6W57xC

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
