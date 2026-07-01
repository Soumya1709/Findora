import { motion } from "framer-motion";
const stats = [
  { value: 12400, suffix: "+", label: "Items Recovered" },
  { value: 98, suffix: "%", label: "Success Rate" },
  { value: 50, suffix: "K+", label: "Active Users" },
  { value: 15, suffix: " min", label: "Avg. Match Time" },
];

export default function StatsBar() {
  return (
    <motion.section initial={{ opacity: 0, y: 50 }}whileInView={{ opacity: 1, y: 0 }}viewport={{ once: true }}transition={{ duration: 0.7 }}className="bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map((s, index) => (
            <motion.div key={s.label} className="text-center"initial={{ opacity: 0, y: 40 }}whileInView={{ opacity: 1, y: 0 }}viewport={{ once: true }}transition={{duration: 0.5,delay: index * 0.15,}}
              whileHover={{y: -5,scale: 1.05,}}>
              <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                {s.value}{s.suffix}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-gray-400">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}