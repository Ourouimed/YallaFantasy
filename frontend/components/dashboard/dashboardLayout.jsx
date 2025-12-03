"use client";
import { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import Button from "../ui/Button";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { verifySession } from "@/store/features/auth/authSlice";
import { useRouter } from "next/navigation";

export default function DashboardLayout({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch()
    const router = useRouter()
    const { isLoading , user } = useSelector(state => state.auth)
    useEffect(()=>{
        dispatch(verifySession())
    } , [])

    useEffect(()=>{
      if(!isLoading && !user){
        router.push('/login')
      }
      if (user && user?.role !== 'admin') router.push('/play')
    } , [user , router , isLoading] )
  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 p-4 overflow-auto">
        <Button
          className="md:hidden mb-4 p-1 aspect-square flex items-center justify-center !bg-main text-white rounded-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={12} /> : <Menu size={12} />}
        </Button>

        {children}
      </div>
    </div>
  );
}
