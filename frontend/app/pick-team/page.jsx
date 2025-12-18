"use client";
import Header from "@/components/sections/Header";
import ChipCard from "@/components/ui/cards/ChipCard";
import PlayerLinupCard from "@/components/ui/cards/PlayerLinupCard";
import { usePopup } from "@/hooks/usePopup";
import { verifySession } from "@/store/features/auth/authSlice";
import { getPickedTeam } from "@/store/features/my-team/myTeamSlice";
import { formatLocalTime } from "@/utils/formatDate";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function PickTeamPage() {
    const { user, isLoading: authLoading } = useSelector(state => state.auth);
    const { picked_team, isLoading } = useSelector(state => state.myTeam);
    const dispatch = useDispatch();
    const router = useRouter();
    const { openPopup } = usePopup();

    // 1. Verify Session on Mount
    useEffect(() => {
        dispatch(verifySession());
    }, [dispatch]);

    // 2. Fetch Team data once Authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }
        if (user) {
            dispatch(getPickedTeam());
        }
    }, [user, authLoading, dispatch, router]);

    // 3. Memoize Lineup Structure
    const lineup = useMemo(() => {
        if (!picked_team?.players) {
            return { pitch: { GK: [], DEF: [], MID: [], FWD: [] }, bench: [] };
        }
        const starters = picked_team.players.startingLinup || [];
        return {
            pitch: {
                GK: starters.filter(p => p.position === 'GK'),
                DEF: starters.filter(p => p.position === 'DEF'),
                MID: starters.filter(p => p.position === 'MID'),
                FWD: starters.filter(p => p.position === 'FWD'),
            },
            bench: picked_team.players.bench || []
        };
    }, [picked_team]);

    const handleOpenPlayerStats = (player) => {
        openPopup({ 
            title: 'Player stats', 
            component: 'PlayerStatsPopup', 
            props: { player , isCaptain : picked_team?.team?.captain === player.player_id , isViceCaptain : picked_team?.team?.vice_captain === player.player_id} 
        });
    };

    if (isLoading) return <div className="p-20 text-center text-white">Loading Pitch...</div>;

    return (
        <>
            <Header isSticky />

            <div className="px-4 md:px-20 py-4">
                {/* Team Info Header */}
                <div className="flex justify-between items-end mb-4 px-2">
                    <div>
                        <h1 className="text-2xl font-black italic uppercase text-slate-800">
                            {picked_team?.team?.team_name || "My Team"}
                        </h1>
                        <p className="text-sm text-slate-500 font-medium">
                            {picked_team?.nextDeadline?.round_title} (ID: {picked_team?.nextDeadline?.round_id})
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-slate-400">Next Deadline</p>
                        <p className="text-sm font-bold text-rose-600">
                            {picked_team?.nextDeadline?.round_deadline ? formatLocalTime(picked_team?.nextDeadline?.round_deadline) : "TBD"}
                        </p>
                    </div>
                </div>

                {/* Pitch Background */}
                <div className="relative bg-emerald-600 p-6 rounded-2xl flex flex-col justify-between min-h-[850px] shadow-inner border-4 border-emerald-700">
                    
                    {/* Chips Display */}
                    {picked_team?.team?.chips && (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-10">
                            {picked_team.team.chips.map(({ chip_name, used_at }) => (
                                <ChipCard
                                    key={chip_name}
                                    title={chip_name}
                                    used_at={used_at}
                                    isAvailble={picked_team?.team?.unlimited_transfers}
                                />
                            ))}
                        </div>
                    )}

                    {/* Pitch Rows (Starters) */}
                    <div className="flex-1 flex flex-col justify-around py-8 gap-4">
                        {['GK', 'DEF', 'MID', 'FWD'].map((pos) => (
                            <div key={pos} className="flex justify-center gap-2 md:gap-8">
                                {lineup.pitch[pos].map((player) => (
                                    <div 
                                        key={player.player_id} 
                                        className='cursor-pointer' 
                                        onClick={() => handleOpenPlayerStats(player)}
                                    >
                                        <PlayerLinupCard 
                                            player={player} 
                                            isCaptain={picked_team?.team?.captain === player.player_id} 
                                            isViceCaptain={picked_team?.team?.vice_captain === player.player_id}
                                            
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Bench Section */}
                    <div className="mt-6 bg-black/30 p-4 rounded-xl border border-white/10">
                        <p className="text-white text-center text-[10px] font-bold uppercase tracking-widest mb-3 opacity-50">Bench</p>
                        <div className="flex justify-center gap-4">
                            {lineup.bench.map((player) => (
                                <div 
                                    className="text-center cursor-pointer" 
                                    onClick={() => handleOpenPlayerStats(player)} 
                                    key={player.player_id}
                                >
                                    <span className="text-white mb-2 block text-xs">
                                        {player.position}
                                    </span>
                                    <PlayerLinupCard 
                                        player={player} 
                                        isBench={true} 
                                        isCaptain={picked_team?.team?.captain === player.player_id} 
                                        isViceCaptain={picked_team?.team?.vice_captain === player.player_id}
                                        
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}