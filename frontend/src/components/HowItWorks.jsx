import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Submit a Report",
    desc: "Describe your lost item or upload a photo of something you found. Our system analyses the details instantly.",
    accent: "#5BE63A",
    bg: "#F0FDF4",
    iconBg: "#D4F7C5",
    icon: (
      <svg width="22" height="22" fill="none" stroke="#1B3A2F" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>
    ),
  },
  {
    step: "02",
    title: "AI Matches Items",
    desc: "Our matching engine cross-references thousands of reports to find potential matches based on location, time, and visuals.",
    accent: "#F59E0B",
    bg: "#FFFBEB",
    iconBg: "#FEF3C7",
    icon: (
      <svg width="22" height="22" fill="none" stroke="#92400E" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
    ),
  },
  {
    step: "03",
    title: "Get Notified",
    desc: "Once a match is confirmed, we'll notify you instantly. Head to the campus security office to pick up your item.",
    accent: "#5BE63A",
    bg: "#F0FDF4",
    iconBg: "#D4F7C5",
    icon: (
      <svg width="22" height="22" fill="none" stroke="#1B3A2F" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <motion.section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.6 }}>

      <motion.div className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.5 }}>
        <span className="inline-flex items-center gap-2 text-[12px] font-bold px-3.5 py-1.5 rounded-full mb-4"
          style={{ background: "#D4F7C5", color: "#1B3A2F", border: "1px solid #A3E890" }}>
          How it works
        </span>
        <h2 className="text-[32px] sm:text-[38px] font-black tracking-tight leading-tight mb-3"
          style={{ color: "#1A1A1A" }}>
          Getting Your Belongings Back
        </h2>
        <p className="text-[14.5px] max-w-xl mx-auto leading-relaxed" style={{ color: "#667085" }}>
          Our streamlined process connects campus finders and losers in three
          simple steps using advanced recognition technology.
        </p>
      </motion.div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Connector lines */}
        {[0, 1].map((i) => (
          <div key={i}
            className="hidden md:block absolute top-[52px] h-px z-0 pointer-events-none"
            style={{
              left: `calc(${33 * (i + 1)}% - 4%)`,
              width: "16%",
              background: `linear-gradient(to right, ${steps[i].accent}60, ${steps[i + 1].accent}60)`,
            }}/>
        ))}

        {steps.map((s, i) => (
          <motion.div key={s.step}
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}
            whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(0,0,0,0.08)" }}
            className="relative z-10 bg-white rounded-2xl p-7 flex flex-col items-center text-center gap-4 transition-all duration-200"
            style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>

            {/* Top accent line */}
            <div className="absolute top-0 left-10 right-10 h-[2px] rounded-b-full"
              style={{ background: s.accent }}/>

            <motion.div
              whileHover={{ rotate: 6, scale: 1.1 }} transition={{ duration: 0.2 }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: s.iconBg }}>
              {s.icon}
            </motion.div>

            <span className="text-[10px] font-black uppercase tracking-[2px]"
              style={{ color: s.accent }}>
              STEP {s.step}
            </span>
            <h3 className="text-[15px] font-bold" style={{ color: "#1A1A1A" }}>{s.title}</h3>
            <p className="text-[13.5px] leading-relaxed" style={{ color: "#667085" }}>{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}