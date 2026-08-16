import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import learnHtml from "../site/learn_page_body.html?raw";
import { pageLinks, siteMeta } from "../lib/site-head";
import { usePagesScript } from "../lib/use-pages-script";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: siteMeta(
      "Learn | Open AI IT TCET",
      "Paper reproductions and technical write-ups: attention, LoRA, DPO, FlashAttention, RoPE and GRPO reasoning.",
    ),
    links: pageLinks,
  }),
  component: LearnComponent,
});

function LearnComponent() {
  usePagesScript();
  return (
    <>
      <SiteHeader />
      <div className="oai-page-enter" dangerouslySetInnerHTML={{ __html: learnHtml }} />
      <SiteFooter />
    </>
  );
}

