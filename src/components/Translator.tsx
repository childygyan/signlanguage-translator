import { useEffect, useRef, useState } from "react";
import {
  fingerspellLetters,
  isMotionLetter,
  translateText,
  type TranslationToken,
} from "../lib/signMatcher";

const MIN_SPEED_MS = 600;
const MAX_SPEED_MS = 3000;
const DEFAULT_SPEED_MS = 1400;

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  onresult: ((event: unknown) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  const ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  return (ctor as SpeechRecognitionCtor | undefined) ?? null;
}

function FingerspellCard({ word }: { word: string }) {
  const letters = fingerspellLetters(word);
  const hasMotion = letters.some(isMotionLetter);
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        Fingerspelled
      </p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{word}</p>
      {letters.length > 0 ? (
        <div
          className="mt-4 flex flex-wrap gap-2"
          role="list"
          aria-label={`Fingerspelling for ${word}`}
        >
          {letters.map((ch, i) => {
            const isDigit = /[0-9]/.test(ch);
            const src = isDigit
              ? `/numbers/${ch}.svg`
              : `/alphabet/${ch.toLowerCase()}.svg`;
            return (
              <span
                key={`${ch}-${i}`}
                role="listitem"
                aria-label={ch}
                className={`flex h-28 w-24 items-center justify-center rounded-lg border-2 p-1.5 ${
                  isMotionLetter(ch)
                    ? "border-amber-500 bg-amber-50"
                    : "border-slate-300 bg-slate-50"
                }`}
              >
                <img
                  src={src}
                  alt={`ASL handshape for ${isDigit ? "number" : "letter"} ${ch}`}
                  className="h-full w-auto"
                  loading="lazy"
                />
              </span>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 text-slate-600">
          No letters or digits to fingerspell in this word.
        </p>
      )}
      {hasMotion && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Note: <strong>J</strong> and <strong>Z</strong> are signed with motion,
          not a static handshape.
        </p>
      )}
    </div>
  );
}

function SignCard({ token }: { token: Extract<TranslationToken, { kind: "sign" }> }) {
  const { entry } = token;
  return (
    <div>
      <p className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-800">
        Dictionary sign
      </p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{entry.word}</p>
      <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-800">
        {entry.steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>
      {entry.tip && (
        <p className="mt-3 text-slate-600">
          <strong>Practice tip:</strong> {entry.tip}
        </p>
      )}
    </div>
  );
}

export default function Translator() {
  const [input, setInput] = useState("");
  const [tokens, setTokens] = useState<TranslationToken[]>([]);
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [speed, setSpeed] = useState(DEFAULT_SPEED_MS);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const [voiceSupported] = useState(() => getSpeechRecognitionCtor() !== null);
  const [ttsSupported] = useState(
    () => typeof window !== "undefined" && "speechSynthesis" in window,
  );

  const token: TranslationToken | undefined = tokens[index];
  const hasResults = tokens.length > 0;

  useEffect(() => {
    if (!autoplay || tokens.length === 0) return;
    if (index >= tokens.length - 1) {
      setAutoplay(false);
      return;
    }
    const id = window.setTimeout(() => {
      setIndex((i) => Math.min(i + 1, tokens.length - 1));
    }, speed);
    return () => window.clearTimeout(id);
  }, [autoplay, index, speed, tokens.length]);

  const handleTranslate = () => {
    const result = translateText(input);
    setTokens(result);
    setIndex(0);
    setAutoplay(false);
  };

  const handleVoice = () => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const rec = new Ctor();
    recognitionRef.current = rec;
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onresult = (event: unknown) => {
      const e = event as {
        results: ArrayLike<ArrayLike<{ transcript: string }>>;
      };
      const last = e.results[e.results.length - 1];
      const transcript = last?.[0]?.transcript ?? "";
      if (transcript.trim()) {
        setInput((prev) => (prev.trim() ? prev.trim() + " " : "") + transcript.trim());
      }
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    setListening(true);
    try {
      rec.start();
    } catch {
      setListening(false);
    }
  };

  const handleSpeak = () => {
    if (!("speechSynthesis" in window) || !input.trim()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(input.trim());
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div
        role="note"
        aria-label="Honest limitations"
        className="mb-6 rounded-xl border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-slate-800"
      >
        <p className="font-semibold">A learning aid — please read</p>
        <p className="mt-1">
          ASL has its own grammar — word order differs from English. This is a
          learning aid, not a substitute for a qualified interpreter.
        </p>
      </div>

      <label
        htmlFor="translator-input"
        className="block text-lg font-semibold text-slate-900"
      >
        Text to translate
      </label>
      <textarea
        id="translator-input"
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type an English sentence, for example: good morning"
        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-lg text-slate-900 placeholder:text-slate-400 focus:border-indigo-700"
      />

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleTranslate}
          disabled={!input.trim()}
          className="rounded-xl bg-indigo-700 px-6 py-3 text-lg font-semibold text-white hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
        >
          Translate
        </button>
        {voiceSupported ? (
          <button
            type="button"
            onClick={handleVoice}
            aria-pressed={listening}
            className={`rounded-xl border-2 px-6 py-3 text-lg font-semibold ${
              listening
                ? "border-amber-600 bg-amber-50 text-amber-900"
                : "border-slate-300 text-slate-700 hover:border-indigo-700 hover:text-indigo-700"
            }`}
          >
            {listening ? "Stop listening" : "Voice input"}
          </button>
        ) : (
          <p className="self-center text-sm text-slate-500">
            Voice input is not supported in this browser.
          </p>
        )}
        {ttsSupported && (
          <button
            type="button"
            onClick={handleSpeak}
            disabled={!input.trim()}
            className="rounded-xl border-2 border-slate-300 px-6 py-3 text-lg font-semibold text-slate-700 hover:border-indigo-700 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Listen
          </button>
        )}
      </div>

      <div className="mt-8" aria-live="polite" aria-atomic="true">
        {!hasResults || !token ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-600">
            <p className="text-lg font-medium">Your signs will appear here</p>
            <p className="mt-1">
              Type some text above and press Translate to step through it sign by sign.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Sign {index + 1} of {tokens.length}
              </p>
            </div>
            <div className="mt-2">
              {token.kind === "sign" ? (
                <SignCard token={token} />
              ) : (
                <FingerspellCard word={token.word} />
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => { setAutoplay(false); setIndex((i) => Math.max(i - 1, 0)); }}
                disabled={index === 0}
                aria-label="Previous sign"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:border-indigo-700 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Previous
              </button>
              <button
                type="button"
                onClick={() => { setAutoplay(false); setIndex((i) => Math.min(i + 1, tokens.length - 1)); }}
                disabled={index >= tokens.length - 1}
                aria-label="Next sign"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:border-indigo-700 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>
              <label className="ml-2 inline-flex cursor-pointer items-center gap-2 font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={autoplay}
                  onChange={(e) => setAutoplay(e.target.checked)}
                  className="h-5 w-5 accent-indigo-700"
                />
                Autoplay
              </label>
              <label className="inline-flex items-center gap-2 text-slate-700">
                <span className="text-sm font-medium">Speed</span>
                <input
                  type="range"
                  min={MIN_SPEED_MS}
                  max={MAX_SPEED_MS}
                  step={100}
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  aria-label="Autoplay speed in milliseconds per sign"
                  className="accent-indigo-700"
                />
                <span className="w-16 text-sm tabular-nums text-slate-600">
                  {(speed / 1000).toFixed(1)}s
                </span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
