"use client";

import { useToast } from "@/hooks/useToast";
import { CircleCheck, CircleX, Info, TriangleAlert, X } from "lucide-react";
export default function Toast ({id , message , type}){
    const { removeToast } = useToast()
    const TYPES = {
        ERROR : "border-red-500" , 
        SUCCESS : "border-green-500" ,
        INFO : "border-blue-500",
        WARNING : "border-yellow-500"
    }

    const ICONS = {
        ERROR : <CircleX className='text-red-500'/> , 
        SUCCESS : <CircleCheck className='text-green-500'/> ,
        INFO : <Info className='text-blue-500'/>,
        WARNING : <TriangleAlert className='text-yellow-500'/>
    }


    return <div className={`bg-white flex items-center justify-between p-4 shadow-xl rounded-md border-l-3 ${TYPES[type.toUpperCase()]}`}>
        <div className="flex items-center gap-1">
            {ICONS[type.toUpperCase()]}
            <span>{message}</span>
        </div>

        <button className='cursor-pointer' onClick={()=>{
            removeToast(id)
        }}><X size={18}/></button>
    </div>
}