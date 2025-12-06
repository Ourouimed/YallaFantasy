"use client";
import { addToast, removeToast } from "@/store/features/toast/toastSlice";
import { useDispatch } from "react-redux"

export const useToast = () => {
    const dispatch = useDispatch()
    return {
        addToast: (data) => {
            dispatch(addToast(data))

            setTimeout(()=>{
                dispatch(removeToast(0))
            }, 3000)
        },
        removeToast: (index) => {
            dispatch(removeToast(index))
        }
    }
}
