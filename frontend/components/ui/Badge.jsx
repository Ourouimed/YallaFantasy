export default function Badge({text , type = 'DEFAULT'}){
    const TYPES = {
        UPCOMING : "bg-yellow-500" ,
        LIVE : "bg-red-300 text-red",
        PLAYED: "bg-green-500" , 
        DEFAULT : "border border-1"
    }
    return <h4 className={`inline-flex py-1 px-3 rounded-full text-xs text-center font-semibold ${TYPES[type.toUpperCase()]}`}>
        {text}
    </h4>
}