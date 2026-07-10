import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const faqs = [
  {
    q: "How do I report a lost item?",
    a: "Go to the Report page, select 'Lost', fill in the item name, category, description, location, and date. Upload a photo if you have one and submit. Your report goes live instantly and our AI begins scanning for matches.",
  },
  {
    q: "How do I report a found item?",
    a: "Go to the Report page, select 'Found', describe the item accurately, and pin the location where you found it. This helps the rightful owner identify and claim it through our verified claim process.",
  },
  {
    q: "How does AI matching work?",
    a: "Our AI engine analyses the title, description, category, colour, brand, and location of each report. It cross-references lost and found reports and generates a confidence score for each potential match. You're notified instantly when a high-confidence match is found.",
  },
  {
    q: "How long does my report stay active?",
    a: "Reports remain active for 90 days by default. You can manually extend, close, or delete your report at any time from the My Reports page.",
  },
  {
    q: "Can I edit or delete my report?",
    a: "Yes. Go to My Reports, find your submission, and use the edit (pencil) or delete (trash) icon. You can update any field including photos, description, and location.",
  },
  {
    q: "How do I claim an item?",
    a: "Click 'Is This Mine?' on any found item listing. You'll be asked to answer verification questions to prove ownership. The finder reviews your answers and approves or rejects the claim.",
  },
  {
    q: "Is my personal information public?",
    a: "No. Your email, phone number, and Student ID are never shown publicly. They are only shared with the other party after a claim has been officially approved by both sides.",
  },
  {
    q: "Can I upload multiple images?",
    a: "Yes, you can upload up to 4 photos per report. We recommend uploading clear, well-lit images from different angles to maximise match accuracy.",
  },
  {
    q: "What happens after someone claims my item?",
    a: "You'll receive a notification with the claimant's answers to your verification questions. Review them, and if satisfied, approve the claim. You'll then be connected to arrange a safe handover on campus.",
  },
  {
    q: "How do notifications work?",
    a: "Findora sends you in-app notifications when: a new AI match is found for your report, someone submits a claim on your found item, or your claim is approved or rejected by a finder.",
  },
];

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="rounded-2xl overflow-hidden"
      style={{ border: `1px solid ${open ? "#A3E890" : "#E5E7EB"}`, background: open ? "#F0FDF4" : "#fff" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors duration-150">
        <span className="text-[14.5px] font-bold pr-4" style={{ color: "#1A1A1A" }}>{faq.q}</span>
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: open ? "#5BE63A" : "#F3F4F6", color: open ? "#1B3A2F" : "#9CA3AF" }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}>
            <div className="px-6 pb-5">
              <div className="h-px mb-4" style={{ background: "#C9DFC0" }}/>
              <p className="text-[14px] leading-relaxed" style={{ color: "#667085" }}>{faq.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
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
              Got questions?
            </span>
            <h1 className="text-[42px] sm:text-[52px] font-black tracking-tight text-white mb-4">
              Frequently Asked <span style={{ color: "#5BE63A" }}>Questions</span>
            </h1>
            <p className="text-[16px] max-w-xl mx-auto leading-relaxed"
              style={{ color: "rgba(255,255,255,0.6)" }}>
              Everything you need to know about using Findora.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ LIST ──────────────────────────────────── */}
      <section className="max-w-3xl mx-auto w-full px-5 sm:px-8 py-16">
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <FAQItem key={faq.q} faq={faq} index={i}/>
          ))}
        </div>

        {/* Still have questions */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="mt-12 rounded-2xl p-8 text-center"
          style={{ background: "#F8FAF8", border: "1px solid #E5E7EB" }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "#F0FDF4" }}>
            <svg width="22" height="22" fill="none" stroke="#5BE63A" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 className="text-[18px] font-bold mb-2" style={{ color: "#1A1A1A" }}>
            Still have questions?
          </h3>
          <p className="text-[14px] mb-5" style={{ color: "#667085" }}>
            We're here to help. Reach out and we'll get back to you as soon as possible.
          </p>
          <a href="mailto:support@findora.app"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13.5px] font-bold transition-all duration-150"
            style={{ background: "#1B3A2F", color: "#5BE63A" }}>
            Contact Support
          </a>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}