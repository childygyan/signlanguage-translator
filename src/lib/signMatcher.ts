import signsData from "../data/signs.json";
import bslSignsData from "../data/bsl-signs.json";
import type { SignEntry } from "./types";

/** The two sign languages this site covers. They are distinct languages. */
export type SignLanguage = "asl" | "bsl";

/**
 * A single rendered unit of a translation: either a dictionary sign
 * (real word-level sign) or a fingerspelled fallback.
 */
export type TranslationToken =
  | { kind: "sign"; entry: SignEntry; lang: SignLanguage }
  | { kind: "fingerspell"; word: string; lang: SignLanguage };

const ASL_SIGNS = signsData as SignEntry[];
const BSL_SIGNS = bslSignsData as SignEntry[];

/**
 * Letters whose fingerspelling involves motion rather than a static handshape.
 * ASL: J and Z. BSL: H (slides off the base palm) and J (traces
 * middle-finger → wrist → thumb) — small movements, per BSL research.
 */
const MOTION_LETTERS: Record<SignLanguage, Set<string>> = {
  asl: new Set(["J", "Z"]),
  bsl: new Set(["H", "J"]),
};

export function isMotionLetter(char: string, lang: SignLanguage = "asl"): boolean {
  return MOTION_LETTERS[lang].has(char.toUpperCase());
}

/**
 * Image source for a fingerspelled letter in the given language.
 * Returns null for characters with no hand image (BSL digits — BSL numbers
 * have their own signs and are not fingerspelled, so digits render as text).
 */
export function fingerspellImageSrc(
  char: string,
  lang: SignLanguage,
): string | null {
  const ch = char.toUpperCase();
  if (/[A-Z]/.test(ch)) {
    return lang === "bsl"
      ? `/bsl-alphabet/${ch.toLowerCase()}.svg`
      : `/alphabet/${ch.toLowerCase()}.svg`;
  }
  if (/[0-9]/.test(ch) && lang === "asl") {
    return `/numbers/${ch}.svg`;
  }
  return null;
}

/** Alt text for a fingerspelling tile. */
export function fingerspellAlt(char: string, lang: SignLanguage): string {
  const ch = char.toUpperCase();
  const language = lang === "bsl" ? "BSL" : "ASL";
  if (/[0-9]/.test(ch)) return `${language} digit ${ch}`;
  return `${language} ${lang === "bsl" ? "two-handed " : ""}handshape for letter ${ch}`;
}

/**
 * Reduce a word to the characters we can fingerspell (A-Z, 0-9).
 */
export function fingerspellLetters(word: string): string[] {
  return word
    .toUpperCase()
    .split("")
    .filter((ch) => /[A-Z0-9]/.test(ch));
}

/**
 * Normalize a word or phrase for dictionary lookup: lowercase, strip all
 * punctuation (including apostrophes, so "don't" matches "dont"), collapse
 * whitespace.
 */
export function normalizePhrase(phrase: string): string {
  return phrase
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

interface LangIndex {
  map: Map<string, SignEntry>;
  maxPhraseWords: number;
}

function buildIndex(signs: SignEntry[]): LangIndex {
  const map = new Map<string, SignEntry>();
  for (const entry of signs) {
    map.set(normalizePhrase(entry.word), entry);
  }
  return {
    map,
    maxPhraseWords: Math.max(
      ...signs.map((s) => normalizePhrase(s.word).split(" ").length),
    ),
  };
}

const INDEX: Record<SignLanguage, LangIndex> = {
  asl: buildIndex(ASL_SIGNS),
  bsl: buildIndex(BSL_SIGNS),
};

/**
 * Words that exist in the ASL dictionary but have no researched BSL sign yet.
 * The translator fingerspells these in BSL mode with an honest "not yet
 * researched" note instead of silently substituting the ASL sign.
 */
const BSL_PENDING = new Set(
  [...INDEX.asl.map.keys()].filter((k) => !INDEX.bsl.map.has(k)),
);

export function isBslPending(word: string): boolean {
  return BSL_PENDING.has(normalizePhrase(word));
}

/**
 * Tokenize input text and match tokens against the word-level sign dictionary
 * of the selected language.
 *
 * Matching contract: normalize each input word (lowercase, strip punctuation
 * incl. apostrophes), then greedily match the longest phrase first
 * (longest → … → 2-word → 1-word) against dictionary `word` fields.
 * Verified dictionary signs render with their steps + tip; unmatched words
 * fall back to { kind: "fingerspell" }.
 */
export function translateText(
  text: string,
  lang: SignLanguage = "asl",
): TranslationToken[] {
  const { map, maxPhraseWords } = INDEX[lang];
  const rawWords = text.trim().split(/\s+/).filter(Boolean);
  const normWords = rawWords.map((w) => normalizePhrase(w));

  const tokens: TranslationToken[] = [];
  let i = 0;
  while (i < rawWords.length) {
    let matched: SignEntry | undefined;
    let matchedLen = 0;
    const maxN = Math.min(maxPhraseWords, rawWords.length - i);
    for (let n = maxN; n >= 1; n--) {
      const phrase = normWords.slice(i, i + n).join(" ");
      const entry = map.get(phrase);
      if (entry) {
        matched = entry;
        matchedLen = n;
        break;
      }
    }
    if (matched && matchedLen > 0) {
      tokens.push({ kind: "sign", entry: matched, lang });
      i += matchedLen;
    } else {
      const original = rawWords[i];
      if (original === undefined) break;
      tokens.push({ kind: "fingerspell", word: original, lang });
      i += 1;
    }
  }
  return tokens;
}

/** All dictionary entries for a language (for pages that list the dictionary). */
export function getAllSigns(lang: SignLanguage = "asl"): SignEntry[] {
  return lang === "bsl" ? BSL_SIGNS : ASL_SIGNS;
}

/** Number of researched signs per language. */
export const SIGN_COUNTS: Record<SignLanguage, number> = {
  asl: ASL_SIGNS.length,
  bsl: BSL_SIGNS.length,
};
