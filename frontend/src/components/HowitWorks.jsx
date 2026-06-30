import { motion } from "framer-motion";
const steps = [
  {
    icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    step: "01",
    title: "Submit a report",
    desc: "Describe your lost item or upload a photo of something you found. Our system analyses the details instantly.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    step: "02",
    title: "AI matches items",
    desc: "Our matching engine cross-references thousands of reports to find potential matches based on location, time, and visuals.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    step: "03",
    title: "Get notified",
    desc: "Once a match is confirmed, we'll notify you instantly. Head to the campus security office to pick up your item.",
  },
];

export default function HowItWorks() {
  return (
    <motion.section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"initial={{ opacity: 0, y: 60 }}whileInView={{ opacity: 1, y: 0 }}viewport={{ once: true }}transition={{ duration: 0.8 }}>
      <motion.div className="text-center mb-12"initial={{ opacity: 0, y: 30 }}whileInView={{ opacity: 1, y: 0 }}viewport={{ once: true }}transition={{ duration: 0.6 }}>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Getting Your Belongings Back</h2>
        <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
          Our streamlined process connects campus finders and losers in three simple steps using
          advanced recognition technology.
        </p>
      </motion.div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Connector lines (desktop) */}
        <div className="hidden md:block absolute top-10 left-[33%] w-[17%] h-px bg-gradient-to-r from-blue-200 to-purple-200 z-0" />
        <div className="hidden md:block absolute top-10 left-[60%] w-[17%] h-px bg-gradient-to-r from-purple-200 to-emerald-200 z-0" />

        {steps.map((s, index) => (
          <motion.div
            key={s.step}
            className="relative z-10 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center gap-4"
              initial={{opacity: 0,y: 60,}}
              whileInView={{opacity: 1,y: 0,}}
              viewport={{once: true,}}
              transition={{duration: 0.6,delay: index * 0.2,}}
              whileHover={{y: -8,scale: 1.03, boxShadow: "0px 20px 40px rgba(0,0,0,0.12)",}}>
            <motion.div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center"
              whileHover={{rotate: 8,scale: 1.15,}}transition={{duration: 0.2,}}>
              {s.icon}
            </motion.div>
            <span className="text-xs font-bold text-gray-300 tracking-widest">STEP {s.step}</span>
            <h3 className="text-base font-bold text-gray-900">{s.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}