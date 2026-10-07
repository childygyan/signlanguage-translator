/**
 * articles.ts — registry of PUBLISHED /learn/ articles.
 *
 * The daily publisher appends one entry per run (below the PUBLISH QUEUE
 * anchor). The /learn/ hub page renders ARTICLES newest-first.
 */
export interface LearnArticle {
  slug: string;
  title: string;
  description: string;
  datePublished: string; // YYYY-MM-DD, the article's honest publish day
}

export const ARTICLES: LearnArticle[] = [
  // PUBLISH QUEUE ANCHOR — publisher appends new entries below this line.
  { slug: 'how-to-fingerspell-your-name-in-asl', title: 'How to Fingerspell Your Name in ASL: A Step-by-Step Practice Guide', description: 'Learn to spell your name with the one-handed ASL alphabet: letter-by-letter steps, the J and Z motion letters, and practice tips for smooth, readable fingerspelling.', datePublished: '2026-10-07' },
];
