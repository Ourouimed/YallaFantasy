export default function Input ({icon : Icon , className , ...props}){
    return <div className="w-full border flex items-center gap-1 border-gray-300 bg-white/5 p-3 rounded-lg focus-within:border-third">
        {Icon && (
          <div className="mr-3 text-gray-300 transition-colors group-focus-within:text-third">
            <Icon size={20} />
          </div>
        )}
        <input
            {...props}
            className={`outline-none focus:border-third transition ${className}`}
            />
    </div>
}