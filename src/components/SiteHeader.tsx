import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Team", to: "/team" },
  { label: "Events", to: "/events" },
  { label: "Learn", to: "/learn" },
];

/** The home page header, reused verbatim on the inner pages. */
export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <div className="site-header-scope">
      <header className={`header${scrolled ? " scrolled" : ""}`} id="header">
        <div className="header-inner container">
          <Link 
            className="logo" 
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="logo-icon logo-icon--img">
              <img
                src="/logos/openai_logo.png"
                alt="Open AI IT TCET Pinwheel Logo"
                width={38}
                height={38}
              />
            </div>
            <div className="logo-text">
              <span className="logo-name">OPEN AI IT</span>
              <span className="logo-sub">TCET-IT Committee</span>
            </div>
          </Link>

          <nav className="nav-desktop" aria-label="Main navigation">
            {NAV.map((item) => (
              <Link
                key={item.to}
                className={`nav-link${isActive(item.to) ? " active" : ""}`}
                to={item.to}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            className="mobile-toggle"
            aria-label="Toggle menu"
            onClick={() => setOpen(true)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      <div className={`mobile-menu${open ? " open" : ""}`}>
        <div className="mobile-menu-header">
          <button className="mobile-close" aria-label="Close menu" onClick={() => setOpen(false)}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>
        <nav className="mobile-nav">
          {NAV.map((item) => (
            <Link
              key={item.to}
              className={`mobile-nav-link${isActive(item.to) ? " active" : ""}`}
              to={item.to}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
