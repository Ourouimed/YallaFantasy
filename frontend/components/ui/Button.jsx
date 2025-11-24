export const Button = ({children , className})=>{
    return <button className={`flex items-center gap-3 cursor-pointer bg-white py-2 px-4 rounded-md text-black ${className}`}>
        {children}
    </button>
}