import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateProfile } from "../services/userService";
import { useNavigate } from "react-router-dom";



const inputCls = `w-full px-4 py-3 text-[13.5px] rounded-xl border bg-[#F8FAF8]
  text-[#1A1A1A] placeholder-gray-400 outline-none transition-all duration-150
  border-[#E5E7EB] hover:border-[#5BE63A]/50 hover:bg-white
  focus:border-[#5BE63A] focus:bg-white focus:ring-4 focus:ring-[#5BE63A]/10`;

const labelCls = `block text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.8px] mb-2`;

const SETTINGS_NAV = [
  {
    label: "Profile",
    icon: (
      <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    label: "Notifications",
    icon: (
      <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
  {
    label: "Security",
    icon: (
      <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    label: "Privacy",
    icon: (
      <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
];


function Topbar({ initials }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 h-16 flex items-center justify-between px-5 sm:px-8"
      style={{
        background: "rgba(248,250,248,0.9)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid #E5E7EB",
      }}>
      {/* Logo + nav */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/dashboard")}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#1B3A2F" }}>
            <svg width="16" height="16" fill="none" stroke="#5BE63A" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <span className="font-black text-[17px] tracking-tight" style={{ color: "#1A1A1A" }}>
            Find<span style={{ color: "#5BE63A" }}>ora</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          {["Browse", "Report", "Matching"].map((l) => (
            <button key={l}
              onClick={() => {
                if (l === "Browse") navigate("/browse");
                else if (l === "Report") navigate("/report");
                else navigate("/matching");
              }}
              className="px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-150"
              style={{ color: "#667085" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#F0FDF4"; e.currentTarget.style.color = "#1B3A2F"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#667085"; }}>
              {l}
            </button>
          ))}
        </nav>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {[
          {
            icon: (
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            ),
          },
          {
            active: true,
            icon: (
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ),
          },
        ].map((btn, i) => (
          <motion.button key={i}
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
            className="w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-150"
            style={{ color: btn.active ? "#5BE63A" : "#667085", background: btn.active ? "rgba(91,230,58,0.1)" : "transparent" }}
            onMouseEnter={e => { if (!btn.active) { e.currentTarget.style.background = "#F0FDF4"; e.currentTarget.style.color = "#1B3A2F"; } }}
            onMouseLeave={e => { if (!btn.active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#667085"; } }}>
            {btn.icon}
          </motion.button>
        ))}
        <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold cursor-pointer"
          style={{ background: "#1B3A2F", color: "#5BE63A", border: "2px solid #E5E7EB", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          {initials}
        </motion.div>
      </div>
    </header>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE — all logic UNCHANGED
   ══════════════════════════════════════════════════════ */
export default function Settings() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Profile");
  const [form, setForm] = useState({
    fullName: "",
    studentId: "",
    email: "",
    phone: "",
  });
  const [saved, setSaved] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setForm({
        fullName:  user.fullName    || "",
        studentId: user.studentId   || "",
        email:     user.email       || "",
        phone:     user.phoneNumber || "",
      });
    }
  }, []);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile({
        fullName:    form.fullName,
        phoneNumber: form.phone,
        studentId:   form.studentId,
      });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setSaved(true);
    } catch (error) {
      console.error(error);
    }
  };

  const initials = form.fullName?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F8FAF8" }}>
      <Topbar initials={initials} />

      {/* BREADCRUMB */}
      <div className="max-w-5xl mx-auto w-full px-5 sm:px-8 py-3 flex items-center gap-1.5 text-[12px]"
        style={{ color: "#9CA3AF" }}>
        <button onClick={() => navigate("/dashboard")}
          className="transition-colors duration-150"
          onMouseEnter={e => e.currentTarget.style.color = "#5BE63A"}
          onMouseLeave={e => e.currentTarget.style.color = "#9CA3AF"}>
          Home
        </button>
        <span>›</span>
        <span style={{ color: "#667085" }}>Settings</span>
      </div>

      <div className="max-w-5xl mx-auto w-full px-5 sm:px-8 pb-16 flex-1">

        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }} className="mb-7">
          <h1 className="text-[22px] font-bold tracking-tight" style={{ color: "#1A1A1A" }}>
            Account Settings
          </h1>
          <p className="text-[13.5px] mt-1" style={{ color: "#667085" }}>
            Manage your profile, notifications, and security preferences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">

          {/* ── SETTINGS SIDEBAR ─────────────────────── */}
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="flex flex-col gap-1">
            {/* Profile quick-card */}
            <div className="bg-white rounded-2xl p-4 mb-3 flex items-center gap-3"
              style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-[14px] flex-shrink-0"
                style={{ background: "#1B3A2F", color: "#5BE63A" }}>
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold truncate" style={{ color: "#1A1A1A" }}>
                  {form.fullName || "Your Name"}
                </p>
                <p className="text-[11.5px] truncate" style={{ color: "#9CA3AF" }}>
                  {form.studentId ? `ID: ${form.studentId}` : "Student"}
                </p>
              </div>
            </div>

            {/* Nav items */}
            <div className="bg-white rounded-2xl overflow-hidden"
              style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              {SETTINGS_NAV.map((item, i) => {
                const isActive = activeTab === item.label;
                return (
                  <motion.button key={item.label}
                    onClick={() => setActiveTab(item.label)}
                    whileHover={{ x: isActive ? 0 : 2 }} whileTap={{ scale: 0.98 }}
                    className="relative w-full flex items-center gap-3 px-4 py-3 text-[13.5px] font-medium transition-all duration-150"
                    style={{
                      color:      isActive ? "#1B3A2F" : "#667085",
                      background: isActive ? "#F0FDF4"  : "transparent",
                      borderBottom: i < SETTINGS_NAV.length - 1 ? "1px solid #F3F4F6" : "none",
                    }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "#F8FAF8"; e.currentTarget.style.color = "#1A1A1A"; } }}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#667085"; } }}>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full"
                        style={{ background: "#5BE63A" }} />
                    )}
                    <span style={{ color: isActive ? "#5BE63A" : "#9CA3AF" }}>{item.icon}</span>
                    {item.label}
                    {isActive && (
                      <svg className="ml-auto" width="13" height="13" fill="none" stroke="#5BE63A" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Danger zone */}
            <div className="bg-white rounded-2xl p-4 mt-3"
              style={{ border: "1px solid #FEE2E2", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.8px] mb-2.5" style={{ color: "#EF4444" }}>
                Danger Zone
              </p>
              <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                className="w-full py-2.5 rounded-xl text-[12.5px] font-semibold transition-all duration-150"
                style={{ background: "#FEF2F2", color: "#EF4444", border: "1.5px solid #FEE2E2" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#EF4444"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.color = "#EF4444"; }}>
                Delete Account
              </motion.button>
            </div>
          </motion.div>

          {/* ── MAIN FORM AREA ───────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: 0.1 }}>

            {/* Success banner */}
            <AnimatePresence>
              {saved && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
                  className="mb-5 flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-semibold"
                  style={{ background: "#F0FDF4", border: "1px solid #A3E890", color: "#1B3A2F" }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "#5BE63A" }}>
                    <svg width="14" height="14" fill="none" stroke="#1B3A2F" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  Your changes have been saved successfully.
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form card */}
            <form onSubmit={handleSave}>
              <div className="bg-white rounded-2xl overflow-hidden mb-5"
                style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>

                {/* Card header */}
                <div className="flex items-center gap-3 px-6 py-4"
                  style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "#F0FDF4" }}>
                    <svg width="16" height="16" fill="none" stroke="#5BE63A" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-[14px] font-bold" style={{ color: "#1A1A1A" }}>Personal Information</h2>
                    <p className="text-[11.5px]" style={{ color: "#9CA3AF" }}>Update your name, ID, and contact details</p>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* Full Name */}
                  <div>
                    <label className={labelCls}>Full Name</label>
                    <input type="text" value={form.fullName}
                      onChange={handleChange("fullName")}
                      placeholder="Enter your full name"
                      className={inputCls} />
                  </div>

                  {/* Student ID */}
                  <div>
                    <label className={labelCls}>Student ID</label>
                    <input type="text" value={form.studentId}
                      onChange={handleChange("studentId")}
                      placeholder="e.g. 20231147"
                      className={inputCls} />
                  </div>

                  {/* Email — read-only */}
                  <div>
                    <label className={labelCls}>
                      Email Address
                      <span className="ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full normal-case tracking-normal"
                        style={{ background: "#F3F4F6", color: "#9CA3AF" }}>
                        Read-only
                      </span>
                    </label>
                    <div className="relative">
                      <input type="email" value={form.email} disabled
                        placeholder="you@university.edu"
                        className="w-full px-4 py-3 text-[13.5px] rounded-xl border cursor-not-allowed outline-none"
                        style={{ background: "#F3F4F6", borderColor: "#E5E7EB", color: "#9CA3AF" }} />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg width="14" height="14" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-[11px] mt-1.5" style={{ color: "#9CA3AF" }}>
                      Contact support to change your email address.
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className={labelCls}>Phone Number</label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                        <span className="text-[13px]">🇮🇳</span>
                        <span className="text-[13px]" style={{ color: "#D1D5DB" }}>|</span>
                      </div>
                      <input type="tel" value={form.phone}
                        onChange={handleChange("phone")}
                        placeholder="+91 00000 00000"
                        className={`${inputCls} pl-[52px]`} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <motion.button type="submit"
                  whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(91,230,58,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 py-3 rounded-xl text-[13.5px] font-bold transition-all duration-150"
                  style={{ background: "#1B3A2F", color: "#5BE63A", boxShadow: "0 3px 10px rgba(27,58,47,0.2)" }}>
                  Save Changes
                </motion.button>
                <motion.button type="button"
                  whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setForm({
                    fullName:  user.fullName    || "",
                    studentId: user.studentId   || "",
                    email:     user.email       || "",
                    phone:     user.phoneNumber || "",
                  })}
                  className="px-6 py-3 rounded-xl text-[13.5px] font-semibold transition-all duration-150"
                  style={{ border: "1.5px solid #E5E7EB", color: "#667085", background: "#fff" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#5BE63A"; e.currentTarget.style.color = "#1B3A2F"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#667085"; }}>
                  Cancel
                </motion.button>
              </div>
            </form>

            {/* Account meta card */}
            <div className="bg-white rounded-2xl p-5 mt-5"
              style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.8px] mb-4" style={{ color: "#9CA3AF" }}>
                Account Overview
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: "Account Status", val: "Active", dot: "#5BE63A" },
                  { label: "Role",           val: "Student" },
                  { label: "Member Since",   val: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—" },
                ].map(({ label, val, dot }) => (
                  <div key={label} className="p-3.5 rounded-xl" style={{ background: "#F8FAF8", border: "1px solid #F3F4F6" }}>
                    <p className="text-[10px] font-bold uppercase tracking-[0.7px] mb-1.5" style={{ color: "#9CA3AF" }}>{label}</p>
                    <div className="flex items-center gap-1.5">
                      {dot && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dot }} />}
                      <p className="text-[13px] font-bold" style={{ color: "#1A1A1A" }}>{val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: "#1B3A2F", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "#5BE63A" }}>
                <svg width="13" height="13" fill="none" stroke="#1B3A2F" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="font-black text-[15px] tracking-tight text-white">
                Find<span style={{ color: "#5BE63A" }}>ora</span>
              </span>
            </div>
            <p className="text-[11.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              © 2024 Findora Recovery Systems. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {["Privacy Policy", "Terms of Service", "Security", "Accessibility", "Support"].map((l) => (
              <a key={l} href="#" className="text-[12px] transition-colors duration-150"
                style={{ color: "rgba(255,255,255,0.4)" }}
                onMouseEnter={e => e.currentTarget.style.color = "#5BE63A"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}