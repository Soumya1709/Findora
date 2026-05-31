export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="font-bold text-gray-900 text-sm">Findora</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Empowering campus recovery through technology.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-12 gap-y-6 text-sm text-gray-500">
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Platform</span>
              <a href="#" className="hover:text-gray-900 transition-colors">Browse Items</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Report Lost</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Report Found</a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Legal</span>
              <a href="#" className="hover:text-gray-900 transition-colors">Campus Safety</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Contact Security</a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
          © 2026 Findora. All rights reserved.
        </div>
      </div>
    </footer>
  );
}