"use client"
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Pitch from '@/components/Pitch'
import PlayerList from '@/components/PlayerList'
import { useRouter } from 'next/navigation'

const TeamSelectionPage = () => {
    const router = useRouter()
    const [allPlayers, setAllPlayers] = useState([])
    const [mySquad, setMySquad] = useState([])
    const [loading, setLoading] = useState(true)
    const [budget, setBudget] = useState(100.0)

    // Transfer Logic States
    const [transfersInfo, setTransfersInfo] = useState({ left: 0, cost: 0, made: 0 })
    const [deadline, setDeadline] = useState(null)
    const [initialSquadIds, setInitialSquadIds] = useState(new Set())

    // Captaincy States
    const [captainId, setCaptainId] = useState(null)
    const [viceCaptainId, setViceCaptainId] = useState(null)

    // Constraints
    const MAX_PLAYERS = 15
    const MAX_BUDGET = 100.0

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch settings for deadline
                const settingsRes = await axios.get('http://localhost:3001/api/settings', { withCredentials: true })
                if (settingsRes.data.deadline) {
                    setDeadline(new Date(settingsRes.data.deadline))
                }

                // Fetch all players
                const playersRes = await axios.get('http://localhost:3001/api/players')
                setAllPlayers(playersRes.data)

                // Fetch current squad if exists
                try {
                    const teamRes = await axios.get('http://localhost:3001/api/fantasy-teams/my-team', { withCredentials: true })
                    if (teamRes.data) {
                        setTransfersInfo(prev => ({ ...prev, left: teamRes.data.transfers_left || 0 }))
                        if (teamRes.data.squad) {
                            setMySquad(teamRes.data.squad)
                            setInitialSquadIds(new Set(teamRes.data.squad.map(p => p.player_id)))

                            // Initialize captaincy
                            const cap = teamRes.data.squad.find(p => p.is_captain)
                            const vice = teamRes.data.squad.find(p => p.is_vice_captain)
                            if (cap) setCaptainId(cap.player_id)
                            if (vice) setViceCaptainId(vice.player_id)
                        }
                    }
                } catch (e) {
                    // Ignore 404/auth errors for now, might be new team
                }

            } catch (error) {
                console.error("Error fetching data", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleAddPlayer = (player) => {
        if (mySquad.length >= MAX_PLAYERS) {
            alert("Squad full! Remove a player first.")
            return
        }
        if (currentCost + player.price > MAX_BUDGET) {
            alert("Not enough budget!")
            return
        }
        if (mySquad.find(p => p.player_id === player.player_id)) return // Already added

        // Check positional limits (2 GK, 5 DEF, 5 MID, 3 FWD)
        const posCount = mySquad.filter(p => p.position === player.position).length
        const limits = { GK: 2, DEF: 5, MID: 5, FWD: 3 }
        if (posCount >= limits[player.position]) {
            alert(`You can only select ${limits[player.position]} players for ${player.position}`)
            return
        }

        const newSquad = [...mySquad, player];
        setMySquad(newSquad)

        // Auto-set captain if first player
        if (newSquad.length === 1) setCaptainId(player.player_id)
        // Auto-set vice if second player
        else if (newSquad.length === 2 && !viceCaptainId) setViceCaptainId(player.player_id)
    }

    const handleRemovePlayer = (playerId) => {
        setMySquad(mySquad.filter(p => p.player_id !== playerId))
        if (captainId === playerId) setCaptainId(null)
        if (viceCaptainId === playerId) setViceCaptainId(null)
    }

    const handleResetSquad = () => {
        setMySquad([])
        setCaptainId(null)
        setViceCaptainId(null)
    }

    const handleAutoPick = () => {
        // Simple logic: Pick random players per position until full
        // GKs: 2, DEFs: 5, MIDs: 5, FWDs: 3

        let squad = []
        let currentCost = 0

        const pickRandom = (arr, count) => {
            const shuffled = [...arr].sort(() => 0.5 - Math.random())
            return shuffled.slice(0, count)
        }

        const gks = pickRandom(allPlayers.filter(p => p.position === 'GK'), 2)
        const defs = pickRandom(allPlayers.filter(p => p.position === 'DEF'), 5)
        const mids = pickRandom(allPlayers.filter(p => p.position === 'MID'), 5)
        const fwds = pickRandom(allPlayers.filter(p => p.position === 'FWD'), 3)

        squad = [...gks, ...defs, ...mids, ...fwds]

        // Simple budget check: if over, replace expensive with cheap?
        // or just warn. For "Polish", let's try to fit.
        // Re-sorting by price ASC and taking cheapest ensures budget fit usually.
        // But we want "Auto Pick" to be somewhat random/good.
        // Let's stick to random for now, if over budget, user can fix.
        // Or better: Try 10 times to find a valid squad?
        // Let's rely on random and just set it, user can adjust if over budget.

        setMySquad(squad)

        // Auto set captain
        if (squad.length > 0) {
            setCaptainId(squad[0].player_id)
            setViceCaptainId(squad[1].player_id)
        }
    }

    const handleSetCaptain = (id) => {
        if (id === viceCaptainId) setViceCaptainId(null)
        setCaptainId(id)
    }

    const handleSetViceCaptain = (id) => {
        if (id === captainId) setCaptainId(null)
        setViceCaptainId(id)
    }

    // Calculation Logic
    const transfersMade = mySquad.filter(p => !initialSquadIds.has(p.player_id)).length
    const freeTransfers = transfersInfo.left // Note: this is static from fetch, logic could be improved to handle dynamic "next GW"
    const chargeable = Math.max(0, transfersMade - freeTransfers)
    const cost = chargeable * 4

    const isDeadlinePassed = deadline && new Date() > deadline

    const handleSaveSquad = async () => {
        if (isDeadlinePassed) {
            alert("Deadline passed! You cannot make changes.")
            return
        }
        if (mySquad.length !== MAX_PLAYERS) {
            alert(`You must select exactly ${MAX_PLAYERS} players.`)
            return
        }
        if (!captainId || !viceCaptainId) {
            alert("You must select a Captain and Vice-Captain.")
            return
        }

        try {
            const playerIds = mySquad.map(p => p.player_id)
            await axios.post('http://localhost:3001/api/fantasy-teams/squad', {
                playerIds,
                captainId,
                viceCaptainId
            }, { withCredentials: true })
            alert("Squad saved successfully!")
            router.push('/overview')
        } catch (error) {
            console.error("Save failed", error)
            alert(error.response?.data?.message || "Failed to save squad")
        }
    }

    const currentCost = mySquad.reduce((sum, p) => sum + p.price, 0)
    const remainingBudget = (MAX_BUDGET - currentCost).toFixed(1)

    if (loading) return <div className="text-white p-8">Loading...</div>

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto h-[calc(100vh-80px)] overflow-hidden flex flex-col">
            <header className="flex justify-between items-center mb-6 bg-gray-800 p-4 rounded-lg shadow">
                <div>
                    <h1 className="text-2xl font-bold text-white">Manage Squad</h1>
                    <div className="text-gray-400 text-sm">
                        Deadline: {deadline ? deadline.toLocaleString() : 'No current round'}
                        {isDeadlinePassed && <span className="text-red-500 font-bold ml-2">(LOCKED)</span>}
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-center">
                        <span className="block text-gray-400 text-xs uppercase">Transfers</span>
                        <div className="text-sm">
                            <span className={cost > 0 ? "text-red-500" : "text-white"}>Made: {transfersMade}</span>
                            {cost > 0 && <span className="block text-red-500 font-bold">Cost: -{cost} pts</span>}
                        </div>
                    </div>
                    <div className="text-center">
                        <span className="block text-gray-400 text-xs uppercase">Players</span>
                        <span className={`text-xl font-bold ${mySquad.length === MAX_PLAYERS ? 'text-green-400' : 'text-white'}`}>{mySquad.length}/{MAX_PLAYERS}</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-gray-400 text-xs uppercase">Money Remaining</span>
                        <span className={`text-xl font-bold ${remainingBudget < 0 ? 'text-red-500' : 'text-green-400'}`}>£{remainingBudget}m</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleAutoPick}
                            disabled={isDeadlinePassed}
                            className={`bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded shadow transition ${isDeadlinePassed && 'opacity-50 cursor-not-allowed'}`}
                        >
                            Auto Pick
                        </button>
                        <button
                            onClick={handleResetSquad}
                            disabled={isDeadlinePassed}
                            className={`bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded shadow transition ${isDeadlinePassed && 'opacity-50 cursor-not-allowed'}`}
                        >
                            Reset
                        </button>
                        <button
                            onClick={handleSaveSquad}
                            disabled={isDeadlinePassed}
                            className={`font-bold py-2 px-6 rounded shadow-lg transform transition active:scale-95 ${isDeadlinePassed ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white'}`}
                        >
                            Save Squad
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
                {/* Left: Pitch for visualization */}
                <div className="lg:w-2/3 overflow-y-auto flex justify-center bg-gray-900/50 rounded-lg p-2">
                    <Pitch
                        selectedPlayers={mySquad}
                        onRemovePlayer={handleRemovePlayer}
                        captainId={captainId}
                        viceCaptainId={viceCaptainId}
                        onSetCaptain={handleSetCaptain}
                        onSetViceCaptain={handleSetViceCaptain}
                    />
                </div>

                {/* Right: Player Selection */}
                <div className="lg:w-1/3">
                    <PlayerList players={allPlayers} onSelectPlayer={handleAddPlayer} budget={remainingBudget} squad={mySquad} />
                </div>
            </div>
        </div>
    )
}

export default TeamSelectionPage
