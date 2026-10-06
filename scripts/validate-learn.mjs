#!/usr/bin/env node
/**
 * validate-learn.mjs — validates /learn/ drafts against queue.ts.
 *
 * Checks per QUEUE entry:
 *  - src/pages/learn/_drafts/<slug>/index.astro exists
 *  - datePublished const matches the queue date
 *  - title/description consts match the queue entry
 *  - 5+ FAQs, Article + FAQPage JSON-LD present
 *  - /signs/<x>/ links only to real ASL slugs; /bsl-signs/<y>/ only to real BSL slugs
 *  - /learn/<z>/ links only to already-published slugs (articles.ts) or
 *    earlier-in-queue slugs (never to same-or-later queue entries)
 *  - no TODO/FIXME/lorem placeholders
 *  - draft imports BaseLayout via ../../../layouts/ (publisher fixes depth)
 */
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const fail = (msg) => errors.push(msg);

const stripTs = (p) =>
  readFileSync(p, "utf8")
    .replace(/export\s+(interface|const|type)[^;]*;?/g, "")
    .replace(/:\s*(QueuedArticle|LearnArticle)\[\]/g, "");

// QUEUE — parse entries (slug/title/description/datePublished) in order.
const queueSrc = readFileSync(join(root, "src/pages/learn/queue.ts"), "utf8");
const queue = [...queueSrc.matchAll(
  /\{\s*slug:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*description:\s*"([^"]+)",\s*datePublished:\s*"([^"]+)"\s*,?\s*\}/g,
)].map((m) => ({ slug: m[1], title: m[2], description: m[3], datePublished: m[4] }));

if (queue.length === 0) fail("QUEUE parsed as empty — check regex against queue.ts");

const aslSlugs = new Set(
  JSON.parse(readFileSync(join(root, "src/data/signs.json"), "utf8")).map((s) => s.slug),
);
const bslSlugs = new Set(
  JSON.parse(readFileSync(join(root, "src/data/bsl-signs.json"), "utf8")).map((s) => s.slug),
);

// Published slugs (already live in articles.ts registry).
const articlesSrc = readFileSync(join(root, "src/pages/learn/articles.ts"), "utf8");
const publishedSlugs = new Set(
  [...articlesSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]),
);

const seenQueueSlugs = new Set();
queue.forEach((entry, qi) => {
  const p = join(root, "src/pages/learn/_drafts", entry.slug, "index.astro");
  if (!existsSync(p)) {
    fail(`[${entry.slug}] draft missing: src/pages/learn/_drafts/${entry.slug}/index.astro`);
    return;
  }
  const src = readFileSync(p, "utf8");

  const constStr = (name) => {
    const m = src.match(new RegExp(`const ${name} =\\s*"([^"]+)"`));
    return m ? m[1] : null;
  };
  if (constStr("datePublished") !== entry.datePublished)
    fail(`[${entry.slug}] datePublished "${constStr("datePublished")}" != queue "${entry.datePublished}"`);
  if (constStr("title") !== entry.title)
    fail(`[${entry.slug}] title const does not match queue title`);
  if (constStr("description") !== entry.description)
    fail(`[${entry.slug}] description const does not match queue description`);

  const faqCount = (src.match(/\{\s*q:\s*"/g) || []).length;
  if (faqCount < 5) fail(`[${entry.slug}] only ${faqCount} FAQs (need 5+)`);
  if (!src.includes('"@type": "Article"')) fail(`[${entry.slug}] missing Article JSON-LD`);
  if (!src.includes('"@type": "FAQPage"')) fail(`[${entry.slug}] missing FAQPage JSON-LD`);
  if (!src.includes('import BaseLayout from "../../../layouts/BaseLayout.astro"'))
    fail(`[${entry.slug}] BaseLayout import must be "../../../layouts/BaseLayout.astro" (publisher fixes depth)`);
  if (/TODO|FIXME|lorem ipsum/i.test(src)) fail(`[${entry.slug}] contains placeholder text`);

  for (const m of src.matchAll(/href="\/signs\/([^"/]+)\/"/g))
    if (!aslSlugs.has(m[1])) fail(`[${entry.slug}] links to unknown ASL sign /signs/${m[1]}/`);
  for (const m of src.matchAll(/href="\/bsl-signs\/([^"/]+)\/"/g))
    if (!bslSlugs.has(m[1])) fail(`[${entry.slug}] links to unknown BSL sign /bsl-signs/${m[1]}/`);
  for (const m of src.matchAll(/href="\/learn\/([^"/]+)\/"/g)) {
    const target = m[1];
    const targetIdx = queue.findIndex((q) => q.slug === target);
    if (!publishedSlugs.has(target) && !(targetIdx !== -1 && targetIdx < qi))
      fail(`[${entry.slug}] links to /learn/${target}/ which is not published yet (would 404)`);
  }
  seenQueueSlugs.add(entry.slug);
});

// Draft folders with no queue entry (orphans).
import { readdirSync } from "node:fs";
const draftsDir = join(root, "src/pages/learn/_drafts");
if (existsSync(draftsDir)) {
  for (const d of readdirSync(draftsDir, { withFileTypes: true })) {
    if (d.isDirectory() && !seenQueueSlugs.has(d.name))
      fail(`orphan draft folder with no queue entry: ${d.name}`);
  }
}

if (errors.length) {
  console.log("VALIDATION FAILED:\n" + errors.map((e) => " - " + e).join("\n"));
  process.exit(1);
}
console.log(`VALIDATION OK — ${queue.length} drafts checked.`);
