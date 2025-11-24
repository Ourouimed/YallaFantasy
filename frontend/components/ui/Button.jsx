export const Button = ({children , className})=>{
    return <button className={`flex items-center justify-center gap-3 cursor-pointer bg-white py-3 px-4 rounded-md text-black ${className}`}>
        {children}
    </button>
}