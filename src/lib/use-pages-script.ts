import { useEffect } from "react";

/** Loads the shared inner-page motion script. */
export function usePagesScript(key?: string) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/site/pages.js";
    script.async = false;
    document.body.appendChild(script);
    return () => {
      script.remove();
      // allow re-init on the next page
      (window as unknown as Record<string, unknown>)["__oaiPagesInit"] = false;
    };
  }, [key]);
}
