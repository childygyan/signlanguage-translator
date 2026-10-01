import { useMemo, useState } from "react";
import type { Category, SignEntry } from "../lib/types";

interface Props {
  signs: SignEntry[];
  categories: Category[];
}

function categoryName(categories: Category[], slug: string): string {
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}

export default function DictionaryBrowser({ signs, categories }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return signs.filter(
      (s) =>
        (category === "all" || s.category === category) &&
        (!q || s.word.toLowerCase().includes(q)),
    );
  }, [query, category, signs]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <label
            htmlFor="dictionary-search"
            className="block text-sm font-semibold text-slate-900"
          >
            Search signs
          </label>
          <input
            id="dictionary-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try: hello, thank you, morning…"
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-900 placeholder:text-slate-400 focus:border-indigo-700"
          />
        </div>
        <div>
          <label
            htmlFor="dictionary-category"
            className="block text-sm font-semibold text-slate-900"
          >
            Category
          </label>
          <select
            id="dictionary-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-lg text-slate-900 focus:border-indigo-700"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8" aria-live="polite">
        {filtered.length === 0 ? (
          <p className="rounded-xl bg-slate-50 px-6 py-10 text-center text-lg text-slate-600">
            No signs match your search. Try a different word.
          </p>
        ) : (
          <>
            <p className="text-slate-600" role="status">
              {filtered.length} {filtered.length === 1 ? "sign" : "signs"} found
            </p>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((s) => (
                <li key={s.slug}>
                  <a
                    href={`/signs/${s.slug}/`}
                    className="block h-full rounded-xl border border-slate-200 bg-white p-5 hover:border-indigo-700 hover:shadow-sm"
                  >
                    <p className="text-xl font-bold text-slate-900">{s.word}</p>
                    <p className="mt-1 text-sm font-medium uppercase tracking-wide text-indigo-700">
                      {categoryName(categories, s.category)}
                    </p>
                    <p className="mt-2 line-clamp-2 text-slate-600">{s.steps[0]}</p>
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
