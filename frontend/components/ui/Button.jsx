export const Button = ({children , className , isLink , ...props})=>{
    if (isLink){
        return <a {...props} className={`flex items-center font-semibold justify-center gap-3 cursor-pointer bg-white py-3 px-4 rounded-md text-black ${className}`}>
        {children}
    </a>
    }
    return <button {...props} className={`flex items-center font-semibold justify-center gap-3 cursor-pointer bg-white py-3 px-4 rounded-md text-black ${className}`}>
        {children}
    </button>
}