// PlayerStatsPopup.jsx
import { ArrowLeftRight, Star, ShieldCheck } from "lucide-react"

export default function PlayerStatsPopup({ player,isCaptain , isViceCaptain}) {
    console.log(isCaptain)
    console.log(isViceCaptain)
    return (
        <div className="flex flex-col gap-6 p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img src={player.player_image} className="size-20 rounded-full p-1 border-2" />
                        <img src={player.team_logo} alt="flag" className="absolute -left-1 bottom-1 size-5 rounded-sm border border-white" />
                    </div>
                    <div>
                        <h4 className="text-2xl font-semibold">{player.fullname}</h4>
                        <div className="text-sm text-gray-600 uppercase flex items-center gap-2">
                            <span>${parseFloat(player.price)}m</span>
                            <span className="bg-gray-200 px-2 rounded-md">{player.position}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Captain Button */}
                    <button 
                        onClick={() => onSetCaptain(player.player_id)}
                        className={`p-2 rounded-full border bg-yellow-500 text-white`}
                        title="Make Captain"
                    >
                        <Star size={20} />
                    </button>
                    
                    {/* Vice Captain Button */}
                    <button 
                        className={`p-2 rounded-full border bg-blue-500 text-white`}
                        title="Make Vice Captain"
                    >
                        <ShieldCheck size={20} />
                    </button>

                    {/* Substitute Button */}
                    <button 
                        className="p-2 rounded-full border hover:bg-gray-100 text-rose-600"
                        title="Substitute"
                    >
                        <ArrowLeftRight size={20}/>
                    </button>
                </div>
            </div>
            
            
        </div>
    )
}