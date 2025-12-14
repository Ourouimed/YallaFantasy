export default function Switch({ checked, onChange, label }) {
  return (
    <label className="inline-flex items-center cursor-pointer space-x-2">
      <span className="text-xs font-medium text-gray-700 uppercase">{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-10 h-5 bg-gray-300 rounded-full shadow-inner peer-checked:bg-green-500 transition-colors duration-200">
          <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200
            ${checked ? "translate-x-5" : "translate-x-0"} absolute top-0.5 left-0.5`}></div>
        </div>
      </div>
    </label>
  );
}
