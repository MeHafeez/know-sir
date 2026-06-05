"use client";

import Link from "next/link";
import { ExternalLink, Phone, Globe, Mail, ShieldCheck, AlertTriangle } from "lucide-react";
import rules from "@/config/sir-rules.json";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";

const QUICK_LINKS = [
  { id: "ql1", label: "Check Voter List",   url: "https://electoralsearch.eci.gov.in" },
  { id: "ql2", label: "Register / Update",  url: "https://voters.eci.gov.in/" },
  { id: "ql3", label: "Download e-EPIC",    url: "https://voters.eci.gov.in/#epicDownload" },
  { id: "ql4", label: "Official ECI Portal",url: "https://www.eci.gov.in" },
  { id: "ql5", label: "NVSP",               url: "https://www.nvsp.in" },
];

const FORMS = [
  { id: "f1", label: "Form 6 — New Registration",        url: "https://voters.eci.gov.in/" },
  { id: "f2", label: "Form 6A — NRI Voters",             url: "https://voters.eci.gov.in/" },
  { id: "f3", label: "Form 7 — Deletion/Objection",      url: "https://voters.eci.gov.in/" },
  { id: "f4", label: "Form 8 — Correction/Transposition",url: "https://voters.eci.gov.in/" },
];

const LANG_CODES = ["en", "hi", "te", "ta", "kn", "ml", "mr", "gu", "pa", "bn", "or", "as", "ur"] as const;
const LANG_NAMES: Record<string, string> = {
  en: "English", hi: "हिंदी", te: "తెలుగు", ta: "தமிழ்", kn: "ಕನ್ನಡ",
  ml: "മലയാളം", mr: "मराठी", gu: "ગુજરાતી", pa: "ਪੰਜਾਬੀ", bn: "বাংলা",
  or: "ଓଡ଼ିଆ", as: "অসমীয়া", ur: "اردو",
};

export default function FooterV2() {
  const ftx = useAutoTranslate({
    tagline: "An independent public awareness initiative empowering citizens through technology.",
    voterHelpline: "Voter Helpline",
    officialPortals: "Official Portals",
    voterForms: "Voter Forms",
    languages: "Languages",
    langCount: "13 Indian languages supported",
    attribution: rules._meta.attribution,
    disclaimer: rules._meta.disclaimer,
    madeFor: "Made with ❤️ for India",
    guidanceNote: "This platform provides guidance based on publicly available official information. Users should verify critical information through official Election Commission resources.",
    empowering: "Empowering Citizens Through Technology",
    publicAwareness: "Made for Public Awareness and Citizen Education",
    notAffiliated: "Not affiliated with any political party.",
    ql1: "Check Voter List",
    ql2: "Register / Update",
    ql3: "Download e-EPIC",
    ql4: "Official ECI Portal",
    ql5: "NVSP",
    f1: "Form 6 — New Registration",
    f2: "Form 6A — NRI Voters",
    f3: "Form 7 — Deletion/Objection",
    f4: "Form 8 — Correction/Transposition",
  });

  return (
    <footer className="bg-gray-950 text-gray-300">

      {/* India stripe */}
      <div className="h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" aria-hidden="true" />

      {/* Main footer grid */}
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-sm text-white">
                HB
              </div>
              <div>
                <p className="font-bold text-white text-sm">HallowByte Innovations</p>
                <p className="text-gray-500 text-xs">Pvt. Ltd.</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {ftx.tagline}
            </p>
            <div className="space-y-2 text-sm">
              <a href="mailto:contact@hallowbyte.com" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4" /> contact@hallowbyte.com
              </a>
              <a href="https://hallowbyte.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Globe className="w-4 h-4" /> hallowbyte.com
              </a>
              <a href={`tel:${rules._meta.helpline}`} className="flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                <Phone className="w-4 h-4" /> {ftx.voterHelpline}: {rules._meta.helpline}
              </a>
            </div>
          </div>

          {/* Official Links */}
          <div>
            <h3 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">{ftx.officialPortals}</h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
                  >
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    {ftx[link.id as keyof typeof ftx] ?? link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Forms */}
          <div>
            <h3 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">{ftx.voterForms}</h3>
            <ul className="space-y-2.5">
              {FORMS.map((f) => (
                <li key={f.id}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group">
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 flex-shrink-0" />
                    {ftx[f.id as keyof typeof ftx] ?? f.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Languages */}
          <div>
            <h3 className="font-bold text-white text-sm mb-4 uppercase tracking-wider">{ftx.languages}</h3>
            <div className="flex flex-wrap gap-1.5">
              {LANG_CODES.map((code) => (
                <Link
                  key={code}
                  href={`/${code}`}
                  className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  {LANG_NAMES[code]}
                </Link>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-3">{ftx.langCount}</p>
          </div>
        </div>
      </div>

      {/* Disclaimer bar */}
      <div className="border-t border-gray-800/60 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2 text-xs text-gray-500">
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                {ftx.attribution}
              </p>
              <p className="flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                {ftx.disclaimer}
              </p>
              <p className="text-gray-600">
                {ftx.guidanceNote}
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-gray-600 text-xs">
                {ftx.madeFor}
              </p>
              <p className="text-gray-700 text-xs mt-1">
                © {new Date().getFullYear()} HallowByte Innovations Pvt. Ltd.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="bg-gray-950 border-t border-gray-900 py-3 px-4 text-center">
        <p className="text-gray-700 text-xs">
          An Initiative by <span className="text-gray-500 font-semibold">HallowByte Innovations Private Limited</span>
          {" · "}{ftx.empowering}
          {" · "}{ftx.publicAwareness}
          {" · "}{ftx.notAffiliated}
        </p>
      </div>
    </footer>
  );
}
