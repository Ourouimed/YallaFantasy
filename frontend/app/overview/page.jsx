"use client"
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Pitch from '@/components/Pitch'

const OverviewPage = () => {
    const [team, setTeam] = useState(null)
    const [loading, setLoading] = useState(true)
    const [newTeamName, setNewTeamName] = useState('')
    const [creating, setCreating] = useState(false)

    useEffect(() => {
        fetchTeam()
    }, [])

    const fetchTeam = async () => {
        try {
            // Must pass withCredentials to send cookies for verifyJWT
            const res = await axios.get('http://localhost:3001/api/fantasy-teams/my-team', { withCredentials: true })
            setTeam(res.data)
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setTeam(null)
            } else {
                console.error("Error fetching team:", error)
            }
        } finally {
            setLoading(false)
        }
    }

    const createTeam = async (e) => {
        e.preventDefault()
        if (!newTeamName) return
        setCreating(true)
        try {
            await axios.post('http://localhost:3001/api/fantasy-teams', { name: newTeamName }, { withCredentials: true })
            await fetchTeam() // Refresh to show the team
        } catch (error) {
            console.error("Error creating team:", error)
            alert("Failed to create team. Ensure you are logged in.")
        } finally {
            setCreating(false)
        }
    }

    if (loading) return <div className="text-white p-8">Loading...</div>

    if (!team) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
                <h1 className="text-4xl font-bold mb-6">Welcome to YallaFantasy</h1>
                <p className="text-xl text-gray-300 mb-8">You don't have a team yet. Start your journey now!</p>

                <form onSubmit={createTeam} className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                    <label className="block text-gray-300 mb-4 text-lg">Choose your Team Name</label>
                    <input
                        type="text"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        placeholder="e.g. Atlas Lions FC"
                        className="w-full p-4 mb-6 rounded bg-gray-700 text-white border border-gray-600 focus:border-green-500 focus:outline-none"
                        required
                    />
                    <button
                        type="submit"
                        disabled={creating}
                        className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded transition-all text-lg"
                    >
                        {creating ? 'Creating...' : 'Create My Team'}
                    </button>
                </form>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 text-white w-full max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                   <h1 className="text-3xl font-bold">Overview</h1>
                   <div className="text-gray-400">Manage your team and track performance</div>
                </div>
                <Link href="/team-selection" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded transition text-white">
                    Manage Squad
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                 <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg">
                    <span className="block text-gray-400 text-sm uppercase font-bold mb-1">Total Points</span>
                    <span className="text-4xl font-bold text-white">{team.total_points}</span>
                 </div>
                 <div className="bg-gradient-to-br from-green-900 to-green-800 p-6 rounded-xl border border-green-700 shadow-lg">
                    <span className="block text-green-300 text-sm uppercase font-bold mb-1">Gameweek Live</span>
                    <span className="text-4xl font-bold text-white">{team.gw_points || 0}</span>
                    <div className="text-xs text-green-200 mt-2 animate-pulse">● Live Scoring</div>
                 </div>
                 <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <span className="block text-gray-400 text-sm uppercase font-bold mb-1">Overall Rank</span>
                    <span className="text-2xl font-bold text-white"># --</span>
                 </div>
                 <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <span className="block text-gray-400 text-sm uppercase font-bold mb-1">Team Value</span>
                    <span className="text-2xl font-bold text-green-400">£{team.budget}m</span>
                 </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Pitch View */}
                <div className="lg:w-2/3">
                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-xl">
                        <h3 className="text-lg font-bold mb-4 text-center">Starting XI</h3>
                        <div className="flex justify-center">
                            {/* Pass squad players. Assuming pitch handles full squad or logic to show only starters. 
                                For now passing all, Pitch component groups them. */}
                            <Pitch 
                                selectedPlayers={team.squad || []} 
                                captainId={team.squad?.find(p => p.is_captain)?.player_id}
                                viceCaptainId={team.squad?.find(p => p.is_vice_captain)?.player_id}
                                readOnly={true}
                            /> 
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:w-1/3 space-y-6">
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h3 className="text-xl font-bold mb-4">Leagues</h3>
                        <p className="text-gray-400 mb-4">You are not in any leagues yet.</p>
                        <Link href="/leagues" className="block w-full text-center py-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition">
                            View Leagues
                        </Link>
                    </div>
                    
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                        <h3 className="text-xl font-bold mb-4">Gameweek Info</h3>
                        <div className="flex justify-between text-sm text-gray-300 border-b border-gray-700 pb-2 mb-2">
                             <span>Deadline</span>
                             <span>Sat 11:30</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-300">
                             <span>Current Round</span>
                             <span>GW 1</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OverviewPage