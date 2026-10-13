# Dictionary Expansion — Entry Format Spec

Source of truth: `src/data/signs.json` (ASL) and `src/data/bsl-signs.json` (BSL).
Validator: `scripts/validate-signs.py`. Every batch MUST pass it before merge.

## Entry shape (exact keys, no extras)

```json
{
  "slug": "thank-you",
  "word": "Thank you",
  "category": "greetings",
  "steps": [
    "Touch your chin with the fingertips of your flat hand, palm facing you.",
    "Move your hand forward and slightly down, ending with your palm angled upward."
  ],
  "tip": "Starts at the chin or mouth — as if sending gratitude forward.",
  "related": ["please", "sorry"]
}
```

## Field rules

| Field      | Rule |
|------------|------|
| `slug`     | lowercase letters/digits/hyphens only (`^[a-z0-9]+(-[a-z0-9]+)*$`), unique across the whole dictionary |
| `word`     | Title Case display form, e.g. `"Thank you"`, `"Good morning"`. Its **normalized** form (lowercase, punctuation stripped, whitespace collapsed — see `normalizePhrase` in `src/lib/signMatcher.ts`) must be unique; the translator matches user input against this normalized form with greedy longest-phrase-first matching |
| `category` | One of the 10 slugs in `src/data/categories.json`: `greetings`, `basics`, `family`, `food`, `feelings`, `time`, `questions`, `health`, `everyday`, `phrases`. Bucket → category map: classroom→`everyday`, animals→`everyday`, colors→`everyday`, nature→`everyday`, verbs→`basics`, emotions→`feelings`. Multi-word everyday phrases→`phrases` |
| `steps`    | 1–6 strings, imperative voice, each ≥ 24 chars. Order: **handshape → hand location → movement → palm orientation → facial/body grammar note**. Concrete and physical ("Make a fist with your dominant hand", "palm facing out", "move in a small clockwise circle"). Never vague ("move your hand nicely") |
| `tip`      | One memorable line — a mnemonic, common-mistake warning, or usage note. E.g. "A flat hand circling the heart." |
| `related`  | 1–4 slugs of genuinely related signs. Every slug MUST exist (existing dictionary or same batch). No self-links |

## Tone reference (existing entries)

- "Touch your chin with the fingertips of your flat hand, palm facing you."
- "Place your flat dominant hand on your chest, palm down."
- "Cross both arms over your chest."
- "Clap your dominant open hand down onto your non-dominant open palm."

Short sentences, physical nouns (fist, flat hand, fingertips, palm, chest, chin,
forehead), explicit palm orientation and movement direction. 10–25 words per step.

## Research & honesty rules (non-negotiable)

1. **ASL primary source: Lifeprint / ASL University (lifeprint.com, asl.ms).**
   Cross-check uncertain signs against university or public-health ASL materials.
2. **BSL primary source: BSL SignBank (UCL).** Backup: BDA-adjacent teaching materials.
3. **Rewrite everything in original words.** Never copy a source sentence verbatim.
4. **NEVER guess a sign.** If reputable sources disagree, or you cannot verify a
   sign from at least one reputable source, do NOT write an entry — put the word
   on the NEEDS-REVIEW list with the reason, and skip it.
5. ASL and BSL are distinct languages. Never relabel an ASL description as BSL or
   vice versa. A BSL entry must come from BSL sources.
6. Regional variation: if a sign varies significantly by region and sources
   conflict, prefer the most widely taught variant and note the variation in the
   tip — or NEEDS-REVIEW it if the conflict cannot be resolved.
7. No AI-generated hand imagery is used anywhere; entries are text steps only.
