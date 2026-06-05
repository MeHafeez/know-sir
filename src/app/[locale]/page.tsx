import { getTranslations, setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import FooterV2 from "@/components/layout/FooterV2";
import TrustBar from "@/components/sections/TrustBar";
import HeroSectionV2 from "@/components/sections/HeroSectionV2";
import SIRWizard from "@/components/sections/SIRWizard";
import ScenarioCards from "@/components/sections/ScenarioCards";
import DecisionTree from "@/components/sections/DecisionTree";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import WhatIsSIR from "@/components/sections/WhatIsSIR";
import RequiredDocuments from "@/components/sections/RequiredDocuments";
import OfficialResources from "@/components/sections/OfficialResources";
import FAQSection from "@/components/sections/FAQSection";
import EmergencyHelp from "@/components/sections/EmergencyHelp";
import StateWiseInfo from "@/components/sections/StateWiseInfo";
import AccessibilityPanel from "@/components/AccessibilityPanel";
import AIAssistantV2 from "@/components/AIAssistantV2";
import HallowByteSection from "@/components/sections/HallowByteSection";
import SIRCategories from "@/components/sections/SIRCategories";
import InlineAIChat from "@/components/sections/InlineAIChat";
import LegalDisclaimerBanner from "@/components/sections/LegalDisclaimerBanner";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: locale,
      type: "website",
    },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[100] bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold"
      >
        Skip to main content
      </a>

      <TrustBar />
      <Navbar />

      <main id="main-content" className="flex-1" tabIndex={-1}>
        {/* 1. Hero — immediate action */}
        <HeroSectionV2 />

        {/* 2. Wizard — personalised guidance */}
        <SIRWizard />

        {/* 3. Scenarios — find your situation */}
        <ScenarioCards />

        {/* 3b. Inline AI Chat — centre of page */}
        <InlineAIChat />

        {/* 4. Decision Tree — visual path */}
        <DecisionTree />

        {/* 5. Process Timeline — how SIR works */}
        <ProcessTimeline />

        {/* 6. What is SIR — education */}
        <WhatIsSIR />

        {/* 6b. SIR Citizen Categories — legal */}
        <SIRCategories />

        {/* 7. Documents — what to prepare */}
        <RequiredDocuments />

        {/* 8. Official Resources */}
        <OfficialResources />

        {/* 9. FAQ */}
        <FAQSection />

        {/* 10. Emergency / Helpline */}
        <EmergencyHelp />

        {/* 11. State-wise info */}
        <StateWiseInfo />

        {/* 12. Accessibility controls */}
        <AccessibilityPanel />

        {/* 13. Legal Disclaimer */}
        <LegalDisclaimerBanner />

        {/* 14. HallowByte Initiative */}
        <HallowByteSection />
      </main>

      <FooterV2 />
      <AIAssistantV2 />
    </div>
  );
}
