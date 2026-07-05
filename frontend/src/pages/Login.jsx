import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthLayout from "../components/AuthLayout";
import { login, googleLogin } from "../services/authService";
import { useGoogleLogin } from "@react-oauth/google";



const inputCls = `w-full py-3 text-[13.5px] rounded-xl border bg-[#F8FAF8]
  text-[#1A1A1A] placeholder-gray-400 outline-none transition-all duration-150
  border-[#E5E7EB]
  hover:border-[#5BE63A]/50 hover:bg-white
  focus:border-[#5BE63A] focus:bg-white focus:ring-4 focus:ring-[#5BE63A]/10`;

const labelCls = `block text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.8px] mb-2`;

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await googleLogin(tokenResponse.access_token);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard");
      } catch (error) {
        console.error(error);
      }
    },
    onError: () => { console.log("Google Login Failed"); },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      alert("Login Successful");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <AuthLayout>
      {/* ── Tab switcher ─────────────────────────────── */}
      <div className="flex rounded-xl p-1 mb-8 gap-1"
        style={{ background: "#F3F4F6" }}>
        <div className="flex-1 py-2.5 rounded-lg text-center text-[13px] font-bold cursor-default"
          style={{ background: "#1B3A2F", color: "#5BE63A", boxShadow: "0 2px 8px rgba(27,58,47,0.2)" }}>
          Login
        </div>
        <Link to="/signup"
          className="flex-1 py-2.5 rounded-lg text-center text-[13px] font-medium no-underline transition-all duration-150"
          style={{ color: "#667085" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#1A1A1A"; e.currentTarget.style.background = "rgba(255,255,255,0.6)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#667085"; e.currentTarget.style.background = "transparent"; }}>
          Create Account
        </Link>
      </div>

      {/* ── Header ───────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }} className="mb-7">
        <h2 className="text-[24px] font-black tracking-tight mb-1" style={{ color: "#1A1A1A" }}>
          Welcome back
        </h2>
        <p className="text-[13.5px]" style={{ color: "#667085" }}>
          Sign in to manage your lost items and alerts.
        </p>
      </motion.div>

      {/* ── Form ─────────────────────────────────────── */}
      <motion.form initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="space-y-4" onSubmit={handleSubmit}>

        {/* Email */}
        <div>
          <label className={labelCls}>College Email Address</label>
          <div className="relative group">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-150"
              style={{ color: "#9CA3AF" }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </span>
            <input type="email" name="email" placeholder="you@college.edu"
              value={formData.email} onChange={handleChange}
              className={`${inputCls} pl-10 pr-4`}/>
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={`${labelCls} mb-0`}>Password</label>
            <a href="#" className="text-[11.5px] font-semibold transition-colors duration-150"
              style={{ color: "#5BE63A" }}
              onMouseEnter={e => e.currentTarget.style.color = "#1B3A2F"}
              onMouseLeave={e => e.currentTarget.style.color = "#5BE63A"}>
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "#9CA3AF" }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </span>
            <input type={showPass ? "text" : "password"} name="password"
              placeholder="••••••••" value={formData.password} onChange={handleChange}
              className={`${inputCls} pl-10 pr-11`}/>
            <motion.button type="button" onClick={() => setShowPass(!showPass)}
              whileTap={{ scale: 0.9 }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-150"
              style={{ color: "#9CA3AF" }}
              onMouseEnter={e => e.currentTarget.style.color = "#1B3A2F"}
              onMouseLeave={e => e.currentTarget.style.color = "#9CA3AF"}>
              {showPass ? (
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              ) : (
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              )}
            </motion.button>
          </div>
        </div>

        {/* Submit */}
        <motion.button type="submit"
          whileHover={{ y: -2, boxShadow: "0 10px 28px rgba(91,230,58,0.32)" }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3.5 rounded-xl text-[14px] font-black tracking-tight transition-all duration-150 mt-2"
          style={{ background: "#1B3A2F", color: "#5BE63A", boxShadow: "0 4px 14px rgba(27,58,47,0.22)" }}>
          Sign In
        </motion.button>
      </motion.form>

      {/* ── Divider ──────────────────────────────────── */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px" style={{ background: "#E5E7EB" }}/>
        <span className="text-[10.5px] font-bold uppercase tracking-[0.8px]"
          style={{ color: "#9CA3AF" }}>Or continue with</span>
        <div className="flex-1 h-px" style={{ background: "#E5E7EB" }}/>
      </div>

      {/* ── SSO buttons ──────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="grid grid-cols-2 gap-3">
        {[
          {
            label: "Google",
            onClick: () => handleGoogleLogin(),
            icon: (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            ),
          },
          {
            label: "Microsoft",
            onClick: undefined,
            icon: (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#F25022" d="M1 1h10v10H1z"/>
                <path fill="#00A4EF" d="M13 1h10v10H13z"/>
                <path fill="#7FBA00" d="M1 13h10v10H1z"/>
                <path fill="#FFB900" d="M13 13h10v10H13z"/>
              </svg>
            ),
          },
        ].map(({ label, icon, onClick }) => (
          <motion.button key={label} type="button" onClick={onClick}
            whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2.5 py-3 rounded-xl text-[13px] font-semibold transition-all duration-150"
            style={{ border: "1.5px solid #E5E7EB", color: "#1A1A1A", background: "#fff" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#C9DFC0"; e.currentTarget.style.background = "#F8FAF8"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.background = "#fff"; }}>
            {icon}
            {label}
          </motion.button>
        ))}
      </motion.div>

      {/* ── Terms ────────────────────────────────────── */}
      <p className="text-center text-[12px] mt-6 leading-relaxed" style={{ color: "#9CA3AF" }}>
        By signing in, you agree to our{" "}
        <a href="#" className="font-semibold transition-colors duration-150"
          style={{ color: "#5BE63A" }}
          onMouseEnter={e => e.currentTarget.style.color = "#1B3A2F"}
          onMouseLeave={e => e.currentTarget.style.color = "#5BE63A"}>
          Terms of Service
        </a>
        {" "}and{" "}
        <a href="#" className="font-semibold transition-colors duration-150"
          style={{ color: "#5BE63A" }}
          onMouseEnter={e => e.currentTarget.style.color = "#1B3A2F"}
          onMouseLeave={e => e.currentTarget.style.color = "#5BE63A"}>
          Privacy Policy
        </a>.
      </p>
    </AuthLayout>
  );
}