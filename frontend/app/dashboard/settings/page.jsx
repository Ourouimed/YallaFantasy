"use client"
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const SettingsPage = () => {
    const [rounds, setRounds] = useState([])
    const [settings, setSettings] = useState({
        current_round_id: '',
        goal_points: 0,
        assist_points: 0,
        clean_sheet_points: 0
    })
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const roundsRes = await axios.get('http://localhost:3001/api/rounds')
                setRounds(roundsRes.data)

                const settingsRes = await axios.get('http://localhost:3001/api/settings')
                if (settingsRes.data) {
                    setSettings({
                        current_round_id: settingsRes.data.current_round_id || '',
                        goal_points: settingsRes.data.goal_points || 0,
                        assist_points: settingsRes.data.assist_points || 0,
                        clean_sheet_points: settingsRes.data.clean_sheet_points || 0
                    })
                }
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage('')
        try {
            await axios.put('http://localhost:3001/api/settings', settings)
            setMessage('Settings updated successfully!')
        } catch (error) {
            console.error("Error updating settings:", error)
            setMessage('Failed to update settings.')
        }
    }

    if (loading) return <div className="p-8 text-white">Loading...</div>

    return (
        <div className="p-8 w-full max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">Admin Settings</h1>

            {message && (
                <div className={`p-4 mb-4 rounded ${message.includes('success') ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">

                {/* Current Round Selection */}
                <div>
                    <label className="block text-gray-300 mb-2 font-medium">Current Round</label>
                    <select
                        name="current_round_id"
                        value={settings.current_round_id}
                        onChange={handleChange}
                        className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-green-500 focus:outline-none"
                    >
                        <option value="">Select Round</option>
                        {rounds.map(round => (
                            <option key={round.round_id} value={round.round_id}>
                                {round.round_title}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="h-px bg-gray-700 my-4"></div>
                <h2 className="text-xl font-semibold text-white mb-4">Points configuration</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-gray-300 mb-2">Goal Points</label>
                        <input
                            type="number"
                            name="goal_points"
                            value={settings.goal_points}
                            onChange={handleChange}
                            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-green-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">Assist Points</label>
                        <input
                            type="number"
                            name="assist_points"
                            value={settings.assist_points}
                            onChange={handleChange}
                            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-green-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-300 mb-2">Clean Sheet Points</label>
                        <input
                            type="number"
                            name="clean_sheet_points"
                            value={settings.clean_sheet_points}
                            onChange={handleChange}
                            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-green-500 focus:outline-none"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded transition-all transform hover:scale-105"
                >
                    Save Settings
                </button>
            </form>
        </div>
    )
}

export default SettingsPage
