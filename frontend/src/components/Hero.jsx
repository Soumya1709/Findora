import { useNavigate } from "react-router-dom";
export default function Hero() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const isLoggedIn = !!token;
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14">
      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* Left Content */}
        <div className="flex-1 max-w-xl">
          <span className="inline-block mb-4 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
            Trusted by 50,000+ Students
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Lost Something on Campus?{" "}
            <span className="text-blue-600">We'll Help You Find It.</span>
          </h1>
          <p className="text-gray-500 text-base leading-relaxed mb-8">
            The smartest way to recover your lost belongings. Our AI‑driven
            platform matches found items with lost reports in seconds, bringing
            your items back home.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => {if (isLoggedIn) { navigate("/report");} else {navigate("/login");}}}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-md shadow-blue-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>

           Report Lost Item
           </button>
          <button onClick={() => {if (isLoggedIn) { navigate("/browse");} else {navigate("/login");}}}
          className="inline-flex items-center gap-2 border border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600 text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors bg-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          Browse Found Items
          </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 relative w-full max-w-lg">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=700&q=80"
              alt="Lost items on desk"
              className="w-full h-72 sm:h-96 object-cover"
            />
          </div>
          {/* Match badge overlay */}
          <div className="absolute bottom-4 right-4 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">92% Match</p>
              <p className="text-[10px] text-gray-500">AI Confidence Score</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}