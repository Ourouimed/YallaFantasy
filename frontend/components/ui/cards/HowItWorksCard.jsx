export default function HowItWorksCard ({index , title , description}){
    return <div>
            <div className="bg-third  text-black rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 font-bold text-xl">{index + 1}</div>
            <h3 className="text-xl font-semibold mb-2 text-third">{title}</h3>
            <p>{description}</p>
        </div>
}