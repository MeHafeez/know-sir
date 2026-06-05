/**
 * Collects every UI string that lives outside en.json so we can translate
 * them in a single API call. Values are deduplicated by English text.
 */
import contentData from "@/config/content.json";
import rules from "@/config/sir-rules.json";
import officialRules from "@/config/sir-official-rules.json";

type TreeNode = {
  id: string;
  question?: string;
  yes?: TreeNode;
  no?: TreeNode;
};

const SCENARIO_LABELS: Record<string, { title: string; subtitle: string }> = {
  "scenario.senior.title": { title: "Senior Citizen", subtitle: "Elderly person needing verification" },
  "scenario.newVoter.title": { title: "New Voter", subtitle: "First time registering to vote" },
  "scenario.student.title": { title: "College Student", subtitle: "Studying away from hometown" },
  "scenario.marriedWoman.title": { title: "Married Woman", subtitle: "Name or address change after marriage" },
  "scenario.migrant.title": { title: "Migrant Worker", subtitle: "Working away from home state" },
  "scenario.nri.title": { title: "NRI / Overseas Indian", subtitle: "Indian citizen living abroad" },
  "scenario.pwd.title": { title: "Person with Disability", subtitle: "Needs accessibility support" },
  "scenario.addressChanged.title": { title: "Address Changed", subtitle: "Moved to new residence" },
};

const WIZARD_QUESTION_TEXT: Record<string, string> = {
  "wizard.q1.text": "Are you already registered as a voter?",
  "wizard.q2.text": "Did you find your name in the voter list?",
  "wizard.q3.text": "Are you an Indian citizen living in India?",
  "wizard.q4.text": "Have you moved to a new address recently?",
  "wizard.q5.text": "What seems to be the problem with your entry?",
  "wizard.q6.text": "Where are you currently living?",
  "wizard.q1.yes": "Yes, I am registered",
  "wizard.q1.no": "No, never registered",
  "wizard.q2.found": "Yes, name found ✓",
  "wizard.q2.notFound": "No, not found",
  "wizard.q3.indian": "Indian citizen in India",
  "wizard.q3.nri": "NRI / Overseas Indian",
  "wizard.q4.same": "Same address as before",
  "wizard.q4.movedSame": "Moved — same constituency",
  "wizard.q4.movedDiff": "Moved — different constituency",
  "wizard.q5.detailsWrong": "My details are incorrect",
  "wizard.q5.notEnrolled": "I was never enrolled",
  "wizard.q6.resident": "Living in India",
  "wizard.q6.nri": "Living Abroad (NRI)",
};

const WIZARD_RESULT_TEXT: Record<string, string> = {
  "wizard.result.existingOk.title": "Your voter registration looks good!",
  "wizard.result.existingOk.summary": "Your name appears to be in the electoral roll at your current address. Please verify your details online and download your e-EPIC if needed.",
  "wizard.result.form8Transpose.title": "You need to update your address",
  "wizard.result.form8Transpose.summary": "Since you have moved within the same constituency, you can request transposition via Form 8. Submit it online or through your local BLO.",
  "wizard.result.form6New.title": "You need to register as a voter",
  "wizard.result.form6New.summary": "Fill Form 6 to register at your current address. You can submit it online via the Voter Services Portal or through your local Booth Level Officer (BLO).",
  "wizard.result.form8Correction.title": "You need to correct your details",
  "wizard.result.form8Correction.summary": "Use Form 8 to correct your name, date of birth, or other details in the electoral roll. Submit online or visit your local Electoral Registration Officer (ERO).",
  "wizard.result.nri.title": "Register as an Overseas Indian Voter",
  "wizard.result.nri.summary": "As an NRI, you can register using Form 6A on the Voter Services Portal. You will need a valid Indian passport.",
};

const RESULT_LABELS: Record<string, { title: string; action: string }> = {
  result_existing_ok: { title: "All Good — Verify Details Online", action: "Check Electoral Roll" },
  result_form8_transpose: { title: "Submit Form 8 — Address Transposition", action: "Fill Form 8 Online" },
  result_form6_new: { title: "Register — Fill Form 6", action: "Register Now" },
  result_form8_correction: { title: "Correct Details — Fill Form 8", action: "Fill Form 8 Online" },
  result_nri: { title: "Register as Overseas Voter — Form 6A", action: "Register as NRI Voter" },
};

const HOW_STEPS = [
  { step: "1", title: "ECI Issues Notification", desc: "Official announcement for states/UTs under SIR" },
  { step: "2", title: "BLO Door-to-Door Visits", desc: "Booth Level Officers visit every household" },
  { step: "3", title: "Form Submission", desc: "Online or offline enumeration form submitted" },
  { step: "4", title: "Document Verification", desc: "Identity, address & age proof checked" },
  { step: "5", title: "Draft Rolls Published", desc: "Public can view and file objections" },
  { step: "6", title: "Final Roll Released", desc: "Verified electoral roll published" },
];

function collectQuestions(node: TreeNode, acc: Record<string, string> = {}): Record<string, string> {
  if (node.id && node.question) acc[node.id] = node.question;
  if (node.yes) collectQuestions(node.yes, acc);
  if (node.no) collectQuestions(node.no, acc);
  return acc;
}

function addValues(set: Set<string>, ...values: (string | null | undefined)[]) {
  for (const v of values) {
    if (typeof v === "string" && v.trim()) set.add(v);
  }
}

function addObject(set: Set<string>, obj: Record<string, string>) {
  addValues(set, ...Object.values(obj));
}

/** Returns deduplicated English strings used by useAutoTranslate across the page. */
export function collectPageStringValues(): string[] {
  const values = new Set<string>();

  // HeroSectionV2
  addObject(values, {
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
    step1Label: "Check Your Name",
    step1Sub: "Search the official voter list",
    step2Label: "Register / Update",
    step2Sub: "New voter or details changed",
    step3Label: "Find Your BLO",
    step3Sub: "Get booth-level assistance",
    feat1: "Door-to-door survey",
    feat1d: "BLO visits every household in the assigned booth",
    feat2: "Add your name",
    feat2d: "New voters aged 18+ can be enrolled during SIR",
    feat3: "Correct entries",
    feat3d: "Fix name spelling, address, or photo errors",
    officialSite: "Go to Official Site",
    catALabel: "Category A",
    catABorn: "Before 01 July 1987",
    catADocs: "Identity proof",
    catBLabel: "Category B",
    catBBorn: "01 July 1987 – 02 Dec 2004",
    catBDocs: "Identity + Parent's ID",
    catCLabel: "Category C",
    catCBorn: "After 02 December 2004",
    catCDocs: "Identity + Both Parents' ID",
    viewReq: "View requirements",
    legalNote: "Based on Citizenship Act, 1955 — Ministry of Home Affairs. State-specific applicability varies.",
  });

  // ScenarioCards
  for (const v of Object.values(SCENARIO_LABELS)) {
    addValues(values, v.title, v.subtitle);
  }
  addObject(values, {
    badge: "Real-Life Scenarios",
    heading: "Find Your Situation",
    sub: "Click on the scenario that matches you. Get a personalised step-by-step action plan.",
    tapForSteps: "TAP FOR STEPS",
    yourActionPlan: "Your Action Plan",
    docsNeeded: "Documents Needed",
    formsToFill: "Forms to Fill",
    getHelp: "Get Help",
    close: "Close",
    viewOnline: "Submit Online",
  });

  // SIRWizard
  addObject(values, WIZARD_QUESTION_TEXT);
  addObject(values, WIZARD_RESULT_TEXT);
  addObject(values, {
    badge: "SIR Eligibility & Action Wizard",
    heading: "What do YOU need to do?",
    sub: "Answer 3–4 simple questions. Get your personalised action plan.",
    back: "Back",
    startOver: "Start Over",
    callHelpline: "Call Voter Helpline",
    docsNeeded: "Documents you need",
    formsToFill: "Forms to fill",
    getHelp: "Get Help",
    nextSteps: "Your Action Plan",
  });

  // SIRCategories
  addObject(values, {
    badge: "Citizenship Categories — Official Reference",
    heading: "SIR Citizen Categories",
    sub: "Based on birth date — each category may have different documentary requirements in certain states. Click any category to see official source, applicable documents, and next steps.",
    legalNote: "State-specific applicability: These categories are based on citizenship law. Exact documentary requirements for voter verification vary by state. Always verify with your local ERO or call Voter Helpline 1950.",
    dobQuestion: "What is your Date of Birth category?",
    tapRequirements: "Tap to see requirements & official source",
    category: "Category",
  });
  for (const c of officialRules.citizenCategories) {
    addValues(values, c.title, c.subtitle);
  }

  // FooterV2
  addObject(values, {
    tagline: "An independent public awareness initiative empowering citizens through technology.",
    voterHelpline: "Voter Helpline",
    officialPortals: "Official Portals",
    voterForms: "Voter Forms",
    languages: "Languages",
    langCount: "13 Indian languages supported",
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
  addValues(values, rules._meta.attribution, rules._meta.disclaimer);

  // LegalDisclaimerBanner
  addObject(values, {
    heading: "Legal & Compliance Disclaimer",
    showLess: "Show Less",
    readFull: "Read Full Disclaimer",
    fullLegalNotice: "Full Legal Notice",
    link0: "ECI Official Portal",
    link1: "Voter Services Portal",
    link2: "Electoral Roll Search",
  });
  addValues(
    values,
    officialRules.legalDisclaimer.primary,
    officialRules._meta.legalNotice,
    officialRules._meta.misinformationPolicy,
    officialRules.legalDisclaimer.userAction,
    officialRules.legalDisclaimer.officialSource,
    officialRules.legalDisclaimer.secondary,
    officialRules.legalDisclaimer.notEligibilityDetermination,
    officialRules.legalDisclaimer.notAffiliated,
  );

  // StateWiseInfo
  addObject(values, {
    searchPlaceholder: "Search state...",
    stateUT: "State / Union Territory",
    selectPrompt: "Select a state from the list to view contact details.",
    visitWebsite: "Visit Official Website",
  });

  // StepByStep
  for (const s of contentData.steps) {
    addValues(values, s.title, s.description, s.linkText);
  }

  // RequiredDocuments
  for (const d of contentData.documents) {
    addValues(values, d.name, d.description);
  }
  addValues(values, "All Documents");

  // EmergencyHelp
  for (const c of contentData.emergencyContacts) {
    addValues(values, c.title, c.description);
  }

  // DecisionTree
  addObject(values, {
    badge: "Visual Decision Tree",
    heading: "Follow the Path — Find Your Answer",
    sub: "Click Yes or No to navigate. Each step brings you closer to your personalised guidance.",
    yes: "Yes",
    no: "No",
    back: "Back",
    startOver: "Start Over",
    takeAction: "Take Action",
  });
  for (const v of Object.values(RESULT_LABELS)) {
    addValues(values, v.title, v.action);
  }
  addObject(values, collectQuestions(rules.decisionTree.root as TreeNode));

  // TrustBar
  addObject(values, {
    officialPortal: "Official ECI Portal",
    verifyWithOfficial: "Please verify with official ECI sources for the latest updates.",
  });
  addValues(values, rules._meta.attribution, rules._meta.disclaimer, rules._meta.lastReviewed);

  // ProcessTimeline
  addObject(values, {
    badge: "SIR Process Timeline",
    heading: "How the SIR Process Works",
    sub: "Tap any phase to see what it means for you and what action to take.",
    clickDetails: "Click for details",
    close: "Close",
    yourAction: "Your Action",
    officialLink: "Official Link",
  });
  for (const p of rules.processTimeline) {
    addValues(values, p.phase, p.description, p.citizenAction);
  }

  // FAQSection
  for (const f of contentData.faqs) {
    addValues(values, f.question, f.answer);
  }

  // WhatIsSIR
  addValues(values, "How SIR Works");
  for (const s of HOW_STEPS) {
    addValues(values, s.title, s.desc);
  }

  return [...values];
}

export { WIZARD_QUESTION_TEXT, WIZARD_RESULT_TEXT };
