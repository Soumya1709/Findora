import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateProfile } from "../services/userService";
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "../services/authService";
import NotificationBell from "../components/NotificationBell";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

/* ── SHARED STYLES ──────────────────────────────────── */
const inputCls = `w-full px-4 py-3 text-[13.5px] rounded-xl border bg-[#F8FAF8]
  text-[#1A1A1A] placeholder-gray-400 outline-none transition-all duration-150
  border-[#E5E7EB] hover:border-[#5BE63A]/50 hover:bg-white
  focus:border-[#5BE63A] focus:bg-white focus:ring-4 focus:ring-[#5BE63A]/10`;

const labelCls = `block text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.8px] mb-2`;

const cardCls = `bg-white rounded-2xl overflow-hidden`;
const cardStyle = { border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" };

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

/* ── EYE ICON ───────────────────────────────────────── */
function EyeIcon({ open }) {
  return open ? (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
    </svg>
  ) : (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
    </svg>
  );
}

/* ── PASSWORD STRENGTH ──────────────────────────────── */
function PasswordStrength({ password }) {
  if (!password) return null;
  const hasUpper   = /[A-Z]/.test(password);
  const hasNum     = /[0-9]/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const strength   =
    password.length >= 12 && hasUpper && hasNum && hasSpecial ? 4 :
    password.length >= 8  && hasUpper && hasNum               ? 3 :
    password.length >= 8                                       ? 2 : 1;
  const labels = ["", "Weak", "Medium", "Strong", "Very Strong"];
  const colors = ["", "#EF4444", "#F59E0B", "#5BE63A", "#059669"];
  return (
    <div className="mt-2.5">
      <div className="flex gap-1 mb-1.5">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: n <= strength ? colors[strength] : "#F3F4F6" }}/>
        ))}
      </div>
      <p className="text-[11px] font-semibold" style={{ color: colors[strength] }}>
        {labels[strength]}
      </p>
    </div>
  );
}

/* ── TOGGLE SWITCH ──────────────────────────────────── */
function Toggle({ checked, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer"/>
      <motion.div
        animate={{ background: checked ? "#5BE63A" : "#E5E7EB" }}
        transition={{ duration: 0.2 }}
        className="relative w-14 h-7 rounded-full peer-focus:outline-none">
        <motion.span
          animate={{ x: checked ? 28 : 3 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-md"/>
      </motion.div>
    </label>
  );
}

/* ── CARD SECTION HEADER ────────────────────────────── */
function CardHeader({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: "1px solid #F3F4F6" }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#F0FDF4" }}>
        <span style={{ color: "#5BE63A" }}>{icon}</span>
      </div>
      <div>
        <h2 className="text-[14px] font-bold" style={{ color: "#1A1A1A" }}>{title}</h2>
        {subtitle && <p className="text-[11.5px]" style={{ color: "#9CA3AF" }}>{subtitle}</p>}
      </div>
    </div>
  );
}

/* ── SETTINGS NAV ───────────────────────────────────── */
const SETTINGS_NAV = [
  { label: "Profile",
    icon: <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> },
  { label: "Security",
    icon: <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg> },
  { label: "Privacy",
    icon: <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> },
];


function Topbar({ initials }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 h-16 flex items-center justify-between px-5 sm:px-8"
      style={{ background: "rgba(248,250,248,0.9)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderBottom: "1px solid #E5E7EB" }}>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/dashboard")}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#1B3A2F" }}>
            <svg width="16" height="16" fill="none" stroke="#5BE63A" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <span className="font-black text-[17px] tracking-tight" style={{ color: "#1A1A1A" }}>
            Find<span style={{ color: "#5BE63A" }}>ora</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          {["Browse", "Report"].map((l) => (
            <button key={l}
              onClick={() => { if (l === "Browse") navigate("/browse"); else if (l === "Report") navigate("/report"); }}
              className="px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-150" style={{ color: "#667085" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#F0FDF4"; e.currentTarget.style.color = "#1B3A2F"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#667085"; }}>
              {l}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <motion.button onClick={() => navigate("/settings")} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
          className="relative w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-150" style={{ color: "#667085" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#F0FDF4"; e.currentTarget.style.color = "#1B3A2F"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#667085"; }}>
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </motion.button>
        <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold cursor-pointer"
          style={{ background: "#1B3A2F", color: "#5BE63A", border: "2px solid #E5E7EB", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          {initials}
        </motion.div>
      </div>
    </header>
  );
}


function SecurityTab({ user, onDeleteAccount }) {
  /* Change Password state */
  const [pwForm,    setPwForm]    = useState({ current: "", newPw: "", confirm: "" });
  const [showPw,    setShowPw]    = useState({ current: false, newPw: false, confirm: false });
  const [pwLoading, setPwLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handlePwChange = (field) => (e) => setPwForm((f) => ({ ...f, [field]: e.target.value }));

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!pwForm.current)                               return toast.error("Current password is required.");
    if (!pwForm.newPw)                                 return toast.error("New password is required.");
    if (pwForm.newPw.length < 8)                       return toast.error("New password must be at least 8 characters.");
    if (pwForm.newPw !== pwForm.confirm)               return toast.error("Passwords do not match.");
    setPwLoading(true);
    try {
      // TODO: connect to changePassword API
      await new Promise((r) => setTimeout(r, 900));
      toast.success("Password updated successfully!");
      setPwForm({ current: "", newPw: "", confirm: "" });
    } catch {
      toast.error("Failed to update password. Please try again.");
    } finally {
      setPwLoading(false);
    }
  };

  const pwMatch    = pwForm.confirm.length > 0 && pwForm.newPw === pwForm.confirm;
  const pwMismatch = pwForm.confirm.length > 0 && pwForm.newPw !== pwForm.confirm;

  

  const authMethod = user?.googleId ? "Google Sign-In" : "Email & Password";

const metaRows = [
  {
    label: "Login Method",
    val: authMethod,
    icon: user?.googleId ? (
      <svg width="15" height="15" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ) : (
      <svg width="15" height="15" fill="none" stroke="#5BE63A" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    label: "Member Since",
    val: user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "—",
  },
  {
    label: "Email Address",
    val: user?.email || "—",
  },
  {
    label: "Student ID",
    val: user?.studentId || "Not Added",
  },
];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-5">

      {/* ── CHANGE PASSWORD ──────────────────────────── */}
      <motion.div variants={fadeUp} className={cardCls} style={cardStyle}>
        <CardHeader
          title="Change Password"
          subtitle="Use a strong password you don't use elsewhere"
          icon={<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>}
        />
        <form onSubmit={handlePasswordSubmit} className="p-6 flex flex-col gap-4">
          {/* Current password */}
          <div>
            <label className={labelCls}>Current Password</label>
            <div className="relative">
              <input type={showPw.current ? "text" : "password"}
                value={pwForm.current} onChange={handlePwChange("current")}
                placeholder="Enter current password" className={inputCls + " pr-11"}/>
              <motion.button type="button" whileTap={{ scale: 0.9 }}
                onClick={() => setShowPw((p) => ({ ...p, current: !p.current }))}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-150"
                style={{ color: "#9CA3AF" }}
                onMouseEnter={e => e.currentTarget.style.color = "#1B3A2F"}
                onMouseLeave={e => e.currentTarget.style.color = "#9CA3AF"}>
                <EyeIcon open={showPw.current}/>
              </motion.button>
            </div>
          </div>

          {/* New password */}
          <div>
            <label className={labelCls}>New Password</label>
            <div className="relative">
              <input type={showPw.newPw ? "text" : "password"}
                value={pwForm.newPw} onChange={handlePwChange("newPw")}
                placeholder="Min. 8 characters" className={inputCls + " pr-11"}/>
              <motion.button type="button" whileTap={{ scale: 0.9 }}
                onClick={() => setShowPw((p) => ({ ...p, newPw: !p.newPw }))}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-150"
                style={{ color: "#9CA3AF" }}
                onMouseEnter={e => e.currentTarget.style.color = "#1B3A2F"}
                onMouseLeave={e => e.currentTarget.style.color = "#9CA3AF"}>
                <EyeIcon open={showPw.newPw}/>
              </motion.button>
            </div>
            <PasswordStrength password={pwForm.newPw}/>
          </div>

          {/* Confirm password */}
          <div>
            <label className={labelCls}>Confirm New Password</label>
            <div className="relative">
              <input type={showPw.confirm ? "text" : "password"}
                value={pwForm.confirm} onChange={handlePwChange("confirm")}
                placeholder="Re-enter new password"
                className={inputCls + " pr-11"}
                style={{ borderColor: pwMismatch ? "#EF4444" : pwMatch ? "#5BE63A" : undefined }}/>
              <motion.button type="button" whileTap={{ scale: 0.9 }}
                onClick={() => setShowPw((p) => ({ ...p, confirm: !p.confirm }))}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-150"
                style={{ color: "#9CA3AF" }}
                onMouseEnter={e => e.currentTarget.style.color = "#1B3A2F"}
                onMouseLeave={e => e.currentTarget.style.color = "#9CA3AF"}>
                <EyeIcon open={showPw.confirm}/>
              </motion.button>
            </div>
            {pwMatch && (
              <p className="text-[11px] font-semibold mt-1.5 flex items-center gap-1" style={{ color: "#5BE63A" }}>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2.5}><polyline points="2,6 5,9 10,3"/></svg>
                Passwords match
              </p>
            )}
            {pwMismatch && (
              <p className="text-[11px] font-semibold mt-1.5 flex items-center gap-1" style={{ color: "#EF4444" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Passwords do not match
              </p>
            )}
          </div>

          <motion.button type="submit" disabled={pwLoading}
            whileHover={!pwLoading ? { y: -2, boxShadow: "0 8px 20px rgba(91,230,58,0.28)" } : {}}
            whileTap={!pwLoading ? { scale: 0.97 } : {}}
            className="mt-1 py-3 rounded-xl text-[13.5px] font-bold flex items-center justify-center gap-2 transition-all duration-150"
            style={{
              background: pwLoading ? "#D4F7C5" : "#1B3A2F",
              color: "#5BE63A",
              boxShadow: "0 3px 10px rgba(27,58,47,0.18)",
              cursor: pwLoading ? "not-allowed" : "pointer",
            }}>
            {pwLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Updating…
              </>
            ) : "Update Password"}
          </motion.button>
        </form>
      </motion.div>

      {/* ── ACCOUNT SECURITY INFO ───────────────────── */}
      <motion.div variants={fadeUp} className={cardCls} style={cardStyle}>
        <CardHeader
          title="Account Security"
          subtitle="Your authentication and account details"
          icon={<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>}
        />
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metaRows.map(({ label, val, dot, icon }) => (
            <div key={label} className="p-4 rounded-xl" style={{ background: "#F8FAF8", border: "1px solid #F3F4F6" }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.7px] mb-2" style={{ color: "#9CA3AF" }}>{label}</p>
              <div className="flex items-center gap-2">
                {icon && <span>{icon}</span>}
                {dot  && <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dot }}/>}
                <p className="text-[13px] font-bold" style={{ color: "#1A1A1A" }}>{val}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── DANGER ZONE ─────────────────────────────── */}
      <motion.div variants={fadeUp} className={`${cardCls}`}
        style={{ border: "1px solid #FEE2E2", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: "1px solid #FEE2E2" }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#FEF2F2" }}>
            <svg width="16" height="16" fill="none" stroke="#EF4444" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-[14px] font-bold" style={{ color: "#DC2626" }}>Danger Zone</h2>
            <p className="text-[11.5px]" style={{ color: "#9CA3AF" }}>These actions are permanent and cannot be undone</p>
          </div>
        </div>
        <div className="p-6">
          <div className="rounded-xl p-4 mb-5" style={{ background: "#FEF2F2", border: "1px solid #FEE2E2" }}>
            <p className="text-[13px] font-semibold mb-2" style={{ color: "#DC2626" }}>Delete Account</p>
            <p className="text-[12.5px] leading-relaxed mb-1" style={{ color: "#667085" }}>
              Permanently deletes your account and removes all associated data including:
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {["Reports", "Claims", "Notifications", "Profile Information"].map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-[12px]" style={{ color: "#9CA3AF" }}>
                  <span className="w-1 h-1 rounded-full bg-red-400 inline-block"/>
                  {item}
                </span>
              ))}
            </div>
          </div>
          <motion.button onClick={() => setShowDeleteModal(true)}
            whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
            className="px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150"
            style={{ background: "#FEF2F2", color: "#EF4444", border: "1.5px solid #FECACA" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#EF4444"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#EF4444"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.borderColor = "#FECACA"; }}>
            Delete Account
          </motion.button>
        </div>
      </motion.div>

      {/* ── DELETE CONFIRM MODAL ─────────────────────── */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)" }}
            onClick={() => setShowDeleteModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }} transition={{ duration: 0.22, ease: "easeOut" }}
              className="bg-white rounded-2xl w-full max-w-md overflow-hidden"
              style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.18)", border: "1px solid #FEE2E2" }}
              onClick={e => e.stopPropagation()}>
              {/* Modal header */}
              <div className="px-6 py-5" style={{ background: "#FEF2F2", borderBottom: "1px solid #FEE2E2" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#FEE2E2" }}>
                    <svg width="18" height="18" fill="none" stroke="#EF4444" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold" style={{ color: "#DC2626" }}>Delete Account</h3>
                    <p className="text-[12px]" style={{ color: "#9CA3AF" }}>This action cannot be undone</p>
                  </div>
                </div>
              </div>
              {/* Modal body */}
              <div className="px-6 py-5">
                <p className="text-[14px] leading-relaxed mb-4" style={{ color: "#667085" }}>
                  Deleting your account permanently removes all of the following from Findora:
                </p>
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {["Reports", "Claims", "Notifications", "Profile"].map((item) => (
                    <div key={item} className="flex items-center gap-2 p-2.5 rounded-lg"
                      style={{ background: "#FEF2F2", border: "1px solid #FEE2E2" }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#EF4444" }}/>
                      <span className="text-[12.5px] font-medium" style={{ color: "#DC2626" }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150"
                    style={{ border: "1.5px solid #E5E7EB", color: "#667085", background: "#fff" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#5BE63A"; e.currentTarget.style.color = "#1B3A2F"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#667085"; }}>
                    Cancel
                  </motion.button>
                  <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                    onClick={() => { setShowDeleteModal(false); onDeleteAccount(); }}
                    className="flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-150"
                    style={{ background: "#EF4444", color: "#fff" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#DC2626"}
                    onMouseLeave={e => e.currentTarget.style.background = "#EF4444"}>
                    Delete Account
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


function PrivacyTab({ form, user }) {
  const [notifications, setNotifications] = useState({
    matchAlerts:      true,
    claimUpdates:     true,
    reportStatus:     true,
    productUpdates:   false,
  });
  const [contactPref,     setContactPref]     = useState("in-app");
  const [showPhoneModal,  setShowPhoneModal]  = useState(false);

  const handleContactPref = (val) => {
    if (
    val === "phone" &&
    !/^[6-9]\d{9}$/.test(user?.phoneNumber || "")
) {
    setShowPhoneModal(true);
    return;
}
    setContactPref(val);
  };

  const notifItems = [
    { key: "matchAlerts",    label: "Receive Match Alerts",      desc: "Get notified when AI finds a potential match for your report." },
    { key: "claimUpdates",   label: "Receive Claim Updates",     desc: "Stay informed when someone claims your found item or approves your claim." },
    { key: "reportStatus",   label: "Receive Report Status",     desc: "Updates when your report status changes (active, recovered, archived)." },
    { key: "productUpdates", label: "Receive Product Updates",   desc: "Occasional updates about new Findora features and improvements." },
  ];

  const contactOptions = [
    { value: "email",  label: "Email",
      icon: <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> },
    { value: "phone",  label: "Phone",
      icon: <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg> },
  ];

  const privacyItems = [
    "Your email address is never publicly displayed on any listing.",
    "Phone number is only shared after a claim has been mutually approved.",
    "Only verified users can submit claims on found items.",
    "Findora never sells or shares your personal information with third parties.",
  ];

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-5">

      {/* ── NOTIFICATION PREFERENCES ─────────────────── */}
      <motion.div variants={fadeUp} className={cardCls} style={cardStyle}>
        <CardHeader
          title="Notification Preferences"
          subtitle="Choose which updates you'd like to receive"
          icon={<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>}
        />
        <div className="p-6 flex flex-col gap-4">
          {notifItems.map(({ key, label, desc }) => (
            <motion.div key={key} whileHover={{ x: 2 }}
              className="flex items-start justify-between gap-4 p-4 rounded-xl transition-all duration-150"
              style={{ background: "#F8FAF8", border: "1px solid #F3F4F6" }}>
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold" style={{ color: "#1A1A1A" }}>{label}</p>
                <p className="text-[12px] mt-0.5 leading-relaxed" style={{ color: "#9CA3AF" }}>{desc}</p>
              </div>
              <Toggle checked={notifications[key]}
                onChange={(val) => setNotifications((n) => ({ ...n, [key]: val }))}/>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── CONTACT PREFERENCE ───────────────────────── */}
      <motion.div variants={fadeUp} className={cardCls} style={cardStyle}>
        <CardHeader
          title="Contact Preference"
          subtitle="How would you like others to reach you after a claim?"
          icon={<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/></svg>}
        />
        <div className="p-6">
          <div className="grid grid-cols-2 gap-3">
            {contactOptions.map(({ value, label, icon }) => {
              const active = contactPref === value;
              return (
                <motion.button key={value} type="button"
                  whileHover={{ y: active ? 0 : -2 }} whileTap={{ scale: 0.97 }}
                  onClick={() => handleContactPref(value)}
                  className="flex flex-col items-center gap-2.5 py-4 px-3 rounded-xl transition-all duration-200"
                  style={{
                    background:   active ? "#F0FDF4" : "#F8FAF8",
                    border:       `2px solid ${active ? "#5BE63A" : "#E5E7EB"}`,
                    color:        active ? "#1B3A2F" : "#667085",
                    boxShadow:    active ? "0 4px 12px rgba(91,230,58,0.2)" : "0 1px 3px rgba(0,0,0,0.04)",
                  }}>
                  <span style={{ color: active ? "#5BE63A" : "#9CA3AF" }}>{icon}</span>
                  <span className="text-[12.5px] font-semibold">{label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Phone required modal */}
        <AnimatePresence>
          {showPhoneModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
              onClick={() => setShowPhoneModal(false)}>
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl w-full max-w-sm overflow-hidden"
                style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.15)", border: "1px solid #E5E7EB" }}
                onClick={e => e.stopPropagation()}>
                <div className="px-6 py-4" style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <h3 className="text-[15px] font-bold" style={{ color: "#1A1A1A" }}>Phone Number Required</h3>
                  <p className="text-[12.5px] mt-1" style={{ color: "#9CA3AF" }}>
                    Add your phone number to use this contact method.
                  </p>
                </div>
                <div className="px-6 py-5">
                  <div className="rounded-xl p-4 mb-4" style={{ background: "#F0FDF4", border: "1px solid #A3E890" }}>
                    <p className="text-[13px] leading-relaxed" style={{ color: "#1B3A2F" }}>
                      Go to the <strong>Profile</strong> tab and add your phone number,
                      then come back to select Phone as your contact preference.
                    </p>
                  </div>
                  <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setShowPhoneModal(false)}
                    className="w-full py-2.5 rounded-xl text-[13px] font-bold"
                    style={{ background: "#1B3A2F", color: "#5BE63A" }}>
                    Got it
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── PRIVACY INFO ─────────────────────────────── */}
      <motion.div variants={fadeUp} className={cardCls} style={cardStyle}>
        <CardHeader
          title="Privacy Information"
          subtitle="How Findora protects your personal data"
          icon={<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>}
        />
        <div className="p-6 flex flex-col gap-3">
          {privacyItems.map((text, i) => (
            <motion.div key={i} whileHover={{ x: 2 }}
              className="flex items-start gap-3 p-4 rounded-xl transition-all duration-150"
              style={{ background: "#F8FAF8", border: "1px solid #F3F4F6" }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "#D4F7C5", border: "1.5px solid #A3E890" }}>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#1B3A2F" strokeWidth={2.5}>
                  <polyline points="2,6 5,9 10,3"/>
                </svg>
              </div>
              <p className="text-[13.5px] leading-relaxed" style={{ color: "#1A1A1A" }}>{text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
}


export default function Settings() {
  const navigate  = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "Profile");
  const [form,      setForm]      = useState({ fullName: "", studentId: "", email: "", phone: "" });
  const [saved,     setSaved]     = useState(false);
  

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setForm({
        fullName:  storedUser.fullName    || "",
        studentId: storedUser.studentId   || "",
        email:     storedUser.email       || "",
        phone:     storedUser.phoneNumber || "",
      });
    }
  }, []);

 useEffect(() => {
  if (location.state?.activeTab) {
    setActiveTab(location.state.activeTab);

   
    navigate(location.pathname, {
      replace: true,
      state: null,
    });
  } else {
    setActiveTab("Profile");
  }
}, [location.state, navigate, location.pathname]);

  const handleChange = (field) => (e) => {
  let value = e.target.value;

  if (field === "phone") {
    value = value.replace(/\D/g, ""); // Only digits
    if (value.length > 10) return;    // Max 10 digits
  }

  setForm((f) => ({
    ...f,
    [field]: value,
  }));

  setSaved(false);
};

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile({ fullName: form.fullName, phoneNumber: form.phone, studentId: form.studentId });
        if (
      form.phone &&
      !/^[6-9]\d{9}$/.test(form.phone)
  ) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
  }
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setSaved(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Account deleted successfully.");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account.");
    }
  };

  const initials = form.fullName?.split(" ").map((n) => n[0]).join("").toUpperCase() || "U";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F8FAF8" }}>
      <Topbar initials={initials}/>

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

          {/* ── SIDEBAR ──────────────────────────────── */}
          <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }} className="flex flex-col gap-1">
            <div className="bg-white rounded-2xl p-4 mb-3 flex items-center gap-3"
              style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-[14px] flex-shrink-0"
                style={{ background: "#1B3A2F", color: "#5BE63A" }}>
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold truncate" style={{ color: "#1A1A1A" }}>{form.fullName || "Your Name"}</p>
                <p className="text-[11.5px] truncate" style={{ color: "#9CA3AF" }}>{form.studentId ? `ID: ${form.studentId}` : "Student"}</p>
              </div>
            </div>

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
                    {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-full" style={{ background: "#5BE63A" }}/>}
                    <span style={{ color: isActive ? "#5BE63A" : "#9CA3AF" }}>{item.icon}</span>
                    {item.label}
                    {isActive && (
                      <svg className="ml-auto" width="13" height="13" fill="none" stroke="#5BE63A" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                      </svg>
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="bg-white rounded-2xl p-4 mt-3"
              style={{ border: "1px solid #FEE2E2", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.8px] mb-2.5" style={{ color: "#EF4444" }}>Danger Zone</p>
              <motion.button onClick={() => setActiveTab("Security")} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                className="w-full py-2.5 rounded-xl text-[12.5px] font-semibold transition-all duration-150"
                style={{ background: "#FEF2F2", color: "#EF4444", border: "1.5px solid #FEE2E2" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#EF4444"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.color = "#EF4444"; }}>
                Delete Account
              </motion.button>
            </div>
          </motion.div>

          {/* ── MAIN CONTENT AREA ────────────────────── */}
          <motion.div key={activeTab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: 0.08 }}>

            {/* ── PROFILE TAB (completely unchanged) ── */}
            {activeTab === "Profile" && (
              <>
                <AnimatePresence>
                  {saved && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
                      className="mb-5 flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-semibold"
                      style={{ background: "#F0FDF4", border: "1px solid #A3E890", color: "#1B3A2F" }}>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#5BE63A" }}>
                        <svg width="14" height="14" fill="none" stroke="#1B3A2F" viewBox="0 0 24 24" strokeWidth={2.5}>
                          <circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/>
                        </svg>
                      </div>
                      Your changes have been saved successfully.
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSave}>
                  <div className="bg-white rounded-2xl overflow-hidden mb-5"
                    style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                    <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom: "1px solid #F3F4F6" }}>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#F0FDF4" }}>
                        <svg width="16" height="16" fill="none" stroke="#5BE63A" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-[14px] font-bold" style={{ color: "#1A1A1A" }}>Personal Information</h2>
                        <p className="text-[11.5px]" style={{ color: "#9CA3AF" }}>Update your name, ID, and contact details</p>
                      </div>
                    </div>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelCls}>Full Name</label>
                        <input type="text" value={form.fullName} onChange={handleChange("fullName")} placeholder="Enter your full name" className={inputCls}/>
                      </div>
                      <div>
                        <label className={labelCls}>Student ID</label>
                        <input type="text" value={form.studentId} onChange={handleChange("studentId")} placeholder="e.g. 20231147" className={inputCls}/>
                      </div>
                      <div>
                        <label className={labelCls}>
                          Email Address
                          <span className="ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full normal-case tracking-normal" style={{ background: "#F3F4F6", color: "#9CA3AF" }}>Read-only</span>
                        </label>
                        <div className="relative">
                          <input type="email" value={form.email} disabled placeholder="you@university.edu"
                            className="w-full px-4 py-3 text-[13.5px] rounded-xl border cursor-not-allowed outline-none"
                            style={{ background: "#F3F4F6", borderColor: "#E5E7EB", color: "#9CA3AF" }}/>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <svg width="14" height="14" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                            </svg>
                          </div>
                        </div>
                        <p className="text-[11px] mt-1.5" style={{ color: "#9CA3AF" }}>Contact support to change your email address.</p>
                      </div>
                      <div>
                        <label className={labelCls}>Phone Number</label>
                        <div className="relative">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                            <span className="text-[13px]">🇮🇳</span>
                            <span className="text-[13px]" style={{ color: "#D1D5DB" }}>|</span>
                          </div>
                          <input type="tel" value={form.phone} onChange={handleChange("phone")} placeholder="+91 00000 00000" className={`${inputCls} pl-[52px]`}/>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button type="submit"
                      whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(91,230,58,0.3)" }} whileTap={{ scale: 0.97 }}
                      className="flex-1 py-3 rounded-xl text-[13.5px] font-bold transition-all duration-150"
                      style={{ background: "#1B3A2F", color: "#5BE63A", boxShadow: "0 3px 10px rgba(27,58,47,0.2)" }}>
                      Save Changes
                    </motion.button>
                    <motion.button type="button" whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setForm({ fullName: user.fullName || "", studentId: user.studentId || "", email: user.email || "", phone: user.phoneNumber || "" })}
                      className="px-6 py-3 rounded-xl text-[13.5px] font-semibold transition-all duration-150"
                      style={{ border: "1.5px solid #E5E7EB", color: "#667085", background: "#fff" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#5BE63A"; e.currentTarget.style.color = "#1B3A2F"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#667085"; }}>
                      Cancel
                    </motion.button>
                  </div>
                </form>

                <div className="bg-white rounded-2xl p-5 mt-5" style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <p className="text-[10px] font-bold uppercase tracking-[0.8px] mb-4" style={{ color: "#9CA3AF" }}>Account Overview</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { label: "Account Status", val: "Active", dot: "#5BE63A" },
                      { label: "Role",           val: "Student" },
                      { label: "Member Since",   val: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—" },
                    ].map(({ label, val, dot }) => (
                      <div key={label} className="p-3.5 rounded-xl" style={{ background: "#F8FAF8", border: "1px solid #F3F4F6" }}>
                        <p className="text-[10px] font-bold uppercase tracking-[0.7px] mb-1.5" style={{ color: "#9CA3AF" }}>{label}</p>
                        <div className="flex items-center gap-1.5">
                          {dot && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dot }}/>}
                          <p className="text-[13px] font-bold" style={{ color: "#1A1A1A" }}>{val}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── SECURITY TAB ─────────────────────── */}
            {activeTab === "Security" && (
              <SecurityTab user={user} onDeleteAccount={handleDeleteAccount}/>
            )}

            {/* ── PRIVACY TAB ──────────────────────── */}
            {activeTab === "Privacy" && (
              <PrivacyTab form={form} user={user}/>
            )}
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <span className="font-black text-[15px] tracking-tight text-white">Find<span style={{ color: "#5BE63A" }}>ora</span></span>
            </div>
            <p className="text-[11.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>© 2024 Findora Recovery Systems. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
  {[
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms of Service", path: "/terms" },
    { label: "Support", path: "/support" },
  ].map((item) => (
    <Link
      key={item.label}
      to={item.path}
      className="text-[12px] transition-colors duration-150"
      style={{ color: "rgba(255,255,255,0.4)" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.color = "#5BE63A")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.color = "rgba(255,255,255,0.4)")
      }
    >
      {item.label}
    </Link>
  ))}

  <button
  onClick={() => setActiveTab("Security")}
  className="text-[12px] transition-colors duration-150"
  style={{
    color: "rgba(255,255,255,0.4)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 0,
  }}
  onMouseEnter={(e) =>
    (e.currentTarget.style.color = "#5BE63A")
  }
  onMouseLeave={(e) =>
    (e.currentTarget.style.color = "rgba(255,255,255,0.4)")
  }
>
  Security
</button>
</div>
        </div>
      </footer>
    </div>
  );
}