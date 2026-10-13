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
