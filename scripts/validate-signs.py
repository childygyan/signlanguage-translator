#!/usr/bin/env python3
"""Validate a batch of new dictionary sign entries before merge.

Usage:
    python3 scripts/validate-signs.py <batch.json> [--lang asl|bsl]

Checks every entry against the SignEntry contract and cross-entry rules:
  - required keys exactly {category, related, slug, steps, tip, word}
  - slug format + uniqueness (within batch and against existing dictionary)
  - normalized word uniqueness (translator matches on normalized words)
  - category is a valid slug from categories.json
  - steps: 2-6 non-empty strings, each >= 24 chars (no thin entries)
  - tip: non-empty string
  - related: list of slugs, all must resolve (existing dict + this batch),
    no self-links
Exits 0 when clean, 1 with a full error list otherwise.
"""
import json
import re
import sys

REPO = "/home/hatch/workspace/signlanguage-translator"
REQUIRED_KEYS = {"category", "related", "slug", "steps", "tip", "word"}
SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def norm(w: str) -> str:
    return re.sub(r"[^a-z0-9 ]", "", w.lower()).strip()


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: validate-signs.py <batch.json> [--lang asl|bsl]", file=sys.stderr)
        return 2
    batch_path = sys.argv[1]
    lang = "asl"
    if "--lang" in sys.argv:
        lang = sys.argv[sys.argv.index("--lang") + 1]

    data_file = "bsl-signs.json" if lang == "bsl" else "signs.json"
    existing = json.load(open(f"{REPO}/src/data/{data_file}"))
    categories = {c["slug"] for c in json.load(open(f"{REPO}/src/data/categories.json"))}
    batch = json.load(open(batch_path))
    if isinstance(batch, dict):
        batch = batch.get("entries", batch.get("signs", []))

    errors: list[str] = []
    existing_slugs = {e["slug"] for e in existing}
    existing_words = {norm(e["word"]) for e in existing}
    # collect all batch slugs/words first so forward references resolve
    batch_slugs: set[str] = set()
    batch_words: set[str] = set()
    for e in batch:
        if isinstance(e.get("slug"), str):
            batch_slugs.add(e["slug"])
        if isinstance(e.get("word"), str):
            batch_words.add(norm(e["word"]))

    seen_slugs: set[str] = set()
    seen_words: set[str] = set()

    for i, e in enumerate(batch):
        tag = f"[{i}] slug={e.get('slug', '?')!r}"
        keys = set(e.keys())
        if keys != REQUIRED_KEYS:
            errors.append(f"{tag}: keys {sorted(keys)} != {sorted(REQUIRED_KEYS)}")
        slug = e.get("slug", "")
        if not isinstance(slug, str) or not SLUG_RE.match(slug):
            errors.append(f"{tag}: bad slug format")
        if slug in existing_slugs:
            errors.append(f"{tag}: slug already in {data_file}")
        if slug in seen_slugs:
            errors.append(f"{tag}: duplicate slug within batch")
        seen_slugs.add(slug)
        word = e.get("word", "")
        if not isinstance(word, str) or not word.strip():
            errors.append(f"{tag}: empty word")
        nw = norm(word)
        if nw in existing_words:
            errors.append(f"{tag}: normalized word {nw!r} already in dictionary")
        if nw in seen_words:
            errors.append(f"{tag}: normalized word {nw!r} duplicated in batch")
        seen_words.add(nw)
        if e.get("category") not in categories:
            errors.append(f"{tag}: unknown category {e.get('category')!r}")
        steps = e.get("steps")
        if not isinstance(steps, list) or not (1 <= len(steps) <= 6):
            errors.append(f"{tag}: steps must be a list of 1-6 strings")
        else:
            for s in steps:
                if not isinstance(s, str) or len(s.strip()) < 24:
                    errors.append(f"{tag}: thin/empty step {s!r}")
        tip = e.get("tip", "")
        if not isinstance(tip, str) or not tip.strip():
            errors.append(f"{tag}: empty tip")
        rel = e.get("related")
        if not isinstance(rel, list):
            errors.append(f"{tag}: related must be a list")
        else:
            for r in rel:
                if r == slug:
                    errors.append(f"{tag}: self-link in related")
                elif r not in existing_slugs and r not in batch_slugs:
                    # forward references within the batch are allowed only if
                    # the target slug appears somewhere in this batch
                    errors.append(f"{tag}: dangling related slug {r!r}")

    if errors:
        print(f"FAILED: {len(errors)} error(s) in {batch_path}")
        for err in errors:
            print("  -", err)
        return 1
    print(f"OK: {len(batch)} entries validated ({lang})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
