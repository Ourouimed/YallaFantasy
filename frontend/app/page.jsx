"use client";

import React, { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { verifyEmail } from "@/store/features/auth/authSlice";

import Features from "@/components/sections/Features";
import Footer from "@/components/sections/Footer";
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";


function EmailVerificationHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const id = searchParams.get('verify-email');

  useEffect(() => {
    if (id) {
      console.log("Dispatching email verification for ID:", id);
      dispatch(verifyEmail(id));

      // Removes the query parameter from the URL after dispatching
      router.replace("/");
    }
  }, [id, dispatch, router]);

  return null; 
}

export default function Home() {
  return (
    <>
      {/* The Suspense boundary is required here because useSearchParams 
          bails out of static rendering during the Vercel build process.
      */}
      <Suspense fallback={null}>
        <EmailVerificationHandler />
      </Suspense>

      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </>
  );
}