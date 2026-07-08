import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { updateClaimStatus, getClaimById } from "../services/claimService";
import { toast } from "react-toastify";


const claimAnswers = [
  {
    q: "Can you unlock the device with the password?",
    a: "Yes — it's a 6-digit passcode set to my birth year combined with my dog's name initials.",
    match: true,
  },
  {
    q: "Describe any specific scratches or markings.",
    a: "There's a small scratch on the bottom-left corner near the hinge, and a faint sticker residue mark on the lid where I used to have a sticker.",
    match: true,
  },
  {
    q: "When and where did you lose it?",
    a: "I left it at the quiet study zone on the 2nd floor of the Main Library on Tuesday afternoon, around 3 PM, after a study session.",
    match: true,
  },
];

/* ── ICON COMPONENTS ────────────────────────────────── */
const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <polyline points="2,6 5,9 10,3" />
  </svg>
);

const XIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CheckCircleIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" />
  </svg>
);

const LaptopSVG = () => (
  <svg viewBox="0 0 560 420" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="560" height="420" fill="#e8ecf0" />
    <rect x="120" y="70" width="320" height="200" rx="10" fill="#c8ccd2" />
    <rect x="130" y="80" width="300" height="180" rx="6" fill="#1e2027" />
    <rect x="80" y="270" width="400" height="18" rx="6" fill="#b5b9c2" />
    <rect x="210" y="274" width="140" height="10" rx="4" fill="#9ca0aa" />
    <circle cx="280" cy="170" r="8" fill="#3a3f4a" />
  </svg>
);

/* ── SHARED INPUT STYLE ─────────────────────────────── */
const inputCls = `w-full text-[13px] border rounded-xl px-3.5 py-2.5 outline-none resize-none transition-all duration-150
  bg-[#F8FAF8] border-[#E5E7EB] text-[#1A1A1A] placeholder-gray-400
  hover:border-[#5BE63A]/40 hover:bg-white
  focus:border-[#5BE63A] focus:bg-white focus:ring-4 focus:ring-[#5BE63A]/10`;

/* ── CONFIDENCE RING ────────────────────────────────── */
function ConfidenceRing({ value }) {
  const r = 18, circ = 2 * Math.PI * r, offset = circ - (value / 100) * circ;
  return (
    <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
      <svg className="absolute inset-0 -rotate-90" width="56" height="56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#F3F4F6" strokeWidth="3.5" />
        <motion.circle cx="28" cy="28" r={r} fill="none" stroke="#5BE63A" strokeWidth="3.5"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          strokeLinecap="round" />
      </svg>
      <span className="text-[11px] font-black z-10" style={{ color: "#1B3A2F" }}>{value}%</span>
    </div>
  );
}


function Topbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = user?.fullName?.split(" ").map((w) => w[0]).join("").toUpperCase() || "JD";

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
            const active = i === 2;
            return (
              <button key={l}
                onClick={() => { if (l === "Browse") navigate("/browse"); else if (l === "Report") navigate("/report"); else navigate("/matching"); }}
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
        {[
          { icon: <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> },
          { icon: <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, onClick: () => navigate("/settings") },
        ].map((btn, i) => (
          <motion.button key={i} onClick={btn.onClick}
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
            className="w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-150"
            style={{ color: "#667085" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#F0FDF4"; e.currentTarget.style.color = "#1B3A2F"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#667085"; }}>
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


export default function ClaimPage() {
  const [decision,       setDecision]       = useState(null);
  const [showRejectNote, setShowRejectNote] = useState(false);
  const [note,           setNote]           = useState("");
  const [claim,          setClaim]          = useState(null);
  const [loading,        setLoading]        = useState(true);

  const { id }    = useParams();
  const navigate  = useNavigate();

  useEffect(() => { fetchClaim(); }, []);

  const fetchClaim = async () => {
    try {
      const res = await getClaimById(id);
      setClaim(res.data.claim);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (claimId, status) => {
    try {
      await updateClaimStatus(claimId, status);
      setDecision(status);
      toast.success(`Claim ${status} successfully`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update claim");
    }
  };

  /* ── LOADING ──────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#F8FAF8" }}>
        <Topbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "#F0FDF4" }}>
              <svg className="w-6 h-6 animate-spin" style={{ color: "#5BE63A" }} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <p className="text-[13.5px] font-semibold" style={{ color: "#667085" }}>Loading claim…</p>
          </div>
        </div>
      </div>
    );
  }

  /* ── NOT FOUND ────────────────────────────────────── */
  if (!claim) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#F8FAF8" }}>
        <Topbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "#F3F4F6" }}>
              <svg className="w-7 h-7" style={{ color: "#9CA3AF" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-[15px] font-bold mb-1.5" style={{ color: "#1A1A1A" }}>Claim not found</p>
            <button onClick={() => navigate("/dashboard")}
              className="mt-3 px-5 py-2.5 rounded-xl text-[13px] font-semibold"
              style={{ background: "#1B3A2F", color: "#5BE63A" }}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const claimantInitials = claim.claimant.fullName.split(" ").map((n) => n[0]).join("").toUpperCase();

  /* Status config */
  const statusCfg = {
    pending:  { bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B", ring: "#FDE68A", label: "Pending" },
    approved: { bg: "#D4F7C5", text: "#1B3A2F", dot: "#5BE63A", ring: "#A3E890", label: "Approved" },
    rejected: { bg: "#FEE2E2", text: "#991B1B", dot: "#EF4444", ring: "#FECACA", label: "Rejected" },
  };
  const sc = statusCfg[claim.status] || statusCfg.pending;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F8FAF8" }}>
      <Topbar />

      {/* BREADCRUMB */}
      <div className="max-w-5xl mx-auto w-full px-5 sm:px-8 py-3 flex items-center gap-1.5 text-[12px]"
        style={{ color: "#9CA3AF" }}>
        <button onClick={() => navigate("/dashboard")}
          className="transition-colors duration-150"
          onMouseEnter={e => e.currentTarget.style.color = "#5BE63A"}
          onMouseLeave={e => e.currentTarget.style.color = "#9CA3AF"}>Home</button>
        <span>›</span>
        <button onClick={() => navigate("/matching")}
          className="transition-colors duration-150"
          onMouseEnter={e => e.currentTarget.style.color = "#5BE63A"}
          onMouseLeave={e => e.currentTarget.style.color = "#9CA3AF"}>Matching</button>
        <span>›</span>
        <span style={{ color: "#667085" }}>Review Claim</span>
      </div>

      <div className="max-w-5xl mx-auto w-full px-5 sm:px-8 pb-16 flex-1">

        {/* Decision banner */}
        <AnimatePresence>
          {decision && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
              className="mb-6 flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-semibold"
              style={{
                background: decision === "approved" ? "#F0FDF4" : "#FEF2F2",
                border: `1px solid ${decision === "approved" ? "#A3E890" : "#FECACA"}`,
                color: decision === "approved" ? "#1B3A2F" : "#DC2626",
              }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: decision === "approved" ? "#5BE63A" : "#EF4444" }}>
                {decision === "approved"
                  ? <CheckCircleIcon size={16} />
                  : <XIcon size={15} />}
              </div>
              {decision === "approved"
                ? "Claim approved. The claimant has been notified to arrange pickup."
                : "Claim rejected. The claimant has been notified."}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

          {/* ── LEFT COLUMN ─────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32 }} className="flex flex-col gap-5">

            {/* Item summary card */}
            <div className="bg-white rounded-2xl p-4 flex items-center gap-4"
              style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div className="w-20 h-14 rounded-xl overflow-hidden flex-shrink-0"
                style={{ background: "#EEF3E8", border: "1px solid #C9DFC0" }}>
                {claim.item.images?.[0]
                  ? <img src={claim.item.images[0]} alt={claim.item.title} className="w-full h-full object-cover" />
                  : <LaptopSVG />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: "#F0FDF4", color: "#1B3A2F", border: "1px solid #A3E890" }}>
                    {claim.item.category}
                  </span>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5"
                    style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.ring}` }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }} />
                    {sc.label}
                  </span>
                </div>
                <p className="text-[14px] font-bold truncate" style={{ color: "#1A1A1A" }}>{claim.item.title}</p>
                <p className="text-[12px] mt-0.5" style={{ color: "#9CA3AF" }}>
                  {claim.item.location?.name} · {new Date(claim.item.dateLostOrFound).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Claimant details */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.9px] mb-3" style={{ color: "#9CA3AF" }}>
                Claimant Details
              </p>
              <div className="bg-white rounded-2xl p-5"
                style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-[14px] flex-shrink-0"
                    style={{ background: "#1B3A2F", color: "#5BE63A" }}>
                    {claimantInitials}
                  </div>
                  <div>
                    <p className="text-[13.5px] font-bold" style={{ color: "#1A1A1A" }}>{claim.claimant.fullName}</p>
                    <p className="text-[12px]" style={{ color: "#9CA3AF" }}>Student</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5 p-4 rounded-xl"
                  style={{ background: "#F8FAF8", border: "1px solid #E5E7EB" }}>
                  {[
                    { label: "Email",           val: claim.claimant.email },
                    { label: "Phone",           val: "+91 98765 43210" },
                    { label: "Claim Submitted", val: new Date(claim.createdAt).toLocaleDateString() },
                    { label: "Claim ID",        val: claim._id.slice(-8), red: true },
                  ].map(({ label, val, red }) => (
                    <div key={label}>
                      <p className="text-[10px] font-bold uppercase tracking-[0.7px] mb-1"
                        style={{ color: "#9CA3AF" }}>{label}</p>
                      <p className="text-[13px] font-semibold truncate"
                        style={{ color: red ? "#EF4444" : "#1A1A1A" }}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Verification responses */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.9px] mb-3" style={{ color: "#9CA3AF" }}>
                Verification Responses
              </p>
              <div className="flex flex-col gap-3">
                {claimAnswers.map((item, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.07 }}
                    className="bg-white rounded-2xl p-5"
                    style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <p className="text-[13.5px] font-semibold" style={{ color: "#1A1A1A" }}>{item.q}</p>
                      {item.match && (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                          style={{ background: "#F0FDF4", color: "#1B3A2F", border: "1px solid #A3E890" }}>
                          <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="#5BE63A" strokeWidth={2.5}>
                            <polyline points="2,6 5,9 10,3" />
                          </svg>
                          Matches
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] leading-relaxed" style={{ color: "#667085" }}>{item.a}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT — Decision panel ────────────────── */}
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.32, delay: 0.1 }}>
            <div className="bg-white rounded-2xl p-5 sticky top-20"
              style={{ border: "1px solid #E5E7EB", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>

              {/* Match confidence */}
              <p className="text-[10px] font-black uppercase tracking-[0.9px] mb-3" style={{ color: "#9CA3AF" }}>
                Match Confidence
              </p>
              <div className="flex items-center gap-3 mb-6 p-3.5 rounded-xl"
                style={{ background: "#F0FDF4", border: "1px solid #C9DFC0" }}>
                <ConfidenceRing value={91} />
                <div className="flex-1">
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#D4F7C5" }}>
                    <motion.div className="h-full rounded-full" style={{ background: "#5BE63A" }}
                      initial={{ width: "0%" }}
                      animate={{ width: "91%" }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.4 }} />
                  </div>
                  <p className="text-[11.5px] font-semibold mt-1.5" style={{ color: "#1B3A2F" }}>
                    High confidence match
                  </p>
                </div>
              </div>

              {/* Decision checklist */}
              <p className="text-[10px] font-black uppercase tracking-[0.9px] mb-3" style={{ color: "#9CA3AF" }}>
                Decision Checklist
              </p>
              <div className="flex flex-col gap-2.5 mb-6">
                {[
                  "Description matches found item",
                  "Unlock method confirmed",
                  "Location & time consistent",
                ].map((text) => (
                  <div key={text} className="flex items-start gap-2.5 text-[13px]" style={{ color: "#1A1A1A" }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "#F0FDF4", border: "1.5px solid #A3E890" }}>
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#5BE63A" strokeWidth={2.5}>
                        <polyline points="2,6 5,9 10,3" />
                      </svg>
                    </div>
                    {text}
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              {!decision ? (
                <div className="flex flex-col gap-2.5">
                  <motion.button
                    whileHover={{ y: -2, boxShadow: "0 8px 20px rgba(91,230,58,0.28)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleUpdate(claim._id, "approved")}
                    className="w-full py-3 rounded-xl text-[13.5px] font-bold flex items-center justify-center gap-2 transition-all duration-150"
                    style={{ background: "#1B3A2F", color: "#5BE63A", boxShadow: "0 3px 10px rgba(27,58,47,0.2)" }}>
                    <CheckCircleIcon size={16} />
                    Approve Claim
                  </motion.button>

                  <motion.button
                    whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setShowRejectNote((v) => !v)}
                    className="w-full py-2.5 rounded-xl text-[13.5px] font-semibold flex items-center justify-center gap-2 transition-all duration-150"
                    style={{ border: "1.5px solid #FECACA", color: "#DC2626", background: "#FEF2F2" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#DC2626"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#DC2626"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.color = "#DC2626"; e.currentTarget.style.borderColor = "#FECACA"; }}>
                    <XIcon size={14} />
                    Reject Claim
                  </motion.button>

                  <AnimatePresence>
                    {showRejectNote && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                        className="overflow-hidden">
                        <textarea
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="Add a reason for rejecting (optional)…"
                          rows={3}
                          className={inputCls} />
                        <motion.button
                          whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
                          onClick={() => handleUpdate(claim._id, "rejected")}
                          className="w-full mt-2 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all duration-150"
                          style={{ background: "#EF4444", boxShadow: "0 2px 8px rgba(239,68,68,0.25)" }}>
                          Confirm Rejection
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-1">
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-bold"
                    style={{
                      background: decision === "approved" ? "#F0FDF4" : "#FEF2F2",
                      color: decision === "approved" ? "#1B3A2F" : "#DC2626",
                      border: `1px solid ${decision === "approved" ? "#A3E890" : "#FECACA"}`,
                    }}>
                    {decision === "approved" ? <CheckCircleIcon size={15} /> : <XIcon size={13} />}
                    {decision === "approved" ? "Approved" : "Rejected"}
                  </motion.div>
                  <button
                    onClick={() => { setDecision(null); setNote(""); setShowRejectNote(false); }}
                    className="block mx-auto mt-3 text-[12px] font-medium transition-colors duration-150"
                    style={{ color: "#9CA3AF" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#5BE63A"}
                    onMouseLeave={e => e.currentTarget.style.color = "#9CA3AF"}>
                    Undo decision
                  </button>
                </div>
              )}

              {/* Reviewer card */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl mt-5"
                style={{ background: "#F8FAF8", border: "1px solid #E5E7EB" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                  style={{ background: "#1B3A2F", color: "#5BE63A" }}>JS</div>
                <div className="flex-1">
                  <p className="text-[13px] font-bold" style={{ color: "#1A1A1A" }}>Jane Smith</p>
                  <p className="text-[11.5px]" style={{ color: "#9CA3AF" }}>Reviewing as Library Staff</p>
                </div>
                <div className="w-2 h-2 rounded-full" style={{ background: "#5BE63A" }} />
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