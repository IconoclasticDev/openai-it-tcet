import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import teamHtml from "../site/team_page_body.html?raw";
import { pageLinks, siteMeta } from "../lib/site-head";
import { usePagesScript } from "../lib/use-pages-script";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: siteMeta(
      "Team | Open AI IT TCET",
      "Meet the Open AI IT committee at TCET: members building systems code, reproducing papers and shipping AI tools.",
    ),
    links: pageLinks,
  }),
  component: TeamComponent,
});

function TeamComponent() {
  usePagesScript();
  return (
    <>
      <SiteHeader />
      <div className="oai-page-enter" dangerouslySetInnerHTML={{ __html: teamHtml }} />
      <SiteFooter />
    </>
  );
}

