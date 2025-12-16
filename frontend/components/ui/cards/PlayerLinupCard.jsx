export default function PlayerLinupCard({ player }) {
  return (
    <div className="w-22 flex flex-col items-center justify-center">
      {/* Image wrapper */}
      <div className="relative">
        <img
          src={player.player_image}
          className="size-16 rounded-full p-1 border border-main mb-2"
        />

        {/* Flag */}
        <img
          src={player.team} // or player.national_flag
          alt="flag"
          className="absolute -left-1 bottom-2 size-4 rounded-sm border border-white"
        />
      </div>

      <div className="w-full rounded-md overflow-hidden">
        <div className="bg-main p-1 text-center text-white text-sm">
          {player.fullname.split(' ')[0]}
        </div>
        <div className="bg-third p-1 text-center text-xs">
          {player.price}
        </div>
      </div>
    </div>
  )
}
