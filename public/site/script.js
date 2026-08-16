/* ===== Open AI IT TCET — Interactive Script ===== */

(function () {
  'use strict';

  // ——— DOM READY ———
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initScrollAnimations();
    initHeader();
    initMobileMenu();
    initNeuralCanvas();
    initCounters();
  }

  // ——————————————————————————————————
  //  SCROLL-TRIGGERED FADE-UP
  // ——————————————————————————————————
  function initScrollAnimations() {
    const els = document.querySelectorAll('.fade-up');
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach((el) => observer.observe(el));
  }

  // ——————————————————————————————————
  //  HEADER SCROLL BEHAVIOR
  // ——————————————————————————————————
  function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.classList.toggle('scrolled', window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ——————————————————————————————————
  //  MOBILE MENU
  // ——————————————————————————————————
  function initMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const close = document.getElementById('menu-close');
    const menu = document.getElementById('mobile-menu');
    if (!toggle || !close || !menu) return;

    toggle.addEventListener('click', () => {
      menu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    close.addEventListener('click', closeMenu);

    menu.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    function closeMenu() {
      menu.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // ——————————————————————————————————
  //  INTERACTIVE NEURAL NETWORK CANVAS
  // ——————————————————————————————————
  function initNeuralCanvas() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let w, h, dpr;
    let mouse = { x: -1000, y: -1000 };
    let layers = [];       // structured neuron positions
    let connections = [];   // connection objects with signal state
    let signals = [];       // travelling signal pulses
    let hoveredNode = null;
    let activeNodes = new Set();
    let activeConnections = new Set();
    const MOUSE_RADIUS = 160;

    function updateActivePaths() {
      activeNodes.clear();
      activeConnections.clear();
      if (!hoveredNode) return;
      
      activeNodes.add(hoveredNode);
      
      // Forward pass - pick highest weight connection
      let curr = hoveredNode;
      while (true) {
        let out = connections.filter(c => c.from === curr);
        if (out.length === 0) break;
        out.sort((a, b) => b.weight - a.weight);
        let best = out[0];
        activeConnections.add(best);
        activeNodes.add(best.to);
        curr = best.to;
      }
      
      // Backward pass - pick highest weight connection
      curr = hoveredNode;
      while (true) {
        let inc = connections.filter(c => c.to === curr);
        if (inc.length === 0) break;
        inc.sort((a, b) => b.weight - a.weight);
        let best = inc[0];
        activeConnections.add(best);
        activeNodes.add(best.from);
        curr = best.from;
      }
    }

    // Layer config: [inputNeurons, hidden1, hidden2, hidden3, output]
    const LAYER_SIZES = [4, 6, 8, 6, 3];
    const NEURON_R = 5;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNetwork();
    }

    function buildNetwork() {
      layers = [];
      connections = [];

      const padX = w * 0.1;
      const padY = h * 0.12;
      const usableW = w - padX * 2;
      const usableH = h - padY * 2;
      const layerCount = LAYER_SIZES.length;

      // Build neuron positions for each layer
      for (let l = 0; l < layerCount; l++) {
        const neurons = [];
        const count = LAYER_SIZES[l];
        const x = padX + (usableW / (layerCount - 1)) * l;
        for (let n = 0; n < count; n++) {
          const y = padY + (usableH / (count + 1)) * (n + 1);
          neurons.push({
            x, y,
            baseR: NEURON_R,
            activation: 0.3 + Math.random() * 0.4,
            phase: Math.random() * Math.PI * 2,
            layer: l,
            hoverLerp: 0,
          });
        }
        layers.push(neurons);
      }

      // Build connections between adjacent layers
      for (let l = 0; l < layerCount - 1; l++) {
        for (const from of layers[l]) {
          for (const to of layers[l + 1]) {
            connections.push({
              from, to,
              weight: 0.3 + Math.random() * 0.7,
              hoverLerp: 0,
            });
          }
        }
      }
    }

    function spawnSignal(fromNode = null) {
      if (connections.length === 0) return;
      let conn;
      if (fromNode) {
        const fromConns = connections.filter(c => c.from === fromNode);
        if (fromConns.length > 0) {
          conn = fromConns[Math.floor(Math.random() * fromConns.length)];
        }
      }
      if (!conn) {
        conn = connections[Math.floor(Math.random() * connections.length)];
      }
      signals.push({
        from: conn.from,
        to: conn.to,
        progress: 0,
        speed: 0.008 + Math.random() * 0.012,
        color: Math.random() > 0.5
          ? [147, 51, 234]     // purple-600
          : [168, 85, 247],    // purple-500
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const time = performance.now() * 0.001;

      function lerpColor(c1, c2, t) {
        return [
          Math.round(c1[0] + (c2[0] - c1[0]) * t),
          Math.round(c1[1] + (c2[1] - c1[1]) * t),
          Math.round(c1[2] + (c2[2] - c1[2]) * t)
        ];
      }

      // ——— Draw connections ———
      for (const conn of connections) {
        const { from, to, weight } = conn;
        const isActive = activeConnections.has(conn);
        conn.hoverLerp += ((isActive ? 1 : 0) - conn.hoverLerp) * 0.15;
        const hL = conn.hoverLerp;

        let alpha = (weight * 0.12) * (1 - hL) + 0.6 * hL;

        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        const md = Math.hypot(midX - mouse.x, midY - mouse.y);
        if (md < MOUSE_RADIUS && !isActive) {
          alpha += (1 - md / MOUSE_RADIUS) * 0.35;
        }

        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        const c = lerpColor([9, 9, 11], [168, 85, 247], hL);
        ctx.strokeStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${alpha})`;
        ctx.lineWidth = (0.6 + weight * 0.4) * (1 - hL) + 1.5 * hL;
        ctx.stroke();
      }

      // ——— Draw signals ———
      for (let i = signals.length - 1; i >= 0; i--) {
        const s = signals[i];
        s.progress += s.speed;
        if (s.progress >= 1) {
          s.to.activation = Math.min(1, s.to.activation + 0.3);
          signals.splice(i, 1);
          continue;
        }

        const x = s.from.x + (s.to.x - s.from.x) * s.progress;
        const y = s.from.y + (s.to.y - s.from.y) * s.progress;
        const r = 3;

        // Glow
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
        grad.addColorStop(0, `rgba(${s.color.join(',')}, 0.5)`);
        grad.addColorStop(1, `rgba(${s.color.join(',')}, 0)`);
        ctx.beginPath();
        ctx.arc(x, y, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color.join(',')}, 0.9)`;
        ctx.fill();
      }

      // ——— Draw neurons ———
      for (const layer of layers) {
        for (const n of layer) {
          const isActive = activeNodes.has(n);
          n.hoverLerp += ((isActive ? 1 : 0) - n.hoverLerp) * 0.15;
          const hL = n.hoverLerp;
          const pulse = 1 + Math.sin(time * 2 + n.phase) * 0.15;

          const md = Math.hypot(n.x - mouse.x, n.y - mouse.y);
          const mouseBoost = md < MOUSE_RADIUS ? (1 - md / MOUSE_RADIUS) : 0;

          n.activation = Math.max(0.3, n.activation - 0.003);

          const r = n.baseR * pulse * (1 + mouseBoost * 0.4 + 0.2 * hL);
          const brightness = n.activation * 0.7 + mouseBoost * 0.3;

          const gC = lerpColor([9, 9, 11], [168, 85, 247], hL);
          const glowAlpha = (brightness * 0.18) * (1 - hL) + (0.4 + brightness * 0.3) * hL;

          // Outer glow
          const glow = ctx.createRadialGradient(n.x, n.y, r * 0.5, n.x, n.y, r * 2.8);
          glow.addColorStop(0, `rgba(${gC[0]}, ${gC[1]}, ${gC[2]}, ${glowAlpha})`);
          glow.addColorStop(1, `rgba(${gC[0]}, ${gC[1]}, ${gC[2]}, 0)`);
          ctx.beginPath();
          ctx.arc(n.x, n.y, r * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();

          // Neuron body
          const bC0 = lerpColor([63, 63, 70], [168, 85, 247], hL);
          const bC0_a = (0.6 + brightness * 0.4) * (1 - hL) + (0.8 + brightness * 0.2) * hL;
          const bC1 = lerpColor([39, 39, 42], [147, 51, 234], hL);
          const bC1_a = (0.5 + brightness * 0.5) * (1 - hL) + (0.7 + brightness * 0.3) * hL;
          const bC2 = lerpColor([9, 9, 11], [107, 33, 168], hL);
          const bC2_a = (0.6 + brightness * 0.4) * (1 - hL) + (0.8 + brightness * 0.2) * hL;

          const bodyGrad = ctx.createRadialGradient(
            n.x - r * 0.3, n.y - r * 0.3, 0,
            n.x, n.y, r
          );
          bodyGrad.addColorStop(0, `rgba(${bC0[0]}, ${bC0[1]}, ${bC0[2]}, ${bC0_a})`);
          bodyGrad.addColorStop(0.6, `rgba(${bC1[0]}, ${bC1[1]}, ${bC1[2]}, ${bC1_a})`);
          bodyGrad.addColorStop(1, `rgba(${bC2[0]}, ${bC2[1]}, ${bC2[2]}, ${bC2_a})`);

          ctx.beginPath();
          ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          ctx.fillStyle = bodyGrad;
          ctx.fill();

          // Border ring
          const sC = lerpColor([9, 9, 11], [216, 180, 254], hL);
          const sC_a = (0.2 + brightness * 0.3) * (1 - hL) + (0.5 + brightness * 0.5) * hL;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 0.5, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${sC[0]}, ${sC[1]}, ${sC[2]}, ${sC_a})`;
          ctx.lineWidth = 1 * (1 - hL) + 1.5 * hL;
          ctx.stroke();

          // Center highlight
          const hl_a = (0.3 + brightness * 0.4) * (1 - hL) + (0.6 + brightness * 0.4) * hL;
          ctx.beginPath();
          ctx.arc(n.x - r * 0.2, n.y - r * 0.2, r * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${hl_a})`;
          ctx.fill();
        }
      }

      // Spawn new signals periodically
      if (Math.random() < 0.06) spawnSignal();

      requestAnimationFrame(draw);
    }

    function updateHover() {
      let found = null;
      for (const layer of layers) {
        for (const n of layer) {
          if (Math.hypot(n.x - mouse.x, n.y - mouse.y) < n.baseR * 3) {
            found = n;
            break;
          }
        }
        if (found) break;
      }
      if (hoveredNode !== found) {
        hoveredNode = found;
        updateActivePaths();
        if (hoveredNode) {
          canvas.style.cursor = 'pointer';
        } else {
          canvas.style.cursor = 'crosshair'; // default canvas cursor
        }
      }
    }

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      updateHover();
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
      hoveredNode = null;
      updateActivePaths();
    });

    canvas.addEventListener('touchmove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouse.x = touch.clientX - rect.left;
      mouse.y = touch.clientY - rect.top;
      updateHover();
    }, { passive: true });

    canvas.addEventListener('touchend', () => {
      mouse.x = -1000;
      mouse.y = -1000;
      hoveredNode = null;
      updateActivePaths();
    });

    // Click to fire burst of signals
    canvas.addEventListener('click', () => {
      if (hoveredNode) {
        // Fire signals starting from this node
        for (let i = 0; i < 4; i++) spawnSignal(hoveredNode);
        // Maybe also fire a few from input layer for effect
        for (let i = 0; i < 2; i++) spawnSignal();
      } else {
        for (let i = 0; i < 8; i++) spawnSignal();
      }
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
      }, 150);
    });

    resize();
    // Seed initial signals
    for (let i = 0; i < 12; i++) spawnSignal();
    draw();
  }

  // ——————————————————————————————————
  //  ANIMATED COUNTERS
  // ——————————————————————————————————
  function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((el) => observer.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;

    const duration = 1800;
    const start = performance.now();

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = easeOutQuart(progress);
      el.textContent = Math.round(eased * target);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  // ——————————————————————————————————
  //  SMOOTH SCROLL FOR ANCHOR LINKS
  // ——————————————————————————————————
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute('href');
    if (id === '#') return;

    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // ——————————————————————————————————
  //  HERO TYPEWRITER (runs once per load)
  // ——————————————————————————————————
  (function heroTypewriter() {
    const el = document.querySelector('.hero-title-accent');
    if (!el || el.dataset.typed === 'done') return;

    const full = (el.textContent || '').trim();
    if (!full) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.dataset.typed = 'done';

    if (reduce) return;

    // Reserve the final width so nothing reflows while typing.
    el.style.display = 'inline-block';
    el.style.minWidth = el.getBoundingClientRect().width + 'px';
    el.textContent = '';

    let i = 0;
    const start = () => {
      const step = () => {
        el.textContent = full.slice(0, ++i);
        if (i < full.length) setTimeout(step, 95);
        else el.style.minWidth = '';
      };
      step();
    };
    setTimeout(start, 550);
  })();
})();
