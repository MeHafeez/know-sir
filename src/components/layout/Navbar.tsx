"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslationFn } from "@/context/TranslationStoreContext";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, Sun, Moon, Globe, ChevronDown,
  Accessibility, Phone, Vote, Settings
} from "lucide-react";
import { useAccessibility } from "@/components/providers/AccessibilityProvider";
import { useTranslationLoading } from "@/context/TranslationStoreContext";
import { useChangeLocale } from "@/hooks/useChangeLocale";
import { type LocaleCode } from "@/context/LanguageContext";
import contentData from "@/config/content.json";
import { cn } from "@/lib/utils";

const navLinks = [
  { key: "whatIsSir", href: "#what-is-sir" },
  { key: "documents", href: "#documents" },
  { key: "steps", href: "#steps" },
  { key: "resources", href: "#resources" },
  { key: "helpline", href: "#emergency" },
];

export default function Navbar() {
  const t = useTranslationFn("nav");
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { simpleMode, toggleSimpleMode } = useAccessibility();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentLocale = pathname.split("/")[1] || "en";

  const changeLocale = useChangeLocale();
  const isTranslating = useTranslationLoading();

  const handleLocaleChange = useCallback((code: string) => {
    changeLocale(code as LocaleCode);
    setLangOpen(false);
  }, [changeLocale]);

  const currentLang = contentData.languages.find(l => l.code === currentLocale);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md border-b border-slate-200 dark:border-slate-700"
          : "bg-white dark:bg-slate-900 border-b border-transparent"
      )}
      role="banner"
    >
      {isTranslating ? (
        <div className="h-1 w-full bg-slate-200 overflow-hidden">
          <div className="h-full bg-blue-500 animate-[shimmer_1.2s_ease-in-out_infinite]" style={{ width: "60%", animation: "translating 1.5s ease-in-out infinite" }} />
        </div>
      ) : (
        <div className="india-stripe h-1 w-full" aria-hidden="true" />
      )}
      <nav className="section-container" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link
            href={`/${currentLocale}`}
            className="flex items-center gap-3 group"
            aria-label="SIR Verification Help Portal - Home"
          >
            <div className="w-10 h-10 bg-primary-700 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-800 transition-colors">
              <Vote className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold text-primary-700 dark:text-primary-400 leading-tight">
                SIR Portal
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                Voter Verification Help
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all"
              >
                {t(link.key)}
              </a>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Helpline Badge */}
            <a
              href="tel:1950"
              className="hidden md:flex items-center gap-1.5 bg-success/10 text-success border border-success/30 hover:bg-success/20 transition-colors px-3 py-1.5 rounded-full text-sm font-bold"
              aria-label="Call Voter Helpline 1950"
            >
              <Phone className="w-3.5 h-3.5" aria-hidden="true" />
              <span>1950</span>
            </a>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label={`Current language: ${currentLang?.nativeName}. Click to change language`}
                aria-expanded={langOpen}
                aria-haspopup="listbox"
              >
                <Globe className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">{currentLang?.nativeName || "English"}</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform", langOpen && "rotate-180")} aria-hidden="true" />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 min-w-[160px] max-h-80 overflow-y-auto"
                    role="listbox"
                    aria-label="Select language"
                  >
                    {contentData.languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLocaleChange(lang.code)}
                        role="option"
                        aria-selected={lang.code === currentLocale}
                        className={cn(
                          "w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors",
                          lang.code === currentLocale
                            ? "text-primary-700 dark:text-primary-400 font-semibold bg-primary-50 dark:bg-primary-900/20"
                            : "text-slate-700 dark:text-slate-300"
                        )}
                      >
                        <span className="font-medium">{lang.nativeName}</span>
                        <span className="text-slate-400 text-xs ml-2">{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Moon className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            )}

            {/* Simple Mode Toggle */}
            <button
              onClick={toggleSimpleMode}
              className={cn(
                "hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                simpleMode
                  ? "bg-warning text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
              aria-label={simpleMode ? "Turn off simple view" : "Turn on simple view for easier reading"}
              aria-pressed={simpleMode}
            >
              <Settings className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden md:inline">{t("simpleMode")}</span>
            </button>

            {/* Accessibility Button */}
            <a
              href="#accessibility"
              className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Accessibility options"
            >
              <Accessibility className="w-4 h-4" aria-hidden="true" />
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700"
          >
            <div className="section-container py-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center px-4 py-3 text-base font-medium text-slate-700 dark:text-slate-300 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all"
                >
                  {t(link.key)}
                </a>
              ))}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <a
                  href="tel:1950"
                  className="flex items-center gap-2 px-4 py-3 text-base font-bold text-success bg-success/10 rounded-xl"
                >
                  <Phone className="w-4 h-4" />
                  Voter Helpline: 1950
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
