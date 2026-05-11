(function () {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  // Cap at 2× so 3× screens don't overdraw at triple resolution
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- config ----
  const N             = 72;     // node count
  const LINK_DIST     = 148;    // max edge length in logical px
  const BASE_SPEED    = 0.45;   // logical px per frame at 60 fps
  const PULSE_INTERVAL = 680;   // ms between new signal pulses
  const PULSE_SPEED    = 0.0024; // t-units per ms (full edge traversal ~420ms)
  const MOUSE_RADIUS   = 130;   // px — repulsion zone

  // Palette: matches navy-to-purple brand gradient
  const NODE_FILLS = [
    'rgba(111,52,254,0.82)',   // brand purple
    'rgba(8,145,178,0.70)',    // teal accent
    'rgba(255,255,255,0.52)',  // white dot
  ];
  const EDGE_RGB    = '111,52,254';
  const PULSE_CORE  = 'rgba(180,140,255,1)';
  const PULSE_EDGE  = 'rgba(111,52,254,0)';

  let W, H, nodes, pulses, raf, lastPulse = 0;
  let mouse = { x: -9999, y: -9999 };

  // ---- setup ----

  function resize() {
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width  = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function mkNode() {
    const angle = Math.random() * Math.PI * 2;
    const speed = BASE_SPEED * (0.5 + Math.random() * 0.9);
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 1.6 + Math.random() * 2.0,
      fill: NODE_FILLS[Math.floor(Math.random() * NODE_FILLS.length)],
    };
  }

  function init() {
    resize();
    nodes  = Array.from({ length: N }, mkNode);
    pulses = [];
    lastPulse = 0;
  }

  // ---- per-frame updates ----

  function stepNodes() {
    for (const n of nodes) {
      // Repel from mouse cursor
      const mdx = n.x - mouse.x, mdy = n.y - mouse.y;
      const md2 = mdx * mdx + mdy * mdy;
      if (md2 < MOUSE_RADIUS * MOUSE_RADIUS) {
        const f = 1.4 / (Math.sqrt(md2) + 1);
        n.vx += mdx * f * 0.011;
        n.vy += mdy * f * 0.011;
      }

      // Cap speed so repulsion can't make nodes fly off screen
      const spd = Math.hypot(n.vx, n.vy);
      if (spd > BASE_SPEED * 2.2) {
        n.vx = (n.vx / spd) * BASE_SPEED * 2.2;
        n.vy = (n.vy / spd) * BASE_SPEED * 2.2;
      }

      n.x += n.vx;
      n.y += n.vy;

      // Bounce off edges
      if (n.x < 0)  { n.x = 0;  n.vx =  Math.abs(n.vx); }
      if (n.x > W)  { n.x = W;  n.vx = -Math.abs(n.vx); }
      if (n.y < 0)  { n.y = 0;  n.vy =  Math.abs(n.vy); }
      if (n.y > H)  { n.y = H;  n.vy = -Math.abs(n.vy); }
    }
  }

  function trySpawnPulse(now) {
    if (now - lastPulse < PULSE_INTERVAL) return;
    // Try up to 30 random pairs until we find a connected edge
    for (let i = 0; i < 30; i++) {
      const ai = (Math.random() * N) | 0;
      const bi = (Math.random() * N) | 0;
      if (ai === bi) continue;
      const a = nodes[ai], b = nodes[bi];
      if (Math.hypot(b.x - a.x, b.y - a.y) < LINK_DIST) {
        pulses.push({ a, b, t: 0 });
        lastPulse = now;
        break;
      }
    }
  }

  function stepPulses(dt) {
    for (let i = pulses.length - 1; i >= 0; i--) {
      pulses[i].t += PULSE_SPEED * dt;
      if (pulses[i].t >= 1) pulses.splice(i, 1);
    }
  }

  // ---- draw ----

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Edges — opacity fades with distance
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const d  = dx * dx + dy * dy;
        if (d < LINK_DIST * LINK_DIST) {
          const alpha = (1 - Math.sqrt(d) / LINK_DIST) * 0.30;
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(' + EDGE_RGB + ',' + alpha + ')';
          ctx.lineWidth = 0.7;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Signal pulses — glowing dot traveling along an edge
    for (const p of pulses) {
      const px = p.a.x + (p.b.x - p.a.x) * p.t;
      const py = p.a.y + (p.b.y - p.a.y) * p.t;
      const g  = ctx.createRadialGradient(px, py, 0, px, py, 8);
      g.addColorStop(0, PULSE_CORE);
      g.addColorStop(1, PULSE_EDGE);
      ctx.beginPath();
      ctx.fillStyle = g;
      ctx.arc(px, py, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Nodes
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.fill;
      ctx.fill();
    }
  }

  // ---- loop ----

  let prevTs = 0;

  function loop(ts) {
    const dt = Math.min(ts - prevTs, 50); // clamp to 50ms so a hidden-tab wake-up doesn't jump
    prevTs = ts;
    stepNodes();
    trySpawnPulse(ts);
    stepPulses(dt);
    draw();
    raf = requestAnimationFrame(loop);
  }

  function start() {
    if (!raf) {
      prevTs = performance.now();
      raf = requestAnimationFrame(loop);
    }
  }

  function stop() {
    if (raf) {
      cancelAnimationFrame(raf);
      raf = null;
    }
  }

  // ---- bootstrap ----

  init();

  if (REDUCED) {
    draw(); // static snapshot, no animation
    return;
  }

  start();

  // Pause when tab is not visible — saves CPU/battery
  document.addEventListener('visibilitychange', function () {
    document.hidden ? stop() : start();
  });

  // Re-fit canvas on window resize
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      stop();
      init();
      start();
    }, 150);
  }, { passive: true });

  // Mouse repulsion
  canvas.addEventListener('mousemove', function (e) {
    var r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  }, { passive: true });

  canvas.addEventListener('mouseleave', function () {
    mouse.x = -9999;
    mouse.y = -9999;
  }, { passive: true });
})();
