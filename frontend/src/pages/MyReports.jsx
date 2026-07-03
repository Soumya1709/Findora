import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getMyItems, deleteItem } from "../services/itemService";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

/* ═══════════════════════════════════════════════════════
   FINDORA — MY REPORTS PAGE  (UI redesign only)
   Same design system as Dashboard & ReportItem:
     --forest:  #1B3A2F  navbar logo / dark panels
     --lime:    #5BE63A  primary accent
     --page:    #F8FAF8
     --ink:     #1A1A1A
     --muted:   #667085
     --border:  #E5E7EB
   All logic, API calls, state, and routing UNCHANGED.
   ═══════════════════════════════════════════════════════ */

const MATCH_ALERTS = [
  { id:1, item:"MacBook Case",  location:"Found at Cafe", confidence:84,
    description:"Blue hard-shell case found on a table in the Engineering Cafe. Fits 14-inch models." },
  { id:2, item:"Car Key Fob",   location:"Found in Gym",  confidence:72, description:null },
];

const FILTER_TABS   = ["All","Lost","Found","Electronics","Accessories","Books","Keys","Bags"];
const SORT_OPTIONS  = ["Newest First","Oldest First","A → Z","Z → A"];

/* ── STATUS CONFIG (matches Dashboard badge style) ──── */
const STATUS_CFG = {
  found:    { bg:"#D4F7C5", text:"#166534", dot:"#5BE63A",  ring:"#A3E890"  },
  lost:     { bg:"#FEF3C7", text:"#92400E", dot:"#F59E0B",  ring:"#FDE68A"  },
  returned: { bg:"#EFF6FF", text:"#1E40AF", dot:"#3B82F6",  ring:"#BFDBFE"  },
  active:   { bg:"#FEF3C7", text:"#92400E", dot:"#F59E0B",  ring:"#FDE68A"  },
  claimed:  { bg:"#F3F4F6", text:"#374151", dot:"#9CA3AF",  ring:"#E5E7EB"  },
  match:    { bg:"#F5F3FF", text:"#5B21B6", dot:"#8B5CF6",  ring:"#DDD6FE"  },
};

function Badge({ type, label }) {
  const s = STATUS_CFG[type] || STATUS_CFG.claimed;
  return (
    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full"
      style={{ background:s.bg, color:s.text, border:`1px solid ${s.ring}` }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background:s.dot }}/>
      {label}
    </span>
  );
}

/* ── ANIMATION VARIANTS ─────────────────────────────── */
const fadeUp = {
  hidden:{ opacity:0, y:14 },
  show:{ opacity:1, y:0, transition:{ duration:0.28, ease:[0.25,0.46,0.45,0.94] } },
};
const stagger = { hidden:{}, show:{ transition:{ staggerChildren:0.06 } } };

/* ── CONFIDENCE RING ────────────────────────────────── */
function ConfidenceRing({ value }) {
  const r=18, circ=2*Math.PI*r, offset=circ-(value/100)*circ;
  const color = value>=80?"#5BE63A":value>=60?"#F59E0B":"#EF4444";
  return (
    <div className="relative w-12 h-12 flex items-center justify-center flex-shrink-0">
      <svg className="absolute inset-0 -rotate-90" width="48" height="48">
        <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3"/>
        <motion.circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={circ} initial={{ strokeDashoffset:circ }}
          animate={{ strokeDashoffset:offset }} transition={{ duration:1, ease:"easeOut" }}
          strokeLinecap="round"/>
      </svg>
      <span className="text-[10px] font-bold text-white z-10">{value}%</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   NAVBAR  — identical visual style to Dashboard topbar
   ══════════════════════════════════════════════════════ */
function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = user?.fullName?.split(" ").map((w)=>w[0]).join("").toUpperCase()||"U";

  return (
    <header className="sticky top-0 z-50 h-16 flex items-center justify-between px-5 sm:px-8"
      style={{
        background:"rgba(248,250,248,0.9)",
        backdropFilter:"blur(12px)",
        WebkitBackdropFilter:"blur(12px)",
        borderBottom:"1px solid #E5E7EB",
      }}>
      {/* Logo + nav */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={()=>navigate("/dashboard")}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background:"#1B3A2F" }}>
            <svg width="16" height="16" fill="none" stroke="#5BE63A" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <span className="font-black text-[17px] tracking-tight" style={{ color:"#1A1A1A" }}>
            Find<span style={{ color:"#5BE63A" }}>ora</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {[
            { label:"Home",       path:"/dashboard" },
            { label:"Browse",     path:"/browse" },
            { label:"My Reports", path:"/my-reports" },
            { label:"Claims",     path:"/claims" },
            { label:"Settings",   path:"/settings" },
          ].map((item)=>{
            const active = item.path==="/my-reports";
            return (
              <button key={item.label} onClick={()=>navigate(item.path)}
                className="px-3.5 py-2 rounded-xl text-[13px] transition-all duration-150"
                style={{
                  background: active?"rgba(91,230,58,0.1)":"transparent",
                  color: active?"#1B3A2F":"#667085",
                  fontWeight: active?700:500,
                }}
                onMouseEnter={e=>{ if(!active){ e.currentTarget.style.background="#F0FDF4"; e.currentTarget.style.color="#1B3A2F"; } }}
                onMouseLeave={e=>{ if(!active){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#667085"; } }}>
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <motion.button whileHover={{ y:-1, boxShadow:"0 6px 16px rgba(27,58,47,0.25)" }} whileTap={{ scale:0.97 }}
          onClick={()=>navigate("/report")}
          className="hidden sm:inline-flex items-center gap-2 text-[13px] font-semibold px-4 py-2.5 rounded-xl"
          style={{ background:"#1B3A2F", color:"#5BE63A", boxShadow:"0 2px 8px rgba(27,58,47,0.2)" }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Report Item
        </motion.button>

        <motion.div whileHover={{ scale:1.06 }} whileTap={{ scale:0.94 }}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold cursor-pointer"
          style={{ background:"#1B3A2F", color:"#5BE63A", border:"2px solid #E5E7EB", boxShadow:"0 2px 8px rgba(0,0,0,0.08)" }}>
          {initials}
        </motion.div>
      </div>
    </header>
  );
}

/* ══════════════════════════════════════════════════════
   ITEM CARD
   ══════════════════════════════════════════════════════ */
function ItemCard({ item, onDelete, onEdit }) {
  const navigate = useNavigate();

  /* Archived card */
  if (item.archived) {
    return (
      <div className="bg-white rounded-2xl overflow-hidden opacity-55 hover:opacity-75 transition-opacity duration-200"
        style={{ border:"1px solid #E5E7EB" }}>
        <div className="relative">
          <img src={item.img} alt={item.name} className="w-full h-40 object-cover grayscale"/>
          <Badge type={item.status} label={item.status.charAt(0).toUpperCase()+item.status.slice(1)}/>
          {item.badge && (
            <span className="absolute top-2 right-2">
              <Badge type={item.badgeType} label={item.badge}/>
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="text-[13.5px] font-semibold truncate" style={{ color:"#1A1A1A" }}>{item.name}</p>
          <p className="text-[11.5px] mt-0.5" style={{ color:"#9CA3AF" }}>{item.category} · {item.subcategory}</p>
          <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop:"1px solid #F3F4F6" }}>
            <p className="text-[11px]" style={{ color:"#9CA3AF" }}>Archived on {item.archivedDate}</p>
            <button className="text-[11.5px] font-semibold transition-colors duration-150"
              style={{ color:"#5BE63A" }}
              onMouseEnter={e=>e.currentTarget.style.color="#1B3A2F"}
              onMouseLeave={e=>e.currentTarget.style.color="#5BE63A"}>
              View History
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={fadeUp} whileHover={{ y:-3, boxShadow:"0 10px 30px rgba(0,0,0,0.09)" }}
      className="bg-white rounded-2xl overflow-hidden group cursor-default"
      style={{ border:"1px solid #E5E7EB", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}
      transition={{ duration:0.2 }}>

      {/* Image */}
      <div className="relative overflow-hidden">
        <img src={item.img} alt={item.name}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"/>
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background:"linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)" }}/>
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5">
          <Badge type={item.type||item.status} label={(item.type||item.status).charAt(0).toUpperCase()+(item.type||item.status).slice(1)}/>
        </div>
        {item.badge && (
          <div className="absolute top-2.5 right-2.5">
            <Badge type={item.badgeType} label={item.badge}/>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-[14px] font-bold truncate leading-tight" style={{ color:"#1A1A1A" }}>{item.name}</p>
        <p className="text-[12px] mt-0.5 truncate" style={{ color:"#667085" }}>{item.category}{item.subcategory?` · ${item.subcategory}`:""}</p>

        <div className="flex items-center gap-1.5 mt-2">
          <svg width="12" height="12" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <p className="text-[11.5px]" style={{ color:"#9CA3AF" }}>{item.date}</p>
        </div>

        {item.location && (
          <div className="flex items-center gap-1.5 mt-1">
            <svg width="12" height="12" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <p className="text-[11.5px] truncate" style={{ color:"#9CA3AF" }}>{item.location}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-4 pt-3.5" style={{ borderTop:"1px solid #F3F4F6" }}>
          <div className="flex items-center gap-1">
            {item.canEdit && (
              <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                onClick={()=>onEdit(item)}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-150"
                style={{ color:"#9CA3AF" }}
                onMouseEnter={e=>{ e.currentTarget.style.background="#F0FDF4"; e.currentTarget.style.color="#1B3A2F"; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#9CA3AF"; }}
                title="Edit">
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </motion.button>
            )}
            {item.canDelete && (
              <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                onClick={()=>onDelete(item.id)}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors duration-150"
                style={{ color:"#9CA3AF" }}
                onMouseEnter={e=>{ e.currentTarget.style.background="#FEF2F2"; e.currentTarget.style.color="#DC2626"; }}
                onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#9CA3AF"; }}
                title="Delete">
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </motion.button>
            )}
          </div>
          <motion.button whileHover={{ x:2 }} onClick={()=>navigate(`/item/${item.id}`)}
            className="flex items-center gap-1 text-[12px] font-semibold transition-colors duration-150"
            style={{ color:"#1B3A2F" }}
            onMouseEnter={e=>e.currentTarget.style.color="#5BE63A"}
            onMouseLeave={e=>e.currentTarget.style.color="#1B3A2F"}>
            View Details
            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   AI MATCH PANEL — dark forest, same as Dashboard alerts
   ══════════════════════════════════════════════════════ */
function AIMatchPanel() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border:"1px solid #E5E7EB" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4"
        style={{ background:"#1B3A2F", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2">
          <svg width="14" height="14" fill="none" stroke="#5BE63A" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          <span className="text-[13.5px] font-bold text-white">AI Match Alerts</span>
        </div>
        <span className="text-[10px] font-bold rounded-full px-2.5 py-0.5"
          style={{ background:"#5BE63A", color:"#1B3A2F" }}>
          {MATCH_ALERTS.length} new
        </span>
      </div>

      {/* Alerts */}
      <div style={{ background:"#1B3A2F" }}>
        {MATCH_ALERTS.map((alert,i)=>(
          <motion.div key={alert.id}
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i*0.1+0.2 }}
            className="px-5 py-4 transition-colors duration-150"
            style={{ borderTop:i>0?"1px solid rgba(255,255,255,0.06)":"" }}
            onMouseEnter={e=>e.currentTarget.style.background="#234D3D"}
            onMouseLeave={e=>e.currentTarget.style.background=""}>
            <div className="flex items-start gap-3">
              <ConfidenceRing value={alert.confidence}/>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-bold text-white truncate">{alert.item}</p>
                <p className="text-[11px] mt-0.5" style={{ color:"rgba(255,255,255,0.45)" }}>{alert.location}</p>
                {alert.description && (
                  <p className="text-[11px] mt-2 leading-relaxed line-clamp-2 italic"
                    style={{ color:"rgba(255,255,255,0.4)" }}>"{alert.description}"</p>
                )}
              </div>
            </div>
            <motion.button whileHover={{ y:-1, boxShadow:"0 4px 12px rgba(91,230,58,0.3)" }} whileTap={{ scale:0.97 }}
              className="mt-3.5 w-full text-[11.5px] font-bold py-2.5 rounded-xl transition-all duration-150"
              style={{ background:"#5BE63A", color:"#1B3A2F" }}>
              View Match
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-4" style={{ background:"#234D3D", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-[11.5px] mb-1.5" style={{ color:"rgba(255,255,255,0.45)" }}>Need help with a match?</p>
        <button className="text-[12px] font-semibold flex items-center gap-1 transition-colors duration-150"
          style={{ color:"#5BE63A" }}
          onMouseEnter={e=>e.currentTarget.style.color="#fff"}
          onMouseLeave={e=>e.currentTarget.style.color="#5BE63A"}>
          Contact Campus Security
          <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="mt-16" style={{ background:"#1B3A2F", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:"#5BE63A" }}>
                <svg width="14" height="14" fill="none" stroke="#1B3A2F" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <span className="font-black text-[16px] tracking-tight text-white">
                Find<span style={{ color:"#5BE63A" }}>ora</span>
              </span>
            </div>
            <p className="text-[12px] leading-relaxed" style={{ color:"rgba(255,255,255,0.4)" }}>
              Reconnecting the campus, one item at a time. Trusted by 20+ universities.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            {[
              { heading:"Product", links:["How it works","Safety Guide","Success Stories"] },
              { heading:"Support", links:["Help Center","Contact","Report Abuse"] },
              { heading:"Legal",   links:["Privacy Policy","Terms of Service"] },
            ].map((col)=>(
              <div key={col.heading} className="flex flex-col gap-2.5">
                <span className="text-[10px] font-bold uppercase tracking-[1.2px]" style={{ color:"rgba(255,255,255,0.25)" }}>
                  {col.heading}
                </span>
                {col.links.map((l)=>(
                  <a key={l} href="#" className="text-[12.5px] transition-colors duration-150"
                    style={{ color:"rgba(255,255,255,0.5)" }}
                    onMouseEnter={e=>e.currentTarget.style.color="#5BE63A"}
                    onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.5)"}>
                    {l}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 pt-6 text-center text-[11.5px]" style={{ borderTop:"1px solid rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.25)" }}>
          © 2024 Findora Recovery Systems. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE  — all logic UNCHANGED
   ══════════════════════════════════════════════════════ */
export default function MyReports() {
  const [reports,      setReports]      = useState([]);
  const [editingItem,  setEditingItem]  = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search,       setSearch]       = useState("");
  const [sortOpen,     setSortOpen]     = useState(false);
  const [filterOpen,   setFilterOpen]   = useState(false);
  const [sortBy,       setSortBy]       = useState("Newest First");
  const [searchFocus,  setSearchFocus]  = useState(false);
  const navigate = useNavigate();

  /* ── DERIVED STATS ────────────────────────────────── */
  const totalReports  = reports.length;
  const activeReports = reports.filter((i)=>i.status==="active").length;
  const returnedItems = reports.filter((i)=>i.status==="returned").length;
  const matchAlerts   = 0;

  const STATS = [
    { label:"Total Reports",  value:totalReports,  accent:"#F59E0B", bg:"#FFFBEB", iconColor:"#F59E0B",
      icon:<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg> },
    { label:"Active Reports",  value:activeReports, accent:"#F59E0B", bg:"#FFFBEB", iconColor:"#F59E0B",
      icon:<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
    { label:"Returned Items",  value:returnedItems, accent:"#5BE63A", bg:"#F0FDF4", iconColor:"#5BE63A",
      icon:<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
    { label:"Match Alerts",    value:matchAlerts,   accent:"#5BE63A", bg:"#F0FDF4", iconColor:"#5BE63A",
      icon:<svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> },
  ];

  /* ── HANDLERS (unchanged) ─────────────────────────── */
  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      setReports((prev)=>prev.filter((item)=>item.id!==id));
      alert("Item deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to delete item");
    }
  };

  const handleEdit = (item) => {
    navigate("/report", { state:{ item, isEdit:true } });
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }
    fetchReports();
  }, [navigate]);

  const fetchReports = async () => {
    try {
      const res = await getMyItems();
      const transformed = res.data.items.map((item)=>({
        id:              item._id,
        name:            item.title,
        description:     item.description,
        category:        item.category,
        brand:           item.brand,
        location:        item.location?.name||"",
        type:            item.type,
        status:          item.status,
        img:             item.images?.[0]||"https://placehold.co/400x300",
        canEdit:         true,
        canDelete:       true,
        campusZone:      item.campusZone||"",
        locationNotes:   item.locationNotes||"",
        dateLostOrFound: item.dateLostOrFound,
        date:            item.dateLostOrFound
                           ? new Date(item.dateLostOrFound).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})
                           : "",
      }));
      setReports(transformed);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ── FILTER / SORT ────────────────────────────────── */
  const filtered = reports.filter((r)=>{
    const matchSearch =
      r.name?.toLowerCase().includes(search.toLowerCase())||
      r.category?.toLowerCase().includes(search.toLowerCase());
    if(activeFilter==="All")   return matchSearch;
    if(activeFilter==="Lost")  return r.type==="lost"  && matchSearch;
    if(activeFilter==="Found") return r.type==="found" && matchSearch;
    return r.category===activeFilter && matchSearch;
  });

  /* ── LOADING ──────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background:"#F8FAF8" }}>
        <Navbar/>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background:"#F0FDF4" }}>
              <svg className="w-6 h-6 animate-spin" style={{ color:"#5BE63A" }} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
            <p className="text-[13.5px] font-semibold" style={{ color:"#667085" }}>Loading your reports…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background:"#F8FAF8" }}>
      <Navbar/>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">

        {/* ── PAGE HEADER ─────────────────────────────── */}
        <motion.div initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.3 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight" style={{ color:"#1A1A1A" }}>My Reports</h1>
            <p className="text-[13.5px] mt-1" style={{ color:"#667085" }}>
              Track and manage your reported lost and found items.
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <motion.div animate={{ width:searchFocus?220:190 }} transition={{ duration:0.2 }}
              className="flex items-center gap-2 h-[40px] px-3.5 rounded-xl border transition-all duration-150"
              style={{
                background:"#fff",
                borderColor: searchFocus?"#5BE63A":"#E5E7EB",
                boxShadow: searchFocus?"0 0 0 3px rgba(91,230,58,0.1)":"0 1px 2px rgba(0,0,0,0.04)",
              }}>
              <svg width="13" height="13" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input value={search} onChange={(e)=>setSearch(e.target.value)}
                onFocus={()=>setSearchFocus(true)} onBlur={()=>setSearchFocus(false)}
                placeholder="Search reports…"
                className="bg-transparent text-[12.5px] focus:outline-none w-full"
                style={{ color:"#1A1A1A" }}/>
            </motion.div>

            {/* Filter dropdown */}
            <div className="relative">
              <motion.button whileTap={{ scale:0.97 }}
                onClick={()=>{ setFilterOpen(!filterOpen); setSortOpen(false); }}
                className="flex items-center gap-1.5 h-[40px] px-3.5 rounded-xl border text-[12.5px] font-semibold transition-all duration-150"
                style={{
                  background:"#fff", borderColor:filterOpen?"#5BE63A":"#E5E7EB",
                  color:filterOpen?"#1B3A2F":"#667085",
                }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                </svg>
                {activeFilter}
              </motion.button>
              <AnimatePresence>
                {filterOpen && (
                  <motion.div initial={{ opacity:0,y:6,scale:0.97 }} animate={{ opacity:1,y:0,scale:1 }}
                    exit={{ opacity:0,y:6,scale:0.97 }} transition={{ duration:0.15 }}
                    className="absolute right-0 top-12 bg-white rounded-2xl z-20 p-2 w-44 space-y-0.5"
                    style={{ border:"1px solid #E5E7EB", boxShadow:"0 16px 40px rgba(0,0,0,0.1)" }}>
                    {["All","Lost","Found"].map((o)=>(
                      <button key={o} onClick={()=>{ setActiveFilter(o); setFilterOpen(false); }}
                        className="w-full text-left text-[12.5px] font-medium px-3 py-2 rounded-xl transition-all duration-150"
                        style={{
                          background: activeFilter===o?"#F0FDF4":"transparent",
                          color: activeFilter===o?"#1B3A2F":"#667085",
                          fontWeight: activeFilter===o?700:500,
                        }}>
                        {o}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <motion.button whileTap={{ scale:0.97 }}
                onClick={()=>{ setSortOpen(!sortOpen); setFilterOpen(false); }}
                className="flex items-center gap-1.5 h-[40px] px-3.5 rounded-xl border text-[12.5px] font-semibold transition-all duration-150"
                style={{
                  background:"#fff", borderColor:sortOpen?"#5BE63A":"#E5E7EB",
                  color:sortOpen?"#1B3A2F":"#667085",
                }}>
                <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M6 12h12M10 17h4"/>
                </svg>
                {sortBy}
              </motion.button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div initial={{ opacity:0,y:6,scale:0.97 }} animate={{ opacity:1,y:0,scale:1 }}
                    exit={{ opacity:0,y:6,scale:0.97 }} transition={{ duration:0.15 }}
                    className="absolute right-0 top-12 bg-white rounded-2xl z-20 p-2 w-44 space-y-0.5"
                    style={{ border:"1px solid #E5E7EB", boxShadow:"0 16px 40px rgba(0,0,0,0.1)" }}>
                    {SORT_OPTIONS.map((o)=>(
                      <button key={o} onClick={()=>{ setSortBy(o); setSortOpen(false); }}
                        className="w-full text-left text-[12.5px] font-medium px-3 py-2 rounded-xl transition-all duration-150"
                        style={{
                          background: sortBy===o?"#F0FDF4":"transparent",
                          color: sortBy===o?"#1B3A2F":"#667085",
                          fontWeight: sortBy===o?700:500,
                        }}>
                        {o}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ── STAT CARDS ──────────────────────────────── */}
        <motion.div variants={stagger} initial="hidden" animate="show"
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
          {STATS.map((s)=>(
            <motion.div key={s.label} variants={fadeUp}
              whileHover={{ y:-4, boxShadow:"0 10px 30px rgba(0,0,0,0.09)" }}
              className="bg-white rounded-2xl p-5 relative overflow-hidden cursor-default transition-all duration-200"
              style={{ border:"1px solid #E5E7EB", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
              <div className="absolute top-0 left-5 right-5 h-[2px] rounded-b-full" style={{ background:s.accent }}/>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 mt-1"
                style={{ background:s.bg, color:s.iconColor }}>
                {s.icon}
              </div>
              <p className="text-[26px] font-bold tracking-tight leading-none" style={{ color:"#1A1A1A" }}>{s.value}</p>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.7px] mt-1.5" style={{ color:"#667085" }}>{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── FILTER TABS ─────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth:"none" }}>
          {FILTER_TABS.map((tab)=>(
            <motion.button key={tab} whileTap={{ scale:0.95 }}
              onClick={()=>setActiveFilter(tab)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-[12.5px] font-semibold transition-all duration-150"
              style={
                activeFilter===tab
                  ? { background:"#1B3A2F", color:"#5BE63A", boxShadow:"0 2px 8px rgba(27,58,47,0.2)" }
                  : { background:"#fff", color:"#667085", border:"1px solid #E5E7EB" }
              }
              onMouseEnter={e=>{ if(activeFilter!==tab){ e.currentTarget.style.borderColor="#5BE63A"; e.currentTarget.style.color="#1B3A2F"; } }}
              onMouseLeave={e=>{ if(activeFilter!==tab){ e.currentTarget.style.borderColor="#E5E7EB"; e.currentTarget.style.color="#667085"; } }}>
              {tab}
            </motion.button>
          ))}
        </div>

        {/* ── MAIN CONTENT ────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Items grid */}
          <div className="flex-1 min-w-0">
            {filtered.length===0 ? (
              <motion.div initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }}
                className="bg-white rounded-2xl p-14 text-center"
                style={{ border:"1px solid #E5E7EB", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background:"#F3F4F6" }}>
                  <svg className="w-7 h-7" style={{ color:"#9CA3AF" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                </div>
                <p className="text-[14px] font-bold mb-1.5" style={{ color:"#1A1A1A" }}>No reports found</p>
                <p className="text-[13px] mb-6" style={{ color:"#9CA3AF" }}>Try adjusting your search or filter</p>
                <motion.button whileHover={{ y:-1, boxShadow:"0 6px 16px rgba(27,58,47,0.25)" }} whileTap={{ scale:0.97 }}
                  onClick={()=>navigate("/report")}
                  className="px-5 py-2.5 text-[13px] font-semibold rounded-xl"
                  style={{ background:"#1B3A2F", color:"#5BE63A", boxShadow:"0 2px 8px rgba(27,58,47,0.2)" }}>
                  Report New Item
                </motion.button>
              </motion.div>
            ) : (
              <motion.div variants={stagger} initial="hidden" animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map((item)=>(
                  <ItemCard key={item.id} item={item} onDelete={handleDelete} onEdit={handleEdit}/>
                ))}
              </motion.div>
            )}
          </div>

          {/* AI Match Panel */}
          <motion.div initial={{ opacity:0,x:12 }} animate={{ opacity:1,x:0 }} transition={{ duration:0.35,delay:0.15 }}
            className="w-full lg:w-72 flex-shrink-0">
            <AIMatchPanel/>
          </motion.div>
        </div>
      </main>

      <Footer/>
    </div>
  );
}