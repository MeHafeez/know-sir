"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

import ElderlyIcon from "@mui/icons-material/Elderly";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ArticleIcon from "@mui/icons-material/Article";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LaunchIcon from "@mui/icons-material/Launch";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import GppGoodIcon from "@mui/icons-material/GppGood";

import officialRules from "@/config/sir-official-rules.json";
import SourceBadge from "@/components/ui/SourceBadge";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";

type Category = (typeof officialRules.citizenCategories)[number];

const ICON_MAP: Record<string, React.ReactNode> = {
  Elderly: <ElderlyIcon sx={{ fontSize: 36 }} />,
  Person:  <PersonIcon  sx={{ fontSize: 36 }} />,
  School:  <SchoolIcon  sx={{ fontSize: 36 }} />,
};

const COLOR_CONFIG: Record<string, {
  bg: string; border: string; text: string; badge: string;
  iconBg: string; dot: string; ring: string; hoverBg: string;
  tagBg: string; activeBg: string;
}> = {
  blue: {
    bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-800",
    badge: "bg-blue-100", iconBg: "bg-blue-600", dot: "bg-blue-500",
    ring: "ring-blue-400", hoverBg: "hover:bg-blue-100",
    tagBg: "bg-blue-50 text-blue-700 border-blue-200",
    activeBg: "bg-blue-600",
  },
  green: {
    bg: "bg-emerald-50", border: "border-emerald-300", text: "text-emerald-800",
    badge: "bg-emerald-100", iconBg: "bg-emerald-600", dot: "bg-emerald-500",
    ring: "ring-emerald-400", hoverBg: "hover:bg-emerald-100",
    tagBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    activeBg: "bg-emerald-600",
  },
  purple: {
    bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-800",
    badge: "bg-purple-100", iconBg: "bg-purple-600", dot: "bg-purple-500",
    ring: "ring-purple-400", hoverBg: "hover:bg-purple-100",
    tagBg: "bg-purple-50 text-purple-700 border-purple-200",
    activeBg: "bg-purple-600",
  },
};

function DocRequirementCard({ docKey }: { docKey: string }) {
  const docReqs = officialRules.categoryDocumentRequirements as Record<string, {
    ruleId: string; label: string; source: string; sourceUrl: string;
    sourceDocument: string; lastVerified: string; verified: boolean;
    note: string; examples: string[];
  }>;
  const doc = docReqs[docKey];
  if (!doc) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <ArticleIcon sx={{ fontSize: 18, color: "#6b7280" }} />
          <p className="font-semibold text-gray-900 text-sm">{doc.label}</p>
        </div>
        <SourceBadge
          source={doc.source}
          sourceUrl={doc.sourceUrl}
          sourceDocument={doc.sourceDocument}
          lastVerified={doc.lastVerified}
          verified={doc.verified}
          compact
        />
      </div>
      <p className="text-xs text-gray-500 mb-3 leading-relaxed">{doc.note}</p>
      <div className="flex flex-wrap gap-1.5">
        {doc.examples.slice(0, 4).map((ex) => (
          <span key={ex} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg border border-gray-200">
            {ex}
          </span>
        ))}
        {doc.examples.length > 4 && (
          <span className="text-xs text-gray-400 px-2 py-1">+{doc.examples.length - 4} more</span>
        )}
      </div>
    </div>
  );
}

function CategoryDetailModal({ cat, onClose }: { cat: Category; onClose: () => void }) {
  const c = COLOR_CONFIG[cat.color] || COLOR_CONFIG.blue;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 60, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className={`${c.bg} rounded-t-3xl p-6 border-b ${c.border}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 ${c.iconBg} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                {ICON_MAP[cat.icon]}
              </div>
              <div>
                <span className={`text-xs font-bold uppercase tracking-widest ${c.text} mb-1 block`}>
                  Category {cat.categoryCode}
                </span>
                <h3 className="text-xl font-extrabold text-gray-900">{cat.title}</h3>
                <p className="text-sm text-gray-600 mt-0.5">{cat.subtitle}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center flex-shrink-0">
              <CloseIcon sx={{ fontSize: 18, color: "#6b7280" }} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Source verification */}
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
            <GppGoodIcon sx={{ fontSize: 22, color: "#16a34a", flexShrink: 0, marginTop: "1px" }} />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-green-800 text-sm mb-1">Official Source</p>
              <p className="text-green-700 text-xs mb-2 break-words">{cat.sourceDocument}</p>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <CalendarTodayIcon sx={{ fontSize: 12 }} />
                  Last verified: {cat.lastVerified}
                </span>
                <SourceBadge
                  source={cat.source}
                  sourceUrl={cat.sourceUrl}
                  sourceDocument={cat.sourceDocument}
                  lastVerified={cat.lastVerified}
                  verified={cat.verified}
                  compact
                />
              </div>
            </div>
          </div>

          {/* Relevance */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2 flex items-center gap-2">
              <InfoIcon sx={{ fontSize: 15 }} /> What This Means
            </p>
            <p className="text-sm text-gray-800 leading-relaxed">{cat.relevanceNote}</p>
          </div>

          {/* Applicability note */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-2">
              <WarningAmberIcon sx={{ fontSize: 15 }} /> State/Context Applicability
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{cat.applicabilityNote}</p>
          </div>

          {/* Documents */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <ArticleIcon sx={{ fontSize: 18, color: "#6b7280" }} />
              Possible Document Requirements
            </p>
            <div className="space-y-3">
              {cat.mayRequireDocuments.map((docKey) => (
                <DocRequirementCard key={docKey} docKey={docKey} />
              ))}
            </div>
          </div>

          {/* Warning */}
          {cat.displayWarning && (
            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
              <WarningAmberIcon sx={{ fontSize: 20, color: "#dc2626", flexShrink: 0 }} />
              <p className="text-sm text-red-800">{cat.displayWarning}</p>
            </div>
          )}

          {/* Voter registration note */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Standard Voter Registration</p>
            <p className="text-sm text-gray-700 leading-relaxed">{cat.voterRegistrationNote}</p>
          </div>

          {/* CTAs */}
          <div className="grid sm:grid-cols-2 gap-3">
            <a href="https://voters.eci.gov.in/" target="_blank" rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white ${c.activeBg} hover:opacity-90 transition-opacity`}>
              Go to Voter Portal <LaunchIcon sx={{ fontSize: 16 }} />
            </a>
            <a href={cat.sourceUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-400 transition-colors">
              View Official Source <LaunchIcon sx={{ fontSize: 16 }} />
            </a>
          </div>

          <p className="text-xs text-gray-400 text-center">
            {officialRules._meta.legalNotice.slice(0, 120)}...
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SIRCategories() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const categories = officialRules.citizenCategories as Category[];

  const htx = useAutoTranslate({
    badge: "Citizenship Categories — Official Reference",
    heading: "SIR Citizen Categories",
    sub: "Based on birth date — each category may have different documentary requirements in certain states. Click any category to see official source, applicable documents, and next steps.",
    legalNote: "State-specific applicability: These categories are based on citizenship law. Exact documentary requirements for voter verification vary by state. Always verify with your local ERO or call Voter Helpline 1950.",
    dobQuestion: "What is your Date of Birth category?",
    tapRequirements: "Tap to see requirements & official source",
    category: "Category",
  });

  const catTx = useAutoTranslate(
    Object.fromEntries(categories.flatMap((c) => [
      [`${c.ruleId}.title`, c.title],
      [`${c.ruleId}.subtitle`, c.subtitle],
    ]))
  );

  return (
    <section id="sir-categories" className="py-16 bg-gradient-to-b from-white to-slate-50" ref={ref}>
      <div className="max-w-5xl mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-4"
        >
          <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            <AccountBalanceIcon sx={{ fontSize: 16 }} />
            {htx.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            {htx.heading}
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-3">
            {htx.sub}
          </p>

          {/* Legal notice */}
          <div className="inline-flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-left max-w-2xl">
            <WarningAmberIcon sx={{ fontSize: 18, color: "#d97706", flexShrink: 0, marginTop: "1px" }} />
            <p className="text-xs text-amber-800 leading-relaxed">
              {htx.legalNote}
            </p>
          </div>
        </motion.div>

        {/* Flow */}
        <div className="flex flex-col items-center gap-0 mt-10">

          {/* START node */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg">
              <PersonIcon sx={{ fontSize: 18 }} />
              {htx.dobQuestion}
            </div>
            <div className="flex flex-col items-center my-2">
              <div className="w-0.5 h-8 bg-gray-300" />
              <ArrowDownwardIcon sx={{ fontSize: 20, color: "#9ca3af" }} />
            </div>
          </motion.div>

          {/* Categories grid */}
          <div className="grid md:grid-cols-3 gap-5 w-full">
            {categories.map((cat, i) => {
              const c = COLOR_CONFIG[cat.color] || COLOR_CONFIG.blue;
              return (
                <motion.button
                  key={cat.ruleId}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative flex flex-col p-6 rounded-2xl border-2 ${c.border} ${c.bg} text-left group cursor-pointer hover:shadow-xl transition-all`}
                >
                  {/* Category badge */}
                  <span className={`absolute -top-3 left-5 ${c.iconBg} text-white text-xs font-black px-3 py-1 rounded-full shadow`}>
                    Category {cat.categoryCode}
                  </span>

                  {/* Verified badge */}
                  <div className="absolute top-3 right-3">
                    <VerifiedUserIcon sx={{ fontSize: 18, color: "#16a34a" }} />
                  </div>

                  {/* Icon */}
                  <div className={`w-14 h-14 ${c.iconBg} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-105 transition-transform mt-2`}>
                    {ICON_MAP[cat.icon]}
                  </div>

                  {/* Title */}
                  <h3 className={`font-extrabold text-lg ${c.text} mb-1`}>{catTx[`${cat.ruleId}.title`] ?? cat.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{catTx[`${cat.ruleId}.subtitle`] ?? cat.subtitle}</p>

                  {/* Source line */}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                    <ArticleIcon sx={{ fontSize: 13 }} />
                    <span className="truncate">{cat.sourceDocument.split(" — ")[0]}</span>
                  </div>

                  {/* Document tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {cat.mayRequireDocuments.map((d) => (
                      <span key={d} className={`text-xs px-2 py-1 rounded-lg border ${c.tagBg}`}>
                        {d === "identity" ? "ID Proof" :
                         d === "birthPlace" ? "Birth Proof" :
                         d === "parentsCitizenship" ? "Parent's ID" :
                         d === "bothParentsCitizenship" ? "Both Parents' ID" : d}
                      </span>
                    ))}
                  </div>

                  {/* CTA hint */}
                  <div className={`flex items-center gap-2 text-xs font-semibold ${c.text} mt-auto`}>
                    <CheckCircleIcon sx={{ fontSize: 15 }} />
                    {htx.tapRequirements}
                  </div>

                  {/* Warning dot */}
                  {cat.displayWarning && (
                    <div className="absolute top-3 left-3">
                      <WarningAmberIcon sx={{ fontSize: 16, color: "#d97706" }} />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Connector + NEXT STEP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center mt-4"
          >
            <div className="flex flex-col items-center my-2">
              <div className="w-0.5 h-8 bg-gray-300" />
              <ArrowDownwardIcon sx={{ fontSize: 20, color: "#9ca3af" }} />
            </div>
            <div className="bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg">
              <CheckCircleIcon sx={{ fontSize: 18 }} />
              Register / Verify at voters.eci.gov.in or call 1950
            </div>
          </motion.div>
        </div>

        {/* Legal footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-10 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <GppGoodIcon sx={{ fontSize: 20, color: "#16a34a", flexShrink: 0, marginTop: "2px" }} />
            <div>
              <p className="text-xs font-bold text-gray-700 mb-1">Legal Compliance Notice</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                {officialRules.legalDisclaimer.primary}{" "}
                {officialRules.legalDisclaimer.secondary}{" "}
                <strong>{officialRules.legalDisclaimer.notEligibilityDetermination}</strong>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {activeCategory && (
          <CategoryDetailModal cat={activeCategory} onClose={() => setActiveCategory(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
