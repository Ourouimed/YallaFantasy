// PlayerStatsPopup.jsx
import { ArrowLeftRight } from "lucide-react"

export default function PlayerStatsPopup({ player,isCaptain , isViceCaptain , onSetCaptain , onSetViceCaptain}) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img src={player.player_image} className="size-20 rounded-full p-1 border-2" />
                        <img src={player.team} alt="flag" className="absolute -left-1 bottom-1 size-5 rounded-sm border border-white" />
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
                        onClick={()=> {onSetCaptain(player)}}
                        className={`p-2 size-10 rounded-full border border-yellow-500 font-semibold hover:bg-yellow-500 hover:text-black cursor-pointer transition duration-300 ${isCaptain ? 'bg-yellow-500 text-black' : 'bg-transparent text-black'}`}
                        title="Make Captain"
                    >
                        C
                    </button>
                    
                    {/* Vice Captain Button */}
                    <button
                        onClick={()=> {onSetViceCaptain(player)}}
                        className={`p-2 size-10 rounded-full border border-blue-500 font-semibold hover:bg-blue-500 hover:text-white cursor-pointer transition duration-300 ${isViceCaptain ? 'bg-blue-500 text-white' : 'bg-transparent text-black'}`}
                        title="Make Captain"
                    >
                        VC
                    </button>

                    {/* Substitute Button */}
                    <button 
                        className="p-2 rounded-full border hover:bg-rose-600 text-rose-600  hover:text-white  cursor-pointer transition duration-300"
                        title="Substitute"
                    >
                        <ArrowLeftRight size={20}/>
                    </button>
                </div>
            </div>
            
            
        </div>
    )
}