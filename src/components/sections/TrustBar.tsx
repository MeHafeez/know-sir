"use client";

import GppGoodIcon from "@mui/icons-material/GppGood";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import LaunchIcon from "@mui/icons-material/Launch";
import UpdateIcon from "@mui/icons-material/Update";
import rules from "@/config/sir-rules.json";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";

export default function TrustBar() {
  const tx = useAutoTranslate({
    attribution: rules._meta.attribution,
    disclaimer: rules._meta.disclaimer,
    officialPortal: "Official ECI Portal",
    lastReviewed: rules._meta.lastReviewed,
    verifyWithOfficial: "Please verify with official ECI sources for the latest updates.",
  });

  return (
    <>
      {/* Top trust strip */}
      <div className="bg-blue-900 text-white text-xs py-2 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GppGoodIcon sx={{ fontSize: 14, color: "#4ade80" }} />
            <span>{tx.attribution}</span>
          </div>
          <a
            href={rules._meta.officialPortal}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-300 hover:text-white transition-colors"
          >
            {tx.officialPortal} <LaunchIcon sx={{ fontSize: 12 }} />
          </a>
        </div>
      </div>

      {/* Political neutrality banner */}
      <div className="bg-amber-50 border-b border-amber-200 py-2 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-amber-800 text-xs">
            <WarningAmberIcon sx={{ fontSize: 14 }} />
            <span>{tx.disclaimer}</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-600 text-xs">
            <UpdateIcon sx={{ fontSize: 12 }} />
            <span>{tx.lastReviewed}</span>
          </div>
        </div>
      </div>
    </>
  );
}
