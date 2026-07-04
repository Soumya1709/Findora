import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      style={{ background: "#1B3A2F", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.6 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10">

          {/* Brand */}
          <motion.div className="max-w-xs"
            initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#5BE63A" }}>
                <svg width="13" height="13" fill="none" stroke="#1B3A2F" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <span className="font-black text-[16px] tracking-tight text-white">
                Find<span style={{ color: "#5BE63A" }}>ora</span>
              </span>
            </div>
            <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              Empowering campus recovery through technology. Trusted by 20+ universities.
            </p>
            {/* Live badge */}
            <div className="flex items-center gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-bold"
                style={{ background: "rgba(91,230,58,0.15)", color: "#5BE63A", border: "1px solid rgba(91,230,58,0.25)" }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#5BE63A" }}/>
                Community Powered
              </span>
            </div>
          </motion.div>

          {/* Links */}
          <motion.div className="flex flex-wrap gap-x-14 gap-y-8"
            initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}>
            {[
              { heading: "Platform", links: ["Browse Items", "Report Lost", "Report Found"] },
              { heading: "Legal",    links: ["Campus Safety", "Privacy Policy", "Terms of Service", "Contact Security"] },
            ].map((col) => (
              <div key={col.heading} className="flex flex-col gap-2.5">
                <span className="text-[10px] font-black uppercase tracking-[1.4px]"
                  style={{ color: "rgba(255,255,255,0.28)" }}>
                  {col.heading}
                </span>
                {col.links.map((l) => (
                  <motion.a key={l} href="#"
                    whileHover={{ x: 4 }} transition={{ duration: 0.15 }}
                    className="text-[13px] transition-colors duration-150"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#5BE63A"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.45)"}>
                    {l}
                  </motion.a>
                ))}
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px]"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.28)" }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.3 }}>
          <span>© 2026 Findora Recovery Systems. All rights reserved.</span>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Service", "Security"].map((l) => (
              <a key={l} href="#" className="transition-colors duration-150"
                onMouseEnter={e => e.currentTarget.style.color = "#5BE63A"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.28)"}>
                {l}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}



