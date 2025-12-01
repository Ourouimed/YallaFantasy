'use client';
import { X } from "lucide-react";
import { Button } from "./Button";
import { useDispatch, useSelector } from "react-redux";
import { closePopup } from "@/store/features/popup/popupSlice";
import * as Components from "@/components/popup-components";


export default function PopupModal (){
    const { title , component , isOpen , props } = useSelector(state => state.popup)
    const dispatch = useDispatch()

    const Component = component ? Components[component] : null

    // close popup modal
    const handleClosePopupModal = ()=>{
        dispatch(closePopup())
    }


    if (!isOpen) return null


    return <div className="fixed z-10 h-screen w-full p-5 top-0 left-0 bg-black/70 flex items-center justify-center overflow-y-auto">
        <div className="w-full max-w-md bg-white rounded-md shadow-sm">
            <div className="py-4 px-6 border-b border-gray-300 flex items-center justify-between">
                <h3 className="text-xl font-semibold">{title}</h3>
                <Button onClick={handleClosePopupModal} className='hover:bg-gray-300 aspect-square !p-2'><X size={20}/></Button>
            </div>
            <div className="p-6">
                {Component && <Component {...props}/>}
            </div>
        </div>
    </div>
}