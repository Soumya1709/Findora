import { useState } from "react";
import logo from "../assets/findora.png";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();
  const token     = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const navLinks = [
    { label: "Browse Items",    action: () => navigate(isLoggedIn ? "/dashboard" : "/login") },
    { label: "Report Lost",     action: () => navigate(isLoggedIn ? "/report"    : "/login") },
    { label: "Report Found",    action: () => navigate(isLoggedIn ? "/report"    : "/login") },
    { label: "Success Stories", action: () => {} },
  ];
  const user = JSON.parse(localStorage.getItem("user"));

const initials = user?.fullName
  ? user.fullName
      .split(" ")
      .map((name) => name[0])
      .slice(0, 2)
      .join("")
      .toUpperCase()
  : "U";

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50"
      style={{
        background: "rgba(248,250,248,0.9)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid #E5E7EB",
      }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <motion.a href="/" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2.5 no-underline">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#1B3A2F" }}>
              <svg width="16" height="16" fill="none" stroke="#5BE63A" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <span className="font-black text-[17px] tracking-tight" style={{ color: "#1A1A1A" }}>
              Find<span style={{ color: "#5BE63A" }}>ora</span>
            </span>
          </motion.a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <motion.button key={l.label} onClick={l.action}
                whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                className="px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-150"
                style={{ color: "#667085" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#F0FDF4"; e.currentTarget.style.color = "#1B3A2F"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#667085"; }}>
                {l.label}
              </motion.button>
            ))}
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => navigate("/support")}
              className="px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-150"
              style={{ color: "#667085" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#F0FDF4"; e.currentTarget.style.color = "#1B3A2F"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#667085"; }}>
              Support
            </button>

            {isLoggedIn ? (
             <motion.div
               whileHover={{ scale: 1.06 }}
               whileTap={{ scale: 0.94 }}
               className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer font-bold text-sm shadow-md"
               style={{
                 background: "#1B3A2F",
                 color: "#5BE63A",
                 border: "2px solid #E5E7EB",
              }}>
              {initials}
             </motion.div>
            ) : (
              <>
                <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-150"
                  style={{ color: "#667085" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#1B3A2F"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#667085"; }}>
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(91,230,58,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/login")}
                  className="px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-150"
                  style={{ background: "#1B3A2F", color: "#5BE63A", boxShadow: "0 3px 10px rgba(27,58,47,0.2)" }}>
                  Register
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <motion.button whileTap={{ scale: 0.93 }}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl transition-colors duration-150"
            style={{ color: "#667085" }}
            onClick={() => setMenuOpen(!menuOpen)}
            onMouseEnter={e => { e.currentTarget.style.background = "#F0FDF4"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden"
            style={{ borderTop: "1px solid #F3F4F6", background: "#fff" }}>
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((l) => (
                <button key={l.label} onClick={() => { l.action(); setMenuOpen(false); }}
                  className="text-left px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-all duration-150"
                  style={{ color: "#667085" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#F0FDF4"; e.currentTarget.style.color = "#1B3A2F"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#667085"; }}>
                  {l.label}
                </button>
              ))}
              <div className="flex gap-2 pt-3" style={{ borderTop: "1px solid #F3F4F6" }}>
                <button onClick={() => { navigate("/login"); setMenuOpen(false); }}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold"
                  style={{ border: "1.5px solid #E5E7EB", color: "#667085" }}>Login</button>
                <button onClick={() => { navigate("/register"); setMenuOpen(false); }}
                  className="flex-1 py-2.5 rounded-xl text-[13px] font-bold"
                  style={{ background: "#1B3A2F", color: "#5BE63A" }}>Register</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}