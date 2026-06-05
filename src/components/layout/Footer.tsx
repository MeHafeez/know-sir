"use client";

import React from "react";
import Link from "next/link";
import { useTranslationFn } from "@/context/TranslationStoreContext";
import { usePathname } from "next/navigation";
import { Vote, Phone, Mail, ExternalLink, Shield, Clock } from "lucide-react";
import contentData from "@/config/content.json";

export default function Footer() {
  const t = useTranslationFn("footer");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  return (
    <footer
      className="bg-slate-900 dark:bg-slate-950 text-slate-300"
      role="contentinfo"
      aria-label="Footer"
    >
      <div className="bg-india-stripe h-1 w-full" aria-hidden="true" />

      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-700 rounded-xl flex items-center justify-center">
                <Vote className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">SIR Verification</div>
                <div className="text-slate-400 text-xs">Help Portal</div>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              {t("disclaimer")}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Shield className="w-3.5 h-3.5 text-success flex-shrink-0" aria-hidden="true" />
              <span>{t("source")}</span>
            </div>
          </div>

          {/* Official Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Official Links
            </h3>
            <ul className="space-y-2.5" role="list">
              {[
                { label: "Election Commission", url: contentData.officialLinks.eciMain },
                { label: "Voter Service Portal", url: contentData.officialLinks.voterPortal },
                { label: "Electoral Search", url: contentData.officialLinks.voterSearch },
                { label: "NVSP Portal", url: contentData.officialLinks.nvsp },
                { label: "Download Forms", url: contentData.officialLinks.downloadForms },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors group"
                  >
                    <ExternalLink className="w-3 h-3 flex-shrink-0 group-hover:text-primary-400" aria-hidden="true" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Helpline */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Voter Helpline
            </h3>
            <div className="space-y-3">
              <a
                href={`tel:${contentData.helpline.national}`}
                className="flex items-center gap-3 bg-success/10 border border-success/30 rounded-xl px-4 py-3 hover:bg-success/20 transition-colors group"
                aria-label={`Call Voter Helpline ${contentData.helpline.national}`}
              >
                <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-success" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-success font-bold text-lg leading-none">{contentData.helpline.national}</div>
                  <div className="text-slate-400 text-xs mt-0.5">National Voter Helpline</div>
                </div>
              </a>
              <a
                href={`mailto:${contentData.helpline.email}`}
                className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors group"
              >
                <Mail className="w-4 h-4 flex-shrink-0 group-hover:text-primary-400" aria-hidden="true" />
                {contentData.helpline.email}
              </a>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                {contentData.helpline.workingHours}
              </div>
            </div>
          </div>

          {/* Languages */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
              Languages
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {contentData.languages.map((lang) => (
                <Link
                  key={lang.code}
                  href={`/${lang.code}`}
                  className="text-sm text-slate-400 hover:text-white transition-colors py-0.5"
                  lang={lang.code}
                >
                  {lang.nativeName}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            {t("copyright")}
          </p>
          <div className="flex items-center gap-4">
            <a
              href={contentData.officialLinks.eciMain}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 hover:text-white transition-colors"
            >
              {t("links.eci")}
            </a>
            <a
              href={contentData.officialLinks.voterPortal}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 hover:text-white transition-colors"
            >
              {t("links.voters")}
            </a>
            <a
              href="#accessibility"
              className="text-xs text-slate-500 hover:text-white transition-colors"
            >
              {t("links.accessibility")}
            </a>
          </div>
        </div>

        {/* Last Updated */}
        <p className="mt-4 text-center text-xs text-slate-600">
          Last updated: {contentData.meta.lastUpdated} · Version {contentData.meta.version}
        </p>
      </div>
    </footer>
  );
}
