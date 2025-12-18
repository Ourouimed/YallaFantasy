"use client";
import Header from "@/components/sections/Header";
import ChipCard from "@/components/ui/cards/ChipCard";
import PlayerLinupCard from "@/components/ui/cards/PlayerLinupCard";
import { usePopup } from "@/hooks/usePopup";
import { verifySession } from "@/store/features/auth/authSlice";
import { getPickedTeam, savePickedTeam } from "@/store/features/my-team/myTeamSlice";
import { formatLocalTime } from "@/utils/formatDate";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/useToast";

export default function PickTeamPage() {
    const { user, isLoading: authLoading } = useSelector(state => state.auth);
    const { picked_team, isLoading } = useSelector(state => state.myTeam);
    const dispatch = useDispatch();
    const router = useRouter();
    const { openPopup, closePopup } = usePopup();
    const toast = useToast()

    const [myTeam, setMyTeam] = useState({
        team: null,
        players: null,
        nextDeadline: null
    });

    const [subSelection, setSubSelection] = useState(null);
    const [isDirty, setIsDirty] = useState(false); // Track if team changed

    useEffect(() => { dispatch(verifySession()); }, [dispatch]);

    useEffect(() => {
        if (!authLoading && !user) { router.push("/login"); return; }
        if (user) { dispatch(getPickedTeam()); }
    }, [user, authLoading, dispatch, router]);

    useEffect(() => {
        if (picked_team && picked_team.team) {
            setMyTeam({
                team: picked_team.team,
                players: picked_team.players,
                nextDeadline: picked_team.nextDeadline
            });
        }
    }, [picked_team]);

    const lineup = useMemo(() => {
        if (!myTeam?.players) return { pitch: { GK: [], DEF: [], MID: [], FWD: [] }, bench: [], allStarters: [] };
        const starters = myTeam.players.startingLinup || [];
        return {
            pitch: {
                GK: starters.filter(p => p.position === 'GK'),
                DEF: starters.filter(p => p.position === 'DEF'),
                MID: starters.filter(p => p.position === 'MID'),
                FWD: starters.filter(p => p.position === 'FWD'),
            },
            bench: myTeam.players.bench || [],
            allStarters: starters
        };
    }, [myTeam]);

    const isSwapValid = (playerB) => {
        if (!subSelection) return true;
        if (subSelection.player_id === playerB.player_id) return true;
        const starters = [...myTeam.players.startingLinup];
        const isAStarter = starters.some(p => p.player_id === subSelection.player_id);
        const isBStarter = starters.some(p => p.player_id === playerB.player_id);
        if (isAStarter === isBStarter) return false;

        let previewStarters = [...starters];
        if (isAStarter) {
            const idx = starters.findIndex(p => p.player_id === subSelection.player_id);
            previewStarters[idx] = playerB;
        } else {
            const idx = starters.findIndex(p => p.player_id === playerB.player_id);
            previewStarters[idx] = subSelection;
        }

        const counts = previewStarters.reduce((acc, p) => {
            acc[p.position] = (acc[p.position] || 0) + 1;
            return acc;
        }, {});
        return (counts.GK === 1 && (counts.DEF || 0) >= 3 && (counts.MID || 0) >= 3 && (counts.FWD || 0) >= 1);
    };

    const handleSubstitute = (playerA, playerB) => {
        setMyTeam(prev => {
            const starters = [...prev.players.startingLinup];
            const bench = [...prev.players.bench];
            const newTeam = { ...prev.team };
            const sIdx = starters.findIndex(p => p.player_id === playerA.player_id || p.player_id === playerB.player_id);
            const bIdx = bench.findIndex(p => p.player_id === playerA.player_id || p.player_id === playerB.player_id);
            const starterMovingOut = starters[sIdx];
            const playerComingIn = bench[bIdx];

            if (newTeam.captain === starterMovingOut.player_id || newTeam.vice_captain === starterMovingOut.player_id) {
                const candidate = starters.find(p => p.player_id !== starterMovingOut.player_id && p.player_id !== newTeam.captain && p.player_id !== newTeam.vice_captain);
                if (newTeam.captain === starterMovingOut.player_id) newTeam.captain = candidate?.player_id;
                else newTeam.vice_captain = candidate?.player_id;
            }

            starters[sIdx] = playerComingIn;
            bench[bIdx] = starterMovingOut;
            return { ...prev, team: newTeam, players: { ...prev.players, startingLinup: starters, bench } };
        });
        setSubSelection(null);
        setIsDirty(true);
    };

    const handleSaveTeam = async () => {
        console.log("Saving Team:", myTeam);
        

        try {
            await dispatch(savePickedTeam(myTeam)).unwrap()
            toast.success('Team save successfully')
            setIsDirty(false);
        }
        catch (err) {
            console.log(err)
            toast.error(err || 'an error occured')
        }
        
        
    };

    const handlePlayerClick = (player) => {
        if (subSelection) {
            if (subSelection.player_id === player.player_id) setSubSelection(null);
            else handleSubstitute(subSelection, player);
            return;
        }
        const isBench = lineup.bench.some(p => p.player_id === player.player_id);
        openPopup({
            title: 'Player stats',
            component: 'PlayerStatsPopup',
            props: {
                player,
                isBench,
                isCaptain: myTeam?.team?.captain === player.player_id,
                isViceCaptain: myTeam?.team?.vice_captain === player.player_id,
                onSetCaptain: (e) => {
                    setMyTeam(prev => {
                        const t = { ...prev.team };
                        if (t.vice_captain === e.player_id) t.vice_captain = t.captain;
                        t.captain = e.player_id;
                        return { ...prev, team: t };
                    });
                    setIsDirty(true);
                },
                onSetViceCaptain: (e) => {
                    setMyTeam(prev => {
                        const t = { ...prev.team };
                        if (t.captain === e.player_id) t.captain = t.vice_captain;
                        t.vice_captain = e.player_id;
                        return { ...prev, team: t };
                    });
                    setIsDirty(true);
                },
                onSubstitute: () => { setSubSelection(player); closePopup(); }
            }
        });
    };

    if (isLoading) return <div className="p-20 text-center text-white font-bold animate-pulse">Loading Pitch...</div>;

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
            <Header isSticky />
            
            <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-3xl font-black italic uppercase text-slate-900 tracking-tight">
                            {myTeam?.team?.team_name || "My Team"}
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                {myTeam?.nextDeadline?.round_title}
                            </span>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols sm:grid-cols-2 md:grid-cols-5 gap-1">
                                    {myTeam?.team?.chips.map(({ chip_name, used_at }) => (
                                      <ChipCard
                                        key={chip_name}
                                        title={chip_name}
                                        used_at={used_at}
                                        isAvailble={!myTeam?.team?.unlimited_transfers}
                                      />
                                    ))}
                                  </div>
                    <div className="flex items-center gap-4 bg-rose-50 p-3 rounded-xl border border-rose-100">
                        <div className="text-right">
                            <p className="text-[10px] uppercase font-bold text-rose-400 leading-none mb-1">{myTeam?.nextDeadline?.round_title} Deadline</p>
                            <p className="text-sm font-black text-rose-600">
                                {myTeam?.nextDeadline?.round_deadline ? formatLocalTime(myTeam?.nextDeadline?.round_deadline) : "TBD"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Pitch Area */}
                <div className="relative w-full overflow-hidden rounded-3xl bg-emerald-700 shadow-2xl border-[6px] border-emerald-800">
                    {/* Pitch Patterns */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" 
                         style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 10%, rgba(0,0,0,0.5) 10%, rgba(0,0,0,0.5) 20%)` }}>
                    </div>

                    <div className="relative z-10 p-4 md:p-8 min-h-[700px] md:min-h-[900px] flex flex-col justify-between">
                        
                        {/* Formation Grid */}
                        <div className="flex-1 flex flex-col justify-around py-4">
                            {['GK', 'DEF', 'MID', 'FWD'].map((pos) => (
                                <div key={pos} className="flex justify-center items-center gap-2 sm:gap-6 md:gap-12">
                                    {lineup.pitch[pos].map((player) => {
                                        const disabled = subSelection && !isSwapValid(player);
                                        return (
                                            <div key={player.player_id} 
                                                 className={`transition-all duration-300 transform ${
                                                     subSelection?.player_id === player.player_id 
                                                     ? "ring-4 ring-yellow-400 rounded-xl scale-110 z-20 shadow-2xl" 
                                                     : disabled ? "opacity-20 grayscale pointer-events-none scale-90" : "cursor-pointer hover:scale-105"
                                                 }`}
                                                 onClick={() => !disabled && handlePlayerClick(player)}>
                                                <PlayerLinupCard 
                                                    player={player} 
                                                    isCaptain={myTeam?.team?.captain === player.player_id} 
                                                    isViceCaptain={myTeam?.team?.vice_captain === player.player_id} 
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        {/* Bench Section */}
                        <div className="mt-8 bg-black/20 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-white/10">
                            <p className="text-white/60 text-center text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                {subSelection ? "Select a player to complete swap" : "Substitutes"}
                            </p>
                            <div className="flex justify-center items-center gap-3 sm:gap-6 overflow-x-auto pb-2">
                                {lineup.bench.map((player) => {
                                    const disabled = subSelection && !isSwapValid(player);
                                    return (
                                        <div key={player.player_id} 
                                             className={`flex-shrink-0 text-center transition-all duration-300 ${
                                                 subSelection?.player_id === player.player_id 
                                                 ? "ring-4 ring-yellow-400 rounded-xl scale-110 z-20 shadow-2xl" 
                                                 : disabled ? "opacity-20 grayscale pointer-events-none scale-90" : "cursor-pointer hover:scale-105"
                                             }`}
                                             onClick={() => !disabled && handlePlayerClick(player)}>
                                            <span className="text-white/80 text-[10px] font-bold uppercase mb-2 block">{player.position}</span>
                                            <PlayerLinupCard 
                                                player={player} 
                                                isBench 
                                                isCaptain={myTeam?.team?.captain === player.player_id} 
                                                isViceCaptain={myTeam?.team?.vice_captain === player.player_id} 
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Floating Action Bar */}
            {isDirty && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md animate-in slide-in-from-bottom-10 duration-500">
                    <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-center justify-between gap-4">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unsaved Changes</span>
                            <span className="text-sm font-medium italic">Team lineup updated</span>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => window.location.reload()}
                                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
                            >
                                <RotateCcw size={20} />
                            </button>
                            <button 
                                onClick={handleSaveTeam}
                                className={`flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black px-6 py-2.5 rounded-xl transition-all active:scale-95 ${isLoading && 'opacity-30'}`}
                            >
                                <Save size={20} />
                                SAVE TEAM
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}