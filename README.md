# Ahmed Guebsi — Portfolio

Personal portfolio website of **Ahmed Guebsi**, AI Engineer specializing in agentic LLM systems, production RAG pipelines, and observable Python backends.

**Live →** [ahmedguebsi.github.io](https://ahmedguebsi.github.io)

---

## Features

- **Neural-network canvas animation** — custom Canvas 2D hero background with animated nodes, connection edges, and traveling signal pulses; mouse repulsion, retina (2× DPR) support, tab-visibility pause, and `prefers-reduced-motion` fallback
- **Tabbed Experience section** — Bootstrap 5 native tabs (no extra JS), vertical rail on desktop / horizontal scroll on mobile
- **Bento Skills grid** — hero card (2/3 wide) + themed accent cards + full-width language strip
- **SVG favicon** — crisp "AG" monogram at any size, navy-to-purple gradient
- **Single Bootstrap 5.3 load** — no Bootstrap 4, no jQuery; all interactions use BS5 native APIs
- **AOS scroll animations** — `fade-up` entrances, `once: true`, reduced-motion safe
- **Formspree contact form** — no back-end required
- **Full Open Graph + Twitter Card** meta tags
- **Responsive** — mobile-first, tested at 375 px → 1440 px

---

## Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 (semantic: `<main>`, `<section>`, `<article>`, `<nav aria-label>`) |
| Styles | CSS3 custom properties, Bootstrap 5.3.0, Bootstrap Icons 1.10 |
| Fonts | Inter (UI), JetBrains Mono (accents) via Google Fonts |
| Animation | Custom Canvas 2D neural-network (zero dependencies) |
| Scroll FX | AOS (Animate On Scroll) |
| Form | Formspree |
| Hosting | GitHub Pages |

---

## Project Structure

```
ahmedguebsi.github.io/
├── index.html          # Single-page application — all 7 sections
├── css/
│   └── style.css       # All styles; CSS custom properties in :root
├── js/
│   ├── app.js          # Neural-network canvas animation
│   └── script.js       # Navbar scroll state, back-to-top, mobile nav close
└── images/
    ├── favicon.svg         # SVG monogram favicon (AG, navy → purple gradient)
    ├── graduationahmed.jpg # Hero avatar + Open Graph image
    ├── ahmedimage.jpg      # About section avatar
    ├── Agent.png           # Portfolio card — Agentic AI Platform
    ├── metricss.png        # Portfolio card — EEG ADHD Detection
    └── transformer.png     # Portfolio card — BERT NLP Chatbot
```

---

## Sections

| # | Section | ID |
|---|---|---|
| 1 | Hero — full-viewport canvas animation, avatar, CTA | `#home` |
| 2 | About — bio, stat tiles, profile photo | `#INTRO` |
| 3 | Skills & Stack — bento grid (LLM / RAG / Backend / MLOps / XAI) | `#skills` |
| 4 | Experience — BS5 tabbed layout (Avaxia · RegimLab · Datasphera · Innovup) | `#timeline` |
| 5 | Selected Work — 3 portfolio cards with detail modals | `#portfolio` |
| 6 | Education & Certifications — degree timeline + cert panel | `#education` |
| 7 | Contact — details list + Formspree form | `#contact` |

---

## Local Development

No build tool required — open directly in a browser or serve with any static server.

```bash
# Option 1 — Python
python -m http.server 8000

# Option 2 — Node
npx serve .

# Option 3 — VS Code
# Install "Live Server" extension, right-click index.html → Open with Live Server
```

Then visit `http://localhost:8000`.

---

## Customization

**Colors** — all design tokens live in `:root` at the top of `css/style.css`:

```css
:root {
  --color-accent:    #05195f;  /* primary navy */
  --color-highlight: #6f34fe;  /* purple accent */
  --color-ink:       #11141b;  /* body text */
  /* … */
}
```

**Canvas animation** — tweak constants at the top of `js/app.js`:

```js
const N             = 72;    // node count
const LINK_DIST     = 148;   // max edge length (px)
const PULSE_INTERVAL = 680;  // ms between signal pulses
```

**Contact form** — replace the Formspree endpoint in `index.html`:

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

---

## Performance Notes

- Images served as JPEG/PNG — convert to WebP for production if needed
- Canvas animation pauses on hidden tabs (`visibilitychange`) to save CPU
- AOS uses `once: true` so elements animate only on first reveal
- Google Fonts loaded with `display=swap` to avoid FOIT

---

## License

MIT — free to use as a starting point for your own portfolio.  
If you do, a link back would be appreciated but is not required.

---

*Built with focus on honest copy, observable systems, and zero fake metrics.*
