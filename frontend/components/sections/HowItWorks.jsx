import { howitworks } from "@/utils/howisworks";
import HowItWorksCard from "../ui/cards/HowItWorksCard";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="p-2 md:p-20 bg-gradient-to-r from-second to-main text-white">
      <div className="mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          How to <span className="text-third">Get Started</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {howitworks.map(({title , description} , i)=> <HowItWorksCard key={title} title={title} description={description} index={i}/>)}
        </div>
      </div>
    </section>
  );
}