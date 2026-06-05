"use client";

import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import EditNoteIcon from "@mui/icons-material/EditNote";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import GppGoodIcon from "@mui/icons-material/GppGood";
import ElderlyIcon from "@mui/icons-material/Elderly";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";
import rules from "@/config/sir-rules.json";
import officialRules from "@/config/sir-official-rules.json";

const ACTIONS = [
  {
    step: "01",
    Icon: SearchIcon,
    label: "Check Your Name",
    sub: "Search the official voter list",
    url: "https://electoralsearch.eci.gov.in",
  },
  {
    step: "02",
    Icon: EditNoteIcon,
    label: "Register / Update",
    sub: "New voter or details changed",
    url: "https://voters.eci.gov.in/",
  },
  {
    step: "03",
    Icon: HomeWorkIcon,
    label: "Find Your BLO",
    sub: "Get booth-level assistance",
    url: "https://voters.eci.gov.in/",
  },
];

const FORMS = [
  { code: "Form 6",  desc: "New Registration",     url: "https://voters.eci.gov.in/" },
  { code: "Form 8",  desc: "Correction / Address",  url: "https://voters.eci.gov.in/" },
  { code: "Form 6A", desc: "NRI Voters",            url: "https://voters.eci.gov.in/" },
  { code: "Form 7",  desc: "Deletion / Objection",  url: "https://voters.eci.gov.in/" },
];

const CATEGORIES = [
  {
    code: "A",
    Icon: ElderlyIcon,
    born: "Before 01 July 1987",
    label: "Category A",
    docs: "Identity proof",
  },
  {
    code: "B",
    Icon: PersonIcon,
    born: "01 July 1987 – 02 Dec 2004",
    label: "Category B",
    docs: "Identity + Parent's ID",
  },
  {
    code: "C",
    Icon: SchoolIcon,
    born: "After 02 December 2004",
    label: "Category C",
    docs: "Identity + Both Parents' ID",
  },
];

export default function HeroSectionV2() {
  const tx = useAutoTranslate({
    headline: "Is Your Name in the Voter List?",
    sub: "Complete your voter verification in 3 steps — powered by official Election Commission of India resources.",
    helplineBtn: "Voter Helpline:",
    wizardBtn: "Not sure? Use the Wizard",
    whatIsSirLabel: "What is SIR?",
    whatIsSirHeading: "Special Intensive Revision of Electoral Rolls",
    whatIsSirBody: "SIR is a comprehensive voter roll verification exercise conducted by the Election Commission of India. Booth Level Officers (BLOs) visit every household to verify voter details, add new voters, correct existing entries, and remove outdated records.",
    categoriesLabel: "Citizen Categories",
    categoriesHeading: "Which category applies to you?",
    categoriesLink: "See full details",
    step1Label: "Check Your Name",    step1Sub: "Search the official voter list",
    step2Label: "Register / Update",  step2Sub: "New voter or details changed",
    step3Label: "Find Your BLO",      step3Sub: "Get booth-level assistance",
    feat1: "Door-to-door survey",     feat1d: "BLO visits every household in the assigned booth",
    feat2: "Add your name",           feat2d: "New voters aged 18+ can be enrolled during SIR",
    feat3: "Correct entries",         feat3d: "Fix name spelling, address, or photo errors",
    officialSite: "Go to Official Site",
    catALabel: "Category A",          catABorn: "Before 01 July 1987",    catADocs: "Identity proof",
    catBLabel: "Category B",          catBBorn: "01 July 1987 – 02 Dec 2004", catBDocs: "Identity + Parent's ID",
    catCLabel: "Category C",          catCBorn: "After 02 December 2004", catCDocs: "Identity + Both Parents' ID",
    viewReq: "View requirements",
    legalNote: "Based on Citizenship Act, 1955 — Ministry of Home Affairs. State-specific applicability varies.",
  });

  return (
    <section id="home" aria-label="SIR Verification Portal Hero" className="bg-white">

      {/* India tricolour top accent */}
      <div className="h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" aria-hidden="true" />

      {/* ── HERO HEADLINE BLOCK ─────────────────────────────── */}
      <div className="bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto px-4 pt-16 pb-14">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 border border-slate-700 rounded-full px-5 py-2 text-xs font-semibold text-slate-400 tracking-widest uppercase">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Special Intensive Revision (SIR) — Voter Verification
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-5">
              {tx.headline.split("Voter List?")[0]}
              <span className="text-blue-400">{tx.headline.includes("Voter List?") ? "Voter List?" : ""}</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto">
              {tx.sub}
            </p>
          </motion.div>

          {/* ── 3 STEP CARDS ─────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-4 mb-8"
          >
            {ACTIONS.map((action, i) => (
              <motion.a
                key={action.step}
                href={action.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group flex flex-col p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/60 hover:bg-slate-800/80 transition-all"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                    <action.Icon sx={{ fontSize: 22, color: "#60a5fa" }} />
                  </div>
                  <span className="text-slate-600 font-black text-2xl tabular-nums leading-none">{action.step}</span>
                </div>
                <p className="font-bold text-white text-base mb-1">
                  {action.step === "01" ? tx.step1Label : action.step === "02" ? tx.step2Label : tx.step3Label}
                </p>
                <p className="text-slate-500 text-sm mb-5 flex-1">
                  {action.step === "01" ? tx.step1Sub : action.step === "02" ? tx.step2Sub : tx.step3Sub}
                </p>
                <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold group-hover:gap-3 transition-all">
                  {tx.officialSite} <ArrowForwardIcon sx={{ fontSize: 14 }} />
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
          >
            <a
              href={`tel:${rules._meta.helpline}`}
              className="flex items-center gap-2.5 bg-white text-slate-950 font-bold px-7 py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-sm shadow-lg"
            >
              <PhoneInTalkIcon sx={{ fontSize: 18 }} />
              {tx.helplineBtn} {rules._meta.helpline}
            </a>
            <a
              href="#wizard"
              className="flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold px-7 py-3.5 rounded-xl transition-colors text-sm"
            >
              {tx.wizardBtn}
              <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </a>
          </motion.div>

          {/* Forms pill row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {FORMS.map((f) => (
              <a
                key={f.code}
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-full transition-all"
              >
                <AssignmentIcon sx={{ fontSize: 13, color: "#60a5fa" }} />
                {f.code}
                <span className="text-slate-600">·</span>
                <span className="text-slate-500">{f.desc}</span>
              </a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── WHAT IS SIR ─────────────────────────────────────── */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-14">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-5 gap-10 items-start"
          >
            {/* Left: label + heading */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-widest mb-3">
                <InfoOutlinedIcon sx={{ fontSize: 14 }} />
                {tx.whatIsSirLabel}
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
                {tx.whatIsSirHeading}
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                {tx.whatIsSirBody}
              </p>
              <p className="text-slate-400 text-xs flex items-center gap-1.5">
                <GppGoodIcon sx={{ fontSize: 13, color: "#16a34a" }} />
                Source: {officialRules.voterRegistrationRules[0].sourceDocument}
              </p>
            </div>

            {/* Right: feature list */}
            <div className="md:col-span-3 grid sm:grid-cols-3 gap-4">
              {[
                { icon: "🏠", title: tx.feat1, desc: tx.feat1d },
                { icon: "✅", title: tx.feat2, desc: tx.feat2d },
                { icon: "📋", title: tx.feat3, desc: tx.feat3d },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <span className="text-3xl block mb-3">{item.icon}</span>
                  <p className="font-bold text-slate-900 text-sm mb-1.5">{item.title}</p>
                  <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── CITIZEN CATEGORIES ──────────────────────────────── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-14">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-widest mb-3">
              <VerifiedUserIcon sx={{ fontSize: 14 }} />
              {tx.categoriesLabel}
            </div>
            <div className="flex items-end justify-between">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight max-w-lg">
                {tx.categoriesHeading}
              </h2>
              <a href="#sir-categories" className="hidden sm:flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors">
                {tx.categoriesLink} <ArrowForwardIcon sx={{ fontSize: 16 }} />
              </a>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 mb-5">
            {CATEGORIES.map((cat, i) => (
              <motion.a
                key={cat.code}
                href="#sir-categories"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="group flex flex-col p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                    <cat.Icon sx={{ fontSize: 22, color: "#475569" }} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-200 px-2.5 py-1 rounded-full">
                    {tx[`cat${cat.code}Label` as keyof typeof tx] || cat.label}
                  </span>
                </div>
                <p className="font-bold text-slate-900 text-sm mb-1">{tx[`cat${cat.code}Born` as keyof typeof tx] || cat.born}</p>
                <p className="text-slate-400 text-xs mb-4">{tx[`cat${cat.code}Docs` as keyof typeof tx] || cat.docs}</p>
                <div className="flex items-center gap-1 text-blue-600 text-xs font-semibold group-hover:gap-2 transition-all mt-auto">
                  {tx.viewReq} <ArrowForwardIcon sx={{ fontSize: 13 }} />
                </div>
              </motion.a>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100">
            <p className="flex items-center gap-1.5">
              <GppGoodIcon sx={{ fontSize: 13, color: "#16a34a" }} />
              {tx.legalNote}
            </p>
            <a href="#sir-categories" className="sm:hidden flex items-center gap-1 text-blue-600 font-semibold">
              Full details <ArrowForwardIcon sx={{ fontSize: 13 }} />
            </a>
          </div>
        </div>
      </div>

      {/* Official source strip */}
      <div className="bg-slate-50 border-b border-slate-200 py-3 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <GppGoodIcon sx={{ fontSize: 13, color: "#16a34a" }} />
            {rules._meta.attribution}
          </span>
          <a
            href={rules._meta.officialPortal}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
          >
            {rules._meta.officialPortal}
            <KeyboardArrowDownIcon sx={{ fontSize: 14, transform: "rotate(-90deg)" }} />
          </a>
        </div>
      </div>

    </section>
  );
}
