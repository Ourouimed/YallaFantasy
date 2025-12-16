"use client"
import Header from "@/components/sections/Header";
import { getAllPlayers } from "@/store/features/players/playersSlice";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatLocalTime } from "@/utils/formatDate";
import PlayerLinupCard from "@/components/ui/cards/PlayerLinupCard";
import { useToast } from "@/hooks/useToast";
import PlayerListCard from "@/components/ui/cards/PlayerListCard";
import { getTeam, saveTeam } from "@/store/features/my-team/myTeamSlice";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
export default function TeamSelection() {
    const { players } = useSelector(state => state.players);
    const { my_team , isLoading} = useSelector(state => state.myTeam);
    const dispatch = useDispatch();
    const toast = useToast();

    const availableSpots = { GK: 2, DEF: 5, MID: 5, FWD: 3 };

    // Initialize with a proper structure to avoid "undefined" errors on first render
    const [teamSelection, setTeamSelection] = useState({
        bank: 100,
        team_name : '',
        total_selected: 0,
        players: { GK: [], DEF: [], MID: [], FWD: [] }
    });

    useEffect(() => { dispatch(getAllPlayers()); }, [dispatch]);
    useEffect(() => { dispatch(getTeam()); }, [dispatch]);

    // Sync Redux store to local state when data arrives
    useEffect(() => {
        if (my_team && my_team.players) {
            console.log(my_team)
            setTeamSelection({
                bank: my_team.team?.balance ?? 100,
                team_name : my_team?.team.team_name,
                total_selected: Object.values(my_team.players).flat().length,
                players: my_team.players ,
                nextDeadline : my_team.nextDeadline
            });
        }
    }, [my_team]);

    // Memoize selected IDs for fast lookup in the list
    const selectedPlayerIds = useMemo(() => {
        return new Set(Object.values(teamSelection.players).flat().map(p => p.player_id));
    }, [teamSelection.players]);

    const handleAddPlayerToSquad = (player) => {
        const price = parseFloat(player.price) || 0;
        const pos = player.position;
        const currentPosPlayers = teamSelection.players[pos];
        const allSelected = Object.values(teamSelection.players).flat();

        // VALIDATIONS
        if (selectedPlayerIds.has(player.player_id)) return toast.info("Player already selected");
        if (currentPosPlayers.length >= availableSpots[pos]) return toast.info(`Full on ${pos}s`);
        if (teamSelection.bank < price) return toast.info("Insufficient funds");
        if (allSelected.filter(p => p.team_name === player.team_name).length >= 3) {
            return toast.info("Max 3 players per real-world team");
        }

        setTeamSelection(prev => ({
            ...prev,
            bank: Number((prev.bank - price).toFixed(1)),
            total_selected: prev.total_selected + 1,
            players: {
                ...prev.players,
                [pos]: [...prev.players[pos], player]
            }
        }));
    };

    const handleRemovePlayerFromSquad = (player) => {
        const price = parseFloat(player.price) || 0;
        setTeamSelection(prev => ({
            ...prev,
            bank: Number((prev.bank + price).toFixed(1)),
            total_selected: prev.total_selected - 1,
            players: {
                ...prev.players,
                [player.position]: prev.players[player.position].filter(p => p.player_id !== player.player_id)
            }
        }));
    };

    // Helper for visual slots
    const getLineupWithEmpty = (pos) => {
        const selected = teamSelection.players[pos] || [];
        const totalNeeded = availableSpots[pos];
        return [...selected, ...Array(totalNeeded - selected.length).fill(null)];
    };

    const handleSaveTeam = async ()=>{
        try {
                await dispatch(saveTeam(teamSelection)).unwrap()
                toast.success('Team saved successfully')
        }
        catch (err){
            console.log(err)
            toast.error(err)
        }
    }

    return (
        <>
            <Header isSticky />
            <div className="px-4 md:px-20 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-6">
                    
                    {/* TOP INFO BAR */}
                    <div className="lg:col-span-full p-4 border rounded-lg bg-main/5 border-main/30">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="text-lg font-bold">Round: {my_team?.nextDeadline?.round_title} -  {formatLocalTime(my_team?.nextDeadline?.round_deadline)}</h4>
                                <p className="text-sm text-gray-500">Bank: <span className="font-bold text-green-600">${teamSelection.bank}m</span></p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black">{teamSelection.total_selected} / 15</span>
                                <p className="text-xs uppercase text-gray-400">Players Selected</p>
                            </div>
                        </div>
                    </div>

                    {/* LIST COLUMN */}
                    <div className="space-y-3">
                        <div className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm p-4 space-y-2">
                            <Input placeholder='your team name here' value={teamSelection.team_name} onChange={(e)=>{
                                setTeamSelection(prev => ({...prev , team_name : e.target.value}))
                            }}/>
                            <Button className='!bg-main text-white w-full' disabled={teamSelection.total_selected !== 15 || isLoading} onClick={handleSaveTeam}>
                                {isLoading ? 'Saving...' : 'Save team'}
                            </Button>
                        </div>
                        <div className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
                        <div className="p-4 border-b border-gray-300 bg-gray-50 font-bold">Available Players</div>
                        <div className="divide-y divide-gray-300 max-h-[700px] overflow-y-auto">
                            {players.map(player => (
                                <PlayerListCard 
                                    key={player.player_id} 
                                    player={player} 
                                    disabled={selectedPlayerIds.has(player.player_id)}
                                    onClick={() => handleAddPlayerToSquad(player)} 
                                />
                            ))}
                        </div>
                    </div>
                    </div>

                    {/* PITCH COLUMN */}
                    <div className="w-full">
                        <div className="relative bg-emerald-600 p-6 rounded-2xl flex flex-col justify-between min-h-[700px] shadow-inner border-4 border-emerald-700">
                            {["GK", "DEF", "MID", "FWD"].map(pos => (
                                <div key={pos} className="flex flex-wrap justify-center gap-4">
                                    {getLineupWithEmpty(pos).map((p, i) => (
                                        p ? (
                                            <div key={p.player_id} onClick={() => handleRemovePlayerFromSquad(p)} className="cursor-pointer hover:scale-105 transition-transform">
                                                <PlayerLinupCard player={p} />
                                            </div>
                                        ) : (
                                            <div key={i} className="size-16 rounded-full border-2 border-dashed border-white/20 bg-black/5 flex items-center justify-center text-white/40 text-xs font-bold">
                                                {pos}
                                            </div>
                                        )
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}