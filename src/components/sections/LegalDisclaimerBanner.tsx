"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GppGoodIcon from "@mui/icons-material/GppGood";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PolicyIcon from "@mui/icons-material/Policy";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LaunchIcon from "@mui/icons-material/Launch";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import officialRules from "@/config/sir-official-rules.json";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";

const DISCLAIMER_ICONS = [
  <GppGoodIcon key="a" sx={{ fontSize: 20, color: "#16a34a" }} />,
  <WarningAmberIcon key="b" sx={{ fontSize: 20, color: "#d97706" }} />,
  <PolicyIcon key="c" sx={{ fontSize: 20, color: "#2563eb" }} />,
  <AccountBalanceIcon key="d" sx={{ fontSize: 20, color: "#7c3aed" }} />,
];
const DISCLAIMER_STYLES = [
  { bg: "bg-green-50 border-green-200",   textColor: "text-green-800" },
  { bg: "bg-amber-50 border-amber-200",   textColor: "text-amber-800" },
  { bg: "bg-blue-50 border-blue-200",     textColor: "text-blue-800" },
  { bg: "bg-purple-50 border-purple-200", textColor: "text-purple-800" },
];

const DISCLAIMER_POINTS = [
  {
    icon: <GppGoodIcon sx={{ fontSize: 20, color: "#16a34a" }} />,
    text: officialRules.legalDisclaimer.officialSource,
    bg: "bg-green-50 border-green-200",
    textColor: "text-green-800",
  },
  {
    icon: <WarningAmberIcon sx={{ fontSize: 20, color: "#d97706" }} />,
    text: officialRules.legalDisclaimer.secondary,
    bg: "bg-amber-50 border-amber-200",
    textColor: "text-amber-800",
  },
  {
    icon: <PolicyIcon sx={{ fontSize: 20, color: "#2563eb" }} />,
    text: officialRules.legalDisclaimer.notEligibilityDetermination,
    bg: "bg-blue-50 border-blue-200",
    textColor: "text-blue-800",
  },
  {
    icon: <AccountBalanceIcon sx={{ fontSize: 20, color: "#7c3aed" }} />,
    text: officialRules.legalDisclaimer.notAffiliated,
    bg: "bg-purple-50 border-purple-200",
    textColor: "text-purple-800",
  },
];

export default function LegalDisclaimerBanner() {
  const [expanded, setExpanded] = useState(false);

  const dtx = useAutoTranslate({
    heading: "Legal & Compliance Disclaimer",
    primary: officialRules.legalDisclaimer.primary,
    showLess: "Show Less",
    readFull: "Read Full Disclaimer",
    fullLegalNotice: "Full Legal Notice",
    legalNotice: officialRules._meta.legalNotice,
    misinfo: officialRules._meta.misinformationPolicy,
    userAction: officialRules.legalDisclaimer.userAction,
    p0: officialRules.legalDisclaimer.officialSource,
    p1: officialRules.legalDisclaimer.secondary,
    p2: officialRules.legalDisclaimer.notEligibilityDetermination,
    p3: officialRules.legalDisclaimer.notAffiliated,
    link0: "ECI Official Portal",
    link1: "Voter Services Portal",
    link2: "Electoral Roll Search",
  });

  const translatedPoints = DISCLAIMER_POINTS.map((p, i) => ({
    ...p,
    icon: DISCLAIMER_ICONS[i],
    style: DISCLAIMER_STYLES[i],
    text: dtx[`p${i}` as keyof typeof dtx] ?? p.text,
  }));

  return (
    <section className="bg-slate-900 text-white py-12">
      <div className="max-w-5xl mx-auto px-4">

        {/* Main header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <PolicyIcon sx={{ fontSize: 26, color: "#93c5fd" }} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white">{dtx.heading}</h2>
              <p className="text-slate-400 text-sm">{dtx.primary}</p>
            </div>
          </div>
          <button
            onClick={() => setExpanded((p) => !p)}
            className="flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 border border-white/10 text-slate-300 px-4 py-2 rounded-xl transition-colors flex-shrink-0"
          >
            {expanded ? dtx.showLess : dtx.readFull}
            {expanded ? <ExpandLessIcon sx={{ fontSize: 18 }} /> : <ExpandMoreIcon sx={{ fontSize: 18 }} />}
          </button>
        </div>

        {/* Always-visible primary points */}
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          {translatedPoints.slice(0, 2).map((point, i) => (
            <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${point.style.bg}`}>
              <div className="flex-shrink-0 mt-0.5">{point.icon}</div>
              <p className={`text-sm font-medium ${point.style.textColor}`}>{point.text}</p>
            </div>
          ))}
        </div>

        {/* Expandable additional points */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {translatedPoints.slice(2).map((point, i) => (
                  <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${point.style.bg}`}>
                    <div className="flex-shrink-0 mt-0.5">{point.icon}</div>
                    <p className={`text-sm font-medium ${point.style.textColor}`}>{point.text}</p>
                  </div>
                ))}
              </div>

              {/* Full legal text */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">{dtx.fullLegalNotice}</p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {dtx.legalNotice}
                </p>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {dtx.misinfo}
                  </p>
                </div>
              </div>

              {/* Verify action */}
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-2">
                <VerifiedUserIcon sx={{ fontSize: 14, color: "#4ade80" }} />
                {dtx.userAction}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Official links row */}
        <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
          {[
            { label: dtx.link0, url: "https://www.eci.gov.in" },
            { label: dtx.link1, url: "https://voters.eci.gov.in/" },
            { label: dtx.link2, url: "https://electoralsearch.eci.gov.in" },
          ].map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-blue-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-all"
            >
              <VerifiedUserIcon sx={{ fontSize: 12 }} />
              {link.label}
              <LaunchIcon sx={{ fontSize: 11 }} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
