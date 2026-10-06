# SignLanguage-Translator.com — Phase 2 Report: ASL/BSL Toggle

**Date:** 2026-10-01
**Scope:** Add British Sign Language (BSL) support to the existing site via an ASL/BSL toggle (Firoz's choice: same site, not a separate BSL website).

## What was delivered

### BSL dictionary (47 signs)
- Independently researched from BSL-specific sources (UCL BSL SignBank, signbsl.com, british-sign.co.uk, brightbsl.co.uk, commandinghands.co.uk, RNID/BDA-adjacent teaching materials, Oxford VGG fingerspelling paper) — never relabelled ASL signs.
- 10 ASL-list words honestly omitted (doctor, don't-understand, excuse-me, finished, go, good-morning, good-night, happy-birthday, phone, understand) — not guessed from video-only or conflicting sources. Documented in `docs/BSL-RESEARCH.md`.
- In BSL mode, missing words fall back to BSL fingerspelling with an honest "not yet researched" note — never substituted with an ASL sign.
- 47 static pages at `/bsl-signs/<slug>/` with DefinedTerm + Breadcrumb JSON-LD, cross-links to the ASL equivalent, and BSL-source attribution notes.

### BSL alphabet (two-handed A–Z) + numbers 1–5
- 26 two-handed BSL alphabet SVGs from Wikimedia Commons (CC BY-SA 3.0, artist Coloringbuddymike) — attribution displayed on the alphabet page.
- BSL vowels mapped on the base hand (A thumb … U little finger); H and J flagged as small-movement letters.
- BSL numbers 1–5 covered with an honest note that 0 and 6–10 vary regionally and are not yet covered.

### Translator with ASL/BSL toggle
- Accessible segmented toggle (ARIA `role="group"`, `aria-pressed`), persists choice in localStorage, re-translates on language switch.
- Language-aware matching: longest-phrase-first against the active language's dictionary, then fingerspelling fallback.
- BSL fingerspelling uses the two-handed BSL alphabet images; BSL digits fall back to honest text tiles (no ASL number images in BSL mode).
- Motion-letter notes: ASL J/Z, BSL H/J.
- Speech input/TTS uses `en-US` in ASL mode and `en-GB` in BSL mode.

### Dictionary page
- ASL/BSL tabs (ARIA tab pattern, both server-rendered for SEO): 57 ASL / 47 BSL signs.

### Copy updates
- Homepage: "Translate Text into ASL & BSL"; new "What is the difference between ASL and BSL?" FAQ; old "Everything on this site is ASL" claim corrected.
- About: ASL + BSL coverage, separate-language framing, BSL source methodology, attribution.
- `public/llms.txt` updated; sitemap includes all 47 BSL pages.

## Verification
- TypeScript strict: clean. Astro build: clean — **112 pages** (65 → 112, +47 BSL sign pages).
- 17/17 translator logic tests pass (ASL regression, BSL phrase matching, BSL missing-word fingerspell fallback, image path separation, motion letters, counts).
- Live checks on preview deployment: homepage, dictionary, BSL sign page, ASL sign page (honest note), alphabet page, BSL SVG serving (image/svg+xml) — all 200.
- `signlanguage-translator.pages.dev` → `signlanguage-translator.com` 301 redirect still intact (path-preserving); preview URLs unaffected.

## Commits & deploys
- GitHub `childygyan/signlanguage-translator` @ `main`: `fa6be21918950e38539a55213df0ab6e59036ce4` ("Add ASL/BSL toggle: 47 BSL signs, /bsl-signs/ pages, BSL alphabet section, language-aware translator")
- Cloudflare Pages deploy: `https://242c0a53.signlanguage-translator.pages.dev` (production hostname redirects to main domain)

## Drive deliverables
- `signlanguage-translator-phase2-bsl-dist.zip` (this deploy's dist, ~1MB)
- This report
