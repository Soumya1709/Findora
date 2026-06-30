import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { signup } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
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
      email: formData.email,
      password: formData.password,
    };

    const response = await signup(payload);

    alert("Account created successfully!");

    console.log(response.data);

    navigate("/login");
  } catch (error) {
    console.error("Signup failed:", error);

    alert(
      error?.response?.data?.message ||
      "Signup failed"
    );
  }
};

  return (
    <AuthLayout>
      {/* Tab switcher */}
      <div className="flex border-b border-gray-200 mb-8">
        <Link
          to="/login"
          className="flex-1 py-3 text-center text-sm text-gray-400 font-medium hover:text-gray-700 transition-colors"
        >
          Login
        </Link>
        <button className="flex-1 py-3 border-b-2 border-blue-600 text-blue-600 text-sm font-semibold transition-colors">
          Create Account
        </button>
      </div>

      {/* Header */}
      <div className="mb-7">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Create your account</h2>
        <p className="text-sm text-gray-500">Join Findora and recover lost items faster.</p>
      </div>

      {/* Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>

        {/* Full Name */}
        <div className="group">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 pl-1">
            Full Name
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Alex Johnson"
                className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50
                      placeholder-gray-400 text-gray-900 hover:border-blue-300 hover:bg-white
                      focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100
                       transition-all duration-200"
            />
          </div>
        </div>

        {/* College Email */}
        <div className="group">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 pl-1">
            College Email Address
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              type="email"
              placeholder="you@college.edu"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50
                         placeholder-gray-400 text-gray-900
                         hover:border-blue-300 hover:bg-white
                         focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100
                         transition-all duration-200"
            />
          </div>
        </div>

        {/* Password */}
        <div className="group">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 pl-1">
            Password
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Min. 8 characters"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50
                         placeholder-gray-400 text-gray-900
                         hover:border-blue-300 hover:bg-white
                         focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100
                         transition-all duration-200"
            />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showPass
                  ? <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></>
                  : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="group">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 pl-1">
            Confirm Password
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter your password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50
                         placeholder-gray-400 text-gray-900
                         hover:border-blue-300 hover:bg-white
                         focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100
                         transition-all duration-200"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showConfirm
                  ? <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></>
                  : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Terms */}
        <label className="flex items-start gap-3 cursor-pointer group mt-1">
          <input
            type="checkbox"
            className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600
                       focus:ring-2 focus:ring-blue-100 focus:ring-offset-0
                       accent-blue-600 cursor-pointer flex-shrink-0"
          />
          <span className="text-xs text-gray-500 leading-relaxed">
            I agree to the{" "}
            <a href="#" className="text-blue-600 hover:underline font-medium">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline font-medium">Privacy Policy</a>
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white py-3 rounded-xl text-sm font-semibold
                     shadow-lg shadow-blue-200 hover:shadow-blue-300
                     transition-all duration-200 mt-1"
        >
          Create Account
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}