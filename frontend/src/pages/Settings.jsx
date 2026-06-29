import { useState,useEffect } from "react";
import { updateProfile } from "../services/userService";
import { useNavigate } from "react-router-dom";

const Logo = ({ className = "" }) => (
  <span className={`font-bold text-xl tracking-tight ${className}`}>
    <span className="text-gray-900">Find</span>
    <span className="text-blue-500">ora</span>
  </span>
);

const BellIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const GearIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const CheckCircleIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" />
  </svg>
);

export default function Settings() {
  const navigate=useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    studentId: "",
    email: "",
    phone: "",
});
  const user = JSON.parse(
  localStorage.getItem("user")
);

   useEffect(() => {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

  if (user) {
    setForm({
      fullName: user.fullName || "",
      studentId: user.studentId || "",
      email: user.email || "",
      phone: user.phoneNumber || "",
    });
  }
}, []);
  const [saved, setSaved] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setSaved(false);
  };

  const handleSave = async (e) => {
  e.preventDefault();

  try {
    const res = await updateProfile({
      fullName: form.fullName,
      phoneNumber: form.phone,
      studentId: form.studentId,
    });

    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );

    setSaved(true);
  } catch (error) {
    console.error(error);
  }
};
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">

      {/* NAV */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 flex items-center gap-6" style={{ height: 52 }}>
          <Logo />
          <div className="flex gap-1 flex-1">
             {["Browse", "Report", "Matching"].map((item, i) => (
          <button
            key={item}
            onClick={() => {
            if (item === "Browse") {
              navigate("/browse");
            } else if (item === "Report") {
              navigate("/report");
            } else if (item === "Matching") {
              navigate("/matching");
            }
          }}className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
             i === 0 ? "text-blue-600 bg-blue-50": "text-gray-500 hover:text-gray-800 hover:bg-gray-100"}`}>
           {item}
            </button>
            ))}
         </div>
          <div className="flex items-center gap-3 ml-auto">
            <button className="text-gray-400 hover:text-gray-700 transition-colors"><BellIcon /></button>
            <button className="text-blue-600"><GearIcon /></button>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold grid place-items-center cursor-pointer">
              {form.fullName?.split(" ").map((n) => n[0]).join("").toUpperCase()}
            </div>
          </div>
        </div>
      </nav>

      {/* BREADCRUMB */}
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-1.5 text-xs text-gray-400 w-full">
        <a href="#" className="hover:text-blue-500 transition-colors">Home</a>
        <span>›</span>
        <span className="text-gray-600">Settings</span>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-16 w-full flex-1">

        <h1 className="text-2xl font-bold tracking-tight leading-tight mb-1">
          Account Settings
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          Update your personal details. This information is used to verify your identity when claiming items.
        </p>

        {saved && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-3 flex items-center gap-2.5 text-sm font-medium">
            <CheckCircleIcon className="w-4 h-4" />
            Your changes have been saved.
          </div>
        )}

        {/* Profile card */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white text-base font-bold grid place-items-center flex-shrink-0">
            {form.fullName?.split(" ").map((n) => n[0]).join("").toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-semibold">{form.fullName || "Your Name"}</div>
            <div className="text-xs text-gray-400">Student ID: {form.studentId || "—"}</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-[10.5px] font-bold uppercase tracking-widest text-gray-400 mb-4">
            Personal Information
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={handleChange("fullName")}
                placeholder="Enter your full name"
                className="w-full text-sm font-medium text-gray-900 border border-gray-200 rounded-lg px-3 py-2.5 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Student ID
              </label>
              <input
                type="text"
                value={form.studentId}
                onChange={handleChange("studentId")}
                placeholder="Enter your student ID"
                className="w-full text-sm font-medium text-gray-900 border border-gray-200 rounded-lg px-3 py-2.5 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                disabled
                placeholder="you@university.edu"
                className="w-full text-sm font-medium text-gray-900 border border-gray-200 rounded-lg px-3 py-2.5 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors bg-gray-50 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={handleChange("phone")}
                placeholder="+91 00000 00000"
                className="w-full text-sm font-medium text-gray-900 border border-gray-200 rounded-lg px-3 py-2.5 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-2.5 mt-6">
            <button
              type="submit"
              className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() =>
                setForm({
                  fullName: user.fullName || "",
                  studentId: user.studentId || "",
                  email: user.email || "",
                  phone: user.phoneNumber || "",
              })
              }
              className="px-5 py-3 border border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-700 text-sm font-medium rounded-xl transition-colors bg-white"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <Logo className="text-base" />
          <p className="text-xs text-gray-400 mt-1">© 2024 Findora Recovery Systems. All rights reserved.</p>
        </div>
        <div className="flex gap-4 text-xs text-gray-400">
          {["Privacy Policy", "Terms of Service", "Security", "Accessibility", "Support"].map((l) => (
            <a key={l} href="#" className="hover:text-blue-500 transition-colors">{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}