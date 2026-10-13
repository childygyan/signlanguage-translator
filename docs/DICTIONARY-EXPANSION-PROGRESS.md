# Dictionary Expansion Progress (1000+ mission)

- Target: ASL 57 → 1000+ entries. BSL 47 → as many as verifiable (stretch).
- Started: 2026-10-13
- Target list: `docs/DICTIONARY-EXPANSION-TARGETS.json` (1870 candidates, priority-ordered)
- Format spec: `docs/DICTIONARY-EXPANSION-FORMAT.md`
- Validator: `scripts/validate-signs.py`
- Skipped/unverifiable: `docs/DICTIONARY-EXPANSION-NEEDS-REVIEW.md`
- Deliberately fingerspelling-only (no sign attempted): single letters c,e,s,x,n,b,t,d,m,r,p,f,l,w,o,g,h,v,k,y,j,u,q,z (fingerspelling IS the correct behavior); web-noise/proper-noun tokens pm, jan, united, ebay, dvd, tv, faq, ok, hi.

## Batch log

| Batch | Lang | Words | Result | Commit | Live count |
|-------|------|-------|--------|--------|------------|
| 001 | asl | 48 (number→brown; story, letter skipped as NEEDS-REVIEW) | ✅ merged, validated, typecheck+build clean (169 pages), spot-check passed, deployed, live verified | db52a101 | ASL 105 / BSL 47 |
| 002 | asl | 45 (pink→day; mean, say, build, hope, hold skipped as NEEDS-REVIEW) | ✅ merged, validated, typecheck+build clean (214 pages), spot-check passed, deployed, live verified | see push | ASL 150 / BSL 47 |
| 001 | bsl | 17 (number→woman; history, class, college, test, study, word, answer, grade skipped as NEEDS-REVIEW) | ✅ merged, validated, typecheck+build clean (231 pages), deployed, live verified | see push | ASL 150 / BSL 64 |
| 003 | asl | 46 (after→hot; garden, lake, usually, park skipped as NEEDS-REVIEW) | ✅ merged, validated, typecheck+build clean (296 pages), spot-check passed ("The fall colors are beautiful" → SIGN:Fall), deployed, live verified | see push | ASL 196 / BSL 64 |
| 002 | bsl | 19 (son→brown; apple, restaurant, white, color skipped as NEEDS-REVIEW) | ✅ merged, validated, typecheck+build clean (296 pages), deployed, live verified | see push | ASL 196 / BSL 83 |
| 004 | asl | 33 (fire→next; earth, hill, free, information, up, news, contact, were, re, click, service, services, price, view, these, health, used skipped as NEEDS-REVIEW) | ✅ merged, validated, typecheck+build clean (339 pages), spot-check passed ("The fall colors are beautiful" → SIGN:Fall + SIGN:Beautiful), deployed, live verified | see push | ASL 229 / BSL 83 |
| 003 | bsl | 10 (pink→run; buy, sell, travel, use, get, find, make, open, call, say, pay, take, give, look skipped as NEEDS-REVIEW) | ✅ merged, validated, typecheck+build clean (339 pages), deployed, live verified | see push | ASL 229 / BSL 93 |
| 005 | asl | 13 (last→real; products, product, data, system, post, add, policy, available, message, software, video, well, rights, public, books, review, years, order, items, company, group, user, set, general, research, full, map, reviews, program, life, games, days, management, part, hotel, item, international skipped as NEEDS-REVIEW) | ✅ merged, validated, typecheck+build clean (357 pages), spot-check passed ("I am on my way to school" → SIGN:Way), deployed, live verified | see push | ASL 242 / BSL 93 |
| 004 | bsl | 5 (ask, choose, cut, day, year; 19 verbs skipped as NEEDS-REVIEW — video-only or directional) | ✅ merged, validated, typecheck+build clean (357 pages), deployed, live verified | see push | ASL 242 / BSL 98 |
| 006 | asl | 17 (sign→access; women, pages, found, technology, link, sports, county, security, index, file, case, project, version, section, related, members, while, network, systems, place, following, without, per, north, resources, posts, media, pictures, size, art, total, control skipped as NEEDS-REVIEW) | ✅ merged, validated, typecheck+build clean (394 pages), spot-check passed, deployed, live verified | see push | ASL 259 / BSL 98 |
| 005 | bsl | 20 (before→monday + 10 months; after, november, month, often, holiday skipped as NEEDS-REVIEW) | ✅ merged, validated, typecheck+build clean (394 pages), deployed, live verified | see push | ASL 259 / BSL 118 |
| 007 | asl | 12 (since→little; 34 skipped as NEEDS-REVIEW incl. plurals, fingerspell-only, ambiguous) | ✅ merged, validated, typecheck+build clean (422 pages), spot-check passed, deployed, live verified | see push | ASL 271 / BSL 118 |
| 006 | bsl | 16 (soon→wind; sometimes, hot, river, sea, tree, beautiful, cool, mountain, forest skipped as NEEDS-REVIEW) | ✅ merged, validated, typecheck+build clean (422 pages), deployed, live verified | see push | ASL 271 / BSL 134 |
| 008 | asl | 18 (save→gay; 30 skipped as NEEDS-REVIEW incl. plurals, fingerspell-only, ambiguous) | ✅ merged, validated, typecheck+build clean (448 pages), spot-check passed, deployed, live verified | see push | ASL 289 / BSL 134 |
| 007 | bsl | 8 (cold→two; 17 skipped as NEEDS-REVIEW — video-only or no written description) | ✅ merged, validated, typecheck+build clean (448 pages), deployed, live verified | see push | ASL 289 / BSL 142 |
| 009 | asl | 13 (live→street; 32 skipped as NEEDS-REVIEW incl. plurals, stubs, fingerspell-only) | ✅ merged, validated, typecheck+build clean (463 pages), spot-check passed, deployed, live verified | see push | ASL 302 / BSL 142 |
| 008 | bsl | 2 (good, best; 23 skipped as NEEDS-REVIEW) — FINAL BSL batch: text-source pool for abstract vocabulary exhausted | ✅ merged, validated, typecheck+build clean (463 pages), deployed, live verified | see push | ASL 302 / BSL 144 |
| 010 | asl | 21 (tax→password; 27 skipped as NEEDS-REVIEW incl. plurals, stubs, tech words) | ✅ merged, validated, typecheck+build clean (484 pages), spot-check passed, deployed, live verified | see push | ASL 323 / BSL 144 |
| 011 | asl | 15 (hard→interest; 24 skipped as NEEDS-REVIEW incl. plurals, stubs, video-only) | ✅ merged, validated, typecheck+build clean (499 pages), spot-check passed, deployed, live verified | see push | ASL 338 / BSL 144 |
| 012 | asl | 14 (keep→agreement; 32 skipped as NEEDS-REVIEW incl. duplicates of existing signs, stubs, video-only) | ✅ merged, validated, typecheck+build clean (513 pages), spot-check passed, deployed, live verified | see push | ASL 352 / BSL 144 |
| 013 | asl | 7 (sure→past; 39 skipped as NEEDS-REVIEW — 85% skip rate, abstract tail thinning) | ✅ merged, validated, typecheck+build clean (520 pages), spot-check passed, deployed, live verified | see push | ASL 359 / BSL 144 |
| 014 | asl | 24 (average→subscribe; 64 skipped as NEEDS-REVIEW) | ✅ merged, validated, typecheck+build clean (544 pages), spot-check passed, deployed, live verified | see push | ASL 383 / BSL 144 |
| 015 | asl | 25 (various→base; 64 skipped as NEEDS-REVIEW) | ✅ merged, validated, typecheck+build clean (569 pages), spot-check passed, deployed, live verified | see push | ASL 408 / BSL 144 |
| 016 | asl | 21 (near→certain; 68 skipped as NEEDS-REVIEW) | ✅ merged, validated, typecheck+build clean (590 pages), spot-check passed, deployed, live verified | see push | ASL 429 / BSL 144 |

> **BSL stretch goal — PAUSED after batch 008.** BSL grew 47 → 144 (3×). Further BSL batches on abstract vocabulary yield ~2/25 with repeat skip patterns; BSL text sources for this tier are exhausted. All worker capacity now goes to the priority target: ASL 1000+.
