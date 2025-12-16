import Badge from "../Badge";

export default function PlayerListCard ({ onClick ,  player }){
    const {player_id , player_image , fullname , team_name , position , price} = player
    return <div key={player_id} onClick={() => onClick(player)} className="hover:bg-gray-100 cursor-pointer transition duration-300 flex items-center gap-3 justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <img src={player_image} className="size-12 rounded-full p-1 border-1"/>
                                    <div>
                                        <h4 className="font-semibold">{fullname}</h4>
                                        <div className="flex items-center gap-2">
                                            <Badge text={position}/>
                                            <span className="text-xs">{team_name}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>{price}</div>
                            </div>
}