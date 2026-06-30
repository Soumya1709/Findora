import { useState, useEffect } from "react";
import { getAllItems } from "../services/itemService";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

/* ─── MOCK DATA ─────────────────────────────────────── */
const ALL_ITEMS = [
  {
    id: 1,
    name: 'MacBook Pro 14"',
    category: "Electronics",
    location: "Main Library, 3rd Floor",
    time: "2h ago",
    status: "found",
    confidence: 88,
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80",
  },
  {
    id: 2,
    name: "Brown Leather Wallet",
    category: "Accessories",
    location: "Student Union Cafe",
    time: "Yesterday",
    status: "lost",
    confidence: null,
    img: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80",
  },
  {
    id: 3,
    name: "iPhone 13 – Blue",
    category: "Electronics",
    location: "Engineering Quad Benches",
    time: "5h ago",
    status: "found",
    confidence: null,
    img: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80",
  },
  {
    id: 4,
    name: "Oversized Denim Jacket",
    category: "Clothing",
    location: "Science Bldg Room 402",
    time: "3 days ago",
    status: "lost",
    confidence: null,
    img: "https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=500&q=80",
  },
  {
    id: 5,
    name: "Keys w/ Blue Lanyard",
    category: "Accessories",
    location: "Gym Entrance",
    time: "Today",
    status: "found",
    confidence: null,
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
  },
  {
    id: 6,
    name: "Sony WH-1000XM4",
    category: "Electronics",
    location: "Music Hall Room 12",
    time: "4h ago",
    status: "lost",
    confidence: 85,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
  },
  {
    id: 7,
    name: "Calculus Textbook",
    category: "Documents",
    location: "North Campus Library",
    time: "2 days ago",
    status: "found",
    confidence: null,
    img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80",
  },
  {
    id: 8,
    name: "HydroFlask – Green",
    category: "Accessories",
    location: "Cafeteria, Table 9",
    time: "6h ago",
    status: "lost",
    confidence: null,
    img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80",
  },
  {
    id: 9,
    name: "Student ID Card",
    category: "Documents",
    location: "Admin Block Reception",
    time: "Today",
    status: "found",
    confidence: null,
    img: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80",
  },
];

const LOCATIONS = [
  "All Locations",
  "Main Library",
  "Engineering Quad",
  "Science Block",
  "Student Union",
  "Gym / Sports Complex",
  "Cafeteria",
  "Admin Block",
  "Music Hall",
  "North Campus",
];

const CATEGORY_FILTERS = ["Electronics", "Clothing", "Accessories", "Documents", "Keys", "Bags"];

const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
   {
  label: "Browse Items",
  path: "/browse",
  icon: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
},
  {
    label: "My Reports",
    path: "/my-reports",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    active: true,
  },
  {
    label: "Match Alerts",
    path: "/match-alerts",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

const ITEMS_PER_PAGE = 6;
const TOTAL_PAGES = 12;

/* ─── TOPBAR ────────────────────────────────────────── */
function Topbar() {
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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 h-14 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <Logo/>
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

      <div className="flex items-center gap-2">
        <button className="relative w-8 h-8 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>
        <button onClick={() => navigate("/settings")}className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all">
            {initials}
        </div>
      </div>
    </header>
  );
}

/* ─── SIDEBAR ────────────────────────────────────────── */
function Sidebar() {
  const [active, setActive] = useState("Browse Items");
  const navigate = useNavigate();
  const handleLogout = () => {
  const confirmLogout = window.confirm(
    "Are you sure you want to log out?"
  );

  if (!confirmLogout) return;

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  navigate("/", { replace: true });
};

  return (
    <aside className="hidden md:flex flex-col w-52 bg-white border-r border-gray-100 flex-shrink-0">
      <div className="px-4 pt-6 pb-2">
        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Navigate</p>
      </div>

      <nav className="flex-1 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              setActive(item.label);
              navigate(item.path);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
              ${active === item.label
                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 border-t border-gray-100 my-3" />

      {/* Report New Item CTA */}
      <div className="px-3 mb-4">
    <button
       onClick={() => navigate("/report")}
       className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold py-2.5 rounded-xl shadow-lg shadow-blue-200 transition-all"
    >
        Report New Item
    </button>
    </div>

      {/* Bottom links */}
      <div className="px-2 pb-4 space-y-0.5">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Help Center
        </button>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Log Out
        </button>
      </div>
    </aside>
  );
}

/* ─── ITEM CARD ─────────────────────────────────────── */
function ItemCard({ item,onClick }) {
  const statusStyle = item.status === "found"
    ? "bg-emerald-500 text-white"
    : "bg-amber-500 text-white";

  return (
    <div onClick={onClick} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={item.img}
          alt={item.name}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Status badge */}
        <span className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${statusStyle}`}>
          {item.status}
        </span>
        {/* AI match confidence badge */}
        {item.confidence && (
          <span className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-white/95 backdrop-blur text-[10px] font-bold px-2 py-0.5 rounded-md text-emerald-700 border border-emerald-200 shadow-sm">
            <svg className="w-2.5 h-2.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {item.confidence}% Match
          </span>
        )}
        {/* Time overlay */}
        <span className="absolute bottom-2.5 right-2.5 bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
          {item.time}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-gray-900 mb-2 truncate">{item.name}</h3>

        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="truncate">{item.category}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{item.location}</span>
          </div>
        </div>

        <button className="mt-4 w-full border border-blue-200 hover:border-blue-500 hover:bg-blue-600 hover:text-white text-blue-600 text-xs font-semibold py-2 rounded-xl transition-all duration-150 active:scale-[0.98]">
          View Details
        </button>
      </div>
    </div>
  );
}

/* ─── PAGINATION ─────────────────────────────────────── */
function Pagination({ current, setCurrent }) {
  const pages = [1, 2, 3, "...", TOTAL_PAGES];

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8 mb-4">
      {/* Prev */}
      <button
        onClick={() => setCurrent(Math.max(1, current - 1))}
        disabled={current === 1}
        className={`w-8 h-8 flex items-center justify-center rounded-xl border text-sm transition-all
          ${current === 1
            ? "border-gray-100 text-gray-300 cursor-not-allowed"
            : "border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50"}`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pages.map((p, i) => (
        <button
          key={i}
          onClick={() => typeof p === "number" && setCurrent(p)}
          className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-semibold transition-all
            ${p === current
              ? "bg-blue-600 text-white shadow-md shadow-blue-200"
              : typeof p === "number"
                ? "border border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50"
                : "text-gray-400 cursor-default"}`}
        >
          {p}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => setCurrent(Math.min(TOTAL_PAGES, current + 1))}
        disabled={current === TOTAL_PAGES}
        className={`w-8 h-8 flex items-center justify-center rounded-xl border text-sm transition-all
          ${current === TOTAL_PAGES
            ? "border-gray-100 text-gray-300 cursor-not-allowed"
            : "border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50"}`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

/* ─── FOOTER ─────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-full px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 bg-blue-600 rounded-md flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <span className="font-extrabold text-gray-900 text-sm">Findora</span>
          </div>
          <p className="text-[11px] text-gray-400">© 2024 Findora Recovery Systems. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-400">
          {["Privacy Policy", "Terms of Service", "Security", "Accessibility", "Support"].map((l) => (
            <a key={l} href="#" className="hover:text-gray-700 transition-colors">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ─── MAIN PAGE ─────────────────────────────────────── */
export default function BrowseItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [location, setLocation] = useState("All Locations");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
  fetchItems();
}, []);

const fetchItems = async () => {
  try {
    const res = await getAllItems();

    const transformed = res.data.items.map((item) => ({
      id: item._id,
      name: item.title,
      description: item.description,
      brand: item.brand,
      category: item.category,
      location: item.location?.name || "Unknown Location",
      time: new Date(item.dateLostOrFound).toLocaleDateString(),
      dateLostOrFound: item.dateLostOrFound,
      reportedBy: item.reportedBy,
      status: item.type,
      confidence: item.matchScore || null,
      img:
        item.images?.[0] ||
        "https://via.placeholder.com/400x300",
    }));

    setItems(transformed);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
   

  const toggleCategory = (cat) => {
    setCategoryFilters((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const removeCategory = (cat) => setCategoryFilters((prev) => prev.filter((c) => c !== cat));
  const filtered = items.filter((item) => {
    const matchStatus =
      statusFilter === "All" ||
      item.status === statusFilter.toLowerCase();
    const matchCategory =
      categoryFilters.length === 0 ||
      categoryFilters.includes(item.category);
     const matchLocation =location === "All Locations" ||item.location?.name === location;
      const matchDate =
  !date ||
  item.dateLostOrFound?.slice(0, 10) === date;
  

    const matchSearch =
  item.title?.toLowerCase().includes(search.toLowerCase()) ||
  item.category?.toLowerCase().includes(search.toLowerCase()) ||
  item.location?.toLowerCase().includes(search.toLowerCase()) ||
  item.description?.toLowerCase().includes(search.toLowerCase()) ||
  item.brand?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchCategory &&  matchLocation && matchDate && matchSearch;
  });

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Topbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <main className="flex-1 px-4 sm:px-6 py-6">

            {/* ── Search + Location + Date row ── */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              {/* Search */}
              <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5
                              hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  placeholder="Search for items (e.g. 'Blue Wallet', 'Airpods')"
                  className="bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none w-full"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Location */}
              <div className="relative">
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 pr-8 py-2.5 text-sm text-gray-700
                             hover:border-blue-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                             transition-all cursor-pointer min-w-[160px]"
                >
                  {LOCATIONS.map((l) => <option key={l}>{l}</option>)}
                </select>
                <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Date picker */}
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500
                           hover:border-blue-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                           transition-all cursor-pointer"
              />
            </div>

            {/* ── Status tabs + Category chips ── */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {/* Status tabs */}
              <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white">
                {["All", "Lost", "Found"].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                    className={`px-4 py-1.5 text-xs font-semibold transition-all
                      ${statusFilter === s
                        ? s === "Found"
                          ? "bg-emerald-600 text-white"
                          : s === "Lost"
                            ? "bg-amber-500 text-white"
                            : "bg-blue-600 text-white"
                        : "text-gray-500 hover:bg-gray-50"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block" />

              {/* Category chips */}
              {CATEGORY_FILTERS.map((cat) => {
                const active = categoryFilters.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => { toggleCategory(cat); setCurrentPage(1); }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
                      ${active
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"}`}
                  >
                    {cat}
                    {active && (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </button>
                );
              })}

              {/* Clear all */}
              {(categoryFilters.length > 0 || statusFilter !== "All" || search || date) && (
                <button
                  onClick={() => { setCategoryFilters([]); setStatusFilter("All"); setSearch(""); setDate(""); setCurrentPage(1); }}
                  className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors ml-1"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* ── Results count ── */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-gray-500 font-medium">
                Showing <span className="font-bold text-gray-900">{filtered.length}</span> items
                {search && <> for "<span className="text-blue-600">{search}</span>"</>}
              </p>
              {filtered.length > 0 && (
                <p className="text-xs text-gray-400">
                  Page {currentPage} of {Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1}
                </p>
              )}
            </div>

            {/* ── Grid ── */}
            {paginated.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-gray-700 mb-1">No items found</p>
                <p className="text-xs text-gray-400 mb-5 text-center max-w-xs">
                  Try adjusting your search, filters, or date range
                </p>
                <button
                  onClick={() => { setCategoryFilters([]); setStatusFilter("All"); setSearch(""); setDate(""); }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginated.map((item) => (
                  <ItemCard key={item.id} item={item} onClick={() => navigate(`/item/${item.id}`)} />
                ))}
              </div>
            )}

            {/* ── Pagination ── */}
            {filtered.length > ITEMS_PER_PAGE && (
              <Pagination current={currentPage} setCurrent={setCurrentPage} />
            )}
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}