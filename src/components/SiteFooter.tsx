import footerHtml from "../site/footer.html?raw";

/**
 * Renders the same footer used on the home page.
 * Imported as raw HTML and injected via dangerouslySetInnerHTML to
 * keep exact parity with the home page markup.
 */
export function SiteFooter() {
  return <div dangerouslySetInnerHTML={{ __html: footerHtml }} />;
}
