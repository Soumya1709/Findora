import { useState } from "react";
import logo from "../assets/findora.png";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const isLoggedIn = !!token;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <a href="/" className="flex items-center">
          <img
             src={logo}
             alt="Findora Logo"
             className="h-12 w-auto"
         />
         </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <button onClick={() => {if (isLoggedIn) {navigate("/dashboard");} else {navigate("/login"); }}}className="text-blue-600 font-semibold">
              Browse Items
            </button>
            <button onClick={() => {if (isLoggedIn) {navigate("/report");} else { navigate("/login");}}}className="hover:text-gray-900 transition-colors">
              Report Lost
            </button>
            <button onClick={() => {if (isLoggedIn) {navigate("/report");} else { navigate("/login");}}}className="hover:text-gray-900 transition-colors">
              Report Found
            </button>
            <a href="#" className="hover:text-gray-900 transition-colors">Success Stories</a>
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-3">
           <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Support
           </a>

          {isLoggedIn ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden cursor-pointer">
             <img
                 src="https://i.pravatar.cc/32"
                 alt="User"
                 className="w-full h-full object-cover"
              />
             </div>
             ) : (
             <>
             <button
                 onClick={() => navigate("/login")} className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                   Login
             </button>

            <button onClick={() => navigate("/register")} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                Register
            </button>
             </>
             )}
           </div>
          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 flex flex-col gap-3 text-sm font-medium text-gray-700">
          <button onClick={() => {if (isLoggedIn) {navigate("/dashboard");} else {navigate("/login"); }}}className="text-blue-600 font-semibold">
              Browse Items
            </button>
            <button onClick={() => {if (isLoggedIn) {navigate("/report");} else { navigate("/login");}}}className="hover:text-gray-900 transition-colors">
              Report Lost
            </button>
            <button onClick={() => {if (isLoggedIn) {navigate("/report");} else { navigate("/login");}}}className="hover:text-gray-900 transition-colors">
              Report Found
            </button>
          <a href="#">Success Stories</a>
          <a href="#">Support</a>
        </div>
      )}
    </nav>
  );
}