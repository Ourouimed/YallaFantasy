"use client";
import DashboardLayout from "@/components/dashboard/dashboardLayout";
import { verifySession } from "@/store/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"

export default function Dashboard (){
    const dispatch = useDispatch()
    const router = useRouter()
    const { user , isLoading , loggedIn} = useSelector(state => state.auth)
    useEffect(()=>{
        dispatch(verifySession())
    } , [])

    useEffect(()=>{
      if(!loggedIn && !isLoading){
        router.push('/login')
      }
    } , [loggedIn , router , isLoading] )

    if (isLoading) {
        return <div>Loading...</div>; 
    }

    if (!user) null
    
    return <>
        <DashboardLayout>
          <h1 className="text-2xl font-semibold">Welcome {user?.fullname}</h1>
          <p className="text-gray-700">yallaFantasy Admin dashboard</p>
        </DashboardLayout>
    </>
}