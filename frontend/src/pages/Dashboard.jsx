import { useState,useEffect} from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getMyItems } from "../services/itemService";


const matchAlerts = [
  {
    id: 1,
    item: "Sony XM4 Headphones",
    confidence: 92,
    location: "Library",
    time: "2h ago",
  },
  {
    id: 2,
    item: "Blue Calculus Textbook",
    confidence: 74,
    location: "Science Block",
    time: "1d ago",
  },
];



/* ─── HELPERS ────────────────────────────────────────── */
const statusStyles = {
  returned: "bg-blue-50 text-blue-700 border border-blue-200",
  lost:     "bg-amber-50 text-amber-700 border border-amber-200",
  found:    "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const statusDot = {
  returned: "bg-blue-500",
  lost:     "bg-amber-500",
  found:    "bg-emerald-500",
};

const activityIcon = {
  returned: { bg: "bg-blue-100",    icon: "✓", text: "text-blue-600" },
  match:    { bg: "bg-purple-100",  icon: "⚡", text: "text-purple-600" },
  report: { bg: "bg-amber-100",   icon: "📋", text: "text-amber-600" },
};

function ConfidenceRing({ value }) {
  const r = 16;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color = value >= 85 ? "#10b981" : value >= 65 ? "#f59e0b" : "#ef4444";
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="48" height="48">
        <circle cx="24" cy="24" r={r} fill="none" stroke="#f1f5f9" strokeWidth="3" />
        <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      </svg>
      <span className="text-[10px] font-bold text-gray-700 z-10">{value}%</span>
    </div>
  );
}

/* ─── SIDEBAR ────────────────────────────────────────── */
const navItems = [
  
  {
    label: "Dashboard",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
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
    badge: 3,
  },
  {
    label: "Match Alerts",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    badge: 2,
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
    label: "Messages",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    label: "Analytics",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    label: "Settings",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

function Sidebar({ active, setActive, collapsed, setCollapsed }) {
  const navigate = useNavigate();
  return (
    <aside
      className={`${collapsed ? "w-16" : "w-60"} hidden md:flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ease-in-out flex-shrink-0`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-2 px-4 h-14 border-b border-gray-100 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {!collapsed && <span className="font-extrabold text-gray-900 text-[15px] tracking-tight">Findora</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = active === item.label;
          return (
            <button
              key={item.label}
              onClick={() => {setActive(item.label);navigate(item.path);}}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }
                ${collapsed ? "justify-center" : ""}
              `}
            >
              <span className={isActive ? "text-blue-600" : ""}>{item.icon}</span>
              {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="text-[10px] font-bold bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-2 py-4 border-t border-gray-100 space-y-0.5">
        <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors ${collapsed ? "justify-center" : ""}`}>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {!collapsed && <span>Help Center</span>}
        </button>
        <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors ${collapsed ? "justify-center" : ""}`}>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-2 mb-3 flex items-center justify-center gap-2 py-2 rounded-xl text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <svg className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
        {!collapsed && <span>Collapse</span>}
      </button>
    </aside>
  );
}

/* ─── TOPBAR ─────────────────────────────────────────── */
function Topbar({ active, search, setSearch }) {
  const storedUser = JSON.parse(
  localStorage.getItem("user") || "{}"
);

const avatarInitials =
  storedUser?.fullName
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "U";


  
  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile logo */}
        <div className="md:hidden w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-900">{active}</h1>
          <p className="text-[11px] text-gray-400 hidden sm:block">Findora · Lost &amp; Found Portal</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-48 hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-xs text-gray-600 placeholder-gray-400 focus:outline-none w-full"
            placeholder="Search items..."
          />
        </div>

        {/* Notification bell */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Settings */}
        <button className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all">
          {avatarInitials}
        </div>
      </div>
    </header>
  );
}

/* ─── DASHBOARD CONTENT ──────────────────────────────── */
function DashboardContent({search}) {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const recentReports = reports
  .slice(0, 3)
  .map((item) => ({
    id: item._id,
    name: item.title,
    location: item.location?.name || "Unknown Location",
    date: new Date(
      item.dateLostOrFound
    ).toLocaleDateString(),
    status: item.type,
    category: item.category,
    img:
      item.images?.[0] ||
      "https://placehold.co/80x80",
  }));

  const recentActivity = reports
  .slice(0, 5)
  .map((item) => ({
    id: item._id,
    type: "report",
    action: "Item Reported",
    item: item.title,
    time: new Date(item.createdAt).toLocaleDateString(),
  }));
  const navigate = useNavigate();
  const filteredReports = recentReports.filter(
  (report) =>
    report.name
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    report.location
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    report.category
      .toLowerCase()
      .includes(search.toLowerCase())
);

useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }

  fetchReports();
}, []);

const avatarInitials =
  user?.fullName
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "U";

const fetchReports = async () => {
  try {
    const res = await getMyItems();

    setReports(res.data.items);
  } catch (error) {
    console.error(error);
  }
};

const memberSince = user?.createdAt
  ? new Date(user.createdAt).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })
  : "Recently";

const stats = {
  itemsReported: reports.length,

  itemsRecovered: reports.filter(
    (item) => item.status === "recovered"
  ).length,
};

const successRate =
  reports.length > 0
    ? Math.round(
        (stats.itemsRecovered /
          stats.itemsReported) *
          100
      )
    : 0;

const isVerified = user?.isVerified || false;
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gray-50">

      {/* Welcome + Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900">
            Welcome back, {user?.fullName?.split(" ")[0]} 👋
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Here's what's happening with your items today.
          </p>
        </div>
        <button onClick={() => navigate("/report")} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-200 transition-all self-start sm:self-auto">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Report New Item
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Items Reported",
            value: stats.itemsReported,
            icon: "📋",
            color: "bg-amber-50 border-amber-100",
            valueColor: "text-amber-700",
          },
          {
            label: "Items Recovered",
            value: stats.itemsRecovered,
            icon: "✅",
            color: "bg-emerald-50 border-emerald-100",
            valueColor: "text-emerald-700",
          },
          {
            label: "Active Alerts",
            value: reports.filter((item) => item.status === "active").length,
            icon: "⚡",
            color: "bg-purple-50 border-purple-100",
            valueColor: "text-purple-700",
          },
          {
            label: "Success Rate",
            value: `${successRate}%`,
            icon: "🎯",
            color: "bg-blue-50 border-blue-100",
            valueColor: "text-blue-700",
          },
        ].map((s) => (
          <div key={s.label} className={`${s.color} border rounded-2xl p-4 flex flex-col gap-2`}>
            <span className="text-xl">{s.icon}</span>
            <p className={`text-2xl font-extrabold ${s.valueColor}`}>{s.value}</p>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Reports Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h3 className="text-sm font-bold text-gray-900">My Recent Reports</h3>
            <button className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors">
              View All
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {filteredReports.map((report) => (
              <div key={report.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                {/* Thumbnail */}
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={report.img} alt={report.name} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{report.name}</p>
                  <p className="text-xs text-gray-400 truncate flex items-center gap-1 mt-0.5">
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {report.location}
                  </p>
                </div>

                {/* Date */}
                <p className="text-xs text-gray-400 hidden sm:block flex-shrink-0">{report.date}</p>

                {/* Status */}
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize flex-shrink-0 flex items-center gap-1.5 ${statusStyles[report.status]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot[report.status]}`}></span>
                  {report.status}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">

          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-extrabold text-base flex-shrink-0">
                {avatarInitials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{user?.fullName||"User"}</p>
                <p className="text-xs text-gray-400 truncate">{user?.collegeName||"College Student"}</p>
                {isVerified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5 mt-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                <p className="text-xl font-extrabold text-amber-700">{stats.itemsReported}</p>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide leading-tight mt-0.5">Reported</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
                <p className="text-xl font-extrabold text-emerald-700">{stats.itemsRecovered}</p>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide leading-tight mt-0.5">Recovered</p>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 text-center mt-3">Member since {memberSince}</p>
          </div>

          {/* AI Match Alerts */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <span className="text-xs">⚡</span>
                <h3 className="text-sm font-bold text-gray-900">AI Match Alerts</h3>
              </div>
              <span className="text-[10px] font-bold bg-purple-600 text-white rounded-full px-2 py-0.5">
                {matchAlerts.length} new
              </span>
            </div>
            <div className="divide-y divide-gray-50">
              {matchAlerts.map((alert) => (
                <div key={alert.id} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-900 truncate">{alert.item}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{alert.location} · {alert.time}</p>
                    </div>
                    <ConfidenceRing value={alert.confidence} />
                  </div>
                  <div className="flex gap-2 mt-2.5">
                    <button className="flex-1 text-[11px] font-semibold bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg transition-colors">
                      Claim
                    </button>
                    <button className="flex-1 text-[11px] font-semibold border border-gray-200 hover:border-gray-300 text-gray-600 py-1.5 rounded-lg transition-colors">
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h3 className="text-sm font-bold text-gray-900">Recent Activity</h3>
          <button className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors">View All</button>
        </div>
        <div className="divide-y divide-gray-50">
          {recentActivity.map((a) => {
            const style = activityIcon[a.type];
            return (
              <div key={a.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                <div className={`w-8 h-8 rounded-xl ${style.bg} flex items-center justify-center text-sm flex-shrink-0`}>
                  <span className={style.text}>{style.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900">{a.action}</p>
                  <p className="text-[11px] text-gray-400 truncate">{a.item}</p>
                </div>
                <p className="text-[11px] text-gray-400 flex-shrink-0">{a.time}</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

/* ─── MAIN DASHBOARD PAGE ────────────────────────────── */
export default function Dashboard() {
  const [active, setActive] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");
  

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar active={active} search={search} setSearch={setSearch} />
        <DashboardContent  search={search} />
      </div>
    </div>
  );
}