import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthLayout from "../components/AuthLayout";
import { signup } from "../services/authService";



const inputCls = `w-full py-3 text-[13.5px] rounded-xl border bg-[#F8FAF8]
  text-[#1A1A1A] placeholder-gray-400 outline-none transition-all duration-150
  border-[#E5E7EB]
  hover:border-[#5BE63A]/50 hover:bg-white
  focus:border-[#5BE63A] focus:bg-white focus:ring-4 focus:ring-[#5BE63A]/10`;

const labelCls = `block text-[10px] font-bold text-[#9CA3AF] uppercase tracking-[0.8px] mb-2`;

/* ── Eye toggle icon ────────────────────────────────── */
function EyeIcon({ open }) {
  return open ? (
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
  );
}

/* ── Password strength meter ────────────────────────── */
function PasswordStrength({ password }) {
  if (!password) return null;
  const strength =
    password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password) ? 3
    : password.length >= 8 && (/[A-Z]/.test(password) || /[0-9]/.test(password)) ? 2
    : 1;
  const labels = ["Weak", "Fair", "Strong"];
  const colors = ["#EF4444", "#F59E0B", "#5BE63A"];
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: n <= strength ? colors[strength - 1] : "#F3F4F6" }} />
        ))}
      </div>
      <p className="text-[11px] font-semibold" style={{ color: colors[strength - 1] }}>
        {labels[strength - 1]} password
      </p>
    </div>
  );
}

export default function Signup() {
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed,      setAgreed]      = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName:        "",
    email:           "",
    password:        "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const payload = {
        fullName: formData.fullName,
        email:    formData.email,
        password: formData.password,
      };
      const response = await signup(payload);
      alert("Account created successfully!");
      console.log(response.data);
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      alert(error?.response?.data?.message || "Signup failed");
    }
  };

  /* Password match indicator */
  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;
  const passwordsMismatch =
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword;

  return (
    <AuthLayout>

      {/* ── Tab switcher ─────────────────────────────── */}
      <div className="flex rounded-xl p-1 mb-8 gap-1"
        style={{ background: "#F3F4F6" }}>
        <Link to="/login"
          className="flex-1 py-2.5 rounded-lg text-center text-[13px] font-medium no-underline transition-all duration-150"
          style={{ color: "#667085" }}
          onMouseEnter={e => { e.currentTarget.style.color = "#1A1A1A"; e.currentTarget.style.background = "rgba(255,255,255,0.6)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "#667085"; e.currentTarget.style.background = "transparent"; }}>
          Login
        </Link>
        <div className="flex-1 py-2.5 rounded-lg text-center text-[13px] font-bold cursor-default"
          style={{ background: "#1B3A2F", color: "#5BE63A", boxShadow: "0 2px 8px rgba(27,58,47,0.2)" }}>
          Create Account
        </div>
      </div>

      {/* ── Header ───────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }} className="mb-6">
        <h2 className="text-[24px] font-black tracking-tight mb-1" style={{ color: "#1A1A1A" }}>
          Create your account
        </h2>
        <p className="text-[13.5px]" style={{ color: "#667085" }}>
          Join Findora and recover lost items faster.
        </p>
      </motion.div>

      {/* ── Form ─────────────────────────────────────── */}
      <motion.form initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="space-y-4" onSubmit={handleSubmit}>

        {/* Full Name */}
        <div>
          <label className={labelCls}>Full Name</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "#9CA3AF" }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </span>
            <input type="text" name="fullName" placeholder="Alex Johnson"
              value={formData.fullName} onChange={handleChange}
              className={`${inputCls} pl-10 pr-4`}/>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className={labelCls}>College Email Address</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
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
          <label className={labelCls}>Password</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "#9CA3AF" }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </span>
            <input type={showPass ? "text" : "password"} name="password"
              placeholder="Min. 8 characters"
              value={formData.password} onChange={handleChange}
              className={`${inputCls} pl-10 pr-11`}/>
            <motion.button type="button" onClick={() => setShowPass(!showPass)}
              whileTap={{ scale: 0.9 }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-150"
              style={{ color: "#9CA3AF" }}
              onMouseEnter={e => e.currentTarget.style.color = "#1B3A2F"}
              onMouseLeave={e => e.currentTarget.style.color = "#9CA3AF"}>
              <EyeIcon open={showPass}/>
            </motion.button>
          </div>
          <PasswordStrength password={formData.password}/>
        </div>

        {/* Confirm Password */}
        <div>
          <label className={labelCls}>Confirm Password</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "#9CA3AF" }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </span>
            <input type={showConfirm ? "text" : "password"} name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword} onChange={handleChange}
              className={`${inputCls} pl-10 pr-11`}
              style={{
                borderColor: passwordsMismatch ? "#EF4444" : passwordsMatch ? "#5BE63A" : undefined,
              }}/>
            <motion.button type="button" onClick={() => setShowConfirm(!showConfirm)}
              whileTap={{ scale: 0.9 }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-150"
              style={{ color: "#9CA3AF" }}
              onMouseEnter={e => e.currentTarget.style.color = "#1B3A2F"}
              onMouseLeave={e => e.currentTarget.style.color = "#9CA3AF"}>
              <EyeIcon open={showConfirm}/>
            </motion.button>
          </div>
          {/* Match feedback */}
          {passwordsMatch && (
            <p className="text-[11px] font-semibold mt-1.5 flex items-center gap-1"
              style={{ color: "#5BE63A" }}>
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="2,6 5,9 10,3"/>
              </svg>
              Passwords match
            </p>
          )}
          {passwordsMismatch && (
            <p className="text-[11px] font-semibold mt-1.5 flex items-center gap-1"
              style={{ color: "#EF4444" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Passwords do not match
            </p>
          )}
        </div>

        {/* Terms checkbox */}
        <label className="flex items-start gap-3 cursor-pointer mt-1">
          <div className="relative mt-0.5 flex-shrink-0">
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
              className="sr-only"/>
            <motion.div whileTap={{ scale: 0.88 }}
              onClick={() => setAgreed(!agreed)}
              className="w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center transition-all duration-150"
              style={{
                background: agreed ? "#5BE63A" : "#fff",
                borderColor: agreed ? "#5BE63A" : "#E5E7EB",
              }}>
              {agreed && (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#1B3A2F" strokeWidth={2.5}>
                  <polyline points="2,6 5,9 10,3"/>
                </svg>
              )}
            </motion.div>
          </div>
          <span className="text-[12.5px] leading-relaxed" style={{ color: "#667085" }}>
            I agree to the{" "}
            <a href="#" className="font-semibold transition-colors duration-150"
              style={{ color: "#5BE63A" }}
              onMouseEnter={e => e.currentTarget.style.color = "#1B3A2F"}
              onMouseLeave={e => e.currentTarget.style.color = "#5BE63A"}>
              Terms of Service
            </a>{" "}and{" "}
            <a href="#" className="font-semibold transition-colors duration-150"
              style={{ color: "#5BE63A" }}
              onMouseEnter={e => e.currentTarget.style.color = "#1B3A2F"}
              onMouseLeave={e => e.currentTarget.style.color = "#5BE63A"}>
              Privacy Policy
            </a>
          </span>
        </label>

        {/* Submit */}
        <motion.button type="submit"
          whileHover={{ y: -2, boxShadow: "0 10px 28px rgba(91,230,58,0.32)" }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3.5 rounded-xl text-[14px] font-black tracking-tight transition-all duration-150 mt-1"
          style={{ background: "#1B3A2F", color: "#5BE63A", boxShadow: "0 4px 14px rgba(27,58,47,0.22)" }}>
          Create Account
        </motion.button>
      </motion.form>

      {/* ── Footer link ──────────────────────────────── */}
      <p className="text-center text-[12.5px] mt-6" style={{ color: "#9CA3AF" }}>
        Already have an account?{" "}
        <Link to="/login"
          className="font-bold no-underline transition-colors duration-150"
          style={{ color: "#5BE63A" }}
          onMouseEnter={e => e.currentTarget.style.color = "#1B3A2F"}
          onMouseLeave={e => e.currentTarget.style.color = "#5BE63A"}>
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}