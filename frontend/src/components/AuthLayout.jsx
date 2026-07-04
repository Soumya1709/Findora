import campusImage from "../assets/campus.png";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#F8FAF8" }}>
      <div className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden grid lg:grid-cols-2"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)", border: "1px solid #E5E7EB" }}>

        {/* Left panel */}
        <div className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden"
          style={{ background: "#1B3A2F" }}>

          {/* Decorative blobs */}
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full pointer-events-none opacity-10"
            style={{ background: "#5BE63A" }}/>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full pointer-events-none opacity-8"
            style={{ background: "#5BE63A" }}/>

          {/* Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-7">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "#5BE63A", boxShadow: "0 4px 14px rgba(91,230,58,0.3)" }}>
                <svg width="17" height="17" fill="none" stroke="#1B3A2F" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <span className="font-black text-[20px] tracking-tight text-white">
                Find<span style={{ color: "#5BE63A" }}>ora</span>
              </span>
            </div>

            <p className="text-[26px] font-black leading-tight tracking-tight text-white">
              Your Campus.<br/>Your Stuff.
              <br/>
              <span style={{ color: "#5BE63A" }}>Found Faster.</span>
            </p>
            <p className="mt-3 text-[13.5px] leading-relaxed max-w-xs"
              style={{ color: "rgba(255,255,255,0.5)" }}>
              The ultimate lost and found ecosystem designed for modern campuses.
              Rapid recovery, secure verification, and peace of mind.
            </p>
          </div>

          {/* Campus image */}
          <div className="flex justify-center relative z-10 my-2">
            <div className="w-64 h-64 rounded-2xl overflow-hidden"
              style={{
                transform: "rotate(4deg)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}>
              <img src={campusImage} alt="Campus" className="w-full h-full object-cover"/>
            </div>
          </div>

          {/* Tags */}
          <div className="relative z-10 space-y-3">
            <div className="flex flex-wrap gap-2">
              {["Verified ID", "Instant Alerts", "Smart Matching"].map((tag) => (
                <span key={tag}
                  className="px-3 py-1.5 rounded-full text-[11.5px] font-semibold"
                  style={{ background: "rgba(91,230,58,0.12)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(91,230,58,0.2)" }}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-bold"
                style={{ background: "#5BE63A", color: "#1B3A2F" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse inline-block"/>
                Community Powered
              </span>
              <span className="text-[11.5px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                10,000+ items returned last semester
              </span>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="p-8 sm:p-12 flex items-center justify-center bg-white">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}