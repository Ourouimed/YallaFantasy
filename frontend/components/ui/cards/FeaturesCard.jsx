export default function FeaturesCard({ title, icon: Icon, description }) {
  return (
    <div className="rounded-2xl border border-[#e3e8e5] p-6 shadow-sm transition duration-200 hover:-translate-y-2 hover:border-third">
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-third mb-4">
        <Icon className="text-black w-6 h-6" />
      </div>

      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      <p className="text-sm text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
