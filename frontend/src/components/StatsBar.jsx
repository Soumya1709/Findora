const stats = [
  { value: "12,400+", label: "Items Recovered" },
  { value: "98%", label: "Success Rate" },
  { value: "50k+", label: "Active Users" },
  { value: "15 min", label: "Avg. Match Time" },
];

export default function StatsBar() {
  return (
    <section className="bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">{s.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}