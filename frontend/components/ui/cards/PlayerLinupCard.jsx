export default function PlayerLinupCard({ player , isCaptain , isViceCaptain}) {
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
          src={player.team}
          alt="flag"
          className="absolute -left-1 bottom-2 size-4 rounded-sm border border-white"
        />


        {/* Captain & Vice*/}
        {isCaptain && <div className={`absolute -right-1 -top-1 size-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-md z-10 bg-yellow-500 text-black`}>
            C
  </div>}


  {isViceCaptain && <div className={`absolute -right-1 -top-1 size-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-md z-10 bg-blue-500 text-white`}>
            VC
  </div>}

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
