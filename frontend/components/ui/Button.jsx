export default function Button ({children , className , isLink , ...props}){
    const btnStyle = `flex items-center font-semibold justify-center gap-3 cursor-pointer bg-white py-3 px-4 rounded-md text-black ${className} 
                      transition duration-300`
    if (isLink){
        return <a {...props} className={btnStyle}>
        {children}
    </a>
    }
    return <button {...props} className={btnStyle}>
        {children}
    </button>
}