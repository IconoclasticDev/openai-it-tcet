import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import eventsHtml from "../site/events_page_body.html?raw";
import { pageLinks, siteMeta } from "../lib/site-head";
import { usePagesScript } from "../lib/use-pages-script";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: siteMeta(
      "Events | Open AI IT TCET",
      "Workshops, technical sessions and build sprints run by Open AI IT, TCET's Information Technology AI committee.",
    ),
    links: pageLinks,
  }),
  component: EventsComponent,
});

function EventsComponent() {
  usePagesScript();
  return (
    <>
      <SiteHeader />
      <div className="oai-page-enter" dangerouslySetInnerHTML={{ __html: eventsHtml }} />
      <SiteFooter />
    </>
  );
}

