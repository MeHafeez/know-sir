"use client";

import { useState } from "react";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LaunchIcon from "@mui/icons-material/Launch";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArticleIcon from "@mui/icons-material/Article";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { motion, AnimatePresence } from "framer-motion";

interface SourceBadgeProps {
  source: string;
  sourceUrl: string;
  sourceDocument: string;
  lastVerified: string;
  verified?: boolean;
  compact?: boolean;
}

export default function SourceBadge({
  source,
  sourceUrl,
  sourceDocument,
  lastVerified,
  verified = true,
  compact = false,
}: SourceBadgeProps) {
  const [open, setOpen] = useState(false);

  if (!verified) {
    return (
      <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-300 px-2.5 py-1 rounded-full">
        <WarningAmberIcon sx={{ fontSize: 13 }} />
        Not verified from official source
      </span>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold bg-green-50 text-green-700 border border-green-300 rounded-full hover:bg-green-100 hover:border-green-500 transition-all ${compact ? "px-2 py-0.5" : "px-3 py-1.5"}`}
        title="View source citation"
      >
        <VerifiedUserIcon sx={{ fontSize: compact ? 12 : 14 }} />
        {compact ? "Verified" : "✓ Verified — Official ECI Source"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
                    <VerifiedUserIcon sx={{ fontSize: 20, color: "#15803d" }} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Source Verification</p>
                    <p className="text-green-700 text-xs font-semibold">Official ECI Resource</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                  <CloseIcon sx={{ fontSize: 18, color: "#6b7280" }} />
                </button>
              </div>

              {/* Source details */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <ArticleIcon sx={{ fontSize: 18, color: "#3b82f6", marginTop: "2px", flexShrink: 0 }} />
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Source Body</p>
                    <p className="text-sm font-semibold text-gray-900">{source}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <ArticleIcon sx={{ fontSize: 18, color: "#8b5cf6", marginTop: "2px", flexShrink: 0 }} />
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Document</p>
                    <p className="text-sm font-semibold text-gray-900">{sourceDocument}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <CalendarTodayIcon sx={{ fontSize: 18, color: "#059669", marginTop: "2px", flexShrink: 0 }} />
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Last Verified</p>
                    <p className="text-sm font-semibold text-gray-900">{lastVerified}</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                View Official Document
                <LaunchIcon sx={{ fontSize: 16 }} />
              </a>

              <p className="text-xs text-gray-400 text-center mt-3">
                Always verify critical information through official channels.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
