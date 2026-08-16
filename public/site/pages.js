/* Premium scroll reveals for the inner pages (team / events / learn / papers). */
(function () {
  if (window.__oaiPagesInit) return;
  window.__oaiPagesInit = true;

  var reduce =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function init() {
    var main = document.querySelector("main") || document.body;
    var targets = main.querySelectorAll("section, section > div > div, article");
    if (reduce || !("IntersectionObserver" in window)) return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          el.style.animationDelay = Math.min(i * 60, 240) + "ms";
          el.classList.add("is-in");
          io.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 },
    );

    Array.prototype.forEach.call(targets, function (el) {
      if (el.closest("header")) return;
      el.classList.add("oai-reveal");
      io.observe(el);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
