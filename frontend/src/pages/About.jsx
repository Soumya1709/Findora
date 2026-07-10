import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const features = [
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    ),
    title: "AI-Powered Matching",
    desc:  "Automatically compares descriptions, categories, colours and locations to surface the most likely matches within seconds.",
    accent: "#5BE63A",
    bg: "#F0FDF4",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    title: "Faster Recovery",
    desc:  "Dramatically reduce the time between losing an item and getting it back — from days to hours.",
    accent: "#F59E0B",
    bg: "#FFFBEB",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
      </svg>
    ),
    title: "Secure Claims",
    desc:  "Multi-step ownership verification ensures every item reaches its rightful owner — no exceptions.",
    accent: "#5BE63A",
    bg: "#F0FDF4",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    title: "Student Friendly",
    desc:  "Designed from scratch for students — simple, fast, and intuitive on any device.",
    accent: "#F59E0B",
    bg: "#FFFBEB",
  },
];

const timeline = [
  { label: "Report Item",           desc: "Describe the item, upload a photo, pin the location." },
  { label: "AI Finds Matches",      desc: "Our engine scans all reports and ranks potential matches by confidence." },
  { label: "Owner Submits Claim",   desc: "The potential owner submits a claim with ownership proof." },
  { label: "Verification",          desc: "The finder verifies the answers before confirming the handover." },
  { label: "Item Recovered",        desc: "Both parties coordinate a safe handover at a campus location." },
];

const stack = [
  "React", "Node.js", "Express", "MongoDB",
  "Tailwind CSS", "Framer Motion", "Cloudinary", "JWT Auth",
];

export default function About() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#fff" }}>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: "#1B3A2F" }}>
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-10 pointer-events-none"
          style={{ background: "#5BE63A" }}/>
        <div className="absolute bottom-0 left-1/4 w-48 h-48 rounded-full opacity-5 pointer-events-none"
          style={{ background: "#5BE63A" }}/>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-20 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }} className="text-center">
            <span className="inline-flex items-center gap-2 text-[12px] font-bold px-3.5 py-1.5 rounded-full mb-5"
              style={{ background: "rgba(91,230,58,0.15)", color: "#5BE63A", border: "1px solid rgba(91,230,58,0.25)" }}>
              Our Story
            </span>
            <h1 className="text-[42px] sm:text-[52px] font-black tracking-tight leading-tight text-white mb-4">
              About <span style={{ color: "#5BE63A" }}>Findora</span>
            </h1>
            <p className="text-[16px] max-w-xl mx-auto leading-relaxed"
              style={{ color: "rgba(255,255,255,0.6)" }}>
              Empowering campuses with AI-powered lost and found technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── MISSION ───────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-16">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div variants={fadeUp}>
            <span className="text-[11px] font-black uppercase tracking-[1.5px] mb-3 block"
              style={{ color: "#5BE63A" }}>Our Mission</span>
            <h2 className="text-[32px] font-black tracking-tight mb-5" style={{ color: "#1A1A1A" }}>
              Built to bring belongings home.
            </h2>
            <p className="text-[15px] leading-relaxed" style={{ color: "#667085" }}>
              Findora was created to simplify the process of recovering lost belongings within
              educational institutions. By combining Artificial Intelligence with an intuitive
              reporting system, Findora helps students reconnect with their belongings faster,
              more securely, and with minimal manual effort.
            </p>
          </motion.div>
          <motion.div variants={fadeUp}
            className="rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: "#F8FAF8", border: "1px solid #E5E7EB" }}>
            {[
              { n: "10,000+", l: "Items Recovered" },
              { n: "98%",     l: "Success Rate" },
              { n: "50K+",    l: "Students Registered" },
              { n: "15 min",  l: "Avg. Match Time" },
            ].map((s) => (
              <div key={s.l} className="flex items-center justify-between py-3"
                style={{ borderBottom: "1px solid #E5E7EB" }}>
                <span className="text-[13.5px] font-medium" style={{ color: "#667085" }}>{s.l}</span>
                <span className="text-[20px] font-black" style={{ color: "#1B3A2F" }}>{s.n}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── WHY FINDORA ───────────────────────────────── */}
      <section style={{ background: "#F8FAF8", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <span className="text-[11px] font-black uppercase tracking-[1.5px] mb-3 block"
              style={{ color: "#5BE63A" }}>Why Findora</span>
            <h2 className="text-[32px] font-black tracking-tight" style={{ color: "#1A1A1A" }}>
              Everything you need to recover your item.
            </h2>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp}
                whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
                className="bg-white rounded-2xl p-6 flex gap-5 transition-all duration-200"
                style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: f.bg, color: f.accent }}>
                  {f.icon}
                </div>
                <div>
                  <h3 className="text-[15px] font-bold mb-1.5" style={{ color: "#1A1A1A" }}>{f.title}</h3>
                  <p className="text-[13.5px] leading-relaxed" style={{ color: "#667085" }}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS TIMELINE ─────────────────────── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-12">
          <span className="text-[11px] font-black uppercase tracking-[1.5px] mb-3 block"
            style={{ color: "#5BE63A" }}>The Process</span>
          <h2 className="text-[32px] font-black tracking-tight" style={{ color: "#1A1A1A" }}>
            How Findora works.
          </h2>
        </motion.div>
        <div className="relative max-w-lg mx-auto">
          <div className="absolute left-5 top-0 bottom-0 w-px" style={{ background: "#E5E7EB" }}/>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="flex flex-col gap-0">
            {timeline.map((t, i) => (
              <motion.div key={t.label} variants={fadeUp}
                className="flex gap-5 pb-10 last:pb-0">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-[13px] z-10 relative"
                    style={{ background: "#1B3A2F", color: "#5BE63A", border: "2px solid #5BE63A" }}>
                    {i + 1}
                  </div>
                </div>
                <div className="pt-2 pb-2">
                  <h3 className="text-[15px] font-bold mb-1" style={{ color: "#1A1A1A" }}>{t.label}</h3>
                  <p className="text-[13.5px] leading-relaxed" style={{ color: "#667085" }}>{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TECH STACK ────────────────────────────────── */}
      <section style={{ background: "#1B3A2F" }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-14 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <span className="text-[11px] font-black uppercase tracking-[1.5px] mb-3 block"
              style={{ color: "#5BE63A" }}>Built With</span>
            <h2 className="text-[28px] font-black tracking-tight text-white mb-8">
              Technology Stack
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {stack.map((t, i) => (
                <motion.span key={t}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  whileHover={{ scale: 1.06 }}
                  className="px-4 py-2 rounded-full text-[13px] font-semibold cursor-default"
                  style={{ background: "rgba(91,230,58,0.12)", color: "#5BE63A", border: "1px solid rgba(91,230,58,0.25)" }}>
                  {t}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── VISION ────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-5 sm:px-8 py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-8 md:p-10 relative overflow-hidden"
          style={{ background: "#F0FDF4", border: "1px solid #A3E890" }}>
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 pointer-events-none"
            style={{ background: "#5BE63A" }}/>
          <span className="text-[11px] font-black uppercase tracking-[1.5px] mb-3 block"
            style={{ color: "#5BE63A" }}>Our Vision</span>
          <h2 className="text-[26px] font-black tracking-tight mb-4" style={{ color: "#1B3A2F" }}>
            A trusted platform for every campus.
          </h2>
          <p className="text-[15px] leading-relaxed max-w-2xl" style={{ color: "#1B3A2F", opacity: 0.75 }}>
            Findora aims to become the go-to campus-wide solution for lost and found management —
            officially integrated with institutional security offices, student portals, and campus
            administration systems. Our goal is to make item recovery effortless, transparent,
            and safe for every student, everywhere.
          </p>
        </motion.div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section style={{ background: "#F8FAF8", borderTop: "1px solid #E5E7EB" }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <h2 className="text-[28px] font-black tracking-tight mb-2" style={{ color: "#1A1A1A" }}>
              Need help recovering an item?
            </h2>
            <p className="text-[14px] mb-7" style={{ color: "#667085" }}>
              Browse what's been found or report something you've lost — it only takes 60 seconds.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <motion.button whileHover={{ y: -2, boxShadow: "0 10px 28px rgba(91,230,58,0.3)" }}
                whileTap={{ scale: 0.97 }} onClick={() => navigate("/browse")}
                className="px-6 py-3 rounded-xl text-[13.5px] font-bold"
                style={{ background: "#1B3A2F", color: "#5BE63A", boxShadow: "0 4px 14px rgba(27,58,47,0.2)" }}>
                Browse Items
              </motion.button>
              <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/report")}
                className="px-6 py-3 rounded-xl text-[13.5px] font-semibold transition-all duration-150"
                style={{ border: "1.5px solid #E5E7EB", color: "#1A1A1A", background: "#fff" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#5BE63A"; e.currentTarget.style.color = "#1B3A2F"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#1A1A1A"; }}>
                Report Lost Item
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}