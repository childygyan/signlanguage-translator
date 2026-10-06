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
];
