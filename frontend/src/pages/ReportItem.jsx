import { useState, useRef,useEffect } from "react";
import { createItem,updateItem } from "../services/itemService";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";




/* ─── CONSTANTS ─────────────────────────────────── */
const CATEGORIES = [
  "Electronics", "Clothing", "Books", "ID / Cards",
  "Keys", "Bags", "Accessories", "Sports", "Other",
];

const COLORS = [
  { label: "Black",  hex: "#1a1a1a" },
  { label: "Gray",   hex: "#9ca3af" },
  { label: "Blue",   hex: "#2563eb" },
  { label: "Red",    hex: "#ef4444" },
  { label: "Green",  hex: "#22c55e" },
  { label: "Yellow", hex: "#eab308" },
  { label: "White",  hex: "#f9fafb", border: true },
  { label: "Brown",  hex: "#92400e" },
  { label: "Orange", hex: "#f97316" },
  { label: "Pink",   hex: "#ec4899" },
];

const CAMPUS_ZONES = [
  "Main Library Plaza", "Science Block", "Engineering Building",
  "North Campus", "South Campus", "Gym / Sports Complex",
  "Student Union", "Cafeteria", "Parking Lot", "Dormitories",
];

const STEPS = ["General Details", "Location & Time", "Photos & Contact"];

/* ─── NAV ───────────────────────────────────────── */
const NAV_LINKS = ["Browse", "Report", "Matching"];

function Topbar() {
  const user = JSON.parse(
  localStorage.getItem("user") || "{}"
);

const initials =
  user?.fullName
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "U";
const navigate = useNavigate();
  return (
    <header className="h-13 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <span className="font-extrabold text-gray-900 text-[15px]">Findora</span>
        </div>
        <nav className="hidden md:flex items-center gap-1 text-sm">
         {["Browse", "Report", "Matching"].map((l) => (
         <button
            key={l}
            onClick={() => {
            if (l === "Browse") {
              navigate("/browse");
            } else if (l === "Report") {
              navigate("/report");
            } else if (l === "Matching") {
              navigate("/matching");
            }
          }}
           className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              l === "Browse"? "text-blue-600 font-semibold border-b-2 border-blue-600 rounded-none": "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}>
             {l}
          </button>
        ))}
      </nav>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative w-8 h-8 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>
        <button onClick={()=> navigate("/settings")}className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">{initials}</div>
      </div>
    </header>
  );
}

/* ─── PROGRESS BAR ──────────────────────────────── */
function ProgressBar({ step }) {
  const pct = Math.round(((step) / STEPS.length) * 100);
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-blue-600">
          Step {step} of {STEPS.length}: {STEPS[step - 1]}
        </span>
        <span className="text-xs font-bold text-gray-400">{pct}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      {/* Step dots */}
      <div className="flex justify-between mt-2 px-0.5">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-col items-center gap-1">
            <div className={`w-2 h-2 rounded-full transition-colors duration-300
              ${i + 1 < step ? "bg-blue-600" : i + 1 === step ? "bg-blue-600 ring-2 ring-blue-200" : "bg-gray-200"}`} />
            <span className={`text-[10px] font-medium hidden sm:block
              ${i + 1 <= step ? "text-blue-600" : "text-gray-400"}`}>
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── LIVE PREVIEW CARD ─────────────────────────── */
function LivePreview({ form, previewImg }) {
  return (
    <div className="sticky top-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Live Preview</span>
          </div>
          <span className="text-xs font-semibold text-emerald-600">● Public View</span>
        </div>

        {/* Item image */}
        <div className="relative">
          {previewImg ? (
            <img src={previewImg} alt="Preview" className="w-full h-36 object-cover" />
          ) : (
            <div className="w-full h-36 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <span className={`absolute top-2 left-2 text-[11px] font-bold px-2 py-0.5 rounded-md
            ${form.type === "lost" ? "bg-amber-500 text-white" : "bg-emerald-500 text-white"}`}>
            {form.type === "lost" ? "Lost Item" : "Found Item"}
          </span>
        </div>

        {/* Details */}
        <div className="p-4 space-y-2.5">
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">
              {form.name || <span className="text-gray-300 font-normal italic">New Report</span>}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {form.category || <span className="text-gray-300 italic">Uncategorized</span>}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {form.locationName || <span className="text-gray-300 italic">Main Library Plaza</span>}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Reported Today
          </div>

          {/* Description preview */}
          <div className="pt-1 border-t border-gray-50">
            <p className="text-[11px] text-gray-400 italic leading-relaxed line-clamp-2">
              {form.description || "Enter details to see description..."}
            </p>
          </div>

          {/* Color dot */}
          {form.primaryColor && (
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: form.primaryColor }}
              />
              <span className="text-[11px] text-gray-500">{form.colorLabel}</span>
            </div>
          )}

          {/* Progress dots */}
          <div className="flex gap-1 pt-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i === 1 ? "bg-blue-500" : "bg-gray-200"}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Recovery tip */}
      <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-4">
        <div className="flex items-start gap-2">
          <span className="text-blue-500 text-base mt-0.5">⚡</span>
          <div>
            <p className="text-xs font-bold text-blue-700 mb-1">Recovery Tip</p>
            <p className="text-[11px] text-blue-600 leading-relaxed">
              Detailed descriptions increase your match accuracy by up to 85% through our AI matching engine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── STEP 1: GENERAL DETAILS ───────────────────── */
function Step1({ form, setForm }) {
  return (
    <div className="space-y-5">
      {/* Status toggle */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</label>
        <div className="flex rounded-xl border border-gray-200 overflow-hidden w-fit">
          {["lost", "found"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setForm({ ...form, type: s })}
              className={`px-8 py-2 text-sm font-semibold capitalize transition-all duration-150
                ${form.type === s
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-gray-500 hover:bg-gray-50"}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Name + Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="group">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Item Name</label>
          <input
            type="text"
            placeholder="e.g., MacBook Pro 14, Blue Hydro Flask"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50
                       placeholder-gray-300 text-gray-900
                       hover:border-blue-300 hover:bg-white
                       focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100
                       transition-all duration-200"
          />
        </div>

        <div className="group">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50
                       text-gray-700 appearance-none
                       hover:border-blue-300 hover:bg-white
                       focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100
                       transition-all duration-200 cursor-pointer"
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
        <textarea
          rows={4}
          placeholder="Describe unique features, scratches, or stickers..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50
                     placeholder-gray-300 text-gray-900 resize-none
                     hover:border-blue-300 hover:bg-white
                     focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100
                     transition-all duration-200"
        />
        <p className="text-[11px] text-gray-400 mt-1 text-right">{form.description.length}/1000</p>
      </div>

      {/* Color + Brand */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Primary Color</label>
          <div className="flex flex-wrap gap-2">
            {COLORS.map((c) => (
              <button
                key={c.label}
                type="button"
                title={c.label}
                onClick={() => setForm({ ...form, primaryColor: c.hex, colorLabel: c.label })}
                className={`w-7 h-7 rounded-full transition-all duration-150
                  ${c.border ? "border border-gray-300" : ""}
                  ${form.primaryColor === c.hex
                    ? "ring-2 ring-offset-2 ring-blue-500 scale-110"
                    : "hover:scale-110"}`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Brand</label>
          <input
            type="text"
            placeholder="e.g., Apple, Nike, Sony"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50
                       placeholder-gray-300 text-gray-900
                       hover:border-blue-300 hover:bg-white
                       focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100
                       transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
}

/* ─── STEP 2: LOCATION & TIME ───────────────────── */
function Step2({ form, setForm }) {
  return (
    <div className="space-y-5">
      {/* Location name */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Location Name</label>
        <div className="relative group">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="e.g., Main Library, 3rd Floor Reading Room"
            value={form.locationName}
            onChange={(e) => setForm({ ...form, locationName: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50
                       placeholder-gray-300 text-gray-900
                       hover:border-blue-300 hover:bg-white
                       focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100
                       transition-all duration-200"
          />
        </div>
      </div>

      {/* Campus Zone */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Campus Zone</label>
        <select
          value={form.campusZone}
          onChange={(e) => setForm({ ...form, campusZone: e.target.value })}
          className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50
                     text-gray-700
                     hover:border-blue-300 hover:bg-white
                     focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100
                     transition-all duration-200 cursor-pointer"
        >
          <option value="">Select Campus Zone</option>
          {CAMPUS_ZONES.map((z) => <option key={z}>{z}</option>)}
        </select>
      </div>

      {/* Map placeholder */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Pin on Map</label>
        <div className="w-full h-44 bg-gradient-to-br from-blue-50 via-slate-100 to-blue-100 rounded-xl border-2 border-dashed border-blue-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 transition-colors group">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-blue-500">Click to drop a pin on campus map</p>
          <p className="text-[11px] text-gray-400">Interactive map integration</p>
        </div>
      </div>

      {/* Date + Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Date {form.type === "lost" ? "Lost" : "Found"}
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50
                       text-gray-700
                       hover:border-blue-300 hover:bg-white
                       focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100
                       transition-all duration-200 cursor-pointer"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Approx. Time</label>
          <input
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50
                       text-gray-700
                       hover:border-blue-300 hover:bg-white
                       focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100
                       transition-all duration-200 cursor-pointer"
          />
        </div>
      </div>

      {/* Extra notes */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Additional Location Notes</label>
        <textarea
          rows={2}
          placeholder='e.g., "Near the east entrance, under a blue chair"'
          value={form.locationNotes}
          onChange={(e) => setForm({ ...form, locationNotes: e.target.value })}
          className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50
                     placeholder-gray-300 text-gray-900 resize-none
                     hover:border-blue-300 hover:bg-white
                     focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100
                     transition-all duration-200"
        />
      </div>
    </div>
  );
}

/* ─── STEP 3: PHOTOS & CONTACT ──────────────────── */
function Step3({ form, setForm, previewImg, setPreviewImg }) {
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewImg(url);
    setForm({ ...form, imageFile: file });
  };

  return (
    <div className="space-y-5">
      {/* Upload */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Upload Photos (up to 4)
        </label>
        <div
          onClick={() => fileRef.current.click()}
          className="w-full h-36 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50
                     hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer
                     flex flex-col items-center justify-center gap-2 group"
        >
          {previewImg ? (
            <img src={previewImg} alt="Preview" className="h-full w-full object-cover rounded-xl" />
          ) : (
            <>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-gray-500 group-hover:text-blue-600 transition-colors">
                Drag & drop or click to upload
              </p>
              <p className="text-[11px] text-gray-400">PNG, JPG up to 10MB</p>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        {previewImg && (
          <button
            type="button"
            onClick={() => { setPreviewImg(null); setForm({ ...form, imageFile: null }); }}
            className="mt-2 text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Remove photo
          </button>
        )}
      </div>

      {/* Contact preference */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Contact Preference</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "in-app", label: "In-App Message", icon: "💬" },
            { value: "email",  label: "Email",          icon: "📧" },
            { value: "phone",  label: "Phone",          icon: "📞" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setForm({ ...form, contactPreference: opt.value })}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-semibold transition-all duration-150
                ${form.contactPreference === opt.value
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-500 hover:border-blue-300 hover:bg-gray-50"}`}
            >
              <span className="text-lg">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reward toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div>
          <p className="text-sm font-semibold text-gray-900">Reward Offered</p>
          <p className="text-xs text-gray-500 mt-0.5">Let finders know you're offering a reward</p>
        </div>
        <button
          type="button"
          onClick={() => setForm({ ...form, rewardOffered: !form.rewardOffered })}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none
            ${form.rewardOffered ? "bg-blue-600" : "bg-gray-300"}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
            ${form.rewardOffered ? "translate-x-5" : "translate-x-0"}`} />
        </button>
      </div>

      {/* Terms */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.agreed}
          onChange={(e) => setForm({ ...form, agreed: e.target.checked })}
          className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer flex-shrink-0"
        />
        <span className="text-xs text-gray-500 leading-relaxed">
          I confirm this information is accurate and agree to{" "}
          <a href="#" className="text-blue-600 hover:underline font-medium">Findora's community guidelines</a>
        </span>
      </label>
    </div>
  );
}

/* ─── MAIN PAGE ─────────────────────────────────── */
const initialForm = {
  type: "lost",
  name: "",
  category: "",
  description: "",
  primaryColor: "",
  colorLabel: "",
  brand: "",
  locationName: "",
  campusZone: "",
  date: "",
  time: "",
  locationNotes: "",
  imageFile: null,
  contactPreference: "in-app",
  rewardOffered: false,
  agreed: false,
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
    const itemDate = editingItem.dateLostOrFound
      ? new Date(editingItem.dateLostOrFound)
      : null;

    setForm((prev) => ({
      ...prev,
      name: editingItem.name || "",
      description: editingItem.description || "",
      category: editingItem.category || "",
      type: editingItem.type || "",
      brand: editingItem.brand || "",
      locationName: editingItem.locationName || "",

      date: itemDate
        ? itemDate.toISOString().split("T")[0]
        : "",

      time: itemDate
        ? itemDate.toTimeString().slice(0, 5)
        : "",
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

payload.append(
  "location",
  JSON.stringify({
    name: form.locationName,
  })
);

payload.append("campusZone", form.campusZone);
payload.append("locationNotes", form.locationNotes);

payload.append(
  "dateLostOrFound",
  form.date && form.time
    ? new Date(`${form.date}T${form.time}`)
    : form.date
);

if (form.imageFile) {
  payload.append("image", form.imageFile);
}

    let response;

if (isEdit) {
  response = await updateItem(
    editingItem.id,
    payload
  );

  alert("Item updated successfully");
} else {
  response = await createItem(payload);

  alert("Item created successfully");
}

console.log(response.data);

setSubmitted(true);
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Failed to submit report"
    );
  }
};

  const handleNext = () => {
    if (step < STEPS.length) {
  setStep(step + 1);
} else {
  handleSubmitReport();
}
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Topbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center max-w-md">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">Report Submitted!</h2>
            <p className="text-sm text-gray-500 mb-6">
              Your item has been posted. Our AI will start matching it against existing reports immediately.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setSubmitted(false); setStep(1); setForm(initialForm); setPreviewImg(null); }}
                className="px-5 py-2.5 border border-gray-200 text-sm font-semibold text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Report Another
              </button>
              <button onClick={() => navigate("/my-reports")} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-200 transition-colors">
 
              View My Reports
            </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Topbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">Report an Item</h1>
          <p className="text-sm text-gray-500 mt-1">
            Help our community by providing detailed information about the item.
          </p>
        </div>

        <ProgressBar step={step} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form card */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-50">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-sm font-bold text-gray-900">{STEPS[step - 1]}</h2>
            </div>

            {step === 1 && <Step1 form={form} setForm={setForm} />}
            {step === 2 && <Step2 form={form} setForm={setForm} />}
            {step === 3 && <Step3 form={form} setForm={setForm} previewImg={previewImg} setPreviewImg={setPreviewImg} />}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-50">
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all
                  ${step === 1
                    ? "border-gray-100 text-gray-300 cursor-not-allowed"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={step === 3 && !form.agreed}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg
                  ${step === 3 && !form.agreed
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                    : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white shadow-blue-200"}`}
              >
                {step === STEPS.length? (isEdit ? "Update Item" : "Submit Report"): "Continue"}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-1">
            <LivePreview form={form} previewImg={previewImg} />
          </div>
        </div>
      </main>
    </div>
  );
}