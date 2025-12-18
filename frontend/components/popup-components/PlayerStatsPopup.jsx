import { ArrowLeftRight } from "lucide-react";

export default function PlayerStatsPopup({ player, isCaptain, isViceCaptain, onSetCaptain, onSetViceCaptain, onSubstitute, isBench }) {
    return (
        <div className="space-y-4 p-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <img src={player.player_image} className="size-20 rounded-full p-1 border-2 border-slate-200 object-cover" alt={player.fullname} />
                        <img src={player.team} alt="team-flag" className="absolute -left-1 bottom-1 size-6 rounded-sm border-2 border-white shadow-sm" />
                    </div>
                    <div>
                        <h4 className="text-2xl font-bold text-slate-800">{player.fullname}</h4>
                        <div className="text-sm text-gray-600 uppercase flex items-center gap-2 font-medium">
                            <span className="text-emerald-600">${parseFloat(player.price)}m</span>
                            <span className="bg-slate-100 px-2 py-0.5 rounded border text-[10px]">{player.position}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => !isBench && onSetCaptain(player)}
                        disabled={isBench}
                        className={`size-11 rounded-full border-2 font-bold transition-all flex items-center justify-center
                            ${isBench ? 'opacity-20 cursor-not-allowed border-slate-300' : 'cursor-pointer border-yellow-500 hover:bg-yellow-500 hover:text-white'} 
                            ${isCaptain ? 'bg-yellow-500 text-white shadow-lg' : 'bg-white text-yellow-600'}`}
                        title={isBench ? "Only starters can be Captain" : "Make Captain"}
                    >
                        C
                    </button>
                    
                    <button
                        onClick={() => !isBench && onSetViceCaptain(player)}
                        disabled={isBench}
                        className={`size-11 rounded-full border-2 font-bold transition-all flex items-center justify-center
                            ${isBench ? 'opacity-20 cursor-not-allowed border-slate-300' : 'cursor-pointer border-blue-500 hover:bg-blue-500 hover:text-white'} 
                            ${isViceCaptain ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-blue-600'}`}
                        title={isBench ? "Only starters can be Vice Captain" : "Make Vice Captain"}
                    >
                        VC
                    </button>

                    <button 
                        onClick={onSubstitute}
                        className="size-11 rounded-full border-2 border-rose-500 flex items-center justify-center hover:bg-rose-500 text-rose-500 hover:text-white cursor-pointer transition-all shadow-sm"
                        title="Swap Player"
                    >
                        <ArrowLeftRight size={22}/>
                    </button>
                </div>
            </div>
        </div>
    );
}