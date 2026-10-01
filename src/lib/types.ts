/** Shared data shapes — mirror the JSON files in src/data exactly. */

export interface SignEntry {
  /** URL slug, e.g. "good-morning" */
  slug: string;
  /** Display word or phrase, e.g. "Good morning" */
  word: string;
  /** Category slug referencing categories.json */
  category: string;
  /** Step-by-step hand/body instructions (original wording) */
  steps: string[];
  /** One-line practice tip */
  tip: string;
  /** Slugs of related signs */
  related: string[];
}

export interface AlphabetEntry {
  /** Single uppercase letter A-Z */
  letter: string;
  /** Text description of the handshape */
  handshape: string;
  /** True when the letter is signed with motion (J, Z) */
  motion: boolean;
}

export interface NumberEntry {
  /** Digit, "0" through "10" */
  digit: string;
  /** Text description of the handshape */
  handshape: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
}
