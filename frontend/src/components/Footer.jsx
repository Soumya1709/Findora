import { motion } from "framer-motion";
export default function Footer() {
  return (
    <motion.footer className="bg-white border-t border-gray-100"initial={{ opacity: 0, y: 40 }}whileInView={{ opacity: 1, y: 0 }}viewport={{ once: true }}transition={{ duration: 0.8 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Brand */}
          <motion.div  className="max-w-xs"initial={{ opacity: 0, x: -40 }}whileInView={{ opacity: 1, x: 0 }}viewport={{ once: true }}transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 mb-3">
              <motion.div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center"whileHover={{rotate: 15,scale: 1.2,}}transition={{ duration: 0.2 }}>
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </motion.div>
              <span className="font-bold text-gray-900 text-sm">Findora</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Empowering campus recovery through technology.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div className="flex flex-wrap gap-x-12 gap-y-6 text-sm text-gray-500"initial={{ opacity: 0, x: 40 }}whileInView={{ opacity: 1, x: 0 }}viewport={{ once: true }}transition={{ duration: 0.6 }}>
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Platform</span>
              <a href="#" className="hover:text-gray-900 transition-colors">Browse Items</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Report Lost</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Report Found</a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Legal</span>
              <motion.a href="#"whileHover={{x: 5,color: "#2563EB",}}transition={{ duration: 0.2 }}className="transition-colors">Campus Safety</motion.a>
              <motion.a href="#"whileHover={{x: 5,color: "#2563EB",}}transition={{ duration: 0.2 }}className="transition-colors">Privacy Policy</motion.a>
              <motion.a href="#"whileHover={{x: 5,color: "#2563EB",}}transition={{ duration: 0.2 }}className="transition-colors">Terms of Service</motion.a>
              <motion.a href="#"whileHover={{x: 5,color: "#2563EB",}}transition={{ duration: 0.2 }}className="transition-colors">Contact Security</motion.a>
            </div>
          </motion.div>
        </div>

        <motion.div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-400"initial={{ opacity: 0 }}whileInView={{ opacity: 1 }}viewport={{ once: true }}transition={{ delay: 0.4 }}>
          © 2026 Findora. All rights reserved.
        </motion.div>
      </div>
    </motion.footer>
  );
}