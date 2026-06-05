"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type FontSize = "sm" | "md" | "lg" | "xl";

interface AccessibilityState {
  fontSize: FontSize;
  highContrast: boolean;
  dyslexiaFont: boolean;
  simpleMode: boolean;
  textToSpeech: boolean;
  setFontSize: (size: FontSize) => void;
  toggleHighContrast: () => void;
  toggleDyslexiaFont: () => void;
  toggleSimpleMode: () => void;
  toggleTextToSpeech: () => void;
  resetAll: () => void;
  speak: (text: string) => void;
}

const AccessibilityContext = createContext<AccessibilityState | null>(null);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>("md");
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [simpleMode, setSimpleMode] = useState(false);
  const [textToSpeech, setTextToSpeech] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("a11y-settings");
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        if (settings.fontSize) setFontSizeState(settings.fontSize);
        if (settings.highContrast) setHighContrast(settings.highContrast);
        if (settings.dyslexiaFont) setDyslexiaFont(settings.dyslexiaFont);
        if (settings.simpleMode) setSimpleMode(settings.simpleMode);
        if (settings.textToSpeech) setTextToSpeech(settings.textToSpeech);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("font-scale-sm", "font-scale-md", "font-scale-lg", "font-scale-xl");
    html.classList.add(`font-scale-${fontSize}`);
    if (highContrast) html.classList.add("high-contrast");
    else html.classList.remove("high-contrast");
    if (dyslexiaFont) html.classList.add("dyslexia-font");
    else html.classList.remove("dyslexia-font");
    if (simpleMode) html.classList.add("simple-mode");
    else html.classList.remove("simple-mode");

    localStorage.setItem(
      "a11y-settings",
      JSON.stringify({ fontSize, highContrast, dyslexiaFont, simpleMode, textToSpeech })
    );
  }, [fontSize, highContrast, dyslexiaFont, simpleMode, textToSpeech]);

  const setFontSize = (size: FontSize) => setFontSizeState(size);
  const toggleHighContrast = () => setHighContrast((v) => !v);
  const toggleDyslexiaFont = () => setDyslexiaFont((v) => !v);
  const toggleSimpleMode = () => setSimpleMode((v) => !v);
  const toggleTextToSpeech = () => setTextToSpeech((v) => !v);

  const resetAll = () => {
    setFontSizeState("md");
    setHighContrast(false);
    setDyslexiaFont(false);
    setSimpleMode(false);
    setTextToSpeech(false);
  };

  const speak = (text: string) => {
    if (textToSpeech && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        highContrast,
        dyslexiaFont,
        simpleMode,
        textToSpeech,
        setFontSize,
        toggleHighContrast,
        toggleDyslexiaFont,
        toggleSimpleMode,
        toggleTextToSpeech,
        resetAll,
        speak,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used inside AccessibilityProvider");
  return ctx;
}
