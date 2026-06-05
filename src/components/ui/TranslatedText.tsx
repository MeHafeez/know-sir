"use client";

import { useTranslateText } from "@/hooks/useAutoTranslate";

interface TranslatedTextProps {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

/**
 * Renders text automatically translated to the current global locale.
 * Falls back to the original text if translation fails or locale is English.
 */
export default function TranslatedText({ text, as: Tag = "span", className }: TranslatedTextProps) {
  const translated = useTranslateText(text);
  return <Tag className={className}>{translated}</Tag>;
}
