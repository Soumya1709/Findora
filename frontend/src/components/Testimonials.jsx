import { motion } from "framer-motion";

const testimonials = [
  {
    stars: 5,
    text: "I lost my AirPods in the library during finals week. I reported them here and got a notification just 2 hours later. Life saver!!",
    name: "Sonia Patel",
    role: "Computer Science Student",
    avatar: "SP",
    bg: "#1B3A2F",
    color: "#5BE63A",
  },
  {
    stars: 5,
    text: "The AI matching is actually insane. I uploaded a blurry photo of a found wallet and it matched with a report within minutes. Campus security is much faster now.",
    name: "Mark Johnson",
    role: "Business Student",
    avatar: "MJ",
    bg: "#1B3A2F",
    color: "#5BE63A",
  },
  {
    stars: 5,
    text: "Super easy to use and it feels secure. I found an expensive calculator and was able to find the owner without posting my personal info publicly.",
    name: "Soumya Rao",
    role: "Engineering Student",
    avatar: "SR",
    bg: "#1B3A2F",
    color: "#5BE63A",
  },
];

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5" fill="#F59E0B" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <motion.section
      style={{ background: "#F8FAF8", borderTop: "1px solid #E5E7EB" }}
      className="py-20"
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
      viewport={{ once: true }} transition={{ duration: 0.6 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div className="mb-12"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-2 text-[12px] font-bold px-3.5 py-1.5 rounded-full mb-4"
            style={{ background: "#D4F7C5", color: "#1B3A2F", border: "1px solid #A3E890" }}>
            Student Stories
          </span>
          <h2 className="text-[32px] sm:text-[38px] font-black tracking-tight" style={{ color: "#1A1A1A" }}>
            Real Students, Real Results
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div key={t.name}
              initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(0,0,0,0.08)" }}
              className="bg-white rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden transition-all duration-200"
              style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              {/* Top accent */}
              <div className="absolute top-0 left-6 right-6 h-[2px] rounded-b-full" style={{ background: "#5BE63A" }}/>

              <Stars count={t.stars} />

              <p className="text-[13.5px] leading-relaxed flex-1" style={{ color: "#667085" }}>
                "{t.text}"
              </p>

              <div className="flex items-center gap-3 pt-3.5" style={{ borderTop: "1px solid #F3F4F6" }}>
                <motion.div
                  whileHover={{ scale: 1.08 }} transition={{ duration: 0.2 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                  style={{ background: t.bg, color: t.color }}>
                  {t.avatar}
                </motion.div>
                <div>
                  <p className="text-[13px] font-bold" style={{ color: "#1A1A1A" }}>{t.name}</p>
                  <p className="text-[11.5px]" style={{ color: "#9CA3AF" }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}