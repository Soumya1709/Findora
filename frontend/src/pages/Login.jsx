import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function Login() {
  const [showPass, setShowPass] = useState(false);

  return (
    <AuthLayout>
      {/* Tab switcher */}
      <div className="flex border-b border-gray-200 mb-8">
        <button className="flex-1 py-3 border-b-2 border-blue-600 text-blue-600 text-sm font-semibold transition-colors">
          Login
        </button>
        <Link
          to="/signup"
          className="flex-1 py-3 text-center text-sm text-gray-400 font-medium hover:text-gray-700 transition-colors"
        >
          Create Account
        </Link>
      </div>

      {/* Header */}
      <div className="mb-7">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Welcome back</h2>
        <p className="text-sm text-gray-500">Sign in to manage your lost items and alerts.</p>
      </div>

      {/* Form */}
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>

        {/* Email */}
        <div className="group relative">
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
              placeholder="@ame@college.edu"
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50
                         placeholder-gray-400 text-gray-900
                         hover:border-blue-300 hover:bg-white
                         focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100
                         transition-all duration-200"
            />
          </div>
        </div>

        {/* Password */}
        <div className="group relative">
          <div className="flex justify-between items-center mb-1.5 pl-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Password
            </label>
            <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              className="w-full pl-10 pr-12 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50
                         placeholder-gray-400 text-gray-900
                         hover:border-blue-300 hover:bg-white
                         focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100
                         transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPass ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Sign In button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white py-3 rounded-xl text-sm font-semibold
                     shadow-lg shadow-blue-200 hover:shadow-blue-300
                     transition-all duration-200 mt-2"
        >
          Sign In
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">OR CONTINUE WITH</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* SSO buttons */}
      <div className="grid grid-cols-2 gap-3">
        {[
          {
            label: "Google",
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
            icon: (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#F25022" d="M1 1h10v10H1z"/>
                <path fill="#00A4EF" d="M13 1h10v10H13z"/>
                <path fill="#7FBA00" d="M1 13h10v10H1z"/>
                <path fill="#FFB900" d="M13 13h10v10H13z"/>
              </svg>
            ),
          },
        ].map(({ label, icon }) => (
          <button
            key={label}
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700
                       hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98]
                       transition-all duration-150"
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        By signing in, you agree to our{" "}
        <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{" "}
        and{" "}
        <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
      </p>
    </AuthLayout>
  );
}