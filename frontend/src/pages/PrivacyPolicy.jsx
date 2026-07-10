import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const sections = [
  {
    title: "Information We Collect",
    content: [
      "Account details — full name, college email address, student ID, and phone number provided during registration.",
      "Report content — item titles, descriptions, photographs, category tags, and location data you submit.",
      "Usage data — pages visited, features used, and timestamps of activity within the platform.",
      "Device information — browser type, operating system, and IP address for security monitoring purposes.",
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      "To operate and improve the Findora platform and its AI matching capabilities.",
      "To send you notifications about item matches, claim updates, and platform announcements.",
      "To verify ownership during the claims process.",
      "To detect and prevent fraudulent or abusive activity.",
      "To generate anonymised aggregate statistics for campus reporting (no personal data is shared).",
    ],
  },
  {
    title: "Account Security",
    content: [
      "Passwords are hashed using industry-standard bcrypt encryption — we never store plain text passwords.",
      "All API communications are secured with JWT (JSON Web Tokens) and transmitted over HTTPS.",
      "We recommend using a strong, unique password and never sharing your credentials with others.",
    ],
  },
  {
    title: "Uploaded Images",
    content: [
      "Photos you upload are stored securely on Cloudinary, a GDPR-compliant cloud storage provider.",
      "Images are only used to help identify and match items — they are never sold or shared with third parties.",
      "You can request deletion of your uploaded images at any time by contacting us.",
    ],
  },
  {
    title: "Communication",
    content: [
      "We send in-app notifications for match alerts and claim updates.",
      "We do not currently send marketing emails. You will only receive emails directly relevant to your account activity.",
      "You can manage your notification preferences from the Settings page.",
    ],
  },
  {
    title: "Cookies",
    content: [
      "Findora does not currently use tracking cookies.",
      "Future versions of the platform may introduce session cookies for authentication and preference storage.",
      "We will update this policy and notify users before any cookies are introduced.",
    ],
  },
  {
    title: "Data Protection",
    content: [
      "Your personal details (email, phone, Student ID) are never publicly visible on any item listing.",
      "Contact information is only shared between two parties after a claim has been mutually approved.",
      "We follow responsible data handling practices aligned with GDPR principles.",
    ],
  },
  {
    title: "Your Rights",
    content: [
      "You have the right to access, correct, or delete any personal data we hold about you.",
      "You can delete your account at any time from the Settings page — all associated data will be removed.",
      "To request a copy of your data or raise a privacy concern, contact us at privacy@findora.app.",
    ],
  },
  {
    title: "Policy Updates",
    content: [
      "We may update this Privacy Policy as Findora evolves.",
      "Significant changes will be communicated via in-app notifications.",
      "Continuing to use Findora after an update constitutes your acceptance of the revised policy.",
    ],
  },
  {
    title: "Contact",
    content: [
      "For privacy-related queries, contact us at: privacy@findora.app",
      "For general support, visit our Support page or email: support@findora.app",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#fff" }}>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: "#1B3A2F" }}>
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10 pointer-events-none"
          style={{ background: "#5BE63A" }}/>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-20 relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 text-[12px] font-bold px-3.5 py-1.5 rounded-full mb-5"
              style={{ background: "rgba(91,230,58,0.15)", color: "#5BE63A", border: "1px solid rgba(91,230,58,0.25)" }}>
              Legal
            </span>
            <h1 className="text-[42px] sm:text-[52px] font-black tracking-tight text-white mb-4">
              Privacy <span style={{ color: "#5BE63A" }}>Policy</span>
            </h1>
            <p className="text-[15px] max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.55)" }}>
              Last updated: June 2026 · We keep things simple and transparent.
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
          style={{ background: "#F0FDF4", border: "1px solid #A3E890" }}>
          <p className="text-[14.5px] leading-relaxed" style={{ color: "#1B3A2F" }}>
            At Findora, your privacy matters. This policy explains what information we collect,
            how we use it, and how we protect it. We've written this in plain language so it's
            easy to understand — not buried in legal jargon.
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
                  style={{ background: "#1B3A2F", color: "#5BE63A" }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h2 className="text-[18px] font-bold" style={{ color: "#1A1A1A" }}>{s.title}</h2>
              </div>
              <div className="flex flex-col gap-2.5 pl-11">
                {s.content.map((c, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: "#5BE63A" }}/>
                    <p className="text-[14px] leading-relaxed" style={{ color: "#667085" }}>{c}</p>
                  </div>
                ))}
              </div>
              {i < sections.length - 1 && (
                <div className="mt-8 h-px" style={{ background: "#E5E7EB" }}/>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}