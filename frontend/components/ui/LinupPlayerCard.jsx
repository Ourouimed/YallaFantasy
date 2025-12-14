import { Edit, Trash } from "lucide-react";
import Badge from "./Badge";
import Button from "./Button";
import { usePopup } from "@/hooks/usePopup";

export default function LinupPlayerCard({ player , team_side}) {
    const { openPopup } = usePopup()
    const handleOpenDeleteConfirmation = ()=>{
        openPopup({
            title: "Delete Player",
            component: "DeletePlayerFromLinupPopup",
            props : {player_id : player.player_id , match_id : player.match_id , team_side}
        })
    }


    const handleOpenEditPopup = ()=>{
        console.log(player)
        openPopup({
            title: "Edit Player",
            component: "EditPlayerLinupPopup",
            props : {player , team_side}
        })
    }
  return (
    <div className="border border-gray-300 rounded-md hover:bg-gray-50">
        <div className="flex items-center justify-between p-3 ">
            <div className="flex items-center gap-3">
                <img src={player.player_image} className="size-15 rounded-full p-1 border-1" />
                <div>
                <p className="font-medium">{player.fullname}</p>
                <span className="text-xs text-gray-500">
                    <Badge text={player.position}/>
                </span>
                </div>
            </div>

            <div className="">
                <h5 className="text-2xl font-semibold text-end">
                    {player.round_pts}
                </h5>
                <span className="text-gray-800 text-sm">points</span>
            </div>
        </div>
        <div className="flex items-center justify-end p-3 gap-1 border-t border-gray-300">
            <Button className='!bg-red-500 !p-2 text-sm !text-white' onClick={handleOpenDeleteConfirmation}>
                <Trash size={12}/>
                Delete Player
            </Button>
            <Button className='!bg-black !p-2 text-sm !text-white' onClick={handleOpenEditPopup}>
                <Edit size={12}/>
                Edit player
            </Button>
        </div>
    </div>
  );
}
