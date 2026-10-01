# BSL Research Report — British Sign Language dictionary data

Date: 2026-10-01
Scope: BSL word-level signs (47 verified of 57 target words), BSL two-handed manual alphabet (A–Z), BSL number signs (1–5 verified).

Standing rule applied throughout: these descriptions are a **learning aid, not a substitute for qualified BSL instruction**. Every description below was researched from BSL-specific sources and rewritten in original words. Nothing was invented from intuition, and nothing was copied from the ASL dataset (the two languages share almost no signs).

## Data files produced

- `src/data/bsl-signs.json` — 47 entries, schema identical to `signs.json` (`slug`, `word`, `category`, `steps`, `tip`, `related`).
  - `related[]` was copied from the ASL dataset's link structure but **filtered to slugs present in the BSL set**, so no related link points to a missing BSL page.
- `src/data/bsl-alphabet.json` — 26 letters, `{"letter","handshape","motion":false}`. BSL fingerspelling is two-handed ("pen and paper": non-dominant hand is the base, dominant hand forms/points letters on it).
- `src/data/bsl-numbers.json` — digits 1–5 only (see omissions).

## Sources consulted

- **british-sign.co.uk** — BSL dictionary with per-sign "how to sign it" text descriptions + free beginners course (most useful single source; ~30 words).
- **brightbsl.co.uk** — BSL course site with per-sign form descriptions.
- **signbsl.com** — University of Bristol / Deaf Studies Trust video dictionary (used for corroboration and regional-variant evidence; video-only, so no prose transcription).
- **BSL SignBank (bslsignbank.ucl.ac.uk)** — UCL DCAL research corpus (used for regional-variant documentation, e.g. STOP variants, NIGHT2).
- **commandinghands.co.uk** — BSL dictionary (corroboration).
- **accessbsl.com** — BSL handshape guides.
- **Lingomagazine BSL article, Twinkl BSL basics guide** — independent corroboration for greetings.
- **BSL For Dummies (City Lit/Wiley)** — used cautiously for NO only; its mirrors contain ASL contamination on other entries.
- **SignStation (University of Bristol / Deaf Studies Trust)** — for "I love you".
- **Oxford VGG BSL fingerspelling paper (Chan/Kwon/Zisserman), BANZSL alphabet notes, BDA fingerspelling chart, UK college BSL teaching deck** — for the two-handed alphabet.
- **howtosayguide.com — EXCLUDED entirely.** It publishes internally contradictory variants for the same word (six different "good morning" handshapes across its own pages) and mixes ASL content. Any word whose only text source was this site was marked unverifiable.

## Words covered (47)

Greetings: hello, goodbye, thank-you, please, sorry.
Basics: yes, no, help, stop, come, want, need, like, know, dont-know.
Family: mother, father, baby, friend, boy, girl.
Food: eat, drink, water, hungry, thirsty, more.
Feelings: happy, sad, angry, tired, sick, pain, scared, love.
Time: morning, night, now, time.
Questions: what.
Health: hospital.
Everyday: bathroom, car, house, school.
Phrases: i-love-you, what-is-your-name.

## Words omitted as unverifiable (10) — with reasons

- **good-morning / good-night** — the only text source (howtosayguide.com) is unreliable (see above); dictionary entries exist on video only.
- **excuse-me** — text results described the ASL EXCUSE sign (rejected); no reliable written BSL description found.
- **go** — only unreliable text source + video-only dictionaries + documented regional variants; cannot verify a standard form.
- **understand / dont-understand** — confirmed to exist in BSL (GCSE vocabulary), but every accessible BSL source shows it on video only; no textual handshape description found.
- **finished** — signbsl.com has videos only; written descriptions found were ASL-labelled or from unreliable content farms.
- **doctor** — sources conflict irreconcilably (D-handshape on forehead vs wrist-tap vs V-handshape); no authoritative written BSL description.
- **phone** — academic papers describe only the handshape; step-by-step guides found were ASL, not BSL.
- **happy-birthday** — HAPPY is documented, but written BSL descriptions of BIRTHDAY conflict irreconcilably (clockwise circles vs chin-to-chest vs "writing 7 on a cake").

These 10 need a BSL tutor or video review before the site can describe them honestly. They are NOT included in `bsl-signs.json`.

## Numbers omitted (0, 6–10) — with reason

BSL numerals show documented regional variation (BSL Corpus / Stamp et al. 2013: variants correlate with region, age and residential school; Manchester has its own number system; even the two-handed children's variant ships in two versions). No consulted source gave a BSL-specific prose description of the adult one-handed forms for 0 and 6–10, so they were omitted rather than guessed. Digits 1–5 are the widely taught adult one-handed forms.

## Regional-variation notes

- BSL has genuine regional dialects. Where variants exist, entries use the most widely taught form and note alternatives in the data (`stop`, `school`, `night`, `mother`, `father`).
- **please / thank-you** share one manual sign in BSL; the mouth pattern carries the meaning — this is explicitly taught in BSL courses.
- **water / thirsty** share one form; context disambiguates.
- **scared / afraid** are the same sign; **girl** covers woman/lady/female; **need** shares its sign with **want**; **eat** covers food/meal; **house** covers home; **bathroom** uses the TOILET sign (no separate BSL sign).
- **dont-know** demonstrates BSL negation grammar: the headshake happens *during* the sign, not after it.
- **pain** shares its manual form with "wow/amazing" per BSL SignBank research — the grimaced facial expression is what marks it as pain. Facial expression is load-bearing across the feelings signs.

## Honesty flag: H and J in the BSL alphabet

Three consulted BSL sources (UK teaching deck, Oxford VGG paper, lead-academy) agree that **H and J are taught with a small movement** — H slides the dominant fingers down off the base palm; J traces from the base middle-finger tip down toward the wrist and up to the thumb. The schema requires `"motion": false` for all letters, so the movement is described inside each letter's `handshape` text and flagged here. Unlike ASL, BSL has no fingerspelled letters that are *defined* by large motions like ASL's J/Z.

## BSL alphabet mechanics (for the parent agent's page copy)

- Vowels are the systematic core: the dominant index finger points to successive fingertips of the base hand starting at the thumb — **A=thumb, E=index, I=middle, O=ring, U=little** — confirmed identically by every source.
- **C is the only letter formed with a single hand** (dominant hand alone makes the C shape).
- Easily confused sets are distinguished purely by which fingers touch where: L/T by finger angle, M/N/V by finger count and spread, P/Q/D by which parts touch, W/X by all-fingers vs index-only.
