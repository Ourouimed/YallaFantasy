import Image from "next/image";
import { Button } from "../ui/Button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section id="hero" className="min-h-screen bg-gradient-to-r from-second to-main text-white flex items-center">
      <div className="container mx-auto px-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left">
          <span></span>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Build Your <span className="text-third">Dream Team</span>
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Join Africa's biggest fantasy football competition. Pick your squad, earn points, and dominate the leaderboard.
          </p>
          <Button className="!bg-third">
           Get started For Free <ArrowRight/>
          </Button>
        </div>
        
        <div className="flex justify-center md:justify-end">
          <Image
            width={300}
            height={300}
            src="/assets/images/linup.png" 
            alt="AFCON Fantasy Game Illustration" 
            className="w-full max-w-md"
          />
        </div>
      </div>
    </section>
  );
}
