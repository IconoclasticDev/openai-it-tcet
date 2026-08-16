import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import markup from "../site/markup.html?raw";

const title = "Open AI IT TCET | IT Department AI Committee, TCET Mumbai";
const description =
  "Open AI IT is TCET Information Technology's AI committee: paper reproduction, PyTorch systems code, LoRA fine-tuning, DPO alignment and GPU engineering.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "theme-color", content: "#9333ea" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap",
      },
      { rel: "stylesheet", href: "/site/styles.css" },
      { rel: "stylesheet", href: "/site/premium.css" },
      { rel: "stylesheet", href: "/site/enhancements.css" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/site/script.js";
    script.async = false;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return <div className="oai-page-enter" dangerouslySetInnerHTML={{ __html: markup }} />;
}
