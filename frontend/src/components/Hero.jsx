import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import campusImage2 from "../assets/campus2.png";

export default function Hero() {
  const navigate   = useNavigate();
  const token      = localStorage.getItem("token");
  const isLoggedIn = !!token;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
      <div className="flex flex-col md:flex-row items-center gap-14">

        {/* Left */}
        <motion.div className="flex-1 max-w-xl"
          initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}>

          <motion.span
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.35 }}
            className="inline-flex items-center gap-2 mb-5 text-[12px] font-bold px-3.5 py-1.5 rounded-full"
            style={{ background: "#D4F7C5", color: "#1B3A2F", border: "1px solid #A3E890" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#5BE63A" }} />
            Trusted by 50,000+ Students
          </motion.span>

          <h1 className="text-[40px] sm:text-[52px] font-black leading-[1.1] tracking-tight mb-5"
            style={{ color: "#1A1A1A" }}>
            Lost Something<br />on Campus?{" "}
            <span style={{ color: "#5BE63A" }}>We'll Help<br />You Find It.</span>
          </h1>

          <p className="text-[15px] leading-relaxed mb-8" style={{ color: "#667085" }}>
            The smartest way to recover your lost belongings. Our AI-driven
            platform matches found items with lost reports in seconds,
            bringing your items back home.
          </p>

          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ y: -2, boxShadow: "0 10px 28px rgba(91,230,58,0.35)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(isLoggedIn ? "/report" : "/login")}
              className="inline-flex items-center gap-2 text-[13.5px] font-bold px-6 py-3 rounded-xl"
              style={{ background: "#1B3A2F", color: "#5BE63A", boxShadow: "0 4px 14px rgba(27,58,47,0.22)" }}>
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
              Report Lost Item
            </motion.button>

            <motion.button
              whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate(isLoggedIn ? "/browse" : "/login")}
              className="inline-flex items-center gap-2 text-[13.5px] font-semibold px-6 py-3 rounded-xl transition-all duration-150"
              style={{ border: "1.5px solid #E5E7EB", color: "#1A1A1A", background: "#fff" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#5BE63A"; e.currentTarget.style.color = "#1B3A2F"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#1A1A1A"; }}>
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              Browse Found Items
            </motion.button>
          </div>
        </motion.div>

        {/* Right image */}
        <motion.div className="flex-1 relative w-full max-w-lg"
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}>

          {/* Decorative bg blob */}
          <div className="absolute -inset-4 rounded-3xl opacity-30 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, #D4F7C5 0%, transparent 70%)" }}/>

          <motion.div className="relative rounded-2xl overflow-hidden"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{ boxShadow: "0 24px 60px rgba(27,58,47,0.18)", border: "1px solid #C9DFC0" }}>
            <img
              src={campusImage2}
              alt="Lost items on desk"
              className="w-full h-72 sm:h-96 object-cover"
            />
          </motion.div>

          {/* AI badge overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.4, type: "spring", stiffness: 300 }}
            className="absolute bottom-4 right-4 flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl"
            style={{ background: "#1B3A2F", boxShadow: "0 8px 20px rgba(27,58,47,0.3)" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "#5BE63A" }}>
              <svg width="14" height="14" fill="none" stroke="#1B3A2F" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div>
              <p className="text-[12px] font-bold text-white">92% Match</p>
              <p className="text-[10.5px]" style={{ color: "rgba(255,255,255,0.5)" }}>AI Confidence Score</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}