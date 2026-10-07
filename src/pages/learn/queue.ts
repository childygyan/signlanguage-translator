/**
 * queue.ts — the 15-day daily article program for signlanguage-translator.com
 * (2026-10-07 → 2026-10-21).
 *
 * Each entry is a COMPLETE draft living in `src/pages/learn/_drafts/<slug>/`
 * as a single self-contained `index.astro` (frontmatter consts + JSON-LD +
 * article body; imports BaseLayout via `../../../layouts/BaseLayout.astro`).
 * Astro ignores `_`-prefixed directories for routing, so drafts are invisible
 * until published.
 *
 * THE DAILY PUBLISHER (cron `daily-article-publish-slt`) takes QUEUE[0] and,
 * in order:
 *  1. Read this file. If QUEUE is empty: the program is complete — call
 *     cron.remove with id `daily-article-publish-slt`, then report
 *     "15-day article program complete — all articles published." and stop.
 *  2. Date check FIRST: let today = current date (Asia/Kolkata, YYYY-MM-DD).
 *     - If QUEUE[0].datePublished is AFTER today: do NOT publish. Report
 *       "Next article '<title>' is scheduled for <datePublished> — nothing
 *       to publish today." and stop. (The cron may fire before a date arrives.)
 *     - If QUEUE[0].datePublished is more than 1 day BEFORE today (a previous
 *       run failed): update the draft's `datePublished` const AND this queue
 *       entry's datePublished to today, so the published date stays truthful.
 *  3. Verify the draft exists: src/pages/learn/_drafts/<slug>/index.astro.
 *     Take { slug, title, description, datePublished } from QUEUE[0].
 *  4. Move the draft into place (run from the repo root):
 *       mv src/pages/learn/_drafts/<slug> src/pages/learn/<slug>/
 *  5. Fix import depth in the moved file (drafts sit 3 levels deep under
 *     _drafts, published pages only 2 under src/pages/learn): in
 *     src/pages/learn/<slug>/index.astro replace every `../../../layouts/`
 *     with `../../layouts/` (and `../../../components/` → `../../components/`,
 *     `../../../lib/` → `../../lib/` if present). This is the ONLY
 *     content-file change allowed.
 *  6. Register it — two file edits:
 *     - src/pages/learn/articles.ts: append
 *         { slug: '<slug>', title: '<title>', description: '<description>',
 *           datePublished: '<datePublished>' },
 *       to ARTICLES after the PUBLISH QUEUE anchor comment.
 *     - src/pages/learn/queue.ts (this file): delete the QUEUE[0] entry you
 *       just published.
 *  7. Append to public/llms.txt (after the last article line in the
 *     "Learning articles" section; create that section right after the
 *     "## Pages" heading if the article is the first one):
 *       - [How to fingerspell your name in ASL](https://signlanguage-translator.com/learn/how-to-fingerspell-your-name-in-asl/) (2026-10-07): <description>.
 *     (Use the real title + description from the queue entry.)
 *  8. From the repo root run: `npm run typecheck`, then `npm run build`.
 *     BOTH must pass with zero errors. If anything fails: STOP here, do NOT
 *     deploy, and report the failure plainly.
 *  9. Deploy (cwd MUST be the repo root):
 *       python3 ~/workspace/bin/cf-pages-deploy.py signlanguage-translator /home/hatch/workspace/signlanguage-translator/dist --branch=main
 *  10. Verify: dist/learn/<slug>/index.html exists and contains the
 *      datePublished string; the deploy output's deployment URL returns 200
 *      for /learn/<slug>/ and /learn/ shows the new card. Then also try
 *      https://signlanguage-translator.com/learn/<slug>/ — report which URL
 *      verified (production DNS may still be propagating).
 *  11. Stage and push (cwd = repo root): `git add -A` first (the push script
 *      reads tracked files from disk, so new/moved files must be staged),
 *      then
 *        python3 ~/workspace/skills/github/bin/gh_datapush.py childygyan/signlanguage-translator main "Publish <slug> (<datePublished>)"
 *      — expect "PUSH OK".
 *  12. Report in Hinglish, short (2-4 lines): which article went live (title +
 *      URL + date), typecheck/build/deploy/push receipts. If QUEUE is now
 *      empty, note it was the final article.
 *
 * Rules: never publish more than one article per run. Never invent or edit
 * article content — the drafts are already written and reviewed; your job is
 * mechanics only (the import-depth fix in step 5 is the only content-file
 * change allowed). If any step fails, stop before deploying and say what
 * failed. Do not edit MEMORY.md; you may append a line to
 * ~/memory/YYYY-MM-DD.md.
 */
export interface QueuedArticle {
  slug: string;
  title: string;
  description: string;
  datePublished: string; // YYYY-MM-DD, honest publish day
}

export const QUEUE: QueuedArticle[] = [
  {
    slug: "how-to-fingerspell-your-name-in-bsl",
    title: "How to Fingerspell Your Name in BSL",
    description:
      "Spell your name with the two-handed BSL alphabet: how the base hand works, the vowel positions, the H and J movements, and practice tips for clear fingerspelling.",
    datePublished: "2026-10-08",
  },
  {
    slug: "asl-vs-bsl-key-differences",
    title: "ASL vs BSL: 7 Key Differences Every Beginner Should Know",
    description:
      "American and British Sign Language are separate languages, not dialects. The seven differences that matter most: alphabets, vocabulary, grammar, numbers, mouthing, fingerspelling use, and learning paths.",
    datePublished: "2026-10-09",
  },
  {
    slug: "essential-asl-signs-for-beginners",
    title: "15 Essential ASL Signs for Beginners",
    description:
      "The first signs every ASL learner should know — greetings, manners, and everyday words — each linking to a step-by-step sign guide with practice tips.",
    datePublished: "2026-10-10",
  },
  {
    slug: "essential-bsl-signs-for-beginners",
    title: "15 Essential BSL Signs for Beginners",
    description:
      "The first signs every BSL learner should know — greetings, manners, and everyday words — each linking to a step-by-step sign guide with practice tips.",
    datePublished: "2026-10-11",
  },
  {
    slug: "common-asl-greetings",
    title: "ASL Greetings: 10+ Ways to Say Hello, Goodbye and More",
    description:
      "10+ ASL greetings every beginner should know: hello, goodbye, good morning, good night, how are you, nice to meet you and more — with the signs, when to use each, and common beginner mistakes.",
    datePublished: "2026-10-12",
  },
  {
    slug: "introduce-yourself-in-asl",
    title: "How to Introduce Yourself in ASL",
    description:
      "A complete beginner's introduction in ASL: signing your name, where you're from, and the classic 'what is your name' exchange — phrase by phrase.",
    datePublished: "2026-10-13",
  },
  {
    slug: "bsl-numbers-1-to-5",
    title: "BSL Numbers 1 to 5: How to Count on Your Fingers",
    description:
      "Learn the BSL number signs 1–5 with clear handshape descriptions, how they differ from ASL numbers, and why 0 and 6–10 vary by region.",
    datePublished: "2026-10-14",
  },
  {
    slug: "how-to-sign-how-are-you-everyday-phrases",
    title: "How to Sign \u2018How Are You?\u2019 + 10 Everyday ASL & BSL Phrases",
    description:
      "Learn to sign \u2018How are you?\u2019 in ASL and BSL, plus 10 everyday phrases for greetings, politeness and small talk \u2014 each linked to step-by-step sign guides.",
    datePublished: "2026-10-15",
  },
  {
    slug: "facial-expressions-in-sign-language",
    title: "Facial Expressions in Sign Language: Your Face Is Grammar (ASL & BSL)",
    description:
      "In ASL and BSL your face carries meaning — questions, negation, and intensity all live in facial expressions. What beginners must learn beyond the hands.",
    datePublished: "2026-10-16",
  },
  {
    slug: "how-to-sign-thank-you-sorry-please",
    title: "How to Sign Thank You, Sorry and Please (ASL & BSL)",
    description:
      "The three politeness signs every learner needs in both ASL and BSL — step-by-step instructions, the shared BSL please/thank-you form, and when to use each.",
    datePublished: "2026-10-17",
  },
  {
    slug: "fingerspelling-tips-for-beginners",
    title: "Fingerspelling Tips for Beginners (Including Double Letters)",
    description:
      "Seven practical rules for clear fingerspelling in ASL and BSL: rhythm, hand position, double letters, when to fingerspell at all — and the mistakes to avoid.",
    datePublished: "2026-10-18",
  },
  {
    slug: "is-sign-language-universal",
    title: "Is Sign Language Universal? ASL, BSL and 300+ Sign Languages",
    description:
      "No — there is no single universal sign language. How ASL, BSL and 300+ other sign languages relate, why they differ, and what that means for learners.",
    datePublished: "2026-10-19",
  },
  {
    slug: "asl-numbers-0-to-10",
    title: "ASL Numbers 0\u201310: How to Count on Your Fingers",
    description:
      "Learn ASL numbers 0 to 10 with clear handshape descriptions and images: how to count on your fingers, how ASL numbers differ from BSL, and practice tips.",
    datePublished: "2026-10-20",
  },
  {
    slug: "asl-beginner-learning-roadmap",
    title: "Your First 30 Days Learning ASL: A Beginner Roadmap",
    description:
      "A practical 30-day plan for ASL beginners: what to learn each week, which signs first, how to practise daily, and when to find a Deaf instructor.",
    datePublished: "2026-10-21",
  },
];
