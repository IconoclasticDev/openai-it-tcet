import { useEffect } from "react";

/** Loads the shared site script (nav, reveals, premium motion) on any page. */
export function useSiteScript(deps: unknown[] = []) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/site/script.js";
    script.async = false;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
