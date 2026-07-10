import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

const guidelines = [
  "Meet only in safe, public campus locations such as library entrances, reception desks, or security offices.",
  "Always verify ownership before handing over any item — ask for Student ID and matching description.",
  "Never exchange money privately for the return of a found item.",
  "Valuable items (laptops, wallets, keys) should be recovered through official campus security procedures.",
  "Report suspicious activity or fraudulent claims immediately via the in-app report feature.",
  "Treat all users with respect — abusive behaviour will result in account suspension.",
];

const tips = [
  {
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
    title: "Improve match accuracy",
    desc:  "Include brand, model, colour, and any unique identifiers like stickers or engravings in your description.",
  },
  {
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
    title: "Take clear photos",
    desc:  "Upload well-lit, close-up photos from multiple angles. Avoid blurry or dark images.",
  },
  {
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>,
    title: "Write better descriptions",
    desc:  "Be specific — mention the exact location, approximate time, and any distinguishing physical features.",
  },
  {
    icon: <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>,
    title: "Select the correct category",
    desc:  "Choosing the right category (Electronics, Bags, Keys, etc.) significantly improves AI matching speed.",
  },
];

const lostSteps = [
  { step: "1", text: "Submit a Lost Report with as much detail as possible." },
  { step: "2", text: "Check your AI Match Alerts regularly — matches are updated in real time." },
  { step: "3", text: "Respond promptly to any claim requests from finders." },
  { step: "4", text: "Contact your institution's official security office if the item is urgent or high-value." },
];

export default function Support() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#fff" }}>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: "#1B3A2F" }}>
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-8 pointer-events-none"
          style={{ background: "#5BE63A" }}/>
        <div className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full opacity-5 pointer-events-none"
          style={{ background: "#5BE63A" }}/>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-20 relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 text-[12px] font-bold px-3.5 py-1.5 rounded-full mb-5"
              style={{ background: "rgba(91,230,58,0.15)", color: "#5BE63A", border: "1px solid rgba(91,230,58,0.25)" }}>
              We've got you covered
            </span>
            <h1 className="text-[42px] sm:text-[52px] font-black tracking-tight text-white mb-4">
              Support &amp; <span style={{ color: "#5BE63A" }}>Safety</span>
            </h1>
            <p className="text-[16px] max-w-xl mx-auto leading-relaxed"
              style={{ color: "rgba(255,255,255,0.6)" }}>
              Helping students recover items safely and responsibly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── SAFETY GUIDELINES ─────────────────────────── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="mb-10">
          <span className="text-[11px] font-black uppercase tracking-[1.5px] mb-3 block"
            style={{ color: "#5BE63A" }}>Campus Safety</span>
          <h2 className="text-[30px] font-black tracking-tight" style={{ color: "#1A1A1A" }}>
            Safety Guidelines
          </h2>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="flex flex-col gap-3">
          {guidelines.map((g, i) => (
            <motion.div key={i} variants={fadeUp}
              whileHover={{ x: 4 }}
              className="flex items-start gap-4 p-4 rounded-2xl transition-all duration-150"
              style={{ background: "#F8FAF8", border: "1px solid #E5E7EB" }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "#D4F7C5", border: "1.5px solid #A3E890" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#1B3A2F" strokeWidth={2.5}>
                  <polyline points="2,6 5,9 10,3"/>
                </svg>
              </div>
              <p className="text-[14px] leading-relaxed" style={{ color: "#1A1A1A" }}>{g}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── IF YOU LOSE AN ITEM ───────────────────────── */}
      <section style={{ background: "#F8FAF8", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="mb-10">
            <span className="text-[11px] font-black uppercase tracking-[1.5px] mb-3 block"
              style={{ color: "#5BE63A" }}>Step by Step</span>
            <h2 className="text-[30px] font-black tracking-tight" style={{ color: "#1A1A1A" }}>
              If you lose an item…
            </h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lostSteps.map((s) => (
              <motion.div key={s.step} variants={fadeUp}
                whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.07)" }}
                className="bg-white p-5 rounded-2xl flex gap-4 transition-all duration-200"
                style={{ border: "1px solid #E5E7EB" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-[14px] flex-shrink-0"
                  style={{ background: "#1B3A2F", color: "#5BE63A" }}>
                  {s.step}
                </div>
                <p className="text-[14px] leading-relaxed pt-1.5" style={{ color: "#1A1A1A" }}>{s.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PILOT NOTICE ──────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-14">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-7 flex gap-5 items-start"
          style={{ background: "#FFFBEB", border: "1.5px solid #FDE68A" }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#FEF3C7" }}>
            <svg width="20" height="20" fill="none" stroke="#F59E0B" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-[15px] font-bold mb-2" style={{ color: "#92400E" }}>
              Pilot Version Notice
            </h3>
            <p className="text-[14px] leading-relaxed" style={{ color: "#92400E", opacity: 0.85 }}>
              Findora is currently operating as a pilot project and is not yet officially affiliated
              with campus security offices. Official campus support information and direct security
              integrations will be added after institutional approval. In the meantime, always refer
              urgent cases to your institution's security office directly.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── SUPPORT TIPS ──────────────────────────────── */}
      <section style={{ background: "#F8FAF8", borderTop: "1px solid #E5E7EB" }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-12">
            <span className="text-[11px] font-black uppercase tracking-[1.5px] mb-3 block"
              style={{ color: "#5BE63A" }}>Pro Tips</span>
            <h2 className="text-[30px] font-black tracking-tight" style={{ color: "#1A1A1A" }}>
              Get better results on Findora.
            </h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {tips.map((t) => (
              <motion.div key={t.title} variants={fadeUp}
                whileHover={{ y: -4, boxShadow: "0 12px 28px rgba(0,0,0,0.08)" }}
                className="bg-white rounded-2xl p-6 flex gap-4 transition-all duration-200"
                style={{ border: "1px solid #E5E7EB" }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#F0FDF4", color: "#1B3A2F" }}>
                  {t.icon}
                </div>
                <div>
                  <h3 className="text-[14.5px] font-bold mb-1.5" style={{ color: "#1A1A1A" }}>{t.title}</h3>
                  <p className="text-[13.5px] leading-relaxed" style={{ color: "#667085" }}>{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}