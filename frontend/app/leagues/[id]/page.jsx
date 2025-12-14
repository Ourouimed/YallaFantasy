"use client"
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const LeagueDetailsPage = ({ params }) => {
    // Unwrapping params for Next.js 14+
    const { id } = React.use(params);

    const [league, setLeague] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLeague = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/api/leagues/${id}`, { withCredentials: true })
                setLeague(res.data)
            } catch (error) {
                console.error("Error fetching league:", error)
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchLeague()
    }, [id])

    if (loading) return <div className="text-white p-8">Loading...</div>
    if (!league) return <div className="text-white p-8">League not found.</div>

    return (
        <div className="p-8 w-full max-w-5xl mx-auto text-white">
            <div className="bg-gradient-to-r from-green-800 to-green-600 p-8 rounded-xl shadow-2xl mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold mb-2">{league.name}</h1>
                    <div className="text-green-100 flex items-center gap-2">
                        Invite Code: <span className="font-mono bg-black/30 px-2 py-1 rounded select-all">{league.code}</span>
                    </div>
                </div>
                <div className="text-5xl opacity-50">🏆</div>
            </div>

            <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                <table className="w-full text-left">
                    <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="p-4 w-16 text-center">Rank</th>
                            <th className="p-4">Team & Manager</th>
                            <th className="p-4 text-center">GW</th>
                            <th className="p-4 text-center">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {league.standings.map((row, index) => (
                            <tr key={row.id} className="hover:bg-gray-700/50 transition">
                                <td className="p-4 text-center font-bold text-xl text-gray-500">
                                    {index + 1}
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-lg text-green-400">{row.team_name}</div>
                                    <div className="text-sm text-gray-400">{row.manager_name}</div>
                                </td>
                                <td className="p-4 text-center font-mono text-gray-300">
                                    -
                                </td>
                                <td className="p-4 text-center font-bold text-xl">
                                    {row.total_points}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {league.standings.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No members yet. Share the code to invite friends!
                    </div>
                )}
            </div>
        </div>
    )
}

export default LeagueDetailsPage
