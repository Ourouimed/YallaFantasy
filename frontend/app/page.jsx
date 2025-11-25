"use client";
import Features from "@/components/sections/Features";
import Footer from "@/components/sections/Footer";
import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import { useSelector } from "react-redux";

export default function Home() {
  const user = useSelector(state => state.auth.user);
  console.log("user :", user);

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
