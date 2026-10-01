import signsData from "../data/signs.json";
import type { SignEntry } from "./types";

/**
 * A single rendered unit of a translation: either a dictionary sign
 * (real word-level ASL sign) or a fingerspelled fallback.
 */
export type TranslationToken =
  | { kind: "sign"; entry: SignEntry }
  | { kind: "fingerspell"; word: string };

const SIGNS = signsData as SignEntry[];

/** Letters whose ASL fingerspelling involves motion rather than a static handshape. */
const MOTION_LETTERS = new Set(["J", "Z"]);

export function isMotionLetter(char: string): boolean {
  return MOTION_LETTERS.has(char.toUpperCase());
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

const SIGN_MAP = new Map<string, SignEntry>();
for (const entry of SIGNS) {
  SIGN_MAP.set(normalizePhrase(entry.word), entry);
}

/** Longest phrase length present in the dictionary (drives the match window). */
const MAX_PHRASE_WORDS = Math.max(
  ...SIGNS.map((s) => normalizePhrase(s.word).split(" ").length),
);

/**
 * Tokenize input text and match tokens against the word-level sign dictionary.
 *
 * Matching contract: normalize each input word (lowercase, strip punctuation
 * incl. apostrophes), then greedily match the longest phrase first
 * (longest → … → 2-word → 1-word) against dictionary `word` fields.
 * Verified dictionary signs render with their steps + tip; unmatched words
 * fall back to { kind: "fingerspell" }.
 */
export function translateText(text: string): TranslationToken[] {
  const rawWords = text.trim().split(/\s+/).filter(Boolean);
  const normWords = rawWords.map((w) => normalizePhrase(w));

  const tokens: TranslationToken[] = [];
  let i = 0;
  while (i < rawWords.length) {
    let matched: SignEntry | undefined;
    let matchedLen = 0;
    const maxN = Math.min(MAX_PHRASE_WORDS, rawWords.length - i);
    for (let n = maxN; n >= 1; n--) {
      const phrase = normWords.slice(i, i + n).join(" ");
      const entry = SIGN_MAP.get(phrase);
      if (entry) {
        matched = entry;
        matchedLen = n;
        break;
      }
    }
    if (matched && matchedLen > 0) {
      tokens.push({ kind: "sign", entry: matched });
      i += matchedLen;
    } else {
      const original = rawWords[i];
      if (original === undefined) break;
      tokens.push({ kind: "fingerspell", word: original });
      i += 1;
    }
  }
  return tokens;
}

/** All dictionary entries (for pages that list the full dictionary). */
export function getAllSigns(): SignEntry[] {
  return SIGNS;
}
