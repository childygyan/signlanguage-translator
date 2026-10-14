#!/usr/bin/env python3
"""Generate inflectional-variant dictionary entries from POS-labeled base signs.

Linguistic basis (ASL/BSL grammar):
- Plurals are produced with the base noun sign (often repeated) — e.g. CATS = CAT.
- Verbs do not inflect for tense/person on the sign itself; time is marked
  separately — e.g. WENT = GO, PLAYED = PLAY, RUNNING = RUN.
Only REGULAR inflections are generated, plus a tight curated list of common
irregular past tenses. Comparatives, adverbs, and irregular plurals are NEVER
generated. Every candidate is reviewed for meaning-shift risk before merge.

Usage:
    python3 scripts/gen-inflections.py <labels.json> [--lang asl|bsl]
Writes: docs/expansion-batches/inflection-candidates-<lang>.json (for review)
Labels format: {"<slug>": {"pos": ["noun"], "word": "Cat"}, ...}
"""
import json
import re
import sys

REPO = "/home/hatch/workspace/signlanguage-translator"

# Words whose inflected form must NEVER be auto-mapped (distinct sign or
# meaning-shift risk).
DENYLIST = {
    "people", "children", "men", "women", "teeth", "feet", "mice", "geese",
    "oxen", "better", "best", "worse", "worst", "less", "least", "more",
    "most", "left",  # direction vs past-of-leave
    "saw",  # kept OUT by default: tool-noun ambiguity; reviewer may allow
}

# Curated irregular past tense -> base verb. Only used when the base verb is
# in the dictionary. Reviewer must confirm each is unambiguous.
IRREGULAR_PAST = {
    "went": "go", "ate": "eat", "came": "come", "took": "take",
    "gave": "give", "made": "make", "said": "say", "got": "get",
    "knew": "know", "thought": "think", "felt": "feel", "brought": "bring",
    "bought": "buy", "caught": "catch", "told": "tell", "wrote": "write",
    "drove": "drive", "spoke": "speak", "chose": "choose", "broke": "break",
    "woke": "wake", "slept": "sleep", "sang": "sing", "drank": "drink",
    "ran": "run", "swam": "swim", "began": "begin", "won": "win",
    "lost": "lose", "found": "find", "heard": "hear", "held": "hold",
    "kept": "keep", "meant": "mean", "met": "meet", "paid": "pay",
    "spent": "spend", "stood": "stand", "understood": "understand",
    "built": "build", "sent": "send", "read": "read",  # same spelling; no-op
    "set": "set", "shut": "shut",  # same spelling; no-op
}


def norm(w: str) -> str:
    return re.sub(r"[^a-z0-9 ]", "", w.lower()).strip()


def plural(word: str) -> str | None:
    w = word.lower()
    if w in DENYLIST:
        return None
    if re.search(r"[^aeiou]y$", w):
        return w[:-1] + "ies"
    if re.search(r"(s|x|z|ch|sh)$", w):
        return w + "es"
    if w.endswith("s"):
        return None  # already s-final; avoid double plurals
    return w + "s"


# Common CVC verbs where the final consonant doubles before -ing/-ed
# (run -> running). Curated to avoid false doubling (visit -> visiting).
DOUBLING_VERBS = {
    "run", "swim", "get", "sit", "cut", "hit", "plan", "stop", "drop",
    "shop", "chat", "clap", "grab", "hug", "jog", "nod", "pat", "rub",
    "ship", "skip", "slip", "snap", "spin", "spot", "step", "stir",
    "tap", "trap", "trip", "wrap", "beg", "dig", "drag", "grin",
}


def verb_forms(word: str) -> list[str]:
    w = word.lower()
    forms = []
    third = plural(w)  # same regular rule
    if third:
        forms.append(third)
    if w in DOUBLING_VERBS:
        forms.append(w + w[-1] + "ing")
        forms.append(w + w[-1] + "ed")
        return [f for f in forms if f not in DENYLIST]
    # -ing: drop silent e, else +ing (skip consonant-doubling cases)
    if re.search(r"[^aeiou]e$", w) and not w.endswith("ee"):
        forms.append(w[:-1] + "ing")
    elif not re.search(r"[^aeiou][aeiou][^aeiou]$", w):
        forms.append(w + "ing")
    # -ed: drop silent e, else +ed (regular only)
    if w.endswith("e"):
        forms.append(w + "d")
    elif not re.search(r"[^aeiou][aeiou][^aeiou]$", w):
        forms.append(w + "ed")
    return [f for f in forms if f not in DENYLIST]


def title_case(word: str) -> str:
    return " ".join(p[:1].upper() + p[1:] for p in word.split(" "))


def main() -> int:
    labels_path = sys.argv[1]
    lang = "bsl" if "--lang" in sys.argv and sys.argv[sys.argv.index("--lang") + 1] == "bsl" else "asl"
    data_file = "bsl-signs.json" if lang == "bsl" else "signs.json"

    entries = json.load(open(f"{REPO}/src/data/{data_file}"))
    by_slug = {e["slug"]: e for e in entries}
    by_norm = {norm(e["word"]): e for e in entries}
    labels = json.load(open(labels_path))

    # sanity: wordlist for "is this a real English word" check
    # (words_alpha.txt has CRLF endings; strip() handles that)
    wordlist = set()
    for wl in (f"{REPO}/docs/wordlist-alpha.txt", f"{REPO}/docs/wordlist-10k.txt"):
        try:
            with open(wl) as f:
                wordlist |= {l.strip() for l in f if l.strip()}
            break
        except FileNotFoundError:
            continue

    candidates = []
    seen = set()
    stats = {"nouns": 0, "verbs": 0, "generated": 0, "skipped_denylist": 0,
             "skipped_collision": 0, "skipped_not_in_wordlist": 0}

    for slug, lab in labels.items():
        base = by_slug.get(slug)
        if not base:
            print(f"WARN: label for unknown slug {slug}", file=sys.stderr)
            continue
        pos = lab.get("pos", [])
        base_word = norm(base["word"])
        forms: list[tuple[str, str]] = []  # (form, kind)
        if "noun" in pos:
            stats["nouns"] += 1
            p = plural(base_word)
            if p:
                forms.append((p, "plural"))
        if "verb" in pos:
            stats["verbs"] += 1
            for f in verb_forms(base_word):
                kind = "3sg" if f == plural(base_word) else ("progressive" if f.endswith("ing") else "past")
                forms.append((f, kind))
        for form, kind in forms:
            if form in seen or form == base_word:
                continue
            seen.add(form)
            if form in DENYLIST:
                stats["skipped_denylist"] += 1
                continue
            if form in by_norm:
                stats["skipped_collision"] += 1
                continue
            if wordlist and form not in wordlist:
                stats["skipped_not_in_wordlist"] += 1
                continue
            stats["generated"] += 1
            if kind == "plural":
                tip = f"Plural of \u201c{base['word']}\u201d \u2014 sign the base sign (often repeated) for more than one."
            elif kind == "progressive":
                tip = f"\u201c{title_case(form)}\u201d is signed with the base {base['word'].upper()} sign \u2014 ASL/BSL marks ongoing action on the sign, not with a separate word."
            elif kind == "past":
                tip = f"Past form of \u201c{base['word']}\u201d \u2014 signed with the base sign; time is shown separately, not on the verb."
            else:
                tip = f"\u201c{title_case(form)}\u201d is signed with the base {base['word'].upper()} sign."
            candidates.append({
                "slug": form.replace(" ", "-"),
                "word": title_case(form),
                "category": base["category"],
                "steps": base["steps"],
                "tip": tip,
                "related": base["related"],
                "base_slug": slug,
                "inflection_kind": kind,
            })

    # curated irregular past tenses
    for past, base_word in IRREGULAR_PAST.items():
        if past in seen or past in by_norm or past in DENYLIST:
            continue
        base = by_norm.get(base_word)
        if not base:
            continue
        seen.add(past)
        if wordlist and past not in wordlist:
            continue
        stats["generated"] += 1
        candidates.append({
            "slug": past.replace(" ", "-"),
            "word": title_case(past),
            "category": base["category"],
            "steps": base["steps"],
            "tip": f"Past form of \u201c{base['word']}\u201d \u2014 signed with the base sign; time is shown separately, not on the verb.",
            "related": base["related"],
            "base_slug": base["slug"],
            "inflection_kind": "past-irregular",
        })

    out = f"{REPO}/docs/expansion-batches/inflection-candidates-{lang}.json"
    json.dump(candidates, open(out, "w"), indent=1)
    print(f"candidates: {len(candidates)} -> {out}")
    print("stats:", json.dumps(stats))
    return 0


if __name__ == "__main__":
    sys.exit(main())
