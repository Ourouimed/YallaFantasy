'use client';
import Header from "@/components/sections/Header";
import { getAllPlayers } from "@/store/features/players/playersSlice";
import { getAllrounds } from "@/store/features/rounds/roundsSlice";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatLocalTime } from "@/utils/formatDate";
import PlayerLinupCard from "@/components/ui/cards/PlayerLinupCard";
import { useToast } from "@/hooks/useToast";
import PlayerListCard from "@/components/ui/cards/PlayerListCard";
import { getTeam } from "@/store/features/my-team/myTeamSlice";

export default function TeamSelection() {
    const { players } = useSelector(state => state.players);
    const { rounds } = useSelector(state => state.rounds);
    const { my_team } = useSelector(state => state.myTeam)
    const dispatch = useDispatch();
    const toast = useToast();

    const availableSpots = { GK: 2, DEF: 5, MID: 5, FWD: 3 };

    const [teamSelection, setTeamSelection] = useState({
        team_name: '',
        bank: 100,
        total_selected: 0,
        players: { GK: [], DEF: [], MID: [], FWD: [] }
    });

    // 1. Initial Data Fetching
    useEffect(() => { dispatch(getAllPlayers()); }, [dispatch]);
    useEffect(() => { dispatch(getTeam()); }, [dispatch]);

    if (my_team) console.log(my_team)

    

    // 3. Helper: Parse Price String to Number
    const parsePlayerPrice = (priceString) => {
        if (typeof priceString === 'number') return priceString;
        const price = parseFloat(priceString.replace('$', '').replace('m', ''));
        return isNaN(price) ? 0 : price;
    };

    // 4. Determine which players are already selected
    const selectedPlayerIds = useMemo(() => {
        return new Set(Object.values(teamSelection.players).flat().map(p => p.player_id));
    }, [teamSelection.players]);

    // 5. Transform players for the list (with selection status)
    const playersToShow = useMemo(() => {
        return players.map(p => ({
            ...p,
            displayPrice: '$' + p.price + 'm',
            isSelected: selectedPlayerIds.has(p.player_id)
        }));
    }, [players, selectedPlayerIds]);

    // 6. Add Player Logic (Validated)
    const handleAddPlayerToSquad = (player) => {
        const playerPrice = parsePlayerPrice(player.price);
        const position = player.position;
        const currentPlayersFlat = Object.values(teamSelection.players).flat();

        // VALIDATIONS
        if (selectedPlayerIds.has(player.player_id)) {
            toast.info("Player already selected");
            return;
        }

        const sameTeamCount = currentPlayersFlat.filter(p => p.team_name === player.team_name).length;
        if (sameTeamCount >= 3) {
            toast.info("Max 3 players from the same team");
            return;
        }

        if (teamSelection.players[position].length >= availableSpots[position]) {
            toast.info(`Max ${availableSpots[position]} ${position}s allowed`);
            return;
        }

        if (teamSelection.bank < playerPrice) {
            toast.info("Not enough budget");
            return;
        }

        // STATE UPDATE
        setTeamSelection(prev => ({
            ...prev,
            bank: Number((prev.bank - playerPrice).toFixed(1)), // Fix floating point math
            total_selected: prev.total_selected + 1,
            players: {
                ...prev.players,
                [position]: [...prev.players[position], player]
            }
        }));
    };

    // 7. Remove Player Logic
    const handleRemovePlayerFromSquad = (player) => {
        const playerPrice = parsePlayerPrice(player.price);
        const position = player.position;

        setTeamSelection(prev => ({
            ...prev,
            bank: Number((prev.bank + playerPrice).toFixed(1)),
            total_selected: prev.total_selected - 1,
            players: {
                ...prev.players,
                [position]: prev.players[position].filter(p => p.player_id !== player.player_id)
            }
        }));
    };

    // Helper: fill empty slots for visual lineup
    const getLineupWithEmpty = (posPlayers, total) => {
        return [...posPlayers, ...Array(total - posPlayers.length).fill(null)];
    };

    return (
        <>
            <Header isSticky />
            <div className="px-4 md:px-20 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-6">

                    {/* TOP INFO BAR */}
                    
                        <div className="lg:col-span-full p-4 border rounded-lg bg-main/5 border-main/30">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div>
                                    <h4 className="text-lg font-bold text-main">Current Round: {my_team?.nextDeadline?.round_title}</h4>
                                    <p className="text-sm text-gray-600">
                                        Deadline: <span className="font-mono font-bold">{formatLocalTime(my_team?.nextDeadline?.round_deadline)}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-center">
                                        <span className="text-3xl font-bold">{teamSelection.total_selected}</span>
                                        <span className="text-gray-400 text-xl"> / 15</span>
                                        <h5 className="text-xs uppercase tracking-wider text-gray-500">Players</h5>
                                    </div>
                                    <div className="text-center">
                                        <span className={`text-3xl font-bold ${teamSelection.bank < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                            ${teamSelection.bank}m
                                        </span>
                                        <h5 className="text-xs uppercase tracking-wider text-gray-500">Bank</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    

                    {/* LEFT COLUMN: PLAYER SELECTION LIST */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                        <div className="p-4 border-b bg-gray-50 font-bold text-gray-700">Available Players</div>
                        <div className="divide-y divide-gray-100 max-h-[700px] overflow-y-auto">
                            {playersToShow.length === 0 ? (
                                <p className="p-10 text-center text-gray-400">Loading players...</p>
                            ) : (
                                playersToShow.map((player) => (
                                    <PlayerListCard 
                                        player={player} 
                                        key={player.player_id} 
                                        onClick={handleAddPlayerToSquad}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: PITCH / LINEUP VISUALIZATION */}
                    <div className="w-full">
                        <div className="relative bg-emerald-600 p-6 rounded-2xl flex flex-col gap-10 min-h-[600px] shadow-inner border-4 border-emerald-700">
                            {/* Pitch markings decoration */}
                            <div className="absolute inset-4 border-2 border-white/20 rounded-xl pointer-events-none" />
                            
                            {["GK", "DEF", "MID", "FWD"].map(pos => (
                                <div key={pos} className="flex flex-wrap justify-center items-center gap-4 relative z-10">
                                    {getLineupWithEmpty(teamSelection.players[pos], availableSpots[pos]).map((p, i) =>
                                        p ? (
                                            <div 
                                                key={p.player_id} 
                                                onClick={() => handleRemovePlayerFromSquad(p)}
                                                className="cursor-pointer hover:scale-105 transition-transform"
                                            >
                                                <PlayerLinupCard player={p} />
                                            </div>
                                        ) : (
                                            <div 
                                                key={i} 
                                                className="size-16 rounded-full border-2 border-dashed border-white/30 bg-black/5 flex items-center justify-center text-white/30 text-xs font-bold"
                                            >
                                                {pos}
                                            </div>
                                        )
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        <button 
                            className="w-full mt-4 bg-main text-white py-3 rounded-lg font-bold disabled:bg-gray-300 disabled:cursor-not-allowed"
                            disabled={teamSelection.total_selected < 15}
                        >
                            Confirm Squad
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}