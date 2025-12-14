"use client"
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'

const LeaguesPage = () => {
    const [leagues, setLeagues] = useState([])
    const [loading, setLoading] = useState(true)
    const [createName, setCreateName] = useState('')
    const [joinCode, setJoinCode] = useState('')
    const [activeTab, setActiveTab] = useState('create') // 'create' or 'join'
    const [message, setMessage] = useState('')

    useEffect(() => {
        fetchLeagues()
    }, [])

    const fetchLeagues = async () => {
        try {
            const res = await axios.get('http://localhost:3001/api/leagues/my-leagues', { withCredentials: true })
            setLeagues(res.data)
        } catch (error) {
            console.error("Error fetching leagues:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = async (e) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:3001/api/leagues', { name: createName }, { withCredentials: true })
            setMessage('League created successfully!')
            setCreateName('')
            fetchLeagues()
        } catch (error) {
            setMessage('Error creating league.')
            console.error(error)
        }
    }

    const handleJoin = async (e) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:3001/api/leagues/join', { code: joinCode }, { withCredentials: true })
            setMessage('Joined league successfully!')
            setJoinCode('')
            fetchLeagues()
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error joining league.')
            console.error(error)
        }
    }

    if (loading) return <div className="text-white p-8">Loading...</div>

    return (
        <div className="p-8 w-full max-w-6xl mx-auto text-white">
            <h1 className="text-3xl font-bold mb-8">Leagues</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* My Leagues List */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-xl font-bold mb-4">My Leagues</h2>
                    {leagues.length === 0 ? (
                        <p className="text-gray-400">You haven't joined any leagues yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {leagues.map(league => (
                                <Link href={`/leagues/${league.id}`} key={league.id} className="block bg-gray-700/50 p-4 rounded hover:bg-gray-700 transition flex justify-between items-center group">
                                    <span className="font-bold text-lg group-hover:text-green-400 transition">{league.name}</span>
                                    <span className="text-sm text-gray-400">{league.member_count} Members</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Create / Join Console */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <div className="flex gap-4 mb-6 border-b border-gray-700 pb-2">
                        <button
                            onClick={() => setActiveTab('create')}
                            className={`pb-2 px-2 font-bold transition-colors ${activeTab === 'create' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}
                        >
                            Create League
                        </button>
                        <button
                            onClick={() => setActiveTab('join')}
                            className={`pb-2 px-2 font-bold transition-colors ${activeTab === 'join' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}
                        >
                            Join League
                        </button>
                    </div>

                    {message && (
                        <div className={`p-3 mb-4 rounded text-sm ${message.includes('success') ? 'bg-green-600/20 text-green-400 border border-green-600' : 'bg-red-600/20 text-red-400 border border-red-600'}`}>
                            {message}
                        </div>
                    )}

                    {activeTab === 'create' ? (
                        <form onSubmit={handleCreate}>
                            <label className="block text-gray-300 mb-2">League Name</label>
                            <input
                                type="text"
                                value={createName}
                                onChange={(e) => setCreateName(e.target.value)}
                                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-green-500 mb-4"
                                placeholder="My Private League"
                                required
                            />
                            <button type="submit" className="w-full py-3 bg-green-600 hover:bg-green-700 rounded font-bold transition">
                                Create New League
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleJoin}>
                            <label className="block text-gray-300 mb-2">League Code</label>
                            <input
                                type="text"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value)}
                                className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-green-500 mb-4"
                                placeholder="e.g. X1Y2Z3"
                                required
                            />
                            <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded font-bold transition">
                                Join League
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default LeaguesPage
