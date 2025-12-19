import { features } from "@/utils/features";
import FeaturesCard from "../ui/cards/FeaturesCard";

export default function Features() {
  return (
    <section id="features" className="p-2 md:p-20 bg-gray-100">
      <div className="mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          Why Play Yalla<span className="text-third">Fantasy</span>?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map(({ title, icon, description }, i) => <FeaturesCard key={i} title={title} description={description} icon={icon}/>)}
        </div>
      </div>
    </section>
  );
}
