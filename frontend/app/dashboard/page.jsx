"use client";
import DashboardLayout from "@/components/dashboard/dashboardLayout";
import { verifySession } from "@/store/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"

export default function Dashboard (){
    const { user , isLoading } = useSelector(state => state.auth)
    
    return <>
        <DashboardLayout>
          <h1 className="text-3xl font-bold">Admin dashboard</h1>
          <p className="text-gray-700">Welcome back admin , {user?.fullname}</p>
        </DashboardLayout>
    </>
}