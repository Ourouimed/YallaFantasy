import React from 'react'

// Simple visual pitch component
const Pitch = ({
  selectedPlayers,
  onRemovePlayer,
  captainId,
  viceCaptainId,
  onSetCaptain,
  onSetViceCaptain,
  readOnly = false
}) => {
  // Group players by position
  const gks = selectedPlayers.filter(p => p.position === 'GK')
  const defs = selectedPlayers.filter(p => p.position === 'DEF')
  const mids = selectedPlayers.filter(p => p.position === 'MID')
  const fwds = selectedPlayers.filter(p => p.position === 'FWD')

  const renderRow = (players, maxCount, type) => {
    const slots = Array(maxCount).fill(null).map((_, i) => players[i] || null)

    return (
      <div className="flex justify-center gap-2 md:gap-4 lg:gap-8 my-4 w-full">
        {slots.map((player, i) => (
          <div key={i} className="relative flex flex-col items-center group">
            <div
              className={`
                w-12 h-12 md:w-16 md:h-16 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-105
                ${player ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-white text-white' : 'bg-gray-800/50 border-gray-600 text-gray-500 hover:bg-gray-700/50'}
                ${player && player.player_id === captainId ? 'ring-4 ring-yellow-400' : ''}
                ${player && player.player_id === viceCaptainId ? 'ring-2 ring-gray-300' : ''}
                ${!readOnly ? 'cursor-pointer' : ''}
              `}
              onClick={() => !readOnly && player && onRemovePlayer?.(player.player_id)}
            >
              {player ? <span className="text-xs font-bold">{player.position}</span> : <span className="text-xl">+</span>}

              {!readOnly && player && (
                <>
                  {/* Remove Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemovePlayer?.(player.player_id); }}
                    className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs text-white shadow-sm z-20"
                    title="Remove"
                  >
                    x
                  </button>

                  {/* Captain/Vice-Captain Buttons */}
                  <div className="absolute -bottom-2 flex gap-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); onSetCaptain?.(player.player_id); }}
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${player.player_id === captainId ? 'bg-yellow-400 text-black' : 'bg-gray-200 text-gray-600 hover:bg-yellow-200'}`}
                      title="Captain"
                    >
                      C
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onSetViceCaptain?.(player.player_id); }}
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${player.player_id === viceCaptainId ? 'bg-gray-300 text-black' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                      title="Vice-Captain"
                    >
                      V
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Player Name & Stats */}
            {player && (
              <div className="mt-2 text-center bg-gray-900/80 px-2 py-0.5 rounded text-[10px] md:text-xs text-white truncate w-20 shadow-sm relative z-0">
                {player.fullname.split(' ').pop()}
                {player.live_points !== undefined ? (
                  <div className="text-yellow-400 font-bold">{player.live_points} pts</div>
                ) : (
                  <div className="text-green-400 font-bold">£{player.price}</div>
                )}
              </div>
            )}

            {/* Placeholder */}
            {!player && (
              <div className="mt-1 text-center text-[10px] md:text-xs text-gray-400 font-bold">
                {type}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-[2/3] md:aspect-[3/4] lg:aspect-[4/3] max-w-2xl bg-gradient-to-b from-green-800 to-green-600 border-4 border-white/20 rounded-xl overflow-hidden shadow-2xl p-4 flex flex-col justify-between">
      {/* Pitch markings */}
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/20 rounded-full"></div>

      {/* Rows */}
      <div className="z-10">{renderRow(fwds, 3, 'FWD')}</div>
      <div className="z-10">{renderRow(mids, 5, 'MID')}</div>
      <div className="z-10">{renderRow(defs, 5, 'DEF')}</div>
      <div className="z-10">{renderRow(gks, 1, 'GK')}</div>
    </div>
  )
}

export default Pitch
