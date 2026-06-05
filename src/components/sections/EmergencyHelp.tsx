"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslationFn } from "@/context/TranslationStoreContext";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";
import { useInView } from "react-intersection-observer";
import { Phone, PhoneCall, Mail, AlertCircle, MapPin } from "lucide-react";
import contentData from "@/config/content.json";

const iconMap: Record<string, React.ElementType> = {
  phone: Phone,
  "phone-call": PhoneCall,
  mail: Mail,
  "alert-circle": AlertCircle,
};

const colorStyles: Record<string, { card: string; icon: string; btn: string }> = {
  success: {
    card: "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20",
    icon: "bg-success text-white",
    btn: "bg-success hover:bg-green-700 text-white",
  },
  primary: {
    card: "border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20",
    icon: "bg-primary-700 text-white",
    btn: "bg-primary-700 hover:bg-primary-800 text-white",
  },
  secondary: {
    card: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20",
    icon: "bg-secondary text-white",
    btn: "bg-secondary hover:bg-blue-700 text-white",
  },
  warning: {
    card: "border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20",
    icon: "bg-warning text-white",
    btn: "bg-warning hover:bg-yellow-600 text-white",
  },
};

export default function EmergencyHelp() {
  const t = useTranslationFn("emergency");
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  const contactTx = useAutoTranslate(
    Object.fromEntries(contentData.emergencyContacts.flatMap((c) => [
      [`${c.id}.title`, c.title],
      [`${c.id}.desc`, c.description],
    ]))
  );

  return (
    <section id="emergency" className="section-padding bg-slate-50 dark:bg-slate-900" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="section-badge mb-4">{t("badge")}</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">
            {t("title")}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">{t("subtitle")}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {contentData.emergencyContacts.map((contact, i) => {
            const Icon = iconMap[contact.icon] || Phone;
            const styles = colorStyles[contact.color] || colorStyles.primary;
            const isPhone = contact.number.match(/^\d+[-\d]*$/);
            const href = isPhone ? `tel:${contact.number}` : contact.number.includes("@") ? `mailto:${contact.number}` : `https://${contact.number}`;

            return (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className={`card-base p-6 border-2 ${styles.card} flex flex-col`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${styles.icon}`}>
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{contactTx[`${contact.id}.title`] ?? contact.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex-1">{contactTx[`${contact.id}.desc`] ?? contact.description}</p>
                <a
                  href={href}
                  target={isPhone || contact.number.includes("@") ? "_self" : "_blank"}
                  rel={isPhone || contact.number.includes("@") ? undefined : "noopener noreferrer"}
                  className={`flex items-center justify-center gap-2 font-black text-lg py-3 px-4 rounded-xl transition-colors ${styles.btn}`}
                  aria-label={`Contact: ${contact.title} — ${contact.number}`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {contact.number}
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* State directory pointer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 card-base p-6 flex flex-col sm:flex-row items-center gap-5 border-2 border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/20"
        >
          <div className="w-12 h-12 bg-primary-700 rounded-2xl flex items-center justify-center flex-shrink-0">
            <MapPin className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t("stateDirectory")}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{t("stateDesc")}</p>
          </div>
          <a
            href="#state-wise"
            className="flex-shrink-0 btn-primary"
            aria-label="View state-wise contact directory"
          >
            View State Directory →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
