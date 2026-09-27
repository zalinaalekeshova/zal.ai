# zal.ai

Personal portfolio site for AI video clips and poster works.

## Structure

```
zal-ai/
├── index.html          # Single-page layout
├── css/
│   └── styles.css      # Design tokens, layout, components, responsive
├── js/
│   └── main.js         # Hero crossfade, scramble tagline, scroll-reveal, cursor glow
└── assets/             # Drop your images and videos here
```

## Placeholder slots

| Slot | Type | Location in HTML |
|------|------|-----------------|
| AI Video 1 | Full-width | Row 1 |
| Poster 1 | Left half | Row 2 |
| Poster 2 | Right half | Row 2 |
| AI Video 2 | Left half | Row 3 |
| Poster 3 | Right half | Row 3 |
| Poster 4 | Left half | Row 4 |
| Poster 5 | Right half | Row 4 |
| AI Video 3 | Full-width | Row 5 |

## Replacing placeholders

Each `.grid-item` holds a `.placeholder` div. To swap in real media:

**Image poster:**
```html
<div class="placeholder">
  <img src="assets/poster-1.jpg" alt="Poster title" />
</div>
```

**Video clip:**
```html
<div class="placeholder">
  <video src="assets/clip-1.mp4" autoplay muted loop playsinline></video>
</div>
```

Add `object-fit: cover; width: 100%; height: 100%;` to the media element — the CSS already handles the container.

## Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "init: zal.ai portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/zal-ai.git
git push -u origin main
```

Then enable GitHub Pages from **Settings → Pages → Deploy from branch → main / (root)**.
