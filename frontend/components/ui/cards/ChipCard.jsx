export default function ChipCard({ title, used_at, isAvailble, start_at }) {
  const disabled = used_at || !isAvailble;

  return (
    <button
      disabled={disabled}
      className={`
        p-3 rounded-lg border text-sm w-full
        ${disabled ? 'bg-red-100 border-red-400 cursor-not-allowed' : 'bg-green-100 border-green-400 hover:bg-green-200'}
      `}
    >
      <h4 className="text-center font-semibold text-gray-800">
        {title}
      </h4>

      <div className="mt-2 text-center text-xs text-gray-600">
        {!isAvailble && <p className="text-red-500">Unavailable</p>}
        {used_at && <p>Used at: {used_at}</p>}
        {!used_at && start_at && <p>Available at: {start_at}</p>}
      </div>
    </button>
  );
}
