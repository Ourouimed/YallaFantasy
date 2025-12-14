import React, { useState } from 'react'

const PlayerList = ({ players, onSelectPlayer, budget, squad }) => {
    const [filter, setFilter] = useState({ position: 'ALL', search: '', priceMax: 15 })

    // Filter players
    const filteredPlayers = players.filter(p => {
        const posMatch = filter.position === 'ALL' || p.position === filter.position
        const nameMatch = p.fullname.toLowerCase().includes(filter.search.toLowerCase())
        const priceMatch = p.price <= filter.priceMax
        // Also exclude already selected
        const notSelected = !squad.find(s => s.player_id === p.player_id)
        return posMatch && nameMatch && priceMatch && notSelected
    })

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg flex flex-col h-[600px] border border-gray-700">
            <div className="p-4 border-b border-gray-700 space-y-3">
                <h2 className="text-xl font-bold text-white">Player Selection</h2>

                <input
                    type="text"
                    placeholder="Search players..."
                    className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:border-green-500"
                    value={filter.search}
                    onChange={e => setFilter({ ...filter, search: e.target.value })}
                />

                <div className="flex gap-2 text-sm overflow-x-auto pb-1">
                    {['ALL', 'GK', 'DEF', 'MID', 'FWD'].map(pos => (
                        <button
                            key={pos}
                            onClick={() => setFilter({ ...filter, position: pos })}
                            className={`px-3 py-1 rounded font-bold transition-colors ${filter.position === pos ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            {pos}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span>Max Price: £{filter.priceMax}m</span>
                    <input
                        type="range" min="4" max="15" step="0.5"
                        value={filter.priceMax} onChange={e => setFilter({ ...filter, priceMax: parseFloat(e.target.value) })}
                        className="w-full accent-green-500"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {filteredPlayers.map(player => (
                    <div key={player.player_id} className="flex justify-between items-center bg-gray-700/50 p-3 rounded hover:bg-gray-700 transition group">
                        <div className="flex items-center gap-3">
                            {/* Jersey/Flag placeholder */}
                            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs text-white">
                                {player.position}
                            </div>
                            <div>
                                <div className="font-bold text-white group-hover:text-green-400 transition">{player.fullname}</div>
                                <div className="text-xs text-gray-400">{player.team}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-green-400">£{player.price}</div>
                            <button
                                onClick={() => onSelectPlayer(player)}
                                className="bg-green-600 hover:bg-green-500 text-white text-xs px-2 py-1 rounded mt-1 opacity-0 group-hover:opacity-100 transition"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                ))}
                {filteredPlayers.length === 0 && (
                    <div className="text-center text-gray-500 p-4">No players found</div>
                )}
            </div>
        </div>
    )
}

export default PlayerList
