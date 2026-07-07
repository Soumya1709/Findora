import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getMyItems } from "../services/itemService";
import { getNotifications, markNotificationRead } from "../services/notificationService";




/* ── ANIMATION VARIANTS ───────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const cardHover = {
  rest: { y: 0, scale: 1, boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)" },
  hover: { y: -4, scale: 1.01, boxShadow: "0 10px 30px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06)", transition: { duration: 0.2, ease: "easeOut" } },
};

/* ── ICON: STAT ICONS ─────────────────────────────────── */
const StatIcons = {
  reported: (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
    </svg>
  ),
  recovered: (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
  ),
  alerts: (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
    </svg>
  ),
  rate: (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
    </svg>
  ),
};

/* ── NAV ITEMS ────────────────────────────────────────── */
const navItems = [
  { label: "Dashboard", icon: <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> },
  { label: "My Reports", path: "/my-reports", icon: <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg> },
  { label: "Match Alerts", icon: <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> },
  { label: "Browse Items", path: "/browse", icon: <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg> },
  { label: "Settings", path: "/settings", icon: <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
];

/* ── CONFIDENCE RING ──────────────────────────────────── */
function ConfidenceRing({ value }) {
  const r = 18, circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color = value >= 85 ? "#5BE63A" : value >= 65 ? "#F59E0B" : "#EF4444";
  return (
    <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
      <svg className="absolute inset-0 -rotate-90" width="56" height="56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3"/>
        <motion.circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          strokeLinecap="round"/>
      </svg>
      <span className="text-[11px] font-bold text-white z-10">{value}%</span>
    </div>
  );
}


function Sidebar({ active, setActive, collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 232 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="hidden md:flex flex-col flex-shrink-0 overflow-hidden"
      style={{ background: "#1B3A2F" }}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 border-b px-4 ${collapsed ? "justify-center" : "gap-3"}`}
        style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#5BE63A", boxShadow: "0 4px 12px rgba(91,230,58,0.3)" }}>
          <svg width="16" height="16" fill="none" stroke="#1B3A2F" viewBox="0 0 24 24" strokeWidth={2.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2 }}
              className="font-black text-[17px] tracking-tight text-white select-none">
              Find<span style={{ color: "#5BE63A" }}>ora</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2.5 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const isActive = active === item.label;
          return (
            <motion.button key={item.label}
              onClick={() => { setActive(item.label); item.path && navigate(item.path); }}
              whileHover={{ x: collapsed ? 0 : 3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className={`relative w-full flex items-center rounded-xl transition-colors duration-150 ${
                collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"
              }`}
              style={{
                background: isActive ? "rgba(91,230,58,0.14)" : "transparent",
                color: isActive ? "#5BE63A" : "rgba(255,255,255,0.55)",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; if (!isActive) e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
            >
              {isActive && (
                <motion.span layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[22px] rounded-full"
                  style={{ background: "#5BE63A" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}/>
              )}
              <span className={isActive ? "text-[#5BE63A]" : ""}>{item.icon}</span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex-1 text-left text-[13.5px] font-medium">
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {!collapsed && item.badge && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500 }}
                  className="text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0"
                  style={{ background: "#5BE63A", color: "#1B3A2F" }}>
                  {item.badge}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-2.5 pb-4 space-y-0.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="pt-3"/>
        {[
          { label: "Help Center", color: "rgba(255,255,255,0.55)", icon: <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, onClick: () => {} },
          { label: "Log Out", color: "#f87171", icon: <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>, onClick: handleLogout },
        ].map((btn) => (
          <motion.button key={btn.label} onClick={btn.onClick}
            whileHover={{ x: collapsed ? 0 : 3 }}
            whileTap={{ scale: 0.97 }}
            className={`w-full flex items-center rounded-xl transition-colors duration-150 ${collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5"}`}
            style={{ color: btn.color }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            {btn.icon}
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }} className="text-[13.5px] font-medium">{btn.label}</motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}

        <motion.button onClick={() => setCollapsed(!collapsed)}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl mt-1 transition-colors duration-150 text-[11.5px] font-medium"
          style={{ color: "rgba(255,255,255,0.35)" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}>
          <motion.svg animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}
            width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
          </motion.svg>
          <AnimatePresence>
            {!collapsed && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>Collapse</motion.span>}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
}

/* ══════════════════════════════════════════════════════
   TOPBAR
   ══════════════════════════════════════════════════════ */
function Topbar({ active, search, setSearch }) {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const notifRef = useRef(null);
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const avatarInitials = storedUser?.fullName?.split(" ").map((w) => w[0]).join("").toUpperCase() || "U";

  useEffect(() => {
    (async () => {
      try {
        const res = await getNotifications();
        setNotifications(res.data.notifications.filter((n) => !n.isRead));
      } catch {}
    })();
  }, []);

  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNotificationClick = async (n) => {
    try { await markNotificationRead(n._id); navigate(`/claims/${n.claimId}`); } catch {}
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-40"
      style={{
        background: "rgba(248,250,248,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid #E5E7EB",
      }}>
      <div>
        <h1 className="text-[15px] font-bold leading-tight" style={{ color: "#1A1A1A" }}>{active}</h1>
        <p className="text-[11.5px] mt-0.5" style={{ color: "#667085" }}>Findora · Lost &amp; Found Portal</p>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <motion.div animate={{ width: focused ? 220 : 190 }} transition={{ duration: 0.2 }}
          className="hidden sm:flex items-center gap-2.5 h-[44px] px-4 rounded-xl border transition-all duration-150"
          style={{
            background: "#fff",
            borderColor: focused ? "#5BE63A" : "#E5E7EB",
            boxShadow: focused ? "0 0 0 3px rgba(91,230,58,0.12)" : "0 1px 2px rgba(0,0,0,0.05)",
          }}>
          <svg width="14" height="14" fill="none" stroke="#667085" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            className="bg-transparent text-[12.5px] focus:outline-none w-full"
            style={{ color: "#1A1A1A" }}
            placeholder="Search lost or found items…"/>
        </motion.div>

        {/* Icon Buttons */}
        {[
          {
            key: "bell",
            badge: unreadCount,
            onClick: () => setShowNotifications(!showNotifications),
            icon: (
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
            ),
          },
          {
            key: "settings",
            onClick: () => navigate("/settings"),
            icon: (
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            ),
          },
        ].map((btn) => (
          <div key={btn.key} className="relative" ref={btn.key === "bell" ? notifRef : null}>
            <motion.button onClick={btn.onClick}
              whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              className="relative w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-150"
              style={{ color: "#667085" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#F0FDF4"; e.currentTarget.style.color = "#1B3A2F"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#667085"; }}>
              {btn.icon}
              {btn.badge > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500 }}
                  className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] flex items-center justify-center rounded-full text-[9.5px] font-bold text-white ring-2 ring-white"
                  style={{ background: "#F59E0B" }}>
                  {btn.badge}
                </motion.span>
              )}
            </motion.button>

            {/* Notification Dropdown */}
            {btn.key === "bell" && (
              <AnimatePresence>
                {showNotifications && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.18, ease: "easeOut" }}
                    className="absolute right-0 top-12 w-80 bg-white rounded-2xl z-50 overflow-hidden"
                    style={{ border: "1px solid #E5E7EB", boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.08)" }}>
                    <div className="px-4 py-3.5 font-bold text-[13px]" style={{ color: "#1A1A1A", borderBottom: "1px solid #F3F4F6" }}>
                      Notifications
                    </div>
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-[13px]" style={{ color: "#667085" }}>
                        <svg className="w-8 h-8 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                        </svg>
                        No new notifications
                      </div>
                    ) : (
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.map((n) => (
                          <motion.div key={n._id} onClick={() => handleNotificationClick(n)}
                            whileHover={{ backgroundColor: "#F8FAF8" }}
                            className="px-4 py-3 cursor-pointer flex gap-3"
                            style={{ borderBottom: "1px solid #F3F4F6", background: !n.isRead ? "rgba(91,230,58,0.04)" : "" }}>
                            {!n.isRead && <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#5BE63A" }}/>}
                            <div>
                              <div className="font-semibold text-[12.5px]" style={{ color: "#1A1A1A" }}>{n.title}</div>
                              <div className="text-[11.5px] mt-0.5" style={{ color: "#667085" }}>{n.message}</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        ))}

        {/* Avatar */}
        <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold cursor-pointer"
          style={{
            background: "#1B3A2F",
            color: "#5BE63A",
            border: "2px solid #E5E7EB",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}>
          {avatarInitials}
        </motion.div>
      </div>
    </header>
  );
}

/* ══════════════════════════════════════════════════════
   DASHBOARD CONTENT
   ══════════════════════════════════════════════════════ */
function DashboardContent({ search }) {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  const matchAlerts = [
    { id: 1, item: "Sony XM4 Headphones", confidence: 92, location: "Library", time: "2h ago" },
    { id: 2, item: "Blue Calculus Textbook", confidence: 74, location: "Science Block", time: "1d ago" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const s = localStorage.getItem("user");
    if (s) setUser(JSON.parse(s));

    (async () => {
      try {
        const res = await getMyItems();
        setReports(res.data.items);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [navigate]);

  const avatarInitials = user?.fullName?.split(" ").map((w) => w[0]).join("").toUpperCase() || "U";
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recently";

  const stats = {
    reported: reports.length,
    returned: reports.filter((i) => i.status === "returned").length,
    active: reports.filter((i) => i.status === "active").length,
  };
  const successRate = reports.length > 0 ? Math.round((stats.returned / stats.reported) * 100) : 0;

  const recentReports = reports.slice(0, 3).map((item) => ({
    id: item._id, name: item.title,
    location: item.location?.name || "Unknown",
    date: new Date(item.dateLostOrFound).toLocaleDateString(),
    status: item.type, category: item.category,
    img: item.images?.[0] || "https://placehold.co/80x80",
  }));

  const filteredReports = recentReports.filter(
    (r) => r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase())
  );

  const recentActivity = reports.slice(0, 5).map((item) => ({
    id: item._id, action: "Item Reported", item: item.title,
    time: new Date(item.createdAt).toLocaleDateString(),
  }));

  const statData = [
    { label: "Items Reported", value: stats.reported, icon: StatIcons.reported, accent: "#F59E0B", bg: "#FFFBEB" },
    { label: "Items Returned", value: stats.returned, icon: StatIcons.recovered, accent: "#5BE63A", bg: "#F0FDF4" },
    { label: "Active Alerts", value: stats.active, icon: StatIcons.alerts, accent: "#5BE63A", bg: "#F0FDF4" },
    { label: "Success Rate", value: `${successRate}%`, icon: StatIcons.rate, accent: "#F59E0B", bg: "#FFFBEB" },
  ];

  const statusConfig = {
    found: { bg: "#F0FDF4", text: "#166534", dot: "#5BE63A", ring: "#BBF7D0" },
    lost: { bg: "#FFFBEB", text: "#92400E", dot: "#F59E0B", ring: "#FDE68A" },
    returned: { bg: "#EFF6FF", text: "#1E40AF", dot: "#3B82F6", ring: "#BFDBFE" },
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: "#F8FAF8" }}>

      {/* ── HERO BANNER ─────────────────────────────── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
        className="relative overflow-hidden px-6 sm:px-8 py-7"
        style={{ background: "linear-gradient(135deg, #1B3A2F 0%, #234D3D 100%)" }}>
        {/* Decorative circles */}
        {[
          { size: 180, top: "-40px", right: "-40px", opacity: 0.06 },
          { size: 100, bottom: "-20px", left: "38%", opacity: 0.04 },
          { size: 60, top: "20px", right: "220px", opacity: 0.04 },
        ].map((c, i) => (
          <div key={i} className="absolute rounded-full pointer-events-none"
            style={{ width: c.size, height: c.size, top: c.top, bottom: c.bottom, left: c.left, right: c.right, background: "#5BE63A", opacity: c.opacity }}/>
        ))}

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[2px] mb-2"
              style={{ color: "rgba(91,230,58,0.8)" }}>Dashboard</p>
            <h2 className="text-[26px] font-bold tracking-tight leading-tight text-white">
              Welcome back,{" "}
              <span style={{ color: "#5BE63A" }}>{user?.fullName?.split(" ")[0] || "there"}</span> 👋
            </h2>
            <p className="text-[13px] mt-1.5 font-normal" style={{ color: "rgba(255,255,255,0.55)" }}>
              Here's what's happening with your items today.
            </p>
          </div>
          <motion.button onClick={() => navigate("/report")}
            whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(91,230,58,0.35)" }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2 text-[13px] font-semibold px-5 py-3 rounded-xl self-start sm:self-auto"
            style={{ background: "#5BE63A", color: "#1B3A2F", boxShadow: "0 4px 14px rgba(91,230,58,0.28)" }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            Report New Item
          </motion.button>
        </div>
      </motion.div>

      <div className="p-6 sm:p-8 space-y-6">

        {/* ── STAT CARDS ─────────────────────────────── */}
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statData.map((s) => (
            <motion.div key={s.label} variants={fadeUp}
              whileHover="hover" initial="rest" animate="rest"
              variants={cardHover}
              className="bg-white rounded-2xl p-5 cursor-default"
              style={{ border: "1px solid #E5E7EB", position: "relative", overflow: "hidden" }}>
              <div className="absolute top-0 left-5 right-5 h-[2px] rounded-b-full" style={{ background: s.accent }}/>
              <div className="flex items-start justify-between mb-3 mt-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg, color: s.accent }}>
                  {s.icon}
                </div>
              </div>
              <p className="text-[28px] font-bold tracking-tight" style={{ color: "#1A1A1A" }}>{s.value}</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.7px] mt-1.5" style={{ color: "#667085" }}>{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── MAIN GRID ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Recent Reports */}
          <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.15 }}
            className="lg:col-span-2 bg-white rounded-2xl overflow-hidden"
            style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid #F3F4F6" }}>
              <h3 className="text-[14px] font-bold" style={{ color: "#1A1A1A" }}>My Recent Reports</h3>
              <motion.button whileHover={{ x: 2 }} whileTap={{ scale: 0.96 }}
                onClick={() => navigate("/my-reports")}
                className="flex items-center gap-1 text-[12.5px] font-semibold transition-colors duration-150"
                style={{ color: "#1B3A2F" }}
                onMouseEnter={e => e.currentTarget.style.color = "#5BE63A"}
                onMouseLeave={e => e.currentTarget.style.color = "#1B3A2F"}>
                View All
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </motion.button>
            </div>
            <div>
              {filteredReports.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: "#F3F4F6" }}>
                    <svg className="w-6 h-6" style={{ color: "#9CA3AF" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <p className="text-[13.5px] font-medium" style={{ color: "#667085" }}>No reports yet</p>
                  <p className="text-[12px] mt-1" style={{ color: "#9CA3AF" }}>Your recent reports will appear here.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredReports.map((report, i) => {
                    const sc = statusConfig[report.status] || statusConfig.lost;
                    return (
                      <motion.div key={report.id}
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="flex items-center gap-4 px-6 py-4 transition-colors duration-150"
                        style={{ borderTop: i > 0 ? "1px solid #F3F4F6" : "" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                        onMouseLeave={e => e.currentTarget.style.background = ""}>
                        <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0"
                          style={{ background: "#F8FAF8", border: "1px solid #E5E7EB" }}>
                          <img src={report.img} alt={report.name} className="w-full h-full object-cover"/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13.5px] font-semibold truncate" style={{ color: "#1A1A1A" }}>{report.name}</p>
                          <p className="text-[12px] flex items-center gap-1 mt-0.5" style={{ color: "#667085" }}>
                            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                            {report.location}
                          </p>
                        </div>
                        <p className="text-[12px] hidden sm:block flex-shrink-0" style={{ color: "#9CA3AF" }}>{report.date}</p>
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 flex items-center gap-1.5 capitalize"
                          style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.ring}` }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }}/>
                          {report.status}
                        </span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {[
                            { icon: <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>, hover: "#F0FDF4", hoverText: "#1B3A2F", fn: () => navigate("/my-reports") },
                            { icon: <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>, hover: "#FEF2F2", hoverText: "#DC2626", fn: () => navigate("/my-reports") },
                          ].map((btn, bi) => (
                            <motion.button key={bi} onClick={btn.fn}
                              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-150"
                              style={{ color: "#9CA3AF" }}
                              onMouseEnter={e => { e.currentTarget.style.background = btn.hover; e.currentTarget.style.color = btn.hoverText; }}
                              onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "#9CA3AF"; }}>
                              {btn.icon}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-5">

            {/* Profile Card */}
            <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div className="px-5 py-5 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #1B3A2F 0%, #234D3D 100%)" }}>
                <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full opacity-10" style={{ background: "#5BE63A" }}/>
                <div className="relative flex items-center gap-3">
                  <motion.div whileHover={{ scale: 1.05 }}
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base flex-shrink-0"
                    style={{ background: "#5BE63A", color: "#1B3A2F", boxShadow: "0 4px 12px rgba(91,230,58,0.3)" }}>
                    {avatarInitials}
                  </motion.div>
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-bold text-white truncate">{user?.fullName || "User"}</p>
                    <p className="text-[12px] truncate" style={{ color: "rgba(255,255,255,0.55)" }}>{user?.collegeName || "College Student"}</p>
                    {user?.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold rounded-full px-2 py-0.5 mt-1.5"
                        style={{ background: "rgba(91,230,58,0.2)", color: "#5BE63A" }}>
                        <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3-3z" clipRule="evenodd"/>
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-white px-5 py-4">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="rounded-xl p-3.5 text-center"
                    style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
                    <p className="text-xl font-bold" style={{ color: "#92400E" }}>{stats.reported}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: "#667085" }}>Reported</p>
                  </div>
                  <div className="rounded-xl p-3.5 text-center"
                    style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                    <p className="text-xl font-bold" style={{ color: "#166534" }}>{stats.recovered}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: "#667085" }}>Recovered</p>
                  </div>
                </div>
                <p className="text-[11px] text-center" style={{ color: "#9CA3AF" }}>Member since {memberSince}</p>
              </div>
            </motion.div>

            {/* AI Match Alerts */}
            <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
              <div className="flex items-center justify-between px-5 py-4"
                style={{ background: "#1B3A2F", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" fill="none" stroke="#5BE63A" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                  <h3 className="text-[13.5px] font-bold text-white">AI Match Alerts</h3>
                </div>
                <span className="text-[10px] font-bold rounded-full px-2.5 py-0.5"
                  style={{ background: "#5BE63A", color: "#1B3A2F" }}>
                  {matchAlerts.length} new
                </span>
              </div>
              <div style={{ background: "#1B3A2F" }}>
                {matchAlerts.map((alert, i) => (
                  <motion.div key={alert.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 + 0.3 }}
                    className="px-5 py-4 transition-colors duration-150"
                    style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#234D3D"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[12.5px] font-semibold text-white truncate">{alert.item}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                          {alert.location} · {alert.time}
                        </p>
                      </div>
                      <ConfidenceRing value={alert.confidence}/>
                    </div>
                    <div className="flex gap-2 mt-3.5">
                      <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }}
                        className="flex-1 text-[11.5px] font-semibold py-2 rounded-xl"
                        style={{ background: "#5BE63A", color: "#1B3A2F" }}>
                        Claim
                      </motion.button>
                      <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }}
                        className="flex-1 text-[11.5px] font-semibold py-2 rounded-xl"
                        style={{ border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.55)" }}>
                        Dismiss
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </motion.div>
        </div>

        {/* ── RECENT ACTIVITY ─────────────────────────── */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl overflow-hidden"
          style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid #F3F4F6" }}>
            <h3 className="text-[14px] font-bold" style={{ color: "#1A1A1A" }}>Recent Activity</h3>
            <motion.button whileHover={{ x: 2 }} onClick={() => navigate("/my-reports")}
              className="text-[12.5px] font-semibold transition-colors duration-150"
              style={{ color: "#1B3A2F" }}
              onMouseEnter={e => e.currentTarget.style.color = "#5BE63A"}
              onMouseLeave={e => e.currentTarget.style.color = "#1B3A2F"}>
              View All
            </motion.button>
          </div>
          <div>
            {recentActivity.map((a, i) => (
              <motion.div key={a.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 + 0.35 }}
                className="flex items-center gap-4 px-6 py-3.5 transition-colors duration-150"
                style={{ borderTop: i > 0 ? "1px solid #F3F4F6" : "" }}
                onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                onMouseLeave={e => e.currentTarget.style.background = ""}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#F0FDF4" }}>
                  <svg className="w-4 h-4" style={{ color: "#1B3A2F" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] font-semibold" style={{ color: "#1A1A1A" }}>{a.action}</p>
                  <p className="text-[11px] truncate" style={{ color: "#667085" }}>{a.item}</p>
                </div>
                <p className="text-[11px] flex-shrink-0" style={{ color: "#9CA3AF" }}>{a.time}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════ */
export default function Dashboard() {
  const [active, setActive] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#F8FAF8" }}>
      <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed}/>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar active={active} search={search} setSearch={setSearch}/>
        <DashboardContent search={search}/>
      </div>
    </div>
  );
}