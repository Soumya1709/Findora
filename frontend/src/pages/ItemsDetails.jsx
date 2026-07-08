import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getItemById, getSimilarItems } from "../services/itemService";
import { createClaim, checkCanViewOwner } from "../services/claimService";
import NotificationBell from "../components/NotificationBell";
import { toast } from "react-toastify";





const LaptopSVG = ({ className = "" }) => (
  <svg viewBox="0 0 560 420" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="560" height="420" fill="#e8ecf0" />
    <rect x="120" y="70" width="320" height="200" rx="10" fill="#c8ccd2" />
    <rect x="130" y="80" width="300" height="180" rx="6" fill="#1e2027" />
    <rect x="80" y="270" width="400" height="18" rx="6" fill="#b5b9c2" />
    <rect x="210" y="274" width="140" height="10" rx="4" fill="#9ca0aa" />
    <circle cx="280" cy="170" r="8" fill="#3a3f4a" />
  </svg>
);

const KeyboardSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="100" height="100" fill="#dde1e8" />
    <rect x="10" y="20" width="80" height="50" rx="4" fill="#b0b5bf" />
    <rect x="14" y="24" width="72" height="42" rx="2" fill="#2a2d35" />
    <rect x="5" y="70" width="90" height="7" rx="3" fill="#a8acb6" />
  </svg>
);

const AppleSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="100" height="100" fill="#e2e6ec" />
    <circle cx="50" cy="46" r="22" fill="#c5c9d0" />
    <circle cx="50" cy="46" r="16" fill="#9ea3ad" />
    <circle cx="50" cy="46" r="6" fill="#d1d5de" />
  </svg>
);

const MapSVG = () => (
  <svg viewBox="0 0 600 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="600" height="160" fill="#EEF3E8" />
    {[40, 80, 120].map((y) => <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#C9DFC0" strokeWidth="1" />)}
    {[100, 200, 300, 400, 500].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="160" stroke="#C9DFC0" strokeWidth="1" />)}
    <rect x="30"  y="20" width="55" height="40" rx="3" fill="#C9DFC0" />
    <rect x="120" y="10" width="60" height="55" rx="3" fill="#c5dab8" />
    <rect x="220" y="30" width="45" height="35" rx="3" fill="#C9DFC0" />
    <rect x="330" y="15" width="70" height="50" rx="3" fill="#bcd8b0" />
    <rect x="440" y="25" width="50" height="40" rx="3" fill="#C9DFC0" />
    <rect x="50"  y="90" width="65" height="45" rx="3" fill="#C9DFC0" />
    <rect x="160" y="85" width="80" height="55" rx="3" fill="#c5dab8" />
    <rect x="290" y="90" width="55" height="50" rx="3" fill="#C9DFC0" />
    <rect x="390" y="80" width="75" height="60" rx="3" fill="#bcd8b0" />
    <rect x="500" y="88" width="60" height="52" rx="3" fill="#C9DFC0" />
    <rect x="0"   y="68" width="600" height="14" fill="#D4F7C5" opacity="0.6" />
    <rect x="270" y="0"  width="20"  height="160" fill="#D4F7C5" opacity="0.6" />
    <circle cx="300" cy="75" r="14" fill="#5BE63A" opacity="0.18" />
    <circle cx="300" cy="75" r="8"  fill="#1B3A2F" />
    <circle cx="300" cy="75" r="3"  fill="white" />
  </svg>
);


const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
};


function Navbar({ initials }) {
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
          {["Browse", "Report", "Matching"].map((l, i) => {
            const active = i === 0;
            return (
              <button key={l}
                onClick={() => { if (l==="Browse") navigate("/browse"); else if (l==="Report") navigate("/report"); else navigate("/matching"); }}
                className="px-3.5 py-2 rounded-xl text-[13px] transition-all duration-150"
                style={{ background: active ? "rgba(91,230,58,0.1)" : "transparent", color: active ? "#1B3A2F" : "#667085", fontWeight: active ? 700 : 500 }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "#F0FDF4"; e.currentTarget.style.color = "#1B3A2F"; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#667085"; } }}>
                {l}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right icons */}
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
        <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold cursor-pointer"
          style={{ background: "#1B3A2F", color: "#5BE63A", border: "2px solid #E5E7EB", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          {initials}
        </motion.div>
      </div>
    </header>
  );
}


function OwnerModal({ item, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }} transition={{ duration: 0.22, ease: "easeOut" }}
        className="bg-white rounded-2xl w-full max-w-sm overflow-hidden"
        style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.18)", border: "1px solid #E5E7EB" }}
        onClick={e => e.stopPropagation()}>
        {/* Modal header — forest green */}
        <div className="px-5 py-4 flex items-center justify-between" style={{ background: "#1B3A2F" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(91,230,58,0.15)" }}>
              <svg width="15" height="15" fill="none" stroke="#5BE63A" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-[14px] font-bold text-white">Owner Information</h3>
          </div>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors duration-150"
            style={{ color: "rgba(255,255,255,0.5)" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>

        {/* Modal body */}
        <div className="p-5 space-y-3.5">
          {[
            { label: "Full Name", val: item.reportedBy?.fullName, icon: <svg width="14" height="14" fill="none" stroke="#5BE63A" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
            { label: "Email",     val: item.reportedBy?.email,    icon: <svg width="14" height="14" fill="none" stroke="#5BE63A" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
            { label: "Phone",     val: item.reportedBy?.phoneNumber, icon: <svg width="14" height="14" fill="none" stroke="#5BE63A" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> },
          ].map(({ label, val, icon }) => (
            <div key={label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#F8FAF8", border: "1px solid #E5E7EB" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#F0FDF4" }}>
                {icon}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#9CA3AF" }}>{label}</p>
                <p className="text-[13px] font-semibold mt-0.5" style={{ color: "#1A1A1A" }}>{val || "—"}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 pb-5">
          <motion.button whileHover={{ y: -1, boxShadow: "0 6px 16px rgba(27,58,47,0.25)" }} whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="w-full py-3 rounded-xl text-[13px] font-bold"
            style={{ background: "#1B3A2F", color: "#5BE63A" }}>
            Close
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}


export default function ItemsDetails() {
  const { id } = useParams();
  const [activeThumb,    setActiveThumb]    = useState(0);
  const [item,           setItem]           = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [similarItems,   setSimilarItems]   = useState([]);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [canViewOwner,   setCanViewOwner]   = useState(false);
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => { fetchItem(); }, [id]);

  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const res = await checkCanViewOwner(id);
        setCanViewOwner(res.data.canViewOwner);
      } catch (error) { console.error(error); }
    };
    fetchPermission();
  }, [id]);

  const fetchItem = async () => {
    try {
      const res = await getItemById(id);
      setItem(res.data.item);
      const similarRes = await getSimilarItems(id);
      setSimilarItems(similarRes.data.items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ── LOADING ──────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8FAF8" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "#F0FDF4" }}>
            <svg className="w-6 h-6 animate-spin" style={{ color: "#5BE63A" }} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <p className="text-[13.5px] font-semibold" style={{ color: "#667085" }}>Loading item…</p>
        </div>
      </div>
    );
  }

  /* ── NOT FOUND ────────────────────────────────────── */
  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#F8FAF8" }}>
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "#F3F4F6" }}>
            <svg className="w-7 h-7" style={{ color: "#9CA3AF" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-[15px] font-bold" style={{ color: "#1A1A1A" }}>Item not found</p>
          <button onClick={() => navigate("/browse")} className="mt-4 px-5 py-2.5 rounded-xl text-[13px] font-semibold"
            style={{ background: "#1B3A2F", color: "#5BE63A" }}>
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const user      = JSON.parse(localStorage.getItem("user") || "{}");
  const initials  = user?.fullName?.split(" ").map((w) => w[0]).join("").toUpperCase() || "U";
  const isFound   = item?.type === "found";

  const handleClaim = async () => {
    try {
      const res = await createClaim(item._id);
      console.log(res.data);
      toast.success("Claim request submitted successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create claim");
    }
  };
  const shareUrl = window.location.href;

  const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to copy link");
  }
};

const shareWhatsapp = () => {
  window.open(
    `https://wa.me/?text=${encodeURIComponent(shareUrl)}`,
    "_blank"
  );
};

const shareTelegram = () => {
  window.open(
    `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`,
    "_blank"
  );
};

const shareFacebook = () => {
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    "_blank"
  );
};

const shareEmail = () => {
  window.location.href =
    `mailto:?subject=Check out this item on Findora&body=${encodeURIComponent(shareUrl)}`;
};

  const reporterInitials = item.reportedBy?.fullName?.split(" ").map((n) => n[0]).join("").toUpperCase();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F8FAF8" }}>
      <Navbar initials={initials} />

      {/* BREADCRUMB */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-3 flex items-center gap-1.5 text-[12px]" style={{ color: "#9CA3AF" }}>
        <button onClick={() => navigate("/dashboard")}
          className="transition-colors duration-150"
          onMouseEnter={e => e.currentTarget.style.color = "#5BE63A"}
          onMouseLeave={e => e.currentTarget.style.color = "#9CA3AF"}>Home</button>
        <span>›</span>
        <button onClick={() => navigate("/browse")}
          className="transition-colors duration-150"
          onMouseEnter={e => e.currentTarget.style.color = "#5BE63A"}
          onMouseLeave={e => e.currentTarget.style.color = "#9CA3AF"}>{item?.category}</button>
        <span>›</span>
        <span style={{ color: "#667085" }}>{item?.brand || item?.title}</span>
      </div>

      <div className="max-w-5xl mx-auto w-full px-5 sm:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

          {/* ── LEFT COLUMN ─────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3]"
              style={{ background: "#EEF3E8", border: "1px solid #E5E7EB" }}>
              {item?.images?.length ? (
                <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <LaptopSVG className="w-full h-full" />
              )}
              {/* Status badge */}
              <span className="absolute top-3 left-3 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 capitalize"
                style={{
                  background: isFound ? "#D4F7C5" : "#FEF3C7",
                  color: isFound ? "#1B3A2F" : "#92400E",
                  border: `1px solid ${isFound ? "#A3E890" : "#FDE68A"}`,
                }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: isFound ? "#5BE63A" : "#F59E0B" }} />
                {item?.type}
              </span>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 mt-3">
              {[<KeyboardSVG />, <AppleSVG />, null].map((Thumb, i) => (
                <motion.div key={i} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveThumb(i)}
                  className="flex-1 aspect-square rounded-xl overflow-hidden cursor-pointer relative transition-all duration-150"
                  style={{
                    background: "#EEF3E8",
                    border: `2px solid ${activeThumb === i ? "#5BE63A" : "#E5E7EB"}`,
                    boxShadow: activeThumb === i ? "0 0 0 3px rgba(91,230,58,0.15)" : "none",
                  }}>
                  {i < 2 ? Thumb : (
                    <>
                      <div className="w-full h-full" style={{ background: "#E5E7EB" }} />
                      <div className="absolute inset-0 flex items-center justify-center text-[13px] font-semibold rounded-lg"
                        style={{ background: "rgba(27,58,47,0.5)", color: "#5BE63A" }}>
                        +2 More
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Map */}
            <div className="mt-4 rounded-2xl overflow-hidden relative" style={{ height: 160, border: "1px solid #C9DFC0" }}>
              <MapSVG />
              <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[12px] font-medium"
                style={{ background: "rgba(255,255,255,0.92)", border: "1px solid #E5E7EB", color: "#1A1A1A" }}>
                <div className="w-2 h-2 rounded-full" style={{ background: "#5BE63A" }} />
                {item?.location?.name}
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN ────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08 }}>

            {/* Tags */}
            <div className="flex gap-2 flex-wrap mb-3">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: "#F0FDF4", color: "#1B3A2F", border: "1px solid #A3E890" }}>
                {item?.category}
              </span>
              {item?.brand && (
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: "#F8FAF8", color: "#667085", border: "1px solid #E5E7EB" }}>
                  {item?.brand}
                </span>
              )}
            </div>

            <h1 className="text-[22px] font-bold tracking-tight leading-tight mb-2.5" style={{ color: "#1A1A1A" }}>
              {item?.title}
            </h1>

            <p className="text-[13.5px] leading-relaxed mb-5" style={{ color: "#667085" }}>
              {item?.description}
            </p>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-3.5 p-4 rounded-2xl mb-5"
              style={{ background: "#F8FAF8", border: "1px solid #E5E7EB" }}>
              {[
                { label: "Category",     val: item?.category },
                { label: "Brand",        val: item?.brand || "—" },
                { label: "Date",         val: new Date(item?.dateLostOrFound).toLocaleDateString() },
                { label: "Reference ID", val: `#${item?._id?.slice(-6)}`, red: true },
              ].map(({ label, val, red }) => (
                <div key={label}>
                  <div className="text-[10px] font-bold uppercase tracking-[0.8px] mb-1" style={{ color: "#9CA3AF" }}>{label}</div>
                  <div className="text-[13px] font-semibold" style={{ color: red ? "#EF4444" : "#1A1A1A" }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Primary CTA — only for found items not owned by current user */}
            {item.type === "found" && item.reportedBy?._id !== user.id && (
              <motion.button onClick={handleClaim}
                whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(91,230,58,0.3)" }} whileTap={{ scale: 0.97 }}
                className="w-full py-3 rounded-xl text-[13.5px] font-bold flex items-center justify-center gap-2 transition-all duration-150"
                style={{ background: "#5BE63A", color: "#1B3A2F", boxShadow: "0 3px 10px rgba(91,230,58,0.22)" }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                </svg>
                Is This Mine?
              </motion.button>
            )}

            {/* Share button */}
            <motion.button onClick={() => setShowShareModal(true)} whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
              className="w-full mt-2.5 py-2.5 rounded-xl text-[13px] font-medium flex items-center justify-center gap-2 transition-all duration-150"
              style={{ border: "1.5px solid #E5E7EB", color: "#667085", background: "#fff" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#5BE63A"; e.currentTarget.style.color = "#1B3A2F"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.color = "#667085"; }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Share with Others
            </motion.button>

            {/* Verification Checklist */}
            <div className="mt-5 mb-3 text-[10px] font-bold uppercase tracking-[0.9px]" style={{ color: "#9CA3AF" }}>
              Verification Checklist
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                "Must be able to unlock with password",
                "Describe any specific scratches or markings",
                "Valid Student ID required for handover",
              ].map((text) => (
                <div key={text} className="flex items-start gap-2.5 text-[13px]" style={{ color: "#1A1A1A" }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "#F0FDF4", border: "1.5px solid #A3E890" }}>
                    <svg width="10" height="10" fill="none" stroke="#5BE63A" viewBox="0 0 12 12" strokeWidth={2.5}>
                      <polyline points="2,6 5,9 10,3" />
                    </svg>
                  </div>
                  {text}
                </div>
              ))}
            </div>

            {/* Reporter / Owner card */}
            <div className="flex items-center justify-between gap-3 p-4 rounded-2xl mt-5"
              style={{ border: "1.5px solid #E5E7EB", background: "#fff" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0"
                  style={{ background: "#1B3A2F", color: "#5BE63A" }}>
                  {reporterInitials}
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#9CA3AF" }}>Reported By</p>
                  <p className="text-[13px] font-bold" style={{ color: "#1A1A1A" }}>{item.reportedBy?.fullName}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <motion.button
                  disabled={!canViewOwner}
                  onClick={() => setShowOwnerModal(true)}
                  whileHover={canViewOwner ? { y: -1 } : {}}
                  whileTap={canViewOwner ? { scale: 0.97 } : {}}
                  className="text-[12px] font-semibold px-3 py-2 rounded-xl transition-all duration-150"
                  style={
                    canViewOwner
                      ? { border: "1.5px solid #C9DFC0", color: "#1B3A2F", background: "#F0FDF4", cursor: "pointer" }
                      : { background: "#F3F4F6", color: "#9CA3AF", cursor: "not-allowed", border: "1.5px solid #F3F4F6" }
                  }
                  onMouseEnter={e => { if (canViewOwner) { e.currentTarget.style.background = "#1B3A2F"; e.currentTarget.style.color = "#5BE63A"; } }}
                  onMouseLeave={e => { if (canViewOwner) { e.currentTarget.style.background = "#F0FDF4"; e.currentTarget.style.color = "#1B3A2F"; } }}>
                  Owner Info
                </motion.button>
                {!canViewOwner && (
                  <p className="text-[10px]" style={{ color: "#9CA3AF" }}>After claim approval</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── SIMILAR ITEMS ───────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.18 }}
          className="mt-12">
          <h2 className="text-[15px] font-bold mb-4 flex items-center gap-2" style={{ color: "#1A1A1A" }}>
            <span className="w-1 h-4 rounded-full inline-block" style={{ background: "#5BE63A" }} />
            Similar Found Items
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {similarItems.map((sim) => (
              <motion.div key={sim._id}
                whileHover={{ y: -4, boxShadow: "0 10px 28px rgba(0,0,0,0.09)" }}
                onClick={() => navigate(`/item/${sim._id}`)}
                className="bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-200"
                style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div className="aspect-[4/3] relative overflow-hidden" style={{ background: "#F8FAF8" }}>
                  <img
                    src={sim.images?.[0] || "https://placehold.co/400x300"}
                    alt={sim.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(to top,rgba(0,0,0,0.28) 0%,transparent 55%)" }} />
                  <span className="absolute top-2.5 left-2.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full capitalize"
                    style={{
                      background: sim.type === "found" ? "#D4F7C5" : "#FEF3C7",
                      color: sim.type === "found" ? "#1B3A2F" : "#92400E",
                      border: `1px solid ${sim.type === "found" ? "#A3E890" : "#FDE68A"}`,
                    }}>
                    {sim.type}
                  </span>
                </div>
                <div className="p-3.5">
                  <p className="text-[13.5px] font-bold truncate mb-0.5" style={{ color: "#1A1A1A" }}>{sim.title}</p>
                  <p className="text-[12px] mb-2.5" style={{ color: "#9CA3AF" }}>{sim.location?.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[11.5px] font-semibold" style={{ color: "#5BE63A" }}>{sim.category}</span>
                    <span className="text-[11px]" style={{ color: "#9CA3AF" }}>
                      {new Date(sim.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* OWNER MODAL */}
      <AnimatePresence>
        {showOwnerModal && (
          <OwnerModal item={item} onClose={() => setShowOwnerModal(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
  {showShareModal && (
    <>
      <motion.div
  className="fixed inset-0 z-50 backdrop-blur-lg bg-white/10"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  onClick={() => setShowShareModal(false)}
/>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ duration: 0.25 }}
        className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-2xl overflow-hidden"
      >

        {/* Header */}

        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">

          <div>

            <h2 className="text-xl font-bold text-[#1B3A2F]">
              Share Item
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Share this item with your friends.
            </p>

          </div>

          <button
            onClick={() => setShowShareModal(false)}
            className="text-gray-400 hover:text-gray-700 text-xl"
          >
            ✕
          </button>

        </div>

        {/* Body */}

        <div className="p-6">

          <button
            onClick={copyLink}
            className="w-full mb-3 py-3 rounded-xl bg-[#5BE63A] text-[#1B3A2F] font-semibold hover:opacity-90 transition"
          >
            🔗 Copy Link
          </button>

          <div className="grid grid-cols-2 gap-3">

            <button
              onClick={shareWhatsapp}
              className="rounded-xl border border-gray-200 py-3 hover:bg-green-50 transition"
            >
              🟢 WhatsApp
            </button>

            <button
              onClick={shareTelegram}
              className="rounded-xl border border-gray-200 py-3 hover:bg-blue-50 transition"
            >
              ✈ Telegram
            </button>

            <button
              onClick={shareFacebook}
              className="rounded-xl border border-gray-200 py-3 hover:bg-blue-50 transition"
            >
              📘 Facebook
            </button>

            <button
              onClick={shareEmail}
              className="rounded-xl border border-gray-200 py-3 hover:bg-gray-100 transition"
            >
              ✉ Email
            </button>

          </div>

        </div>

      </motion.div>
    </>
  )}
</AnimatePresence>

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