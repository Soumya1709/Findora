import { useState, useRef, useEffect } from "react";
import { createItem, updateItem } from "../services/itemService";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";



const CATEGORIES = [
  "Electronics","Clothing","Books","ID / Cards",
  "Keys","Bags","Accessories","Sports","Other",
];

const COLORS = [
  { label:"Black",  hex:"#1a1a1a" },
  { label:"Gray",   hex:"#9ca3af" },
  { label:"Blue",   hex:"#2563eb" },
  { label:"Red",    hex:"#ef4444" },
  { label:"Green",  hex:"#22c55e" },
  { label:"Yellow", hex:"#eab308" },
  { label:"White",  hex:"#f9fafb", border:true },
  { label:"Brown",  hex:"#92400e" },
  { label:"Orange", hex:"#f97316" },
  { label:"Pink",   hex:"#ec4899" },
];

const CAMPUS_ZONES = [
  "Main Library Plaza","Science Block","Engineering Building",
  "North Campus","South Campus","Gym / Sports Complex",
  "Student Union","Cafeteria","Parking Lot","Dormitories",
];

const STEPS = ["General Details","Location & Time","Photos & Contact"];

/* ── ANIMATION VARIANTS ─────────────────────────────── */
const fadeUp = {
  hidden:{ opacity:0, y:14 },
  show:{ opacity:1, y:0, transition:{ duration:0.3, ease:[0.25,0.46,0.45,0.94] } },
};

/* ── SHARED INPUT CLASSES ───────────────────────────── */
const inputCls = `w-full px-4 py-3 text-[13.5px] rounded-xl border bg-[#F8FAF8]
  placeholder-gray-400 text-[#1A1A1A] transition-all duration-150 outline-none
  border-[#E5E7EB]
  hover:border-[#5BE63A]/50 hover:bg-white
  focus:border-[#5BE63A] focus:bg-white focus:ring-4 focus:ring-[#5BE63A]/10`;

const selectCls = `${inputCls} cursor-pointer appearance-none`;

const labelCls = `block text-[10.5px] font-bold text-[#667085] uppercase tracking-[0.8px] mb-2`;


function Topbar() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const initials = user?.fullName?.split(" ").map((w) => w[0]).join("").toUpperCase() || "U";
  const navigate = useNavigate();

  return (
    <header className="h-16 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-40"
      style={{
        background:"rgba(248,250,248,0.9)",
        backdropFilter:"blur(12px)",
        WebkitBackdropFilter:"blur(12px)",
        borderBottom:"1px solid #E5E7EB",
      }}>
      {/* Logo + Nav */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate("/dashboard")}>
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
          {["Browse","Report","Matching"].map((l) => {
            const active = l === "Report";
            return (
              <button key={l}
                onClick={() => {
                  if(l==="Browse") navigate("/browse");
                  else if(l==="Report") navigate("/report");
                  else navigate("/matching");
                }}
                className="px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-150"
                style={{
                  background: active ? "rgba(91,230,58,0.1)" : "transparent",
                  color: active ? "#1B3A2F" : "#667085",
                  fontWeight: active ? 700 : 500,
                }}
                onMouseEnter={e => { if(!active){ e.currentTarget.style.background="#F0FDF4"; e.currentTarget.style.color="#1B3A2F"; } }}
                onMouseLeave={e => { if(!active){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#667085"; } }}>
                {l}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {[
          { icon: <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>, dot:true, onClick:()=>{} },
          { icon: <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>, onClick:()=>navigate("/settings") },
        ].map((btn,i) => (
          <motion.button key={i} onClick={btn.onClick}
            whileHover={{ scale:1.08 }} whileTap={{ scale:0.92 }}
            className="relative w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-150"
            style={{ color:"#667085" }}
            onMouseEnter={e=>{ e.currentTarget.style.background="#F0FDF4"; e.currentTarget.style.color="#1B3A2F"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#667085"; }}>
            {btn.icon}
            {btn.dot && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F59E0B] border-2 border-white"/>}
          </motion.button>
        ))}
        <motion.div whileHover={{ scale:1.06 }} whileTap={{ scale:0.94 }}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold cursor-pointer"
          style={{ background:"#1B3A2F", color:"#5BE63A", border:"2px solid #E5E7EB", boxShadow:"0 2px 8px rgba(0,0,0,0.08)" }}>
          {initials}
        </motion.div>
      </div>
    </header>
  );
}


function ProgressStepper({ step }) {
  return (
    <div className="mb-8">
      {/* Step pills */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => {
          const n = i + 1;
          const done = n < step;
          const active = n === step;
          return (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2.5">
                {/* Circle */}
                <motion.div
                  animate={{ scale: active ? 1.1 : 1 }}
                  transition={{ type:"spring", stiffness:400, damping:20 }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                  style={{
                    background: done ? "#5BE63A" : active ? "#1B3A2F" : "#F3F4F6",
                    color: done ? "#1B3A2F" : active ? "#5BE63A" : "#9CA3AF",
                    boxShadow: active ? "0 0 0 4px rgba(91,230,58,0.15)" : "none",
                  }}>
                  {done ? (
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                  ) : n}
                </motion.div>
                {/* Label */}
                <span className="text-[12.5px] font-semibold hidden sm:block"
                  style={{ color: active ? "#1A1A1A" : done ? "#1B3A2F" : "#9CA3AF" }}>
                  {s}
                </span>
              </div>
              {/* Connector */}
              {i < STEPS.length - 1 && (
                <div className="flex-1 mx-3 h-[2px] rounded-full overflow-hidden" style={{ background:"#E5E7EB" }}>
                  <motion.div className="h-full rounded-full" style={{ background:"#5BE63A" }}
                    initial={{ width:"0%" }}
                    animate={{ width: done ? "100%" : "0%" }}
                    transition={{ duration:0.5, ease:"easeOut" }}/>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Progress bar */}
      <div className="mt-5 h-1 rounded-full overflow-hidden" style={{ background:"#F3F4F6" }}>
        <motion.div className="h-full rounded-full" style={{ background:"#5BE63A" }}
          animate={{ width:`${Math.round(((step)/STEPS.length)*100)}%` }}
          transition={{ duration:0.5, ease:"easeOut" }}/>
      </div>
    </div>
  );
}


function LivePreview({ form, previewImg }) {
  return (
    <div className="sticky top-24 space-y-4">
      {/* Preview card */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ border:"1px solid #E5E7EB", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom:"1px solid #F3F4F6" }}>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:"#5BE63A" }}/>
            <span className="text-[10.5px] font-bold uppercase tracking-[0.8px]" style={{ color:"#667085" }}>Live Preview</span>
          </div>
          <span className="text-[10.5px] font-semibold" style={{ color:"#5BE63A" }}>● Public View</span>
        </div>

        {/* Image */}
        <div className="relative">
          {previewImg ? (
            <img src={previewImg} alt="Preview" className="w-full h-40 object-cover"/>
          ) : (
            <div className="w-full h-40 flex items-center justify-center" style={{ background:"#F8FAF8" }}>
              <div className="text-center">
                <svg className="w-10 h-10 mx-auto mb-2" style={{ color:"#E5E7EB" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <p className="text-[11px]" style={{ color:"#9CA3AF" }}>No photo yet</p>
              </div>
            </div>
          )}
          <span className="absolute top-2.5 left-2.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full"
            style={{
              background: form.type === "lost" ? "#FEF3C7" : "#D4F7C5",
              color: form.type === "lost" ? "#92400E" : "#1B3A2F",
              border: `1px solid ${form.type === "lost" ? "#FDE68A" : "#A3E890"}`,
            }}>
            {form.type === "lost" ? "Lost" : "Found"}
          </span>
        </div>

        {/* Details */}
        <div className="p-4 space-y-2.5">
          <p className="text-[14px] font-bold leading-tight" style={{ color:"#1A1A1A" }}>
            {form.name || <span className="font-normal italic" style={{ color:"#D1D5DB" }}>Item name…</span>}
          </p>

          {[
            { icon:<svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>, val: form.category, placeholder:"Category" },
            { icon:<svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>, val: form.locationName, placeholder:"Location" },
            { icon:<svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, val:"Reported Today", placeholder:null },
          ].map((row,i) => (
            <div key={i} className="flex items-center gap-1.5 text-[12px]" style={{ color:"#667085" }}>
              <span style={{ color:"#9CA3AF" }}>{row.icon}</span>
              {row.val
                ? row.val
                : row.placeholder && <span className="italic" style={{ color:"#D1D5DB" }}>{row.placeholder}</span>}
            </div>
          ))}

          {form.description && (
            <p className="text-[11px] italic leading-relaxed line-clamp-2 pt-2" style={{ color:"#9CA3AF", borderTop:"1px solid #F3F4F6" }}>
              {form.description}
            </p>
          )}

          {form.primaryColor && (
            <div className="flex items-center gap-2 pt-1">
              <div className="w-3.5 h-3.5 rounded-full border border-[#E5E7EB]" style={{ background:form.primaryColor }}/>
              <span className="text-[11px]" style={{ color:"#9CA3AF" }}>{form.colorLabel}</span>
            </div>
          )}

          {/* Step progress dots */}
          <div className="flex gap-1 pt-1">
            {STEPS.map((_,i) => (
              <div key={i} className="h-1 flex-1 rounded-full" style={{ background: i===0 ? "#5BE63A" : "#F3F4F6" }}/>
            ))}
          </div>
        </div>
      </div>

      {/* Recovery tip */}
      <div className="rounded-2xl p-4" style={{ background:"#1B3A2F", border:"1px solid #234D3D" }}>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:"rgba(91,230,58,0.15)" }}>
            <svg width="16" height="16" fill="none" stroke="#5BE63A" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <div>
            <p className="text-[12px] font-bold mb-1" style={{ color:"#5BE63A" }}>Recovery Tip</p>
            <p className="text-[11.5px] leading-relaxed" style={{ color:"rgba(255,255,255,0.55)" }}>
              Detailed descriptions increase match accuracy by up to 85% through our AI matching engine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


function Step1({ form, setForm }) {
  return (
    <motion.div variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.06 } } }} initial="hidden" animate="show"
      className="space-y-6">

      {/* Type toggle */}
      <motion.div variants={fadeUp}>
        <label className={labelCls}>Report Type</label>
        <div className="flex gap-3">
          {["lost","found"].map((s) => {
            const active = form.type === s;
            return (
              <motion.button key={s} type="button" onClick={() => setForm({ ...form, type:s })}
                whileHover={{ y:-1 }} whileTap={{ scale:0.97 }}
                className="flex-1 py-3 rounded-xl text-[13px] font-semibold capitalize transition-all duration-150"
                style={{
                  background: active ? (s==="lost" ? "#FEF3C7" : "#D4F7C5") : "#F8FAF8",
                  color: active ? (s==="lost" ? "#92400E" : "#1B3A2F") : "#9CA3AF",
                  border: active
                    ? `1.5px solid ${s==="lost" ? "#FDE68A" : "#A3E890"}`
                    : "1.5px solid #E5E7EB",
                  boxShadow: active ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                }}>
                {s === "lost" ? "🔍 Lost Item" : "✅ Found Item"}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Name + Category */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Item Name</label>
          <input type="text" placeholder="e.g., MacBook Pro 14, Blue Hydro Flask"
            value={form.name} onChange={(e) => setForm({ ...form, name:e.target.value })}
            className={inputCls}/>
        </div>
        <div>
          <label className={labelCls}>Category</label>
          <div className="relative">
            <select value={form.category} onChange={(e) => setForm({ ...form, category:e.target.value })}
              className={selectCls}>
              <option value="">Select category…</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Description */}
      <motion.div variants={fadeUp}>
        <label className={labelCls}>Description</label>
        <textarea rows={4} placeholder="Describe unique features, scratches, stickers, or any identifying marks…"
          value={form.description} onChange={(e) => setForm({ ...form, description:e.target.value })}
          className={`${inputCls} resize-none`}/>
        <div className="flex justify-end mt-1.5">
          <span className="text-[11px]" style={{ color:"#9CA3AF" }}>{form.description.length}/1000</span>
        </div>
      </motion.div>

      {/* Color + Brand */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
        <div>
          <label className={labelCls}>Primary Color</label>
          <div className="flex flex-wrap gap-2.5 mt-1">
            {COLORS.map((c) => (
              <motion.button key={c.label} type="button" title={c.label}
                whileHover={{ scale:1.15 }} whileTap={{ scale:0.95 }}
                onClick={() => setForm({ ...form, primaryColor:c.hex, colorLabel:c.label })}
                className="w-7 h-7 rounded-full transition-all duration-150"
                style={{
                  background:c.hex,
                  border: c.border ? "1.5px solid #E5E7EB" : "none",
                  boxShadow: form.primaryColor===c.hex
                    ? `0 0 0 3px white, 0 0 0 5px #5BE63A`
                    : "0 1px 3px rgba(0,0,0,0.15)",
                  transform: form.primaryColor===c.hex ? "scale(1.15)" : "scale(1)",
                }}/>
            ))}
          </div>
        </div>
        <div>
          <label className={labelCls}>Brand</label>
          <input type="text" placeholder="e.g., Apple, Nike, Sony"
            value={form.brand} onChange={(e) => setForm({ ...form, brand:e.target.value })}
            className={inputCls}/>
        </div>
      </motion.div>
    </motion.div>
  );
}


function Step2({ form, setForm }) {
  return (
    <motion.div variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.06 } } }} initial="hidden" animate="show"
      className="space-y-6">

      <motion.div variants={fadeUp}>
        <label className={labelCls}>Location Name</label>
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <input type="text" placeholder="e.g., Main Library, 3rd Floor Reading Room"
            value={form.locationName} onChange={(e) => setForm({ ...form, locationName:e.target.value })}
            className={`${inputCls} pl-11`}/>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <label className={labelCls}>Campus Zone</label>
        <div className="relative">
          <select value={form.campusZone} onChange={(e) => setForm({ ...form, campusZone:e.target.value })}
            className={selectCls}>
            <option value="">Select campus zone…</option>
            {CAMPUS_ZONES.map((z) => <option key={z}>{z}</option>)}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </motion.div>

      {/* Map placeholder */}
      <motion.div variants={fadeUp}>
        <label className={labelCls}>Pin on Map</label>
        <div className="w-full h-44 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer group transition-all duration-150"
          style={{ background:"#F8FAF8", borderColor:"#C9DFC0" }}
          onMouseEnter={e=>{ e.currentTarget.style.borderColor="#5BE63A"; e.currentTarget.style.background="#F0FDF4"; }}
          onMouseLeave={e=>{ e.currentTarget.style.borderColor="#C9DFC0"; e.currentTarget.style.background="#F8FAF8"; }}>
          <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-sm transition-transform duration-150 group-hover:scale-110"
            style={{ border:"1px solid #E5E7EB" }}>
            <svg width="20" height="20" fill="none" stroke="#5BE63A" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <p className="text-[12.5px] font-semibold" style={{ color:"#5BE63A" }}>Click to drop a pin on campus map</p>
          <p className="text-[11px]" style={{ color:"#9CA3AF" }}>Interactive map integration</p>
        </div>
      </motion.div>

      {/* Date + Time */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Date {form.type==="lost"?"Lost":"Found"}</label>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date:e.target.value })}
            className={inputCls}/>
        </div>
        <div>
          <label className={labelCls}>Approx. Time</label>
          <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time:e.target.value })}
            className={inputCls}/>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <label className={labelCls}>Additional Location Notes</label>
        <textarea rows={2} placeholder={`e.g., "Near the east entrance, under a blue chair"`}
          value={form.locationNotes} onChange={(e) => setForm({ ...form, locationNotes:e.target.value })}
          className={`${inputCls} resize-none`}/>
      </motion.div>
    </motion.div>
  );
}


function Step3({ form, setForm, previewImg, setPreviewImg }) {
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewImg(URL.createObjectURL(file));
    setForm({ ...form, imageFile:file });
  };

  return (
    <motion.div variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.06 } } }} initial="hidden" animate="show"
      className="space-y-6">

      {/* Upload */}
      <motion.div variants={fadeUp}>
        <label className={labelCls}>Upload Photos (up to 4)</label>
        <motion.div onClick={() => fileRef.current.click()}
          whileHover={{ borderColor:"#5BE63A" }}
          className="w-full h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer overflow-hidden transition-all duration-150 group"
          style={{ borderColor:"#E5E7EB", background:"#F8FAF8" }}
          onMouseEnter={e=>{ e.currentTarget.style.background="#F0FDF4"; }}
          onMouseLeave={e=>{ e.currentTarget.style.background="#F8FAF8"; }}>
          {previewImg ? (
            <img src={previewImg} alt="Preview" className="w-full h-full object-cover"/>
          ) : (
            <>
              <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-150"
                style={{ border:"1px solid #E5E7EB" }}>
                <svg width="20" height="20" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
              <p className="text-[12.5px] font-semibold" style={{ color:"#667085" }}>
                Drag & drop or <span style={{ color:"#5BE63A" }}>click to upload</span>
              </p>
              <p className="text-[11px]" style={{ color:"#9CA3AF" }}>PNG, JPG up to 10MB</p>
            </>
          )}
        </motion.div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile}/>
        {previewImg && (
          <button type="button" onClick={() => { setPreviewImg(null); setForm({ ...form, imageFile:null }); }}
            className="mt-2 text-[12px] font-medium transition-colors duration-150"
            style={{ color:"#EF4444" }}
            onMouseEnter={e=>e.currentTarget.style.color="#B91C1C"}
            onMouseLeave={e=>e.currentTarget.style.color="#EF4444"}>
            Remove photo
          </button>
        )}
      </motion.div>

      {/* Contact preference */}
      <motion.div variants={fadeUp}>
        <label className={labelCls}>Contact Preference</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value:"in-app", label:"In-App", icon:<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg> },
            { value:"email",  label:"Email",  icon:<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> },
            { value:"phone",  label:"Phone",  icon:<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg> },
          ].map((opt) => {
            const active = form.contactPreference === opt.value;
            return (
              <motion.button key={opt.value} type="button"
                onClick={() => setForm({ ...form, contactPreference:opt.value })}
                whileHover={{ y:-1 }} whileTap={{ scale:0.97 }}
                className="flex flex-col items-center gap-2 p-3.5 rounded-xl border-[1.5px] text-[12px] font-semibold transition-all duration-150"
                style={{
                  background: active ? "#F0FDF4" : "#F8FAF8",
                  borderColor: active ? "#5BE63A" : "#E5E7EB",
                  color: active ? "#1B3A2F" : "#667085",
                  boxShadow: active ? "0 2px 8px rgba(91,230,58,0.15)" : "none",
                }}>
                <span style={{ color: active ? "#5BE63A" : "#9CA3AF" }}>{opt.icon}</span>
                {opt.label}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Reward toggle */}
      <motion.div variants={fadeUp}
        className="flex items-center justify-between p-4 rounded-xl"
        style={{ background:"#F8FAF8", border:"1.5px solid #E5E7EB" }}>
        <div>
          <p className="text-[13.5px] font-semibold" style={{ color:"#1A1A1A" }}>Reward Offered</p>
          <p className="text-[12px] mt-0.5" style={{ color:"#667085" }}>Let finders know you're offering a reward</p>
        </div>
        <motion.button type="button"
          onClick={() => setForm({ ...form, rewardOffered:!form.rewardOffered })}
          whileTap={{ scale:0.93 }}
          className="relative w-12 h-6 rounded-full transition-colors duration-200 outline-none flex-shrink-0"
          style={{ background: form.rewardOffered ? "#5BE63A" : "#E5E7EB" }}>
          <motion.span animate={{ x: form.rewardOffered ? 24 : 2 }}
            transition={{ type:"spring", stiffness:500, damping:30 }}
            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"/>
        </motion.button>
      </motion.div>

      {/* Terms */}
      <motion.div variants={fadeUp}>
        <label htmlFor="agreeCheckbox" className="flex items-center gap-3 cursor-pointer">
          <input id="agreeCheckbox" type="checkbox" checked={form.agreed}
            onChange={(e) => setForm((prev) => ({ ...prev, agreed: e.target.checked }))}
            className="w-5 h-5 rounded border-2 text-[#1B3A2F] focus:ring-[#5BE63A] transition-colors duration-150"
            style={{ borderColor: form.agreed ? "#5BE63A" : "#E5E7EB", background: form.agreed ? "#5BE63A" : "#fff" }} />
          <span className="text-[12.5px] leading-relaxed" style={{ color:"#667085" }}>
            I confirm this information is accurate and agree to{' '}
            <span className="font-semibold transition-colors duration-150" style={{ color:"#1B3A2F" }}>
              Findora's community guidelines
            </span>
          </span>
        </label>
      </motion.div>
    </motion.div>
  );
}


const initialForm = {
  type:"lost", name:"", category:"", description:"",
  primaryColor:"", colorLabel:"", brand:"",
  locationName:"", campusZone:"", date:"", time:"",
  locationNotes:"", imageFile:null,
  contactPreference:"in-app", rewardOffered:false, agreed:false,
};

export default function ReportItem() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [previewImg, setPreviewImg] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const editingItem = location.state?.item;
  const isEdit = location.state?.isEdit;

  useEffect(() => {
    if (editingItem) {
      const itemDate = editingItem.dateLostOrFound ? new Date(editingItem.dateLostOrFound) : null;
      setForm((prev) => ({
        ...prev,
        name: editingItem.name || "",
        description: editingItem.description || "",
        category: editingItem.category || "",
        type: editingItem.type || "",
        brand: editingItem.brand || "",
        locationName: editingItem.locationName || "",
        date: itemDate ? itemDate.toISOString().split("T")[0] : "",
        time: itemDate ? itemDate.toTimeString().slice(0, 5) : "",
      }));
    }
  }, [editingItem]);

  const handleSubmitReport = async () => {
    try {
      const payload = new FormData();
      payload.append("title", form.name);
      payload.append("description", form.description);
      payload.append("type", form.type);
      payload.append("category", form.category);
      payload.append("primaryColor", form.primaryColor);
      payload.append("brand", form.brand);
      payload.append("location", JSON.stringify({ name: form.locationName }));
      payload.append("campusZone", form.campusZone);
      payload.append("locationNotes", form.locationNotes);
      payload.append(
        "dateLostOrFound",
        form.date && form.time
          ? `${form.date}T${form.time}`
          : form.date || new Date().toISOString()
      );
      if (form.imageFile) payload.append("image", form.imageFile);
      let response;
      if (isEdit) {
        response = await updateItem(editingItem.id, payload);
        alert("Item updated successfully");
      } else {
        response = await createItem(payload);
        alert("Item created successfully");
      }
      console.log(response.data);
      setSubmitted(true);
    } catch (error) {
      console.error(error.response || error);
      alert(error.response?.data?.message || "Failed to submit report");
    }
  };

  const handleNext = () => {
    if (step < STEPS.length) setStep(step + 1);
    else handleSubmitReport();
  };
  const handleBack = () => { if (step > 1) setStep(step - 1); };

  /* ── SUCCESS SCREEN ───────────────────────────── */
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background:"#F8FAF8" }}>
        <Topbar/>
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
            transition={{ duration:0.4, ease:"easeOut" }}
            className="bg-white rounded-2xl p-10 text-center max-w-md w-full"
            style={{ border:"1px solid #E5E7EB", boxShadow:"0 4px 24px rgba(0,0,0,0.08)" }}>
            <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
              transition={{ type:"spring", stiffness:400, damping:20, delay:0.15 }}
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background:"#D4F7C5" }}>
              <svg width="28" height="28" fill="none" stroke="#1B3A2F" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </motion.div>
            <h2 className="text-[20px] font-bold mb-2" style={{ color:"#1A1A1A" }}>Report Submitted!</h2>
            <p className="text-[13.5px] mb-7 leading-relaxed" style={{ color:"#667085" }}>
              Your item has been posted. Our AI will start matching it against existing reports immediately.
            </p>
            <div className="flex gap-3 justify-center">
              <motion.button whileHover={{ y:-1 }} whileTap={{ scale:0.97 }}
                onClick={() => { setSubmitted(false); setStep(1); setForm(initialForm); setPreviewImg(null); }}
                className="px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150"
                style={{ border:"1.5px solid #E5E7EB", color:"#1A1A1A", background:"#fff" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor="#5BE63A"; e.currentTarget.style.color="#1B3A2F"; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor="#E5E7EB"; e.currentTarget.style.color="#1A1A1A"; }}>
                Report Another
              </motion.button>
              <motion.button whileHover={{ y:-1, boxShadow:"0 6px 16px rgba(91,230,58,0.28)" }} whileTap={{ scale:0.97 }}
                onClick={() => navigate("/my-reports")}
                className="px-5 py-2.5 rounded-xl text-[13px] font-semibold"
                style={{ background:"#1B3A2F", color:"#5BE63A", boxShadow:"0 3px 10px rgba(27,58,47,0.2)" }}>
                View My Reports
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ── MAIN FORM ────────────────────────────────── */
  return (
    <div className="min-h-screen flex flex-col" style={{ background:"#F8FAF8" }}>
      <Topbar/>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">

        {/* Page header */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3 }}
          className="mb-7">
          <div className="flex items-center gap-2 mb-1">
            <button onClick={() => navigate(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-150"
              style={{ color:"#667085" }}
              onMouseEnter={e=>{ e.currentTarget.style.background="#F0FDF4"; e.currentTarget.style.color="#1B3A2F"; }}
              onMouseLeave={e=>{ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="#667085"; }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <h1 className="text-[22px] font-bold tracking-tight" style={{ color:"#1A1A1A" }}>
              {isEdit ? "Edit Report" : "Report an Item"}
            </h1>
          </div>
          <p className="text-[13.5px] ml-10" style={{ color:"#667085" }}>
            Help our community by providing detailed information about the item.
          </p>
        </motion.div>

        <ProgressStepper step={step}/>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Form card */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35, delay:0.1 }}
            className="lg:col-span-2 bg-white rounded-2xl overflow-hidden"
            style={{ border:"1px solid #E5E7EB", boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>

            {/* Card header */}
            <div className="flex items-center gap-3 px-6 py-4" style={{ borderBottom:"1px solid #F3F4F6" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background:"#F0FDF4" }}>
                <svg width="16" height="16" fill="none" stroke="#5BE63A" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-[14px] font-bold" style={{ color:"#1A1A1A" }}>
                  Step {step} — {STEPS[step-1]}
                </h2>
                <p className="text-[11.5px]" style={{ color:"#9CA3AF" }}>Fill in the fields below</p>
              </div>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div key={step}
                  initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
                  exit={{ opacity:0, x:-20 }} transition={{ duration:0.25, ease:"easeOut" }}>
                  {step===1 && <Step1 form={form} setForm={setForm}/>}
                  {step===2 && <Step2 form={form} setForm={setForm}/>}
                  {step===3 && <Step3 form={form} setForm={setForm} previewImg={previewImg} setPreviewImg={setPreviewImg}/>}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Nav buttons */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderTop:"1px solid #F3F4F6" }}>
              <motion.button type="button" onClick={handleBack} disabled={step===1}
                whileHover={step>1 ? { y:-1 } : {}} whileTap={step>1 ? { scale:0.97 } : {}}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150"
                style={{
                  border:"1.5px solid #E5E7EB",
                  color: step===1 ? "#D1D5DB" : "#1A1A1A",
                  background: step===1 ? "#FAFAFA" : "#fff",
                  cursor: step===1 ? "not-allowed" : "pointer",
                }}>
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                </svg>
                Back
              </motion.button>

              <motion.button type="button" onClick={handleNext}
                disabled={step===3 && !form.agreed}
                whileHover={!(step===3 && !form.agreed) ? { y:-2, boxShadow:"0 8px 20px rgba(91,230,58,0.3)" } : {}}
                whileTap={!(step===3 && !form.agreed) ? { scale:0.97 } : {}}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150"
                style={{
                  background: step===3 && !form.agreed ? "#F3F4F6" : "#1B3A2F",
                  color: step===3 && !form.agreed ? "#9CA3AF" : "#5BE63A",
                  cursor: step===3 && !form.agreed ? "not-allowed" : "pointer",
                  boxShadow: step===3 && !form.agreed ? "none" : "0 3px 10px rgba(27,58,47,0.2)",
                }}>
                {step===STEPS.length ? (isEdit ? "Update Item" : "Submit Report") : "Continue"}
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </motion.button>
            </div>
          </motion.div>

          {/* Live Preview */}
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35, delay:0.18 }}>
            <LivePreview form={form} previewImg={previewImg}/>
          </motion.div>
        </div>
      </main>
    </div>
  );
}