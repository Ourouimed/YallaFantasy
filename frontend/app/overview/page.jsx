"use client"
import Header from "@/components/sections/Header";
import Button from "@/components/ui/Button";
import { verifySession } from "@/store/features/auth/authSlice";
import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function PlayPage(){
    const { user , isLoading} = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const router = useRouter()
    useEffect(()=>{
            dispatch(verifySession())
    } , [])
    
    useEffect(()=>{
          if(!isLoading && !user){
            router.push('/login')
          }
          
    } , [user , router , isLoading] )
    return <>
        <Header isSticky/>
        <div className="px-20 py-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[4fr_6fr] gap-2">
                <div className="px-4 py-4 rounded-xl bg-main text-white">
                    <div className="flex items-center gap-3 justify-between">
                       <div className="flex items-center gap-3">
                            <div className="bg-third rounded-full aspect-square p-3">
                                <Shield size={45} className="text-main"/>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-2">
                                    My Team
                                </h3>
                                <p>
                                    {user?.fullname}
                                </p>
                            </div>
                       </div>
                       <Button className='!bg-second text-white'>Configure team</Button>
                    </div>
                </div>
            </div>
        </div>
    </>
}