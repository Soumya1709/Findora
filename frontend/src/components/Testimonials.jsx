const testimonials = [
  {
    stars: 5,
    text: "I lost my AirPods in the library during finals week. I reported them here and got a notification just 2 hours later. Life saver!!",
    name: "Sonia Patel",
    role: "Computer Science Student",
    avatar: "SJ",
    color: "bg-blue-500",
  },
  {
    stars: 5,
    text: "The AI matching is actually insane. I uploaded a blurry photo of a found wallet and it matched with a report within minutes. Campus security is much faster now.",
    name: "Mark Johnson",
    role: "Business Student",
    avatar: "MC",
    color: "bg-purple-500",
  },
  {
    stars: 5,
    text: "Super easy to use and it feels secure. I found a expensive calculator and was able to find the owner without posting my personal info publicly.",
    name: "Soumya Rao",
    role: "Engineering Student",
    avatar: "ER",
    color: "bg-emerald-500",
  },
];

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-gray-50 border-t border-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-10">Student Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
            >
              <Stars count={t.stars} />
              <p className="text-sm text-gray-600 leading-relaxed flex-1">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                <div className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}