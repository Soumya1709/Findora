import { useState, useEffect } from "react";
import { getMyItems,deleteItem } from "../services/itemService";
import { useNavigate } from "react-router-dom";

/* ─── MOCK DATA ─────────────────────────────────────── */
// const REPORTS = [
//   {
//     id: 1,
//     name: "MacBook Pro 14\"",
//     category: "Electronics",
//     subcategory: "Library Level 2",
//     date: "Oct 24, 2024",
//     status: "lost",
//     badge: "Active",
//     badgeType: "active",
//     img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80",
//     canEdit: true,
//     canDelete: true,
//   },
//   {
//     id: 2,
//     name: "Keys & Lanyard",
//     category: "Accessories",
//     subcategory: "Campus Plaza",
//     date: "Oct 26, 2024",
//     status: "found",
//     badge: "Nearly Found",
//     badgeType: "match",
//     img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
//     canEdit: true,
//     canDelete: true,
//   },
//   {
//     id: 3,
//     name: "Herschel Backpack",
//     category: "Bags",
//     subcategory: "Student Centre",
//     date: "Oct 12, 2024",
//     status: "lost",
//     badge: "Returned",
//     badgeType: "returned",
//     img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
//     archived: true,
//     archivedDate: "Oct 15",
//     canEdit: false,
//     canDelete: false,
//   },
//   {
//     id: 4,
//     name: "Hydro Flask Blue",
//     category: "Accessories",
//     subcategory: "Science Plaza · Gym Lobby",
//     date: "Oct 20, 2024",
//     status: "lost",
//     badge: "Claimed",
//     badgeType: "claimed",
//     img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80",
//     canEdit: true,
//     canDelete: false,
//   },
// ];

const MATCH_ALERTS = [
  {
    id: 1,
    item: "MacBook Case",
    location: "Found at Cafe",
    confidence: 84,
    description: "Blue hard-shell case found on a table in the Engineering Cafe. Fits 14-inch models.",
  },
  {
    id: 2,
    item: "Car Key Fob",
    location: "Found in Gym",
    confidence: 72,
    description: null,
  },
];

const FILTER_TABS = ["All", "Lost", "Found", "Electronics", "Accessories", "Books", "Keys", "Bags"];



/* ─── BADGE CONFIG ──────────────────────────────────── */
const BADGE_STYLES = {
  active:   "bg-blue-100 text-blue-700 border border-blue-200",
  match:    "bg-purple-100 text-purple-700 border border-purple-200",
  returned: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  claimed:  "bg-gray-100 text-gray-600 border border-gray-200",
  lost:     "bg-amber-100 text-amber-700 border border-amber-200",
  found:    "bg-teal-100 text-teal-700 border border-teal-200",
};

const STATUS_DOT = {
  active:   "bg-blue-500",
  match:    "bg-purple-500",
  returned: "bg-emerald-500",
  claimed:  "bg-gray-400",
  lost:     "bg-amber-500",
  found:    "bg-teal-500",
};

/* ─── CONFIDENCE RING ───────────────────────────────── */
function ConfidenceRing({ value }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color = value >= 80 ? "#10b981" : value >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative w-14 h-14 flex items-center justify-center flex-shrink-0">
      <svg className="absolute inset-0 -rotate-90" width="56" height="56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#f1f5f9" strokeWidth="3.5" />
        <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="3.5"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <span className="text-[11px] font-extrabold text-gray-700 z-10">{value}%</span>
    </div>
  );
}

/* ─── NAVBAR ────────────────────────────────────────── */
function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(
  localStorage.getItem("user") || "{}"
);

const initials =
  user?.fullName
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "U";
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="font-extrabold text-gray-900 text-[15px] tracking-tight">Findora</span>
          </a>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {["Feed", "Map", "Analytics", "Help"].map((l) => (
              <a key={l} href="#"
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors
                  ${l === "Analytics"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"}`}>
                {l}
              </a>
            ))}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button
             onClick={() => navigate("/report")}
             className="hidden sm:inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-blue-200 transition-all"
        >
         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
         </svg>
            Report Item
           </button>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}

/* ─── ITEM CARD ─────────────────────────────────────── */
function ItemCard({ item,onDelete }) {
  
  if (item.archived) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden opacity-60 hover:opacity-80 transition-opacity">
        <div className="relative">
          <img src={item.img} alt={item.name} className="w-full h-40 object-cover grayscale" />
          <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${BADGE_STYLES[item.status]}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[item.status]}`}></span>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
          <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md ${BADGE_STYLES[item.badgeType]}`}>
            {item.badge}
          </span>
        </div>
        <div className="p-4">
          <p className="text-sm font-bold text-gray-700 mb-0.5">{item.name}</p>
          <p className="text-[11px] text-gray-400">{item.category} · {item.subcategory}</p>
          <div className="flex items-center justify-between mt-3">
            <p className="text-[11px] text-gray-400">Archived on {item.archivedDate}</p>
            <button className="text-[11px] text-blue-500 font-semibold hover:text-blue-700 transition-colors">
              View History
            </button>
          </div>
        </div>
      </div>
    );
  }
  

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
      {/* Image */}
      <div className="relative">
        <img src={item.img} alt={item.name} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
        {/* Status */}
        <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${BADGE_STYLES[item.status]}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[item.status]}`}></span>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </span>
        {/* Badge */}
        <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md ${BADGE_STYLES[item.badgeType]}`}>
          {item.badge}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-sm font-bold text-gray-900 mb-0.5 truncate">{item.name}</p>
        <p className="text-[11px] text-gray-400 truncate">{item.category} · {item.subcategory}</p>
        <div className="flex items-center gap-1 mt-1.5">
          <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-[11px] text-gray-400">{item.date}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1">
            {item.canEdit && (
              <button className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Edit">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {item.canDelete && (
              <button onClick={() => onDelete(item.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete" >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
          <button className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── AI MATCH PANEL ────────────────────────────────── */
function AIMatchPanel() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-gray-900">AI Match Alerts</span>
        </div>
        <span className="text-[10px] font-bold bg-blue-600 text-white rounded-full px-2 py-0.5">
          {MATCH_ALERTS.length} new
        </span>
      </div>

      {/* Alerts */}
      <div className="divide-y divide-gray-50">
        {MATCH_ALERTS.map((alert, i) => (
          <div key={alert.id} className="p-4">
            <div className="flex items-start gap-3">
              <ConfidenceRing value={alert.confidence} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{alert.item}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{alert.location}</p>
                {alert.description && (
                  <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed line-clamp-2 bg-gray-50 rounded-lg p-2 border border-gray-100">
                    "{alert.description}"
                  </p>
                )}
              </div>
            </div>
            <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-semibold py-2 rounded-xl transition-all shadow-sm shadow-blue-200">
              View Match
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100">
        <p className="text-[11px] text-gray-500 mb-1.5">Need help with a match?</p>
        <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
          Contact Campus Security
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}

/* ─── FOOTER ────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="font-extrabold text-gray-900 text-sm">Findora</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Reconnecting the campus, one item at a time. Trusted by 20+ universities.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-12 gap-y-6 text-xs text-gray-500">
            {[
              { heading: "Product", links: ["How it works", "Safety Guide", "Success Stories"] },
              { heading: "Support", links: ["Help Center", "Contact", "Report Abuse"] },
              { heading: "Legal", links: ["Privacy Policy", "Terms of Service"] },
            ].map((col) => (
              <div key={col.heading} className="flex flex-col gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-300">{col.heading}</span>
                {col.links.map((l) => (
                  <a key={l} href="#" className="hover:text-gray-900 transition-colors">{l}</a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
          © 2024 Findora Recovery Systems. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* ─── MAIN PAGE ─────────────────────────────────────── */
export default function MyReports() {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();
  const totalReports = reports.length;
  const handleDelete = async (id) => {
  try {
    await deleteItem(id);

    setReports((prev) =>
      prev.filter((item) => item.id !== id)
    );

    alert("Item deleted successfully");
  } catch (error) {
    console.error(error);
    alert("Failed to delete item");
  }
};

const activeReports = reports.filter(
  (item) => item.badgeType === "active"
).length;

const returnedItems = reports.filter(
  (item) => item.badgeType === "returned"
).length;

const matchAlerts = 0; // until AI matching is built

  const STATS = [
  {
    label: "Total Reports",
    value: totalReports,
    icon: (
      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    bg: "bg-white", valueCls: "text-gray-900", border: "border-gray-100",
  },
  {
    label: "Active Reports",
    value: activeReports,
    icon: (
      <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    bg: "bg-amber-50", valueCls: "text-amber-700", border: "border-amber-100",
  },
  {
    label: "Returned Items",
    value: returnedItems,
    icon: (
      <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    bg: "bg-emerald-50", valueCls: "text-emerald-700", border: "border-emerald-100",
  },
  {
    label: "Match Alerts",
    value: matchAlerts,
    icon: (
      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    bg: "bg-blue-50", valueCls: "text-blue-700", border: "border-blue-200",
    highlight: true,
  },
];
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Newest First");

  const SORT_OPTIONS = ["Newest First", "Oldest First", "A → Z", "Z → A"];
  useEffect(() => {
  fetchReports();
}, []);

const fetchReports = async () => {
  
  try {
    const res = await getMyItems();
    console.log("API Response:", res.data);

    const transformed = res.data.items.map((item) => ({
      id: item._id,
      name: item.title,
      category: item.category,
      subcategory: item.location?.name || "Unknown Location",
      date: new Date(item.createdAt).toLocaleDateString(),
      status: item.status,
      badge: item.status,
      badgeType: item.status,
      img:
        item.images?.[0] ||
        "https://via.placeholder.com/400x300",
      canEdit: true,
      canDelete: true,
    }));

    setReports(transformed);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  const filtered = reports.filter((r) => {
  const matchSearch =
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.category.toLowerCase().includes(search.toLowerCase());

  if (activeFilter === "All") return matchSearch;
  if (activeFilter === "Lost")
    return r.status === "lost" && matchSearch;
  if (activeFilter === "Found")
    return r.status === "found" && matchSearch;

  return r.category === activeFilter && matchSearch;
});
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">My Reports</h1>
            <p className="text-sm text-gray-500 mt-0.5">Track and manage your reported lost and found items.</p>
          </div>

          {/* Search + Filter + Sort */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 w-52
                            hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your reports..."
                className="bg-transparent text-xs text-gray-700 placeholder-gray-400 focus:outline-none w-full"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <button
                onClick={() => { setFilterOpen(!filterOpen); setSortOpen(false); }}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter
              </button>
              {filterOpen && (
                <div className="absolute right-0 top-10 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 p-3 w-44 space-y-1">
                  {["All Statuses", "Lost", "Found", "Returned", "Archived"].map((o) => (
                    <button key={o} onClick={() => { setFilterOpen(false); }}
                      className="w-full text-left text-xs font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-700 px-3 py-2 rounded-lg transition-colors">
                      {o}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => { setSortOpen(!sortOpen); setFilterOpen(false); }}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 7h18M6 12h12M10 17h4" />
                </svg>
                {sortBy}
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-10 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 p-3 w-40 space-y-1">
                  {SORT_OPTIONS.map((o) => (
                    <button key={o} onClick={() => { setSortBy(o); setSortOpen(false); }}
                      className={`w-full text-left text-xs font-medium px-3 py-2 rounded-lg transition-colors
                        ${sortBy === o ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}>
                      {o}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {STATS.map((s) => (
            <div key={s.label}
              className={`${s.bg} border ${s.border} rounded-2xl p-4 flex items-center gap-3
                ${s.highlight ? "ring-2 ring-blue-200" : ""}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                ${s.highlight ? "bg-blue-100" : "bg-white"} shadow-sm`}>
                {s.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-tight">{s.label}</p>
                <p className={`text-2xl font-extrabold leading-tight ${s.valueCls}`}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150
                ${activeFilter === tab
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                  : "bg-white border border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Items grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-gray-700 mb-1">No reports found</p>
                <p className="text-xs text-gray-400 mb-5">Try adjusting your search or filter</p>
                <button onClick={() => navigate("/report")} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-lg shadow-blue-200">
                  Report New Item
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map((item) => (
                  <ItemCard key={item.id} item={item} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>

          {/* AI Match Panel */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <AIMatchPanel />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}