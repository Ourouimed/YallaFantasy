"use client";
import Features from "@/components/sections/Features";
import Footer from "@/components/sections/Footer";
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import { verifyEmail } from "@/store/features/auth/authSlice";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function Home() {
  const searchParams = useSearchParams()
  const id = searchParams.get('verify-email')
  const router= useRouter()
  const dispatch = useDispatch()


  useEffect(()=>{
    if(id){
      console.log("Dispatching...");
      dispatch(verifyEmail(id))

      router.replace("/");
    }
  } , [id , dispatch , router])


  return (
    <>
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </>
  );
}
