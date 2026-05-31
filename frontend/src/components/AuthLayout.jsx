import campusImage from "../assets/campus.png";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-2xl grid lg:grid-cols-2">

        {/* ── Left Panel ── */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-10 relative overflow-hidden">

          {/* Subtle radial glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full bg-blue-600/10 blur-3xl" />
            <div className="absolute bottom-[-60px] right-[-60px] w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />
          </div>

          {/* Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h1 className="text-lg font-extrabold tracking-tight">Findora</h1>
            </div>

            <p className="text-2xl font-bold leading-snug text-white/90">
              Your Campus. Your Stuff.
              <br />
              <span className="text-blue-400">Found Faster.</span>
            </p>
            <p className="mt-3 text-sm text-white/50 leading-relaxed max-w-xs">
              The ultimate lost and found ecosystem designed for modern campuses. Rapid recovery, secure verification, and peace of mind.
            </p>
          </div>

          {/* Campus image */}
          <div className="flex justify-center relative z-10">
            <div className="w-72 h-72 rounded-3xl overflow-hidden rotate-6 shadow-2xl ring-1 ring-white/10">
              <img src={campusImage} alt="Campus" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Badges */}
          <div className="relative z-10 space-y-3">
            <div className="flex flex-wrap gap-2">
              {["Verified ID", "Instant Alerts", "Smart Matching"].map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-medium text-white/80 backdrop-blur-sm">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 text-xs font-semibold shadow-lg shadow-emerald-900/30">
                <span className="w-1.5 h-1.5 rounded-full bg-white/80 inline-block animate-pulse"></span>
                Community Powered
              </span>
              <span className="text-xs text-white/40">10,000+ items returned last semester</span>
            </div>
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="p-8 sm:p-12 flex items-center justify-center bg-white">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}