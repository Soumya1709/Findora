import { motion } from "framer-motion";

const stats = [
  { value: "12,400+", label: "Items Recovered",  accent: "#5BE63A" },
  { value: "98%",     label: "Success Rate",     accent: "#5BE63A" },
  { value: "50K+",    label: "Active Users",     accent: "#F59E0B" },
  { value: "15 min",  label: "Avg. Match Time",  accent: "#F59E0B" },
];

export default function StatsBar() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.6 }}
      style={{ background: "#1B3A2F", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={s.label} className="text-center"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.1 }}
              whileHover={{ y: -4, scale: 1.04 }}>
              <p className="text-[36px] sm:text-[42px] font-black tracking-tight leading-none"
                style={{ color: s.accent }}>
                {s.value}
              </p>
              <div className="w-8 h-[2px] rounded-full mx-auto mt-2 mb-1.5"
                style={{ background: "rgba(255,255,255,0.15)" }}/>
              <p className="text-[11px] font-bold uppercase tracking-[1.2px]"
                style={{ color: "rgba(255,255,255,0.45)" }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}