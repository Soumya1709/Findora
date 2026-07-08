import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllItems } from "../services/itemService";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../components/NotificationBell";




const LOCATIONS = [
  "All Locations","Main Library","Engineering Quad","Science Block",
  "Student Union","Gym / Sports Complex","Cafeteria",
  "Admin Block","Music Hall","North Campus",
];
const CATEGORY_FILTERS = ["Electronics","Clothing","Accessories","Documents","Keys","Bags"];
const ITEMS_PER_PAGE   = 6;
const TOTAL_PAGES      = 12;

const NAV_ITEMS = [
  { label:"Dashboard",   path:"/dashboard",
    icon:<svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> },
  { label:"Browse Items", path:"/browse",
    icon:<svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg> },
  { label:"My Reports",  path:"/my-reports",
    icon:<svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg> },
  { label:"Match Alerts", path:"/match-alerts",
    icon:<svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> },
];

/* ── ANIMATION VARIANTS ─────────────────────────────── */
const fadeUp = {
  hidden:{ opacity:0, y:14 },
  show:{ opacity:1, y:0, transition:{ duration:0.28, ease:[0.25,0.46,0.45,0.94] } },
};
const stagger = { hidden:{}, show:{ transition:{ staggerChildren:0.055 } } };

/* ══════════════════════════════════════════════════════
   TOPBAR — matches all other pages
   ══════════════════════════════════════════════════════ */
function Topbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = user?.fullName?.split(" ").map((w)=>w[0]).join("").toUpperCase() || "U";
  const [searchFocus, setSearchFocus] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-16 flex items-center justify-between px-5 sm:px-7 flex-shrink-0"
      style={{
        background:"rgba(248,250,248,0.9)",
        backdropFilter:"blur(12px)",
        WebkitBackdropFilter:"blur(12px)",
        borderBottom:"1px solid #E5E7EB",
      }}>
      {/* Logo */}
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

      {/* Nav */}
      <nav className="hidden md:flex items-center gap-1">
        {["Browse","Report","Matching"].map((l)=>{
          const active = l==="Browse";
          return (
            <button key={l}
              onClick={()=>{ if(l==="Browse") navigate("/browse"); else if(l==="Report") navigate("/report"); else navigate("/matching"); }}
              className="px-3.5 py-2 rounded-xl text-[13px] transition-all duration-150"
              style={{ background:active?"rgba(91,230,58,0.1)":"transparent", color:active?"#1B3A2F":"#667085", fontWeight:active?700:500 }}
              onMouseEnter={e=>{ if(!active){ e.currentTarget.style.background="#F0FDF4"; e.currentTarget.style.color="#1B3A2F"; } }}
              onMouseLeave={e=>{ if(!active){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#667085"; } }}>
              {l}
            </button>
          );
        })}
      </nav>

      {/* Right */}
      <div className="flex items-center gap-2">

  <NotificationBell />

  <motion.button
    onClick={() => navigate("/settings")}
    whileHover={{ scale: 1.08 }}
    whileTap={{ scale: 0.92 }}
    className="relative w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-150"
    style={{ color: "#667085" }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "#F0FDF4";
      e.currentTarget.style.color = "#1B3A2F";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.color = "#667085";
    }}
  >
    <svg
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
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
   SIDEBAR — matches Dashboard sidebar style
   ══════════════════════════════════════════════════════ */
function Sidebar() {
  const [active, setActive] = useState("Browse Items");
  const navigate = useNavigate();
  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace:true });
  };

  return (
    <aside className="hidden md:flex flex-col w-56 flex-shrink-0" style={{ background:"#1B3A2F" }}>
      <div className="px-4 pt-6 pb-2">
        <p className="text-[9.5px] font-bold uppercase tracking-[1.5px]" style={{ color:"rgba(255,255,255,0.3)" }}>
          Navigate
        </p>
      </div>

      <nav className="flex-1 px-2.5 space-y-0.5">
        {NAV_ITEMS.map((item)=>{
          const isActive = active===item.label;
          return (
            <motion.button key={item.label}
              onClick={()=>{ setActive(item.label); navigate(item.path); }}
              whileHover={{ x:isActive?0:3 }} whileTap={{ scale:0.97 }}
              className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors duration-150"
              style={{
                background: isActive?"rgba(91,230,58,0.14)":"transparent",
                color: isActive?"#5BE63A":"rgba(255,255,255,0.5)",
              }}
              onMouseEnter={e=>{ if(!isActive){ e.currentTarget.style.background="rgba(255,255,255,0.06)"; e.currentTarget.style.color="rgba(255,255,255,0.85)"; } }}
              onMouseLeave={e=>{ if(!isActive){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,0.5)"; } }}>
              {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full" style={{ background:"#5BE63A" }}/>}
              <span style={{ color:isActive?"#5BE63A":"rgba(255,255,255,0.4)" }}>{item.icon}</span>
              {item.label}
            </motion.button>
          );
        })}
      </nav>

      <div className="px-3 py-4" style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
        <motion.button whileHover={{ y:-1, boxShadow:"0 6px 16px rgba(91,230,58,0.3)" }} whileTap={{ scale:0.97 }}
          onClick={()=>navigate("/report")}
          className="w-full text-[13px] font-bold py-2.5 rounded-xl mb-3"
          style={{ background:"#5BE63A", color:"#1B3A2F" }}>
          + Report New Item
        </motion.button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors duration-150 mb-0.5"
          style={{ color:"rgba(255,255,255,0.45)" }}
          onMouseEnter={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.06)"; e.currentTarget.style.color="rgba(255,255,255,0.8)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="rgba(255,255,255,0.45)"; }}>
          <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          Help Center
        </button>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors duration-150"
          style={{ color:"#f87171" }}
          onMouseEnter={e=>{ e.currentTarget.style.background="rgba(248,113,113,0.08)"; }}
          onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; }}>
          <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Log Out
        </button>
      </div>
    </aside>
  );
}

/* ══════════════════════════════════════════════════════
   ITEM CARD
   ══════════════════════════════════════════════════════ */
function ItemCard({ item, onClick }) {
  const isFound = item.status==="found";
  return (
    <motion.div variants={fadeUp}
      whileHover={{ y:-4, boxShadow:"0 12px 32px rgba(0,0,0,0.10)" }}
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden group cursor-pointer flex flex-col"
      style={{ border:"1px solid #E5E7EB", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}
      transition={{ duration:0.2 }}>

      {/* Image */}
      <div className="relative overflow-hidden flex-shrink-0">
        <img src={item.img} alt={item.name}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"/>
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:"linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 55%)" }}/>

        {/* Status badge */}
        <span className="absolute top-2.5 left-2.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5"
          style={{
            background: isFound?"#D4F7C5":"#FEF3C7",
            color: isFound?"#166534":"#92400E",
            border: `1px solid ${isFound?"#A3E890":"#FDE68A"}`,
          }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background:isFound?"#5BE63A":"#F59E0B" }}/>
          {isFound?"Found":"Lost"}
        </span>

        {/* AI confidence badge */}
        {item.confidence && (
          <span className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[10.5px] font-bold px-2.5 py-1 rounded-full"
            style={{ background:"rgba(27,58,47,0.85)", color:"#5BE63A", border:"1px solid rgba(91,230,58,0.3)", backdropFilter:"blur(4px)" }}>
            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            {item.confidence}% Match
          </span>
        )}

        {/* Time */}
        <span className="absolute bottom-2.5 right-2.5 text-[10px] font-medium px-2 py-0.5 rounded-lg"
          style={{ background:"rgba(0,0,0,0.5)", color:"#fff", backdropFilter:"blur(4px)" }}>
          {item.time}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-[14px] font-bold truncate leading-tight mb-2.5" style={{ color:"#1A1A1A" }}>
          {item.name}
        </h3>

        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-1.5 text-[12px]" style={{ color:"#667085" }}>
            <svg className="flex-shrink-0" width="13" height="13" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
            </svg>
            <span className="truncate">{item.category}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[12px]" style={{ color:"#667085" }}>
            <svg className="flex-shrink-0" width="13" height="13" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span className="truncate">{item.location}</span>
          </div>
        </div>

        <motion.button whileHover={{ y:-1 }} whileTap={{ scale:0.97 }}
          className="mt-4 w-full text-[12.5px] font-semibold py-2.5 rounded-xl transition-all duration-150"
          style={{
            border:"1.5px solid #C9DFC0",
            color:"#1B3A2F",
            background:"#F0FDF4",
          }}
          onMouseEnter={e=>{ e.currentTarget.style.background="#1B3A2F"; e.currentTarget.style.color="#5BE63A"; e.currentTarget.style.borderColor="#1B3A2F"; }}
          onMouseLeave={e=>{ e.currentTarget.style.background="#F0FDF4"; e.currentTarget.style.color="#1B3A2F"; e.currentTarget.style.borderColor="#C9DFC0"; }}>
          View Details →
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   PAGINATION
   ══════════════════════════════════════════════════════ */
function Pagination({ current, setCurrent, total }) {
  const pages = total<=5
    ? Array.from({length:total},(_,i)=>i+1)
    : [1,2,3,"...",total];

  return (
    <div className="flex items-center justify-center gap-2 mt-8 mb-2">
      <motion.button whileTap={{ scale:0.93 }}
        onClick={()=>setCurrent(Math.max(1,current-1))} disabled={current===1}
        className="w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-150"
        style={{
          borderColor: current===1?"#F3F4F6":"#E5E7EB",
          color: current===1?"#D1D5DB":"#667085",
          cursor: current===1?"not-allowed":"pointer",
        }}
        onMouseEnter={e=>{ if(current!==1){ e.currentTarget.style.borderColor="#5BE63A"; e.currentTarget.style.color="#1B3A2F"; } }}
        onMouseLeave={e=>{ if(current!==1){ e.currentTarget.style.borderColor="#E5E7EB"; e.currentTarget.style.color="#667085"; } }}>
        <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
        </svg>
      </motion.button>

      {pages.map((p,i)=>(
        <motion.button key={i} whileTap={{ scale:0.93 }}
          onClick={()=>typeof p==="number"&&setCurrent(p)}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-[12.5px] font-semibold transition-all duration-150"
          style={
            p===current
              ? { background:"#1B3A2F", color:"#5BE63A", boxShadow:"0 2px 8px rgba(27,58,47,0.2)" }
              : typeof p==="number"
                ? { border:"1.5px solid #E5E7EB", color:"#667085", cursor:"pointer" }
                : { color:"#9CA3AF", cursor:"default" }
          }
          onMouseEnter={e=>{ if(typeof p==="number"&&p!==current){ e.currentTarget.style.borderColor="#5BE63A"; e.currentTarget.style.color="#1B3A2F"; } }}
          onMouseLeave={e=>{ if(typeof p==="number"&&p!==current){ e.currentTarget.style.borderColor="#E5E7EB"; e.currentTarget.style.color="#667085"; } }}>
          {p}
        </motion.button>
      ))}

      <motion.button whileTap={{ scale:0.93 }}
        onClick={()=>setCurrent(Math.min(total,current+1))} disabled={current===total}
        className="w-9 h-9 flex items-center justify-center rounded-xl border transition-all duration-150"
        style={{
          borderColor: current===total?"#F3F4F6":"#E5E7EB",
          color: current===total?"#D1D5DB":"#667085",
          cursor: current===total?"not-allowed":"pointer",
        }}
        onMouseEnter={e=>{ if(current!==total){ e.currentTarget.style.borderColor="#5BE63A"; e.currentTarget.style.color="#1B3A2F"; } }}
        onMouseLeave={e=>{ if(current!==total){ e.currentTarget.style.borderColor="#E5E7EB"; e.currentTarget.style.color="#667085"; } }}>
        <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
        </svg>
      </motion.button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{ background:"#1B3A2F", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
      <div className="px-5 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background:"#5BE63A" }}>
              <svg width="13" height="13" fill="none" stroke="#1B3A2F" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <span className="font-black text-[15px] tracking-tight text-white">
              Find<span style={{ color:"#5BE63A" }}>ora</span>
            </span>
          </div>
          <p className="text-[11.5px]" style={{ color:"rgba(255,255,255,0.3)" }}>
            © 2024 Findora Recovery Systems. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          {["Privacy Policy","Terms of Service","Security","Accessibility","Support"].map((l)=>(
            <a key={l} href="#" className="text-[12px] transition-colors duration-150"
              style={{ color:"rgba(255,255,255,0.4)" }}
              onMouseEnter={e=>e.currentTarget.style.color="#5BE63A"}
              onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.4)"}>
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE — all logic UNCHANGED
   ══════════════════════════════════════════════════════ */
export default function BrowseItems() {
  const [items,           setItems]           = useState([]);
  const [loading,         setLoading]         = useState(true);
  const [statusFilter,    setStatusFilter]    = useState("All");
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [location,        setLocation]        = useState("All Locations");
  const [date,            setDate]            = useState("");
  const [search,          setSearch]          = useState("");
  const [currentPage,     setCurrentPage]     = useState(1);
  const [searchFocus,     setSearchFocus]     = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{ fetchItems(); },[]);

  const fetchItems = async () => {
    try {
      const res = await getAllItems();
      const transformed = res.data.items.map((item)=>({
        id:              item._id,
        name:            item.title,
        description:     item.description,
        brand:           item.brand,
        category:        item.category,
        location:        item.location?.name||"Unknown Location",
        time:            new Date(item.dateLostOrFound).toLocaleDateString(),
        dateLostOrFound: item.dateLostOrFound,
        reportedBy:      item.reportedBy,
        status:          item.type,
        confidence:      item.matchScore||null,
        img:             item.images?.[0]||"https://via.placeholder.com/400x300",
      }));
      setItems(transformed);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (cat) => {
    setCategoryFilters((prev)=>prev.includes(cat)?prev.filter((c)=>c!==cat):[...prev,cat]);
  };

  const filtered = items.filter((item)=>{
    const matchStatus   = statusFilter==="All" || item.status===statusFilter.toLowerCase();
    const matchCategory = categoryFilters.length===0 || categoryFilters.includes(item.category);
    const matchLocation = location==="All Locations" || item.location?.name===location;
    const matchDate     = !date || item.dateLostOrFound?.slice(0,10)===date;
    const matchSearch   =
      item.name?.toLowerCase().includes(search.toLowerCase())||
      item.title?.toLowerCase().includes(search.toLowerCase())||
      item.category?.toLowerCase().includes(search.toLowerCase())||
      item.location?.toLowerCase().includes(search.toLowerCase())||
      item.description?.toLowerCase().includes(search.toLowerCase())||
      item.brand?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchCategory && matchLocation && matchDate && matchSearch;
  });

  const paginated = filtered.slice((currentPage-1)*ITEMS_PER_PAGE, currentPage*ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length/ITEMS_PER_PAGE)||1;
  const hasActiveFilters = categoryFilters.length>0||statusFilter!=="All"||search||date;

  /* ── LOADING ──────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background:"#F8FAF8" }}>
        <Topbar/>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background:"#F0FDF4" }}>
              <svg className="w-6 h-6 animate-spin" style={{ color:"#5BE63A" }} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
            <p className="text-[13.5px] font-semibold" style={{ color:"#667085" }}>Loading items…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background:"#F8FAF8" }}>
      <Topbar/>

      <div className="flex flex-1 min-h-0">
        <Sidebar/>

        {/* ── MAIN AREA ─────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-y-auto min-w-0">
          <main className="flex-1 px-5 sm:px-7 py-7">

            {/* Page heading */}
            <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.3 }}
              className="mb-6">
              <h1 className="text-[22px] font-bold tracking-tight" style={{ color:"#1A1A1A" }}>Browse Items</h1>
              <p className="text-[13.5px] mt-1" style={{ color:"#667085" }}>
                Search through all lost and found reports across campus.
              </p>
            </motion.div>

            {/* ── SEARCH + LOCATION + DATE ─────────── */}
            <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.3, delay:0.05 }}
              className="flex flex-col sm:flex-row gap-3 mb-5">

              {/* Search */}
              <motion.div animate={{ boxShadow: searchFocus?"0 0 0 3px rgba(91,230,58,0.1)":"none" }}
                className="flex-1 flex items-center gap-3 h-[44px] px-4 rounded-xl border transition-all duration-150"
                style={{
                  background:"#fff",
                  borderColor: searchFocus?"#5BE63A":"#E5E7EB",
                }}>
                <svg width="15" height="15" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input value={search}
                  onChange={(e)=>{ setSearch(e.target.value); setCurrentPage(1); }}
                  onFocus={()=>setSearchFocus(true)} onBlur={()=>setSearchFocus(false)}
                  placeholder="Search for items (e.g. 'Blue Wallet', 'AirPods')"
                  className="bg-transparent text-[13px] focus:outline-none flex-1"
                  style={{ color:"#1A1A1A" }}/>
                <AnimatePresence>
                  {search && (
                    <motion.button initial={{ opacity:0,scale:0.8 }} animate={{ opacity:1,scale:1 }} exit={{ opacity:0,scale:0.8 }}
                      onClick={()=>setSearch("")}
                      className="w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-150 flex-shrink-0"
                      style={{ color:"#9CA3AF" }}
                      onMouseEnter={e=>{ e.currentTarget.style.background="#FEF2F2"; e.currentTarget.style.color="#DC2626"; }}
                      onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#9CA3AF"; }}>
                      <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Location */}
              <div className="relative flex-shrink-0">
                <select value={location} onChange={(e)=>setLocation(e.target.value)}
                  className="h-[44px] appearance-none rounded-xl px-4 pr-9 text-[13px] transition-all duration-150 cursor-pointer min-w-[168px] outline-none"
                  style={{
                    background:"#fff", borderColor:"#E5E7EB", color:"#1A1A1A",
                    border:"1px solid #E5E7EB",
                  }}
                  onFocus={e=>e.currentTarget.style.borderColor="#5BE63A"}
                  onBlur={e=>e.currentTarget.style.borderColor="#E5E7EB"}>
                  {LOCATIONS.map((l)=><option key={l}>{l}</option>)}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="13" height="13" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </div>

              {/* Date */}
              <input type="date" value={date} onChange={(e)=>setDate(e.target.value)}
                className="h-[44px] rounded-xl px-4 text-[13px] transition-all duration-150 cursor-pointer outline-none flex-shrink-0"
                style={{ background:"#fff", border:"1px solid #E5E7EB", color: date?"#1A1A1A":"#9CA3AF" }}
                onFocus={e=>e.currentTarget.style.borderColor="#5BE63A"}
                onBlur={e=>e.currentTarget.style.borderColor="#E5E7EB"}/>
            </motion.div>

            {/* ── STATUS TABS + CATEGORY CHIPS ──────── */}
            <motion.div initial={{ opacity:0,y:8 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.3, delay:0.1 }}
              className="flex flex-wrap items-center gap-2 mb-6">

              {/* Status toggle */}
              <div className="flex rounded-xl overflow-hidden p-1 gap-1" style={{ background:"#F3F4F6" }}>
                {["All","Lost","Found"].map((s)=>{
                  const active = statusFilter===s;
                  return (
                    <motion.button key={s} whileTap={{ scale:0.95 }}
                      onClick={()=>{ setStatusFilter(s); setCurrentPage(1); }}
                      className="px-4 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all duration-150"
                      style={
                        active
                          ? { background: s==="Found"?"#D4F7C5":s==="Lost"?"#FEF3C7":"#1B3A2F",
                              color: s==="Found"?"#166534":s==="Lost"?"#92400E":"#5BE63A",
                              boxShadow:"0 2px 6px rgba(0,0,0,0.08)" }
                          : { background:"transparent", color:"#667085" }
                      }>
                      {s}
                    </motion.button>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="w-px h-5 hidden sm:block" style={{ background:"#E5E7EB" }}/>

              {/* Category chips */}
              {CATEGORY_FILTERS.map((cat)=>{
                const active = categoryFilters.includes(cat);
                return (
                  <motion.button key={cat} whileTap={{ scale:0.95 }}
                    onClick={()=>{ toggleCategory(cat); setCurrentPage(1); }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-150"
                    style={
                      active
                        ? { background:"#1B3A2F", color:"#5BE63A", border:"1.5px solid #1B3A2F" }
                        : { background:"#fff", color:"#667085", border:"1.5px solid #E5E7EB" }
                    }
                    onMouseEnter={e=>{ if(!active){ e.currentTarget.style.borderColor="#5BE63A"; e.currentTarget.style.color="#1B3A2F"; } }}
                    onMouseLeave={e=>{ if(!active){ e.currentTarget.style.borderColor="#E5E7EB"; e.currentTarget.style.color="#667085"; } }}>
                    {cat}
                    {active && (
                      <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    )}
                  </motion.button>
                );
              })}

              {/* Clear all */}
              <AnimatePresence>
                {hasActiveFilters && (
                  <motion.button initial={{ opacity:0,scale:0.9 }} animate={{ opacity:1,scale:1 }} exit={{ opacity:0,scale:0.9 }}
                    onClick={()=>{ setCategoryFilters([]); setStatusFilter("All"); setSearch(""); setDate(""); setCurrentPage(1); }}
                    className="text-[12px] font-semibold transition-colors duration-150"
                    style={{ color:"#EF4444" }}
                    onMouseEnter={e=>e.currentTarget.style.color="#B91C1C"}
                    onMouseLeave={e=>e.currentTarget.style.color="#EF4444"}>
                    Clear all
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ── RESULTS COUNT ─────────────────────── */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-[12.5px]" style={{ color:"#667085" }}>
                Showing{" "}
                <span className="font-bold" style={{ color:"#1A1A1A" }}>{filtered.length}</span>{" "}
                item{filtered.length!==1?"s":""}
                {search && <> for "<span style={{ color:"#5BE63A" }}>{search}</span>"</>}
              </p>
              {filtered.length>0 && (
                <p className="text-[12px]" style={{ color:"#9CA3AF" }}>
                  Page {currentPage} of {totalPages}
                </p>
              )}
            </div>

            {/* ── GRID ──────────────────────────────── */}
            {paginated.length===0 ? (
              <motion.div initial={{ opacity:0,y:12 }} animate={{ opacity:1,y:0 }}
                className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl"
                style={{ border:"1px solid #E5E7EB", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background:"#F3F4F6" }}>
                  <svg className="w-7 h-7" style={{ color:"#9CA3AF" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
                <p className="text-[14px] font-bold mb-1.5" style={{ color:"#1A1A1A" }}>No items found</p>
                <p className="text-[13px] text-center max-w-xs mb-6" style={{ color:"#9CA3AF" }}>
                  Try adjusting your search, filters, or date range
                </p>
                <motion.button whileHover={{ y:-1, boxShadow:"0 6px 16px rgba(27,58,47,0.25)" }} whileTap={{ scale:0.97 }}
                  onClick={()=>{ setCategoryFilters([]); setStatusFilter("All"); setSearch(""); setDate(""); }}
                  className="px-5 py-2.5 text-[13px] font-semibold rounded-xl"
                  style={{ background:"#1B3A2F", color:"#5BE63A", boxShadow:"0 2px 8px rgba(27,58,47,0.2)" }}>
                  Clear Filters
                </motion.button>
              </motion.div>
            ) : (
              <motion.div variants={stagger} initial="hidden" animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginated.map((item)=>(
                  <ItemCard key={item.id} item={item} onClick={()=>navigate(`/item/${item.id}`)}/>
                ))}
              </motion.div>
            )}

            {/* ── PAGINATION ────────────────────────── */}
            {filtered.length>ITEMS_PER_PAGE && (
              <Pagination current={currentPage} setCurrent={setCurrentPage} total={totalPages}/>
            )}
          </main>

          <Footer/>
        </div>
      </div>
    </div>
  );
}