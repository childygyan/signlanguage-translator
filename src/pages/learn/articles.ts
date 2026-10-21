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
  { slug: 'how-to-sign-how-are-you-everyday-phrases', title: 'How to Sign ‘How Are You?’ + 10 Everyday ASL & BSL Phrases', description: 'Learn to sign ‘How are you?’ in ASL and BSL, plus 10 everyday phrases for greetings, politeness and small talk — each linked to step-by-step sign guides.', datePublished: '2026-10-15' },
  { slug: 'how-to-fingerspell-your-name-in-asl', title: 'How to Fingerspell Your Name in ASL: A Step-by-Step Practice Guide', description: 'Learn to spell your name with the one-handed ASL alphabet: letter-by-letter steps, the J and Z motion letters, and practice tips for smooth, readable fingerspelling.', datePublished: '2026-10-07' },
  { slug: 'how-to-fingerspell-your-name-in-bsl', title: 'How to Fingerspell Your Name in BSL', description: 'Spell your name with the two-handed BSL alphabet: how the base hand works, the vowel positions, the H and J movements, and practice tips for clear fingerspelling.', datePublished: '2026-10-08' },
  { slug: 'asl-vs-bsl-key-differences', title: 'ASL vs BSL: 7 Key Differences Every Beginner Should Know', description: 'American and British Sign Language are separate languages, not dialects. The seven differences that matter most: alphabets, vocabulary, grammar, numbers, mouthing, fingerspelling use, and learning paths.', datePublished: '2026-10-09' },
  { slug: 'essential-asl-signs-for-beginners', title: '15 Essential ASL Signs for Beginners', description: 'The first signs every ASL learner should know — greetings, manners, and everyday words — each linking to a step-by-step sign guide with practice tips.', datePublished: '2026-10-10' },
  { slug: 'essential-bsl-signs-for-beginners', title: '15 Essential BSL Signs for Beginners', description: 'The first signs every BSL learner should know — greetings, manners, and everyday words — each linking to a step-by-step sign guide with practice tips.', datePublished: '2026-10-11' },
  { slug: 'common-asl-greetings', title: 'ASL Greetings: 10+ Ways to Say Hello, Goodbye and More', description: '10+ ASL greetings every beginner should know: hello, goodbye, good morning, good night, how are you, nice to meet you and more — with the signs, when to use each, and common beginner mistakes.', datePublished: '2026-10-12' },
  { slug: 'introduce-yourself-in-asl', title: 'How to Introduce Yourself in ASL', description: 'A complete beginner\'s introduction in ASL: signing your name, where you\'re from, and the classic \'what is your name\' exchange — phrase by phrase.', datePublished: '2026-10-13' },
  { slug: 'bsl-numbers-1-to-5', title: 'BSL Numbers 1 to 5: How to Count on Your Fingers', description: 'Learn the BSL number signs 1–5 with clear handshape descriptions, how they differ from ASL numbers, and why 0 and 6–10 vary by region.', datePublished: '2026-10-14' },
  { slug: 'facial-expressions-in-sign-language', title: 'Facial Expressions in Sign Language: Your Face Is Grammar (ASL & BSL)', description: 'In ASL and BSL your face carries meaning — questions, negation, and intensity all live in facial expressions. What beginners must learn beyond the hands.', datePublished: '2026-10-16' },
  { slug: 'how-to-sign-thank-you-sorry-please', title: 'How to Sign Thank You, Sorry and Please (ASL & BSL)', description: 'The three politeness signs every learner needs in both ASL and BSL — step-by-step instructions, the shared BSL please/thank-you form, and when to use each.', datePublished: '2026-10-17' },
  { slug: 'fingerspelling-tips-for-beginners', title: 'Fingerspelling Tips for Beginners (Including Double Letters)', description: 'Seven practical rules for clear fingerspelling in ASL and BSL: rhythm, hand position, double letters, when to fingerspell at all — and the mistakes to avoid.', datePublished: '2026-10-18' },
  { slug: 'is-sign-language-universal', title: 'Is Sign Language Universal? ASL, BSL and 300+ Sign Languages', description: 'No — there is no single universal sign language. How ASL, BSL and 300+ other sign languages relate, why they differ, and what that means for learners.', datePublished: '2026-10-21' },
];
