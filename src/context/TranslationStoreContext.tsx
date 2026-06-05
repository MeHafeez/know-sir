"use client";

import {
  createContext, useContext, useState, useEffect,
  useCallback, ReactNode, useRef,
} from "react";
import { useLanguage } from "./LanguageContext";
import { collectPageStringValues } from "@/config/page-strings";
import enMessages from "@/messages/en.json";
import hiMessages from "@/messages/hi.json";

// ── Flatten/unflatten helpers ─────────────────────────────────────────────────

type NestedObject = Record<string, unknown>;

function flattenStrings(obj: NestedObject, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const val = obj[key];
    if (typeof val === "string") {
      result[fullKey] = val;
    } else if (Array.isArray(val)) {
      val.forEach((item, i) => {
        if (typeof item === "string") {
          result[`${fullKey}.${i}`] = item;
        } else if (item && typeof item === "object") {
          Object.assign(result, flattenStrings(item as NestedObject, `${fullKey}.${i}`));
        }
      });
    } else if (val && typeof val === "object") {
      Object.assign(result, flattenStrings(val as NestedObject, fullKey));
    }
  }
  return result;
}

function setDeep(obj: NestedObject, path: string, value: string) {
  const keys = path.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cur: any = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (!(k in cur)) {
      const nextIsNum = !isNaN(Number(keys[i + 1]));
      cur[k] = nextIsNum ? [] : {};
    }
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
}

function unflatten(flat: Record<string, string>): NestedObject {
  const result: NestedObject = {};
  for (const [path, val] of Object.entries(flat)) {
    setDeep(result, path, val);
  }
  return result;
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface TranslationStoreValue {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: Record<string, any>;
  /** English text → translated text for useAutoTranslate lookups */
  byEnglish: Record<string, string>;
  loading: boolean;
}

const BASE_MESSAGES = enMessages as Record<string, unknown>;
const HI_MESSAGES = hiMessages as Record<string, unknown>;
const NATIVE_MESSAGES: Record<string, Record<string, unknown>> = { en: BASE_MESSAGES, hi: HI_MESSAGES };
const NATIVE_LOCALES = ["en", "hi"];

// ── Context ───────────────────────────────────────────────────────────────────

const TranslationStoreContext = createContext<TranslationStoreValue>({
  messages: BASE_MESSAGES,
  byEnglish: {},
  loading: false,
});

function cacheKey(locale: string) {
  return `sir_page_tx_${locale}`;
}

function readCache(locale: string): { messages: Record<string, unknown>; byEnglish: Record<string, string> } | null {
  try {
    const raw = localStorage.getItem(cacheKey(locale));
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

function writeCache(
  locale: string,
  messages: Record<string, unknown>,
  byEnglish: Record<string, string>
) {
  try {
    localStorage.setItem(cacheKey(locale), JSON.stringify({ messages, byEnglish }));
  } catch { /* quota */ }
}

function buildHiByEnglish(): Record<string, string> {
  const enFlat = flattenStrings(BASE_MESSAGES as NestedObject);
  const hiFlat = flattenStrings(HI_MESSAGES as NestedObject);
  const byEnglish: Record<string, string> = {};
  for (const [key, enVal] of Object.entries(enFlat)) {
    byEnglish[enVal] = hiFlat[key] ?? enVal;
  }
  return byEnglish;
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function TranslationStoreProvider({ children }: { children: ReactNode }) {
  const { locale } = useLanguage();
  const [messages, setMessages] = useState<Record<string, unknown>>(() => {
    if (NATIVE_LOCALES.includes(locale)) return NATIVE_MESSAGES[locale] ?? BASE_MESSAGES;
    if (typeof window !== "undefined") {
      const cached = readCache(locale);
      if (cached) return cached.messages;
    }
    return BASE_MESSAGES;
  });
  const [byEnglish, setByEnglish] = useState<Record<string, string>>(() => {
    if (locale === "hi") return buildHiByEnglish();
    if (typeof window !== "undefined") {
      const cached = readCache(locale);
      if (cached?.byEnglish) return cached.byEnglish;
    }
    return {};
  });
  const [loading, setLoading] = useState(false);
  const loadIdRef = useRef(0);

  const loadTranslations = useCallback(async (targetLocale: string) => {
    const loadId = ++loadIdRef.current;

    if (NATIVE_LOCALES.includes(targetLocale)) {
      if (targetLocale === "hi") {
        setMessages(HI_MESSAGES);
        setByEnglish(buildHiByEnglish());
      } else {
        setMessages(BASE_MESSAGES);
        setByEnglish({});
      }
      setLoading(false);
      return;
    }

    const cached = readCache(targetLocale);
    if (cached?.messages && cached?.byEnglish) {
      setMessages(cached.messages);
      setByEnglish(cached.byEnglish);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const messageFlat = flattenStrings(BASE_MESSAGES as NestedObject);
      const messageKeys = Object.keys(messageFlat);
      const messageTexts = Object.values(messageFlat);
      const pageValues = collectPageStringValues();

      // Deduplicate page strings already covered by en.json
      const messageSet = new Set(messageTexts);
      const uniquePageValues = pageValues.filter((v) => !messageSet.has(v));

      const allTexts = [...messageTexts, ...uniquePageValues];

      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: allTexts, locale: targetLocale }),
      });

      const data = await res.json();
      if (!data.translations?.length) {
        setMessages(BASE_MESSAGES);
        setByEnglish({});
        return;
      }

      if (loadId !== loadIdRef.current) return;

      const translatedFlat: Record<string, string> = {};
      messageKeys.forEach((k, i) => {
        translatedFlat[k] = data.translations[i] ?? messageFlat[k];
      });

      const translatedMessages = unflatten(translatedFlat);
      const lookup: Record<string, string> = {};
      allTexts.forEach((text, i) => {
        lookup[text] = data.translations[i] ?? text;
      });

      setMessages(translatedMessages);
      setByEnglish(lookup);
      writeCache(targetLocale, translatedMessages, lookup);
    } catch {
      if (loadId === loadIdRef.current) {
        setMessages(BASE_MESSAGES);
        setByEnglish({});
      }
    } finally {
      if (loadId === loadIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadTranslations(locale);
  }, [locale, loadTranslations]);

  return (
    <TranslationStoreContext.Provider value={{ messages, byEnglish, loading }}>
      {children}
    </TranslationStoreContext.Provider>
  );
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useT(namespace: string): Record<string, any> {
  const { messages } = useContext(TranslationStoreContext);
  const ns = (messages as Record<string, unknown>)[namespace];
  if (ns && typeof ns === "object") return ns as Record<string, unknown>;
  return {};
}

export function useTranslationFn(namespace: string) {
  const ns = useT(namespace);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = (key: string): any => {
    const val = ns[key];
    return val !== undefined ? val : key;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t.raw = (key: string): any => ns[key];
  return t;
}

export function useTranslationLoading() {
  return useContext(TranslationStoreContext).loading;
}

export function useTranslationByEnglish() {
  return useContext(TranslationStoreContext).byEnglish;
}
