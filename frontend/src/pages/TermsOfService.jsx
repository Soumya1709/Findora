import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const sections = [
  {
    title: "Eligibility",
    content: [
      "Findora is intended for use by currently enrolled students, faculty, and staff of educational institutions.",
      "You must be at least 16 years old to create an account.",
      "By registering, you confirm that all information you provide is accurate and up to date.",
    ],
  },
  {
    title: "User Responsibilities",
    content: [
      "You are responsible for maintaining the security of your account credentials.",
      "You must not share your account with any other person.",
      "You agree to use Findora only for legitimate lost and found activities.",
      "All information you submit must be truthful and accurate to the best of your knowledge.",
    ],
  },
  {
    title: "Reporting Guidelines",
    content: [
      "Only report items that are genuinely lost or found — do not create fake or duplicate reports.",
      "Descriptions must be honest and accurate. Misleading descriptions that fraudulently attract claims are prohibited.",
      "You may report up to 10 active items at one time.",
      "Reports must be closed or deleted once an item has been recovered.",
    ],
  },
  {
    title: "Prohibited Activities",
    content: [
      "Using Findora to buy, sell, or trade items — this is not a marketplace.",
      "Submitting false ownership claims or impersonating other users.",
      "Harassing, threatening, or intimidating other users through any platform feature.",
      "Attempting to reverse engineer, scrape, or interfere with the platform's systems.",
      "Uploading offensive, illegal, or inappropriate content of any kind.",
    ],
  },
  {
    title: "Claim Verification",
    content: [
      "Approved claims do not constitute legal proof of ownership — they are a good-faith match facilitated by Findora.",
      "Findora is not responsible for disputes that arise between users after a claim is approved.",
      "Both parties are responsible for conducting handovers safely and in public campus locations.",
    ],
  },
  {
    title: "Account Suspension",
    content: [
      "Findora reserves the right to suspend or permanently ban any account that violates these Terms.",
      "Suspension may occur without prior notice in cases of severe abuse or fraud.",
      "Banned users may not create new accounts to circumvent suspension.",
    ],
  },
  {
    title: "Intellectual Property",
    content: [
      "The Findora name, logo, and all platform code are the intellectual property of the Findora development team.",
      "Content you submit (descriptions, photos) remains yours — you grant Findora a limited licence to display it on the platform.",
      "You may not reproduce, distribute, or commercially exploit any part of Findora without written permission.",
    ],
  },
  {
    title: "Limitation of Liability",
    content: [
      "Findora is provided on an 'as is' basis during the pilot phase with no guarantees of uptime or item recovery.",
      "We are not liable for any loss, damage, or dispute arising from the use of the platform.",
      "In no event shall Findora's liability exceed the amount you paid to use the service (which is currently zero — Findora is free).",
    ],
  },
  {
    title: "Changes to Terms",
    content: [
      "We may update these Terms of Service as the platform evolves.",
      "Significant updates will be communicated via in-app notification.",
      "Continued use of Findora after an update constitutes acceptance of the revised Terms.",
    ],
  },
  {
    title: "Contact",
    content: [
      "For questions about these Terms, contact us at: legal@findora.app",
      "For general support: support@findora.app",
    ],
  },
];

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#fff" }}>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: "#1B3A2F" }}>
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-8 pointer-events-none"
          style={{ background: "#5BE63A" }}/>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-20 relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 text-[12px] font-bold px-3.5 py-1.5 rounded-full mb-5"
              style={{ background: "rgba(91,230,58,0.15)", color: "#5BE63A", border: "1px solid rgba(91,230,58,0.25)" }}>
              Legal
            </span>
            <h1 className="text-[42px] sm:text-[52px] font-black tracking-tight text-white mb-4">
              Terms of <span style={{ color: "#5BE63A" }}>Service</span>
            </h1>
            <p className="text-[15px] max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
              Last updated: June 2026 · Please read before using Findora.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT ───────────────────────────────────── */}
      <section className="max-w-3xl mx-auto w-full px-5 sm:px-8 py-16">
        {/* Intro */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl p-6 mb-10"
          style={{ background: "#F8FAF8", border: "1px solid #E5E7EB" }}>
          <p className="text-[14.5px] leading-relaxed" style={{ color: "#1A1A1A" }}>
            By accessing or using Findora, you agree to be bound by these Terms of Service.
            If you do not agree to these terms, please do not use the platform.
            These terms are written clearly and concisely — we want you to actually read them.
          </p>
        </motion.div>

        <div className="flex flex-col gap-10">
          {sections.map((s, i) => (
            <motion.div key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black flex-shrink-0"
                  style={{ background: "#F0FDF4", color: "#1B3A2F", border: "1px solid #A3E890" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h2 className="text-[18px] font-bold" style={{ color: "#1A1A1A" }}>{s.title}</h2>
              </div>
              <div className="flex flex-col gap-3 pl-11">
                {s.content.map((c, j) => (
                  <div key={j} className="flex items-start gap-3 p-3.5 rounded-xl"
                    style={{ background: "#F8FAF8", border: "1px solid #E5E7EB" }}>
                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: "#5BE63A" }}/>
                    <p className="text-[13.5px] leading-relaxed" style={{ color: "#667085" }}>{c}</p>
                  </div>
                ))}
              </div>
              {i < sections.length - 1 && (
                <div className="mt-8 h-px" style={{ background: "#E5E7EB" }}/>
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 rounded-2xl p-6 text-center"
          style={{ background: "#1B3A2F" }}>
          <p className="text-[13.5px] font-semibold mb-1 text-white">
            Questions about these Terms?
          </p>
          <a href="mailto:legal@findora.app"
            className="text-[13px] font-bold transition-colors duration-150"
            style={{ color: "#5BE63A" }}
            onMouseEnter={e => e.currentTarget.style.color = "#fff"}
            onMouseLeave={e => e.currentTarget.style.color = "#5BE63A"}>
            legal@findora.app
          </a>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}